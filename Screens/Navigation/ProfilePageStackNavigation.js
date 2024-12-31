import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfilePage from '../ProfilePage';
import MyPost from '../MyPost';
import COLORS from '../../constants/Colors';
import EditProfile from '../EditProfile';
import ProductdetailStackNavigation from './ProductdetailStackNavigation';
import MyOrder from '../MyOrder';

const Stack = createStackNavigator();

export default function ProfilePageStackNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="profilepage" component={ProfilePage} 
        options={{
            headerShown:false
        }}/>
        
        <Stack.Screen name="mypost" component={MyPost}
           options={{
            headerStyle:{
                backgroundColor:COLORS.secondary
            },
            headerTintColor: COLORS.white,
            headerTitle :"My Product Post"
        }}   
        />     

        <Stack.Screen name = 'productdetailStackNavigation' component={ProductdetailStackNavigation}
            options={{
                headerShown: false // Hide the header
            }}            
        />

        <Stack.Screen name="editprofile" component={EditProfile}
           options={{
            headerStyle:{
                backgroundColor:COLORS.secondary
            },
            headerTintColor: COLORS.white,
            headerTitle :"Edit Profile"
        }}            
        />  

        <Stack.Screen name="myOrder" component={MyOrder}
           options={{
            headerStyle:{
                backgroundColor:COLORS.secondary
            },
            headerTintColor: COLORS.white,
            headerTitle :"My Orders"
        }}            
        />  
    </Stack.Navigator>
  )
}