import { View, Text , ScrollView, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../components/Button'
import COLORS from '../constants/Colors'
import { firebase ,app } from '../config'
import { getFirestore ,getDocs, collection, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function DownloadReport() {
    const [reportname, setReportName] = useState('');
    const reportList =["Active Users" , "Inactive Users" ,"Products purchased in last 1 month"]
    const db = getFirestore(app)
    const [activeUsers, setActiveUsers]=useState([]);

    useEffect(()=>{
      getActiveUsers();
    }, [])
    
    const getReportData=async ()=>{
      console.log(reportname)
      if(reportname == "Active Users"){
        generateExcelFile();
      }
      else if(reportname == "Inactive Users"){
        Alert.alert("No data found", "No Inactive Users found");
      }
      else{
        Alert.alert("No data found", "No transaction processed to checkout");
      }    
    }

    const getActiveUsers=async()=>{
      setActiveUsers([]);
      const querySnap = query(collection(db,'users'))
      const queryInstance = await getDocs(querySnap);
      queryInstance.forEach((doc) => {
        const userData = doc.data();
        delete userData.password;
        setActiveUsers(activeUsers => [...activeUsers,userData]);
      });        
    }
  
  //   const generateExcelFile = async () => {
  //     console.log("Hi")
  //     console.log(activeUsers)
  //     let wb = XLSX.utils.book_new();
  //     let ws = XLSX.utils.aoa_to_sheet([
  //         ["Full Name", "Email", "Contact No", "Address"]
  //     ]);
  
  //     // Iterate through activeUsers array and add each user's data to the worksheet
  //     activeUsers.forEach((user) => {
  //         const { fullname, email, contactno, address } = user;
  //         XLSX.utils.sheet_add_aoa(ws, [[fullname, email, contactno, address]], { origin: -1 });
  //     });
  
  //     XLSX.utils.book_append_sheet(wb, ws, "Users", true);
  //     const base64 = XLSX.write(wb, { type: "base64" });
  //     const filename = FileSystem.documentDirectory + "UserDetails.xlsx";
  //     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
  //     if (permissions.granted) {
  //         await FileSystem.StorageAccessFramework.createFileAsync(
  //             permissions.directoryUri,
  //             "UserDetails.xlsx",
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //         ).then(async (uri) => {
  //             await FileSystem.writeAsStringAsync(uri, base64, {
  //                 encoding: FileSystem.EncodingType.Base64,
  //             });
  //         }).catch((e) => console.log(e));
  //     }
  // }  
 
  const generateExcelFile = async () => {
    let wb = XLSX.utils.book_new();
    let wsData = [];
  
    // Extract column names from the first user object
    const columns = Object.keys(activeUsers[0]);
  
    // Push column names as the first row of worksheet data
    wsData.push(columns);
  
    // Iterate through activeUsers array and add each user's data to the worksheet
    activeUsers.forEach((user) => {
      const rowData = columns.map((column) => user[column]);
      wsData.push(rowData);
    });
  
    // Convert worksheet data to sheet
    let ws = XLSX.utils.aoa_to_sheet(wsData);
  
    // Add sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Users", true);
  
    // Convert workbook to base64
    const base64 = XLSX.write(wb, { type: "base64" });
  
    // Define filename and permissions
    const filename = FileSystem.documentDirectory + "UserDetails.xlsx";
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    
    // Create Excel file
    if (permissions.granted) {
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        "UserDetails.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ).then(async (uri) => {
        // Write base64 data to file
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        Alert.alert("Download successful", "User details have been downloaded successfully.");
      }).catch((e) => console.log(e));
    }
  };
  
  return (
    <SafeAreaView style ={{flex:1,backgroundColor:COLORS.white}}>
        <ScrollView style ={{flex:1 ,marginHorizontal :22}}>        
            <View style ={{marginVertical:22}}>
                <Text style ={{
                fontSize:18,
                marginVertical:12,
                color:COLORS.black
                }}>Select the report name to generate</Text>
            </View>
            <View style ={{marginBottom:12}}>                
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
                   selectedValue={reportname}
                   onValueChange={itemValue=> setReportName(itemValue)}
                >
                  {reportList && reportList.map((name, index) => (
                    <Picker.Item key={index} label={name} value={name} />
                  ))}
                  </Picker>
                </View>
                
            </View>

            <Button 
                filled  
                title = "Download Report"
                style={{
                  marginTop:18,
                  marginBottom:4
                }}
                onPress={getReportData}
            />             
        </ScrollView>
    </SafeAreaView>      
  )
}