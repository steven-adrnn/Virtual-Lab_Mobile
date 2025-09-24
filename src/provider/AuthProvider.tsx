import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../initSupabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

type QuizProgress = {
	currentQuestionIndex: number;
	timer: number;
	score: number;
	answers: any[];
  }

type ContextProps = {
	user: null | boolean;
	session: Session | null;
	saveQuizProgress: (progress: QuizProgress) => void;
	getQuizProgress: () => Promise<QuizProgress | null>;
	clearQuizProgress: () => void;
	logout: () => void;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
	children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
	const [currentPage, setCurrentPage] = useState<string | null>(null);
	const [user, setUser] = useState<null | boolean>(null);
	const [session, setSession] = useState<Session | null>(null);

	const saveQuizProgress = async (progress: QuizProgress) => {
		try {
		  const userId = session?.user?.id;
		  await AsyncStorage.setItem(
			`quiz_progress_${userId}`, 
			JSON.stringify(progress)
		  );
		} catch (error) {
		  console.error("Error saving quiz progress", error);
		}
	  };
	
	const getQuizProgress = async () => {
	try {
		const userId = session?.user?.id;
		const progressJson = await AsyncStorage.getItem(`quiz_progress_${userId}`);
		return progressJson ? JSON.parse(progressJson) : null;
	} catch (error) {
		console.error("Error retrieving quiz progress", error);
		return null;
	}
	};
	
	const clearQuizProgress = async () => {
	try {
		const userId = session?.user?.id;
		await AsyncStorage.removeItem(`quiz_progress_${userId}`);
	} catch (error) {
		console.error("Error clearing quiz progress", error);
	}
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};

	useEffect(() => {
		const session = supabase.auth.session();
		setSession(session);
		setUser(session ? true : false);
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				console.log(`Supabase auth event: ${event}`);
				setSession(session);
				setUser(session ? true : false);
				if (session) {
					const progress = await getQuizProgress();
					if (progress) {
					  console.log("User 's last quiz progress:", progress);
					}
				}
			}
		);
		return () => {
			authListener!.unsubscribe();
		};
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				saveQuizProgress,
				getQuizProgress,
				clearQuizProgress,
				logout,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
