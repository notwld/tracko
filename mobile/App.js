import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Chat from './screens/Chat';
import Home from './screens/Home';
import AssignStoryPoint from './screens/AssignStoryPoint';
import CardReveal from './screens/CardReveal';
import FinishScreen from './screens/FinishScreen';
import Usecase from './screens/Usecase';
import UsecaseReveal from './screens/UsecaseReveal';
import ChatClone from './screens/ChatClone';
import CardRevealFP from './screens/CardRevealFP';
import FPQuestions from './screens/FPQuestions';
import UsecaseAgile from './screens/UsecaseAgile';
import UsecaseAgileReveal from './screens/UsecaseAgileReveal';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ChatClone" component={ChatClone} />
      <Stack.Screen name="AssignStoryPoints" component={AssignStoryPoint} />
      <Stack.Screen name="CardReveal" component={CardReveal} />
      <Stack.Screen name="FinishScreen" component={FinishScreen} />
      <Stack.Screen name="Usecase" component={Usecase} />
      <Stack.Screen name="UsecaseAgile" component={UsecaseAgile} />
      <Stack.Screen name="UsecaseReveal" component={UsecaseReveal} />
      <Stack.Screen name="UsecaseAgileReveal" component={UsecaseAgileReveal} />
      <Stack.Screen name="CardRevealFP" component={CardRevealFP} />
      <Stack.Screen name="FPQuestions" component={FPQuestions} />
    </Stack.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
// unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}