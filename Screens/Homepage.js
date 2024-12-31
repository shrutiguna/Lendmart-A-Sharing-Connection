import { View, Text ,ScrollView, FlatList, TouchableOpacity, Image } from 'react-native'
import React ,{ useEffect, useState }  from 'react'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, addDoc, orderBy } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../constants/Colors'
import ItemDisplayFormat from '../components/ItemDisplayFormat';
import { useNavigation } from '@react-navigation/native';

export default function Homepage() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const [name, setName] = useState('');
  const[categoryList, setCategoryList] =useState([]);
  const[latestItemList, setLatestItemList] =useState([]);

  useEffect(()=>{
    getCategoryList();
    getLatestItemList();
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

  // useEffect(()=>{
  //   navigation.addListener('focus',(resp)=>{
  //     getLatestItemList();
  //   })
  // })

  const getCategoryList =async() =>{
    setCategoryList([]);
    const querySnapShot= await getDocs(collection(db,'ProductCategory'));
    querySnapShot.forEach((doc)=>{
      setCategoryList(categoryList=>[...categoryList,doc.data()])
    })
  }

  const getLatestItemList =async() =>{
    setLatestItemList([]);
    const querySnapShot= await getDocs(collection(db,'UserProductPost'),orderBy('postedAt','desc'));
    querySnapShot.forEach((doc)=>{
      setLatestItemList(latestItemList=>[...latestItemList,doc.data()])
    })
  }


  return (
    <SafeAreaView style ={{flex:1,backgroundColor:COLORS.white}}>
      <View nestedScrollEnabled={true} style ={{flex:1 ,marginHorizontal :22}}> 
        <View style ={{marginVertical:22}}>
          <Text style ={{fontSize:22,
              fontWeight:'bold',
              marginVertical:12,
              color:COLORS.black
            }}> Welcome!! </Text>
            <Text style ={{fontSize:18,
              color:COLORS.black
            }}> {name.fullname}</Text>
        </View>
        
        <View>        
          <View style ={{marginBottom:12}}>
            <Text style ={{
              fontSize: 16,
              fontWeight:'bold',
              marginVertical:8,
            }}> Product categories </Text>
            
            <FlatList 
              data = {categoryList}
              numColumns={3}
              renderItem={({item, index}) => (
                <TouchableOpacity 
                onPress={()=>navigation.navigate('itemList',{
                  category:item.Name
                })}
                className ="flex-1 items-center justify-center 
                p-2 border-[1px] border-blue-200 m-1 h-[100px] rounded-lg"                
                style={{backgroundColor: COLORS.secondary}}>
                  <Text style={{fontSize:12, color: COLORS.white }}> {item?.Name} 
                  </Text>
                </TouchableOpacity>              
              )}
            />
          </View>        
        </View>

        <View>        
          <View style ={{marginBottom:12}}>
            <Text style ={{
              fontSize: 16,
              fontWeight:'bold',
              marginVertical:8,
            }}> Latest Item's Posted </Text>
            
            <FlatList 
              data = {latestItemList}
              numColumns={2}
              renderItem={({item, index}) => (
                <ItemDisplayFormat item={item}/>
              )}
            />
          </View>        
        </View>
      </View>
    </SafeAreaView>
  )
}