import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, Alert, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { firebase, app } from '../config';
import { getFirestore, getDocs, collection, query, where, deleteDoc, doc, addDoc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from react-native-paper

export default function Addtocart() {
  const db = getFirestore(app);
  const [name, setName] = useState('');
  const [myCartList, setmyCartList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // State to manage selected time slot
  const navigation = useNavigation();

  useEffect(() => {
    getUserdetails();
    name && getCartList();
  }, [name]);

  const getUserdetails = () => {
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data())
        }
      })
  }

  const getCartList = async () => {
    try {
      if (!name) {
        return;
      }
      const tempOrderList = [];
      const querySnap = query(collection(db, 'CartItems'), where('BuyerEmailId', '==', name.email));
      const queryInstance = await getDocs(querySnap);
      queryInstance.forEach((doc) => {
        tempOrderList.push({ ...doc.data(), id: doc.id });
      });
      setmyCartList(tempOrderList);
    } catch (error) {
      console.error('Error retrieving cart items:', error);
    }
  }

  const removeCart = async (itemId, item) => {
    try {
      await deleteDoc(doc(db, 'CartItems', itemId));
      Alert.alert('Success', 'Product Removed from Cart');
      navigation.navigate('homePage')
    } catch (error) {
      console.error('Error cancelling order:', error);
      Alert.alert('Error', 'An error occurred while cancelling the order. Please try again later.');
    }
  }

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedTimeSlot(null); // Reset selected time slot when modal opens
    setIsModalVisible(true);
  }

  const closeModal = () => {
    setIsModalVisible(false);
  }

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  }

  const handleConfirm = () => {
    // Perform any necessary action here
    setIsModalVisible(false); // Close the modal
    console.log("Entered here")
    console.log("Selected product",selectedProduct)
    addCheckout(selectedProduct.id);
  }

  const addCheckout = async (itemId) => {
    try {
    // Find the item in myCartList based on the itemId
    const item = myCartList.find(cartItem => cartItem.id === itemId);
    if (!item) {
      console.error('Item not found in cart');
      return;
    }

    // Construct the checkout data
    const checkoutData = {
      address: item.address,
      category: item.category,
      description: item.description,
      image: item.image,
      mobilenumber: item.mobilenumber,
      pickupDate1: item.pickupDate1,
      postedAt: item.postedAt,
      price: item.price,
      productname: item.productname,
      timeSlot1: item.timeSlot1,
      timeSlot2: item.timeSlot2,
      userEmailId: item.userEmailId,
      userName: item.userName,
      BuyerName: name.fullname,
      BuyerEmailId: name.email,
      Buyercontactno: name.contactno
    };
    console.log("Add to cart checkout")
    console.log(checkoutData)
    // Add the document to the Checkoutproducts collection
    await addDoc(collection(db, 'Checkoutproducts'), checkoutData);
    console.log('Product added to Checkoutproducts successfully');

    // Remove the item from the CartItems collection
    await deleteDoc(doc(db, 'CartItems', itemId));
    console.log('Product removed from CartItems successfully');

    const userProductPostQuerySnap = await getDocs(query(collection(db, 'UserProductPost'), 
      where('userEmailId','==',item.userEmailId),
      where('productname','==',item.productname),
      where('postedAt','==',item.postedAt)))
   
    userProductPostQuerySnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Product removed from UserProductPost successfully');
    });

    // Refresh the cart list after removal
    getCartList();

    // Show success message
    Alert.alert('Success', 'Product added to Checkout successfully');

  } catch (error) {
    console.error('Error adding product to Checkout:', error);
    Alert.alert('Error', 'An error occurred while adding the product to Checkout. Please try again later.');
  }
  } 

  useFocusEffect(
    React.useCallback(()=>{
      getCartList();
      return()=>{
      };
    },[])
  );

  return (
    <SafeAreaView>
      { myCartList.length >0 ? 
      <FlatList
        data={myCartList}
        numColumns={2}
        renderItem={({ item, index }) => (
          <View className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200">
            <Image source={{ uri: item.image }}
              className="w-full h-[170px] rounded-lg" />
            <Text className="text-[15px] font-bold mt-2"> {item.productname} </Text>
            <Text className="text-[20px] font-bold" style={{ color: COLORS.secondary }}> $ {item.price} </Text>
            <TouchableOpacity
              className="mt-1 bg-blue-500 p-[2px] text-center rounded-full px-1 text-[20px] w-[80px]"
              onPress={() => openModal(item)} // Open modal on checkout button click
            >
              <Text className="text-white">Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-1 bg-red-600 p-[2px] text-center rounded-full px-1 text-[20px] w-[80px]"
              onPress={() => removeCart(item.id)}>
              <Text className="text-white">Remove from Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      : <Text className="p-5 text-[22px] mt-24
               justify-center text-center text-gray-500"
              > No items in cart </Text>
      } 
      {selectedProduct && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTextCheckout}>Checkout</Text>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTextProduct}>{selectedProduct.productname}</Text>
                  <Text style={styles.modalTextPrice}>${selectedProduct.price}</Text>
                  <View style={styles.radioContainer}>
                    <RadioButton.Android // Use RadioButton.Android for Android platform
                      value={selectedProduct.timeSlot1}
                      status={selectedTimeSlot === selectedProduct.timeSlot1 ? 'checked' : 'unchecked'}
                      onPress={() => handleTimeSlotSelection(selectedProduct.timeSlot1)}
                      color={COLORS.primary}
                    />
                    <Text style={styles.radioText}>{selectedProduct.timeSlot1}</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioButton.Android // Use RadioButton.Android for Android platform
                      value={selectedProduct.timeSlot2}
                      status={selectedTimeSlot === selectedProduct.timeSlot2 ? 'checked' : 'unchecked'}
                      onPress={() => handleTimeSlotSelection(selectedProduct.timeSlot2)}
                      color={COLORS.primary}
                    />
                    <Text style={styles.radioText}>{selectedProduct.timeSlot2}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={closeModal}
                  >
                    {/* <Text style={styles.closeIconText}>X</Text> */}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 20,
  },
  modalTextCheckout: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  modalTextProduct: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTextPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioText: {
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});



