import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AdminAccount from '../AdminAccount';
import COLORS from '../../constants/Colors';
import ProductDetails from '../ProductDetails';
import UsersProductPosts from '../UsersProductPosts';
import DownloadReport from '../DownloadReport';
import ProductdetailStackNavigation from './ProductdetailStackNavigation';
const Stack = createStackNavigator();

export default function AdminPageStackNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="adminprofile" component={AdminAccount} 
        options={{
            headerShown:false
        }}/>
    
        <Stack.Screen name="userpost" component={UsersProductPosts}
        options={{
            headerStyle:{
                backgroundColor:COLORS.secondary
            },
            headerTintColor: COLORS.white,
            headerTitle :" User Product Post"
        }}   
        />     
        <Stack.Screen name = 'productdetailStackNavigation' component={ProductdetailStackNavigation}
            options={{
                headerShown: false // Hide the header
            }}            
        />
        <Stack.Screen name="downloadReport" component={DownloadReport}
           options={{
            headerStyle:{
                backgroundColor:COLORS.secondary
            },
            headerTintColor: COLORS.white,
            headerTitle :"Download Reports"
        }}            
        />  
    </Stack.Navigator>
  )
}