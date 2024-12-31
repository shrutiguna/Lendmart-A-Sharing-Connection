import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase, app } from '../config';
import { getFirestore, getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore";
import {Picker} from '@react-native-picker/picker';

export default function EditPost() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [editedPost, setEditedPost] = useState({});
  const [name, setName] = useState('');
  const [timeList, setTimeList] = useState([]);
  const db = getFirestore(app);

  useEffect(() =>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      }
    })
  },[])

  useEffect(() => {
    // Fetch the post details from the params
    setEditedPost(params.product);
    getTime();
  }, [params]);

  const handleSaveChanges = async () => {
    const querySnap = query(collection(db,'UserProductPost'),where('userEmailId','==',name.email),
          where('postedAt','==',editedPost.postedAt))
    const queryInstance = await getDocs(querySnap);

    queryInstance.forEach(async (doc) => {
      try {
        // Update the post details in the database
        await updateDoc(doc.ref, editedPost);
        Alert.alert('Success', 'Post details updated successfully');
        navigation.navigate('homePage');
      } catch (error) {
        console.error('Error updating post details:', error);
        Alert.alert('Error', 'Failed to update post details. Please try again.');
      }
    });
  }

  const getTime = () => {
    const timelist = [];
    
    for(let i = 8; i < 12; i++) {
      timelist.push(`${i}:00 AM`)
      timelist.push(`${i}:30 AM`)
    }

    for(let i = 1; i <= 5; i++) {
      timelist.push(`${i}:00 PM`)
      timelist.push(`${i}:30 PM`)
    }

    setTimeList(timelist);
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Edit Post</Text>
      <TextInput
        placeholder="Product Name"
        value={editedPost.productname}
        onChangeText={(text) => setEditedPost({ ...editedPost, productname: text })}
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Description"
        value={editedPost.description}
        onChangeText={(text) => setEditedPost({ ...editedPost, description: text })}
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Price"
        value={editedPost.price}
        onChangeText={(text) => setEditedPost({ ...editedPost, price: text })}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Contact Number"
        value={editedPost.mobilenumber}
        onChangeText={(text) => setEditedPost({ ...editedPost, mobilenumber: text })}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Address to Pickup"
        value={editedPost.address}
        onChangeText={(text) => setEditedPost({ ...editedPost, address: text })}
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
      />
      <View style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 2, padding: 4, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 3 }}>Preferred Time Slot 1</Text>
        <Picker
          selectedValue={editedPost.timeSlot1}
          onValueChange={(itemValue) => setEditedPost({ ...editedPost, timeSlot1: itemValue })}
        >
          {timeList.map((time, index) => (
            <Picker.Item key={index} label={time} value={time} />
          ))}
        </Picker>
      </View>
      <View style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 2, padding: 4, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 3 }}>Preferred Time Slot 2</Text>
        <Picker
          selectedValue={editedPost.timeSlot2}
          onValueChange={(itemValue) => setEditedPost({ ...editedPost, timeSlot2: itemValue })}
        >
          {timeList.map((time, index) => (
            <Picker.Item key={index} label={time} value={time} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity 
        onPress={handleSaveChanges} 
        style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}