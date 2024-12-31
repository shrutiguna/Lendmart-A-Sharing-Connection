import { View, Text, Image, FlatList,TouchableOpacity } from 'react-native'
import React, { useEffect, useState }from 'react'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, addDoc, orderBy } from "firebase/firestore";
import COLORS from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function AdminAccount() {
  const db = getFirestore(app);
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const menubutton=[
    {
      id: 1,
      name: 'User Posts',
      path:'userpost'
    },
    {
      id: 2,
      name: 'Download Reports',
      path: 'downloadReport'
    },
    {
      id: 3,
      name: 'Logout'
    }
  ]

  const onPathSelect=(item)=>{
    item?.path ? navigation.navigate(item.path) :null;

    switch (item.name) {
      case 'Logout':
        firebase.auth().signOut().then(() => {
          navigation.navigate('Login');
        }).catch((error) => {
          console.error("Error logging out: ", error);
        });
        break;
      default:
        break;
    }
  }

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
    <View className="p-5 flex-1">
    <View className="items-center mt-[150px]">
      <Image source={require('../assets/account.jpg')}  
              className="w-[100px] rounded-full h-[100px]"
      />
      <Text className="font-bold text-[20px] mt-3 mb-16"> {name.fullname} </Text>
    </View>
    <FlatList 
      data = {menubutton}
      numColumns={2}
      renderItem={({item, index}) => (
        <TouchableOpacity
          onPress={()=>onPathSelect(item)}
          className ="flex-1 items-center justify-center 
          p-2 border-[1px] border-blue-200 m-1 h-[100px] rounded-lg"                
          style={{backgroundColor: COLORS.secondary}}>
          <Text style={{fontSize:15, color: COLORS.white, textAlign:'center' }}> {item?.name} 
          </Text>
        </TouchableOpacity>              
      )}
    />      
  </View>
  )
}