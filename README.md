# Virtual Lab Mobile

## Developer
This project was developed by:
- Viktor Arsindiantoro S. - 18222083
- Steven Adrian Corne - 18222101

## Project Description
Virtual Lab Mobile is a TypeScript template starter that provides a seamless authentication flow using Supabase and React Navigation. It allows users to navigate through various screens while managing their authentication state effectively.

Mobile App:
- https://expo.dev/artifacts/eas/bpoqf8rE7fsU86jjfenMC6.apk

Web App: 
- https://virtuallab.expo.app
- https://frontend-indol-psi-15.vercel.app


## Tech Stack
- **Frontend**: React, TypeScript
- **Navigation**: React Navigation
- **Backend**: Supabase
- **State Management**: React Context API
- **UI Components**: Rapi UI


## Installation and Running Locally
1. Install [node.js](https://nodejs.org/en/).
2. Clone the repository using `git clone https://github.com/steven-adrnn/Virtual-Lab_Mobile.git`
3. Install Expo:
   ```bash
   npm install --global expo-cli
   ```
4. Navigate to the project folder and install dependencies:
   ```bash
   npm install
   ```
5. Start the environment:
   ```bash
   npx expo start
   ```

## Auth Flow
### Supabase Setup
- Set up a new Supabase.io project.
- Fill in your Supabase credentials in `./src/initSupabase.ts`.

### Prebuilt UI Screens
- Login screen: `./src/screens/auth/login.tsx`
- Register screen: `./src/screens/auth/register.tsx`
- Forget password screen: `./src/screens/auth/forget.tsx`

### React Navigation Auth Flow
The checking logged users process is inside `./src/provider/AuthProvider`.

## File Management
The project structure is organized as follows:
```bash
/src/assets -> for media such as images, etc
/src/components -> for reusable components
/src/navigation -> for React Navigation
/src/provider -> for React Context
/src/screens -> for application screens
/src/types -> for TypeScript types
```
