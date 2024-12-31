import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState }from 'react'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, query, where } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context'
import ItemDisplayFormat from '../components/ItemDisplayFormat';
import { useNavigation } from '@react-navigation/native';

export default function UsersProductPosts() {
    const db = getFirestore(app);
    const [myproduct, setMyProduct]=useState([]);
    const navigation = useNavigation();

    useEffect(() =>{
        getUserPost();
    },[])
      
    const getUserPost=async()=>{
        setMyProduct([]);
        const querySnap = query(collection(db,'UserProductPost'))
        const queryInstance = await getDocs(querySnap);
        queryInstance.forEach(doc=>{
          setMyProduct(myproduct=>[...myproduct,doc.data()])
        })
    }
    
    return (
        <SafeAreaView>
            <View>
                <FlatList 
                    data = {myproduct}
                    numColumns={2}
                    renderItem={({item, index}) => (
                    <ItemDisplayFormat item={item}/>
                    )}
                />
            </View>
        </SafeAreaView> 
    )
}