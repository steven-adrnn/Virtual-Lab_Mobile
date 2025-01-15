export type MainStackParamList = {
	MainTabs: undefined;
	SecondScreen: undefined;
	Simulation: undefined; 
	Course: undefined; // Updated from CourseData to Course
	Quiz: undefined; 
};

export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgetPassword: undefined;
};

export type MainTabsParamList = {
	Home: undefined;
	Quiz: undefined; // Updated from Profile to QuizScreen
	About: undefined;
	Simulation: undefined; 
	Course: undefined; // Added Course entry
};
