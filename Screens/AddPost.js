import { View, Text , TextInput,ScrollView, TouchableOpacity , Image, Alert, Platform , Pressable} from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase ,app } from '../config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getFirestore ,getDocs, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {Picker} from '@react-native-picker/picker';
import { Formik } from 'formik';
import Button from '../components/Button'
import COLORS from '../constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddPost() {  
  const db = getFirestore(app)
  const[categoryList, setCategoryList] =useState([]);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [date , setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickupDate1, setPickupDate] = useState("");
  const [timeList , setTimeList] = useState();
  const storage = getStorage();

  useEffect(()=>{
    getCategoryList();
  }, [])

  useEffect(()=>{
    getTime();
  }, [])


  useEffect(() =>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      }
    })
  },[])


  const toggleDatePicker=()=>{
    setShowPicker(!showPicker);
  }

  const onChange=( {type}, selectedDate)=>{
    if(type == "set"){
      const currentDate = selectedDate;
      setDate(currentDate);

      if(Platform.OS === "android"){
        toggleDatePicker();
        setPickupDate(currentDate.toDateString());
      }
    }
    else{
      toggleDatePicker();
    }
  }

  const getTime =() =>{
    const  timelist=[];
    
    for(let i=8;i<12;i++)
    {
      timelist.push(`${i}:00 AM`)
      timelist.push(`${i}:30 AM`)
    }

    for(let i=1;i<=5;i++)
    {
      timelist.push(`${i}:00 PM`)
      timelist.push(`${i}:30 PM`)
    }
    setTimeList(timelist);
  }

  const getCategoryList =async() =>{
    setCategoryList([]);
    const querySnapShot= await getDocs(collection(db,'ProductCategory'));
    querySnapShot.forEach((doc)=>{
      setCategoryList(categoryList=>[...categoryList,doc.data()])
    })
  }
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onFormSubmit=async(value) =>{
      try{
        const imgresp = await fetch(image);
        const blobimg = await imgresp.blob();
        const storageRef = ref(storage, 'Lendmart/'+ Date.now()+".jpg");
        value.pickupDate1 = pickupDate1
        uploadBytes(storageRef, blobimg).then((snapshot) => {}).
          then((imgresp)=>{
            getDownloadURL(storageRef).then(async(downloadURL)=>{
            value.image = downloadURL;
            value.userEmailId = name.email;
            value.userName=name.fullname;            
            const docRef= await addDoc(collection(db,"UserProductPost"),value)
            if(docRef.id)
            {
              Alert.alert("Success!!!","Post created Successfully");          
            }
          })
      });
      }
      catch(error){
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred while submitting the form. Please try again later.');
      }     
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
        }}>Add Post</Text>
      </View>

      <Formik initialValues={{
          productname:'', 
          category:'',
          description:'',
          price:'',
          address:'',
          mobilenumber:'',
          userName:'',
          userEmailId:'',
          image:'',
          postedAt: Date.now(),
          pickupDate1:'',
          timeSlot1:'',
          timeSlot2:''
        }}
        onSubmit={(value , {resetForm})=> {onFormSubmit(value);  resetForm();}}
        // validate={(values)=>{
        //   const errors={};
        //   if(!values.productname )
        //   {
        //       alert("Product name is required!!")
        //       errors.name ="Product name is required!!"
        //   }
        //   return errors
        // }}
      >
        
        {({handleChange, handleSubmit, handleBlur, values, setFieldValue,resetForm}) =>(
            <View>
              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Product Name </Text>
          
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
                    placeholder='Enter the Product Name'
                    placeholderTextColor={COLORS.black} 
                    value= {values?.productname}
                    onChangeText={handleChange('productname')}
                    style={{width:"100%"}}
                  />              
                </View>
              </View>
              
              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Product Category </Text>
                
                <View style = {{
                  width:"100%",
                  height:48,
                  borderColor:COLORS.black,
                  borderWidth:1,
                  borderRadius:8,
                  justifyContent: "center",
                  paddingLeft: 10
                }}>
                <Picker
                  selectedValue={values?.category}
                  onValueChange={itemValue=> setFieldValue('category',itemValue)}
                >
                  {categoryList.length>0 && categoryList.map((item,index) => (
                      <Picker.Item key={index} label ={item?.Name} value={item.Name}/>
                  ))}
                  </Picker>
                  </View>
              </View>
   
              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Product Description </Text>
          
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
                    placeholder='Enter the Product Description'
                    placeholderTextColor={COLORS.black} 
                    value= {values?.description}
                    numberOfLines={7}
                    onChangeText={handleChange('description')}
                    multiline={true}
                    style={{width:"100%"}}
                  />   
                </View>          
              </View>

              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}>Product Price</Text>
          
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
                    placeholder='$'
                    placeholderTextColor={COLORS.black}
                    keyboardType='numeric'
                    style={{
                      width:"10%",
                      borderRightWidth:1,
                      borderLeftColor:COLORS.grey,
                      height:"100%"  
                    }}
                  />   

                  <TextInput
                    placeholder='Enter your product price'
                    placeholderTextColor={COLORS.black}
                    value= {values?.price}
                    onChangeText={handleChange('price')}
                    keyboardType='number-pad'
                    style={{width:"80%"}}
                  />               
                </View>
              </View>

              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}>Contact Number </Text>
          
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
                    value= {values?.mobilenumber}
                    onChangeText={handleChange('mobilenumber')}
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
                }}> Address to Pickup </Text>
          
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
                    placeholder='Enter the address for the product to be pickedup'
                    placeholderTextColor={COLORS.black} 
                    value= {values?.address}
                    numberOfLines={7}
                    onChangeText={handleChange('address')}
                    multiline={true}
                    style={{width:"100%"}}
                  />   
                </View>          
              </View>
              
              <View style ={{marginBottom:12}}>
                
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Preferred Date Slot </Text>
                
                <View style = {{
                    width:"100%",
                    height:48,
                    borderColor:COLORS.black,
                    borderWidth:1,
                    borderRadius:8,
                    alignItems:'center',
                    justifyContent: "center"
                }}>
                  {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode='date'
                    display='spinner'
                    onChange={onChange}
                  />
                  )}

                  {!showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                      <TextInput
                        placeholder='Enter the preferred Date Slot for pickup'
                        placeholderTextColor={COLORS.black} 
                        value= {pickupDate1}
                        onChangeText={setPickupDate}
                        style={{width:"100%"}}
                        editable={false}
                      />   
                    </Pressable>
                  )}                             
                </View>
              </View>

              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Preferred TimeSlot -Choice 01 </Text>
                
                <View style = {{
                  width:"100%",
                  height:48,
                  borderColor:COLORS.black,
                  borderWidth:1,
                  borderRadius:8,
                  justifyContent: "center",
                  paddingLeft: 10
                }}>
                <Picker
                  selectedValue={values?.timeSlot1}
                  onValueChange={itemValue=> setFieldValue('timeSlot1',itemValue)}
                >
                  {timeList && timeList.map((time, index) => (
                    <Picker.Item key={index} label={time} value={time} />
                  ))}
                  </Picker>
                  </View>
              </View>              

              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Preferred TimeSlot -Choice 02 </Text>
                
                <View style = {{
                  width:"100%",
                  height:48,
                  borderColor:COLORS.black,
                  borderWidth:1,
                  borderRadius:8,
                  justifyContent: "center",
                  paddingLeft: 10
                }}>
                <Picker
                  selectedValue={values?.timeSlot2}
                  onValueChange={itemValue=> setFieldValue('timeSlot2',itemValue)}
                >
                  {timeList && timeList.map((time, index) => (
                    <Picker.Item key={index} label={time} value={time} />
                  ))}
                  </Picker>
                  </View>
              </View>   

              <View style ={{marginBottom:12}}>
                <Text style ={{
                  fontSize: 16,
                  fontWeight:400,
                  marginVertical:8
                }}> Product Image </Text>
              </View>
              
              <TouchableOpacity onPress={pickImage}>
                {
                  image?
                  <Image source ={{uri:image}}
                    style ={{width:100 , height:100,borderRadius:15}} />
                  :<Image source={require('../assets/placeholder.jpg')}
                    style ={{width:100 , height:100,borderRadius:15}} />
                }
              </TouchableOpacity>

              <Button 
                filled  
                title = "Add Post"
                style={{
                  marginTop:18,
                  marginBottom:4
                }}
                onPress={handleSubmit}
              />             
          </View>
        )}
      </Formik>
    </ScrollView>
    </SafeAreaView>
  )
}