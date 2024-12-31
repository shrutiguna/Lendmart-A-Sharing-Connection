import { View, Text , FlatList, ActivityIndicator} from 'react-native'
import React ,{ useEffect, useState }  from 'react'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, query, where } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import ItemDisplayFormat from '../components/ItemDisplayFormat';
import COLORS from '../constants/Colors';

export default function ItemsList() {
  const db = getFirestore(app);
  const[loading,setLoading] =useState(false);
  const[itemlist, setItemList] =useState([]);
  const {params} = useRoute();
  const navigation = useNavigation();


  useEffect(()=>{
    params && getItemListByCategory();
  },[params])

  // useEffect(()=>{
  //   navigation.addListener('focus',(resp)=>{
  //     getItemListByCategory();
  //   })
  // })

  const getItemListByCategory=async()=>{
    setItemList([]);
    setLoading(true)
    const querySnap = query(collection(db,'UserProductPost'),where('category','==',params.category))
    const queryInstance = await getDocs(querySnap);
    setLoading(false)
    queryInstance.forEach(doc=>{
      setItemList(itemlist=>[...itemlist,doc.data()])
      setLoading(false)
    })
  }

  return (
    <SafeAreaView>
      <View className ="p-2">
        {loading ?
          <ActivityIndicator size={'large'} color={COLORS.LightBlue}/>        
        :
        itemlist.length >0 ? 
          <FlatList 
          data = {itemlist}
          numColumns={2}
          renderItem={({item, index}) => (
            <ItemDisplayFormat item={item}/>
          )}
        />
          : <Text className="p-5 text-[22px] mt-24
          justify-center text-center text-gray-500"
          > No items found under this category </Text>
        }      
      </View>
    </SafeAreaView>
    
  )
}