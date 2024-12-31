import { View, Text ,Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../constants/Colors'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Pressable } from 'react-native';
import {firebase} from '../config';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';

const ResetPW = ({navigation}) => {
  const [email,setEmail] =useState('')

  reset = async (email) => {
    try{
        await firebase.auth().sendPasswordResetEmail(email)
        Alert.alert("Success!!!","Password Reset Email sent Successfully");          
        navigation.navigate('Login')
    }
    catch(error){
        alert (error.message)
    }
  }

  return (
   <SafeAreaView style ={{flex:1,backgroundColor:COLORS.white}}>
      <View style ={{flex:1 ,marginHorizontal :22}}>
        <View style ={{marginVertical:22}}>
          <Text style ={{
            fontSize:22,
            fontWeight:'bold',
            marginVertical:12,
            color:COLORS.black
          }}>Reset Password</Text>
        </View>

        <View style ={{marginBottom:12}}>
          <Text style ={{
            fontSize: 16,
            fontWeight:400,
            marginVertical:8
          }}> Email ID </Text>

          <View style = {{
              width:"100%",
              height:48,
              borderColor:COLORS.black,
              borderWidth:1,
              borderRadius:8,
              alignItems:'center',
              justifyContent: "center",
              paddingLeft: 22
          }}>
            <TextInput
              placeholder='Enter your Email ID'
              placeholderTextColor={COLORS.black}
              onChangeText={(email) => setEmail(email)}
              keyboardType='email-address'
              style={{width:"100%"}}
            />              
          </View>

        <Button 
          title ="Send Reset Password Link"
          filled
          style={{
            marginTop:18,
            marginBottom:4
          }}
          onPress={() => reset(email)}
          />       

        <View style={{
          flexDirection :"row",
          justifyContent:"center",
          marginVertical:22
        }}>
          <Text style ={{
            fontSize:16,
            color:COLORS.black,
          }}>Don't have an account? </Text>
          <Pressable onPress={()=> navigation.navigate("Signup")}>
            <Text style ={{
              fontSize:16,
              color:COLORS.primary,
              fontWeight:"bold",
              marginLeft:6
            }}>Register</Text>
          </Pressable>
        </View>
        </View>
      </View>
   </SafeAreaView>
  )
}

export default ResetPW