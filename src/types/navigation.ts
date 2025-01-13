import { NavigatorScreenParams } from '@react-navigation/native';

export type MainStackParamList = {
  Home: undefined;
  ModuleDetail: { moduleId: string };
  Quiz: { moduleId: string };
  AlgorithmDetail: { algorithmId: string }; // Added AlgorithmDetail route
  SimulationDetail: { algorithmId: string; initialArray: number[] };
  Profile: undefined; // Add other routes as needed
  Settings: undefined; // Add other routes as needed
  Help: undefined; // Add Help route
  Progress: undefined; // Add other routes as needed
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
