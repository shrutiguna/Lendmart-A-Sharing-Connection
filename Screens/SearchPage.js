import { View, Text, TextInput ,ActivityIndicator ,TouchableOpacity,FlatList, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';
import React ,{ useEffect, useState }  from 'react'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, query, where ,orderBy } from "firebase/firestore";
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import ItemDisplayFormat from '../components/ItemDisplayFormat';

export default function SearchPage() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const [searchquery, setSearchQuery] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const[loading,setLoading] =useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);

  const handleSearch = async() => {
    console.log(searchquery)
    // navigation.navigate('itemList', { category: searchquery });
    setSearchItems([]);
    setLoading(true)
    const querySnap = query(collection(db,'UserProductPost'),where('productname','==',searchquery))
    const queryInstance = await getDocs(querySnap);
    setLoading(false)
    queryInstance.forEach(doc=>{
      console.log(doc.data())
      setSearchItems(searchItems=>[...searchItems,doc.data()])
      setLoading(false)
    })
  }

  const handleSortByPrice = () => {
    const sortedItems = [...searchItems].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    setSearchItems(sortedItems);
    console.log("Sort by price",searchItems)
  }
  const handleSortByDatePosted = () => {
    const sortedItems = [...searchItems].sort((a, b) => a.postedAt - b.postedAt);
    setSearchItems(sortedItems);
  }

  useFocusEffect(
    React.useCallback(()=>{
      handleSearch();
      return()=>{
      };
    },[])
  );
  
  return (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center', marginTop: 50 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: COLORS.white, marginHorizontal: 10, borderRadius: 20 }}>
      <Ionicons name="search" size={24} color={COLORS.grey} />
      <TextInput
        placeholder='Search'
        clearButtonMode='always'
        style={{ flex: 1, marginLeft: 10 }}
        value={searchquery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons name="arrow-forward-circle" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSortDropdownVisible(!sortDropdownVisible)}>
        <Ionicons name="filter" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
    {sortDropdownVisible && (
      <View style={{ padding: 10, backgroundColor: COLORS.white, marginHorizontal: 10, borderRadius: 20 }}>
        <TouchableOpacity onPress={handleSortByPrice}>
          <Text style={{ fontSize: 16, color: COLORS.primary, marginBottom: 10 }}>Sort by Price</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSortByDatePosted}>
          <Text style={{ fontSize: 16, color: COLORS.primary }}>Sort by Date Posted</Text>
        </TouchableOpacity>
      </View>
    )}
    <View style={{ flex: 1, padding: 10 }}>
      {loading ?
        <ActivityIndicator size='large' color={COLORS.LightBlue} />
        :
        searchItems.length > 0 ?
          <FlatList
            data={searchItems}
            numColumns={2}
            renderItem={({ item, index }) => (
              <ItemDisplayFormat item={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          :
          <Text style={{ fontSize: 22, marginTop: 24, textAlign: 'center', color: COLORS.gray }}>No items found using this Search query</Text>
      }
    </View>
  </SafeAreaView>
  )
}







