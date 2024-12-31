import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../constants/Colors'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Pressable } from 'react-native';
import {firebase} from '../config'
import TabNavigation from './Navigation/TabNavigation'

const Login = ({navigation}) => {
  const [isPasswordShown, setIsPasswordShown]= useState(true);
  const [email,setEmail] =useState('')
  const [password,setPassword] =useState('')

  loginUser = async (email,password) => {
    try{
        await firebase.auth().signInWithEmailAndPassword(email,password)
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
          }}>Hey!! Welcome!!</Text>
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
        </View>

        <View style ={{marginBottom:12}}>
          <Text style ={{
            fontSize: 16,
            fontWeight:400,
            marginVertical:8
          }}> Password </Text>
          
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
              placeholder='Password'
              placeholderTextColor={COLORS.black}
              onChangeText={(password) => setPassword(password)}
              secureTextEntry = {isPasswordShown}
              style={{width:"100%"}}
            />        

            <TouchableOpacity
              onPress={()=> setIsPasswordShown(!isPasswordShown)}
              style ={{
                position:"absolute",
                right:12
              }}
            >
              {
                isPasswordShown == true
                  ? (<Ionicons name ="eye-off" size={24} color={COLORS.black}/>)
                  : (<Ionicons name ="eye" size={24} color={COLORS.black}/>)             
              }
            </TouchableOpacity>             
          </View>
        
        <Button 
          title ="Login"
          filled
          style={{
            marginTop:18,
            marginBottom:4
          }}
          onPress={() => loginUser(email,password)}
          />       

        <View style={{
          flexDirection :"row",
          justifyContent:"center",
          marginVertical:22
        }}>
          <Text style ={{
            fontSize:16,
            color:COLORS.black,
          }}>Forgot Password </Text>
          <Pressable onPress={()=> navigation.navigate("ResetPassword")}>
            <Text style ={{
              fontSize:16,
              color:COLORS.primary,
              fontWeight:"bold",
              marginLeft:6
            }}>Reset your password</Text>
          </Pressable>
        </View>

        <View style={{
          flexDirection :"row",
          justifyContent:"center"
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

export default Login