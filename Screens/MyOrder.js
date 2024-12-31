import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text,Image,Alert } from 'react-native';
import { firebase, app } from '../config';
import { getFirestore, getDocs, collection, query, where, deleteDoc, doc ,addDoc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors'
import { useFocusEffect } from '@react-navigation/native';

export default function MyOrder() {
      const db = getFirestore(app);
      const [name, setName] = useState('');
      const[myOrderList, setmyOrderList] =useState([]);
      
      const getUserdetails =()=>{
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid).get()
        .then((snapshot) => {
          if(snapshot.exists){
            setName(snapshot.data())
          }
        })
      }
  
      useEffect(()=>{
        getUserdetails();
        name && getOrderList();
      }, [name])
    
      const getOrderList = async () => {
        try {
          if (!name) {
            return;
          }
          const tempOrderList = [];
          const querySnap = query(collection(db, 'Checkoutproducts'), where('BuyerEmailId', '==', name.email))
          const queryInstance = await getDocs(querySnap);
          queryInstance.forEach((doc) => {
              tempOrderList.push({ ...doc.data(), id: doc.id});
          });
          setmyOrderList(tempOrderList);
        } 
        catch (error) {
          console.error('Error retrieving order items:', error);
        }        
      }

    // const handleCancelOrder = async (itemId, item) => {
    //   try {

    //       Alert.alert('Warning!!',"Are you sure you want to cancel the Order",[
    //       {
    //         text: "Delete",
    //         onPress: ()=> deletefromOrder()
    //       },
    //       {
    //         text:'Cancel',
    //         style: 'cancel'
    //       }
    //     ])
          
             
    //       // Create a modified object without BuyerEmailID, BuyerName, and BuyercontactNo
    //       const { BuyerEmailID, BuyerName, BuyercontactNo, ...modifiedItem } = item;
          
    //       // Add the modified item back to the UserProductPost collection
    //       await addDoc(collection(db, 'UserProductPost'), { ...modifiedItem, id: null });
          
    //       await deleteDoc(doc(db, 'Checkoutproducts', itemId));
    //       Alert.alert('Success', 'Order successfully cancelled');
          
    //       // Refresh the order list after cancellation
    //       getOrderList();
    //   } catch (error) {
    //       console.error('Error cancelling order:', error);
    //       Alert.alert('Error', 'An error occurred while cancelling the order. Please try again later.');
    //   }
    // }

    const handleCancelOrder = async (itemId,item) => {
      const newitem = myOrderList.find(cartItem => cartItem.id === itemId);
      // console.log(itemId)
      // console.log("enered here")
      try {
        // console.log(newitem)
        Alert.alert('Warning!!', "Are you sure you want to cancel the Order", [
          {
            text: "Delete",
            onPress: async () => {
              
              // Create a modified object without BuyerEmailID, BuyerName, and BuyercontactNo
              const { BuyerEmailId, BuyerName, Buyercontactno,id, ...modifiedItem } = newitem; 
              // Add the modified item back to the UserProductPost collection
              // console.log("Modified item")
              // console.log(modifiedItem)
              await addDoc(collection(db, 'UserProductPost'), { ...modifiedItem});    
              // Delete the item from the Checkoutproducts collection
              await deleteDoc(doc(db, 'Checkoutproducts', itemId));    
              Alert.alert('Success', 'Order successfully cancelled');    
              // Refresh the order list after cancellation
              getOrderList();
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]);
      } catch (error) {
        console.error('Error cancelling order:', error);
        Alert.alert('Error', 'An error occurred while cancelling the order. Please try again later.');
      }
    }
    
    useFocusEffect(
      React.useCallback(()=>{
        getOrderList();
        return()=>{
        };
      },[])
    );


    return (
        <SafeAreaView>
            <FlatList
                data={myOrderList}
                numColumns={2}
                renderItem={({ item,index }) => (
                    <View className ="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200">                    
                      <Image source ={{uri:item.image}}
                      className ="w-full h-[170px] rounded-lg" />                      
                          <Text className ="text-[15px] font-bold mt-2"> {item.productname} </Text>
                          <Text className ="text-[20px] font-bold" style={{color:COLORS.secondary}}> $ {item.price} </Text>
                          <TouchableOpacity 
                            className ="bg-red-500 mt-1 p-[2px] text-center rounded-full px-1 text-[10px] w-[60px]"
                            onPress={() => handleCancelOrder(item.id)}>
                            <Text className="text-white">Cancel</Text>
                          </TouchableOpacity>                  
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    )
}
