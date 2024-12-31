import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../../constants/Colors';
import ProductDetails from '../ProductDetails';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditPost from '../EditPost';
import Homepage from '../Homepage';

const Stack = createNativeStackNavigator()

export default function ProductdetailStackNavigation() {
  const { params } = useRoute();
  return (
    <Stack.Navigator>
        <Stack.Screen name = 'productDetails' 
            component={ProductDetails} 
            initialParams={{ product: params.product }}
            options={{
                headerStyle:{
                    backgroundColor:COLORS.secondary
                },
                headerTitle :"Product Details",
                headerTintColor: COLORS.white
            }}           
        />
        {/* <Stack.Screen name = 'addtocart' component={Addtocart}
        initialParams={{ product: params.product }}
            options={{
                headerStyle:{
                    backgroundColor:COLORS.secondary
                },
                headerTintColor: COLORS.white,
                headerTitle :"Add to cart"
            }}            
        /> */}
        <Stack.Screen name = 'editPost' component={EditPost}
            initialParams={{ product: params.product }}
            options={{
                headerStyle:{
                    backgroundColor:COLORS.secondary
                },
                headerTintColor: COLORS.white,
                headerTitle :"Edit Post"
            }}            
        />
        <Stack.Screen name ='homePage' component={Homepage} 
            options={{
                headerShown:false
            }}
        />
    </Stack.Navigator>
  )
}
