import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchPage from '../SearchPage'
import AddPost from '../AddPost'
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePageStackNavigation from './HomePageStackNavigation'
import COLORS from '../../constants/Colors'
import ProfilePageStackNavigation from './ProfilePageStackNavigation'
import Addtocart from '../Addtocart';
import AdminPageStackNavigation from './AdminPageStackNavigation';
import { AntDesign } from '@expo/vector-icons';
import { firebase ,app } from '../../config'

export default function TabNavigation() {  
const Tab = createBottomTabNavigator();
const [name, setName] = useState('');


useEffect(() =>{
  firebase.firestore().collection('users')
  .doc(firebase.auth().currentUser.uid).get()
  .then((snapshot) => {
    if(snapshot.exists){
      setName(snapshot.data())
    }
  })
},[])

  return (
    <Tab.Navigator screenOptions={{headerShown : false}}> 
      <Tab.Screen name="Home"  component= {HomePageStackNavigation} 
        options={{
          tabBarLabel:({color}) => (
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Home</Text>
          ),
          tabBarIcon:({color,size})=> (<Ionicons name="home" size ={size} color={color}/>),
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.grey
        }}       
      />
      <Tab.Screen name="Search"  component= {SearchPage} 
        options={{
          tabBarLabel:({color}) => (
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Search</Text>
          ),
          tabBarIcon:({color,size})=> (<Ionicons name="search" size ={size} color={color}/>),
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.grey
        }}
      />
      <Tab.Screen name="Add Post"  component= {AddPost} 
        options={{
          tabBarLabel:({color}) => (
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Add Post</Text>
          ),
          tabBarIcon:({color,size})=> (<Ionicons name="add" size ={size} color={color}/>),
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.grey
        }}        
      />

      <Tab.Screen name="Add to Cart"  component= {Addtocart}  
        options={{
          tabBarLabel:({color}) => (
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Add to Cart</Text>
          ),
          tabBarIcon:({color,size})=> (<AntDesign name="shoppingcart" size={size} color={color} />),
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.grey
        }}        
      />

      {
        name.email === 'admin@lendmart.com' ?
        <Tab.Screen name="Account"  component= {AdminPageStackNavigation} 
          options={{
            tabBarLabel:({color}) => (
              <Text style={{color:color,fontSize:12,marginBottom:3}}>Account</Text>
            ),
            tabBarIcon:({color,size})=> (<Ionicons name="person-circle" size ={size} color={color}/>),
            tabBarActiveTintColor: COLORS.black,
            tabBarInactiveTintColor: COLORS.grey
          }}
        />
        :
          <Tab.Screen name="Account"  component= {ProfilePageStackNavigation} 
          options={{
            tabBarLabel:({color}) => (
              <Text style={{color:color,fontSize:12,marginBottom:3}}>Account</Text>
            ),
            tabBarIcon:({color,size})=> (<Ionicons name="person-circle" size ={size} color={color}/>),
            tabBarActiveTintColor: COLORS.black,
            tabBarInactiveTintColor: COLORS.grey
          }}
        />
      }

      {/* <Tab.Screen name="Account"  component= {ProfilePageStackNavigation} 
        options={{
          tabBarLabel:({color}) => (
            <Text style={{color:color,fontSize:12,marginBottom:3}}>Account</Text>
          ),
          tabBarIcon:({color,size})=> (<Ionicons name="person-circle" size ={size} color={color}/>),
          tabBarActiveTintColor: COLORS.black,
          tabBarInactiveTintColor: COLORS.grey
        }}
      /> */}
  </Tab.Navigator>
  )
}