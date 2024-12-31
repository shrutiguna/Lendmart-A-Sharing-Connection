import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from '../Homepage';
import ItemsList from '../ItemsList';
import COLORS from '../../constants/Colors';
import ProductdetailStackNavigation from './ProductdetailStackNavigation';
const Stack = createNativeStackNavigator()

export default function HomePageStackNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name ='homePage' component={Homepage} 
            options={{
                headerShown:false
            }}
        />
        <Stack.Screen name = 'itemList' component={ItemsList}
            options={({route}) => ({title:route.params.category,
                headerStyle:{
                    backgroundColor:COLORS.secondary
                },
                headerTintColor: COLORS.white
            })}            
        />
        <Stack.Screen name = 'productdetailStackNavigation' component={ProductdetailStackNavigation}
            options={{
                headerShown: false // Hide the header
            }}          
        />
    </Stack.Navigator>
  )
}