import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React , {useState, useEffect} from 'react';
import {firebase} from "./config";
import { Login, Welcome,Signup, ResetPassword} from "./Screens";
import TabNavigation from './Screens/Navigation/TabNavigation';

const Stack = createNativeStackNavigator()

function App() {
  const [initialize , setInitialize] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user){
    setUser(user);
    if(initialize)   setInitialize(false);
  }

  useEffect(() => {
    const subscriber= firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);

  if(initialize) return null;

  if(!user){
    return (
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen 
            name ="Welcome"
            component={Welcome}
            options={{
              headerShown:false
            }}
          />
          <Stack.Screen 
            name ="Login"
            component={Login}
            options={{
              headerShown:false
            }}
          />  
           <Stack.Screen 
            name ="ResetPassword"
            component={ResetPassword}
            options={{
              headerShown:false
            }}
          />  
          <Stack.Screen 
            name ="Signup"
            component={Signup}
            options={{
              headerShown:false
            }}
          />
        </Stack.Navigator>        
    );
  }
  
  return(
    <Stack.Navigator>
        <Stack.Screen 
          name ="TabNavigation" 
          component ={TabNavigation} 
          options={{
            headerShown:false
          }}
        />
      </Stack.Navigator>
  );
}

export default() =>{
  return(
    <NavigationContainer>
       <App />
    </NavigationContainer>
  )
}
