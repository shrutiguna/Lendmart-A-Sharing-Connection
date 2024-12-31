import { View, Text ,ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../constants/Colors'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button'
import { Pressable } from 'react-native';
import {firebase} from '../config'

const Signup = ({navigation}) => {
  const [email,setEmail] =useState('')
  const [password,setPassword] =useState('')
  const [fullname,setFullName] =useState('')
  const [address,setAddress] =useState('')
  const [contactno,setContactNumber] =useState('')
  const [isPasswordShown, setIsPasswordShown]= useState(true);

  registerUser = async (email,password,fullname,address,contactno) => {
    await firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(() => {
      firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp:true,
        url:'https://lendmart-90895.firebaseapp.com',
      })
      .then(() => {
        alert('Verification Email sent!')
      }).catch((error) => {
        alert(error.message)
      })
      .then(() => {
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          fullname,
          email,
          password,
          address,
          contactno,
        })
      })
      .catch((error) =>{
        alert(error.message)
      })
    })
    .catch((error) =>{
      alert(error.message)
    })
  }

  return (
   <SafeAreaView style ={{flex:1,backgroundColor:COLORS.white}}>
      <ScrollView style ={{flex:1 ,marginHorizontal :22}}>
        <View style ={{marginVertical:22}}>
          <Text style ={{
            fontSize:22,
            fontWeight:'bold',
            marginVertical:12,
            color:COLORS.black
          }}>Create Account!!</Text>
        </View>
        
        <View style ={{marginBottom:12}}>
          <Text style ={{
            fontSize: 16,
            fontWeight:400,
            marginVertical:8
          }}> Full Name </Text>
          
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
              placeholder='Enter your Full name'
              placeholderTextColor={COLORS.black}
              onChangeText={(fullname) => setFullName(fullname)}
              style={{width:"100%"}}
            />              
          </View>
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
          }}>Mobile Number </Text>
          
          <View style = {{
              width:"100%",
              height:48,
              borderColor:COLORS.black,
              borderWidth:1,
              borderRadius:8,
              alignItems:'center',
              justifyContent: "space-between",
              flexDirection:"row",
              paddingLeft:22
          }}>
            <TextInput
              placeholder='+1'
              placeholderTextColor={COLORS.black}
              keyboardType='numeric'
              style={{
                width:"12%",
                borderRightWidth:1,
                borderLeftColor:COLORS.grey,
                height:"100%"  
              }}
            />   

            <TextInput
              placeholder='Enter your phone number'
              placeholderTextColor={COLORS.black}
              onChangeText={(contactno) => setContactNumber(contactno)}
              keyboardType='numeric'
              style={{width:"80%"}}
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

          <View style ={{marginBottom:12}}>
          <Text style ={{
            fontSize: 16,
            fontWeight:400,
            marginVertical:8
          }}> Contact Address </Text>
          
          <View style = {{
              width:"100%",
              borderColor:COLORS.black,
              borderWidth:1,
              borderRadius:8,
              alignItems:'center',
              justifyContent: "center",
              paddingLeft: 22
          }}>
            <TextInput
              placeholder='Enter your Address'
              onChangeText={(address) => setAddress(address)}
              placeholderTextColor={COLORS.black}
              numberOfLines={7}
              multiline={true}
              style={{width:"100%"}}
            />              
          </View>
        </View>
        
        <Button 
          title ="Sign Up"
          filled
          style={{
            marginTop:18,
            marginBottom:4
          }}
          onPress={() => {registerUser(email,password,fullname,address,contactno);
                  navigation.navigate("Login");}}
        />

        <View style={{
          flexDirection :"row",
          justifyContent:"center",
          marginVertical:22
        }}>
          <Text style ={{
            fontSize:16,
            color:COLORS.black,
          }}>Already have an account? </Text>
          <Pressable onPress={()=> navigation.navigate("Login")}>
            <Text style ={{
              fontSize:16,
              color:COLORS.primary,
              fontWeight:"bold",
              marginLeft:6
            }}>Login</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
   </SafeAreaView>
  )
}

export default Signup