/* Chandramouli Code

import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text,Image,Alert } from 'react-native';
import { firebase, app } from '../config';
import { getFirestore, getDocs, collection, query, where, deleteDoc, doc ,addDoc} from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

export default function Addtocart() {
      const db = getFirestore(app);
      const [name, setName] = useState('');
      const[myCartList, setmyCartList] =useState([]);
      const navigation = useNavigation();      

      useEffect(()=>{
        getUserdetails();
        name && getCartList();
      }, [name])
      
      const getUserdetails =()=>{
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid).get()
        .then((snapshot) => {
          if(snapshot.exists){
            setName(snapshot.data())
          }
        })
      }

      const getCartList = async () => {
        try {
          if (!name) {
            return;
          }
          const tempOrderList = [];
          const querySnap = query(collection(db, 'CartItems'), where('BuyerEmailId', '==', name.email));
          const queryInstance = await getDocs(querySnap);
          queryInstance.forEach((doc) => {
            tempOrderList.push({ ...doc.data(), id: doc.id });
          });
          setmyCartList(tempOrderList);
        } 
      catch (error) {
        console.error('Error retrieving cart items:', error);
      }        
      }
    
      const removeCart = async (itemId, item) => {
        try 
        {
          // Delete the item from the Checkoutproducts collection
          await deleteDoc(doc(db, 'CartItems', itemId));
          Alert.alert('Success', 'Product Removed from Cart');  
          navigation.navigate('homePage')            
        } 
        catch (error) {
          console.error('Error cancelling order:', error);
          Alert.alert('Error', 'An error occurred while cancelling the order. Please try again later.');
        }
      }

      const addCheckout = async (itemId) => {
        try {
        // Find the item in myCartList based on the itemId
        const item = myCartList.find(cartItem => cartItem.id === itemId);
        if (!item) {
          console.error('Item not found in cart');
          return;
        }
    
        // Construct the checkout data
        const checkoutData = {
          address: item.address,
          category: item.category,
          description: item.description,
          image: item.image,
          mobilenumber: item.mobilenumber,
          pickupDate1: item.pickupDate1,
          postedAt: item.postedAt,
          price: item.price,
          productname: item.productname,
          timeSlot1: item.timeSlot1,
          timeSlot2: item.timeSlot2,
          userEmailId: item.userEmailId,
          userName: item.userName,
          BuyerName: name.fullname,
          BuyerEmailId: name.email,
          Buyercontactno: name.contactno
        };
        console.log("Add to cart checkout")
        console.log(checkoutData)
        // Add the document to the Checkoutproducts collection
        await addDoc(collection(db, 'Checkoutproducts'), checkoutData);
        console.log('Product added to Checkoutproducts successfully');
    
        // Remove the item from the CartItems collection
        await deleteDoc(doc(db, 'CartItems', itemId));
        console.log('Product removed from CartItems successfully');

        const userProductPostQuerySnap = await getDocs(query(collection(db, 'UserProductPost'), 
          where('userEmailId','==',item.userEmailId),
          where('productname','==',item.productname),
          where('postedAt','==',item.postedAt)))
       
        userProductPostQuerySnap.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log('Product removed from UserProductPost successfully');
        });
    
        // Refresh the cart list after removal
        getCartList();
    
        // Show success message
        Alert.alert('Success', 'Product added to Checkout successfully');
    
      } catch (error) {
        console.error('Error adding product to Checkout:', error);
        Alert.alert('Error', 'An error occurred while adding the product to Checkout. Please try again later.');
      }
    }      

    useFocusEffect(
      React.useCallback(()=>{
        getCartList();
        return()=>{
        };
      },[])
    );

    return (
        <SafeAreaView>
          { myCartList.length >0 ? 
            <FlatList
                data={myCartList}
                numColumns={2}
                renderItem={({ item,index }) => (
                    <View className ="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200">                    
                      <Image source ={{uri:item.image}}
                      className ="w-full h-[170px] rounded-lg" />                      
                          <Text className ="text-[15px] font-bold mt-2"> {item.productname} </Text>
                          <Text className ="text-[20px] font-bold" style={{color:COLORS.secondary}}> $ {item.price} </Text>
                          <TouchableOpacity 
                            className ="mt-1 bg-blue-500 p-[2px] text-center rounded-full px-1 text-[20px] w-[80px]"
                            onPress={() => addCheckout(item.id)}
                          >
                            <Text className="text-white">Checkout</Text>
                          </TouchableOpacity>   
                          <TouchableOpacity 
                            className ="mt-1 bg-red-600 p-[2px] text-center rounded-full px-1 text-[20px] w-[80px]"
                            onPress={() => removeCart(item.id)}>
                            <Text className="text-white">Remove from Cart</Text>
                          </TouchableOpacity>                  
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            : <Text className="p-5 text-[22px] mt-24
               justify-center text-center text-gray-500"
              > No items in cart </Text>
            }      
        </SafeAreaView>
    )
}


*/