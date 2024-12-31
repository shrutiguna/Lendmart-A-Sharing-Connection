import { View, Text ,Image,ScrollView, TouchableOpacity,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, addDoc , query ,where , deleteDoc } from "firebase/firestore";
import COLORS from '../constants/Colors';

export default function ProductDetails() {
  const {params} = useRoute();
  const [productdetails, setProductDetails]= useState([]);
  const db = getFirestore(app);
  const [name, setName] = useState('');
  const navigation = useNavigation();

  useEffect(() =>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      }
    })
  },[])

  useEffect(()=>{
    params && setProductDetails(params.product);
    console.log("Productdetails")
  },[params])

  const deleteUserPost=()=>{
    Alert.alert('Are you sure you want to Delete this Post?',"You cannot retrieve this post after you delete",[
      {
        text: "Delete",
        onPress: ()=> deletefromFirebase()
      },
      {
        text:'Cancel',
        style: 'cancel'
      }
    ])
  }

  const editUserPost=()=>{
    navigation.navigate('editPost', { product: productdetails });
  }

  const deletefromFirebase=async()=>{
    const querySnap = query(collection(db,'UserProductPost'),where('productname','==',productdetails.productname))
    const queryInstance = await getDocs(querySnap);
    queryInstance.forEach(doc=>{
      deleteDoc(doc.ref).then(resp=>{
          // navigation.goBack();
          Alert.alert('Success', 'Post Successfully Deleted', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('homePage')
                // navigation.goBack(); // Navigate back after user clicks OK
              }
            }
          ]);
      })
      .catch(error => {
        console.error('Error deleting post:', error);
        Alert.alert('Error', 'An error occurred while deleting the post. Please try again later.');
      });
    })
  }

  const addtocart=async()=>{   
    console.log(productdetails)   
    try {
      const querySnapshot = await getDocs(query(collection(db, 'CartItems'), 
            where('productname', '==', productdetails.productname),
            where('userEmailId', '==', productdetails.userEmailId)));
        // If a matching product is found, do not add it again
        if (!querySnapshot.empty) {
            Alert.alert('Error', 'Product is already added to Cart');
            return;
        }
        // console.log(productdetails)
        const cartData = {
            address: productdetails.address,
            category: productdetails.category,
            description: productdetails.description,
            image: productdetails.image,
            mobilenumber: productdetails.mobilenumber,
            pickupDate1: productdetails.pickupDate1,
            postedAt: productdetails.postedAt,
            price: productdetails.price,
            productname: productdetails.productname,
            timeSlot1: productdetails.timeSlot1,
            timeSlot2: productdetails.timeSlot2,
            userEmailId: productdetails.userEmailId,
            userName: productdetails.userName,
            BuyerName: name.fullname,
            BuyerEmailId: name.email,
            Buyercontactno: name.contactno
        };

        // Add the document to the Checkoutproducts collection
        await addDoc(collection(db, 'CartItems'), cartData);
        console.log('Product added to Cart successfully');
        navigation.navigate('Add to Cart')

    } catch (error) {
        console.error('Error adding product to Cart', error);
    }
  }
  
  return (
    <ScrollView className ="bg-white">
        <View className = "flex-1"> 
            <Text className ="text-[24px] font-bold mb-3 mt-3 italic ml-3">{productdetails?.productname}</Text>
            <Image source={{uri:productdetails.image}}
                className= "h-[300px] w-full rounded-xl"
            />
            <Text className ="mt-3 text-[20px] ml-2 font-bold italic">About the Product:</Text>
            <Text className="text-[16px] ml-4">{productdetails?.description}</Text>
            <Text className="text-[20px] ml-2 font-bold italic mt-3">Price : ${productdetails.price} </Text>
        </View>   

        <View className = "flex-1 justify-center"> 
            <Text className ="mt-3 text-[20px] ml-2 font-bold italic">Product Owner Details:</Text>
            <Text className="text-[17px] ml-2  mt-3"> 
                <Text className ="text-[18px] font-bold italic">Name:</Text>
                {productdetails.userName}
            </Text>
            <Text className="text-[17px] ml-2  mt-3"> 
                <Text className ="text-[18px] font-bold italic">Contact Number:</Text>
                +1 {productdetails.mobilenumber}
            </Text>
            <Text className="text-[17px] ml-2  mt-3"> 
                <Text className ="text-[18px] font-bold italic">Address for Item Pickup:</Text>
                {productdetails.address}
            </Text>
        </View> 
        
        {name.email == productdetails.userEmailId || name.email == 'admin@lendmart.com' ?
        <View>
          <TouchableOpacity 
            onPress ={()=> deleteUserPost()}
            className="z-40 rounded-full bg-red-600 p-4 m-2">           
            <Text className="text-center text-[15px] text-white">Delete User Post</Text>
          </TouchableOpacity> 

          <TouchableOpacity 
            onPress ={()=> editUserPost()}
            className="z-40 rounded-full p-4 m-2"
            style={{backgroundColor:COLORS.secondary}}>           
            <Text className="text-center text-[15px] text-white">Edit User Post</Text>
          </TouchableOpacity> 
        </View>               
        :
        <TouchableOpacity className="z-40 rounded-full bg-yellow-400 p-4 m-2"
        onPress={() => addtocart()}>           
            <Text className="text-center text-[15px]">Add to Cart</Text>
        </TouchableOpacity>
        } 
    </ScrollView>
  )
}