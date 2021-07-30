import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios'



const HomeMenu = ({ navigation, route }) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const colors = [ '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#c0392b', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#c0392b',          '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', ];
    const [menuItems, setMenuItems] = useState([]);

    const menuItemClicked = (isLink,navigate,link) => {
        if(isLink==1){
            navigation.navigate('webView',{url:link})
        }
        else if(isLink==0){
            navigation.navigate(navigate)
        }
    }  
    const [mobile, setMobile] = useState('');
    const logOut = () => {
        removeData('mobile');
        removeData('password');
        removeData('access');
        removeData('refresh');
        removeData('groups');
        route.params.setIsLogin(false);
    }

    useEffect(() => {
        const initMobileData = async () => {
            let grps = await AsyncStorage.getItem("groups")
            const value = await AsyncStorage.getItem("mobile")
            if (value != "" && value != null && grps != "" && grps != null)
                if(grps=="employee"){
                    grps = "کارمند";
                    getMenus();
                }
                else if(grps=="visitor"){
                    grps = "بازدید کننده";
                    let newMenuItems = [...menuItems,
                        { name: 'ثبت اطلاعات بیمه گذار جدید',isLink:0, navigate:'newUser', link:''},
                        { name: 'بازدید جدید',isLink:0, navigate:'sendImage', link:''},
                        { name: 'بازدیدهای من',isLink:0, navigate:'mySendered', link:''},
                       // { name: 'ارسال مدارک',isLink:0, navigate:'sendDocuments', link:''},                       
                    ];
                    setMenuItems(newMenuItems);
                }
                else if(grps=="admin" || grps=="superuser" || grps=="administrator"){
                    grps = "مدیر";
                    let oldMenuItems = [...menuItems,
                        { name: 'ثبت اطلاعات بیمه گذار جدید',isLink:0, navigate:'newUser', link:''},
                        { name: 'بازدید جدید',isLink:0, navigate:'sendImage', link:''},
                        { name: 'بازدیدهای من',isLink:0, navigate:'mySendered', link:''},
                       // { name: 'ارسال مدارک',isLink:0, navigate:'sendDocuments', link:''},                       
                    ];
                                  
                    getMenus(oldMenuItems)                        
                }
                setMobile(value+ " - " + grps)
        }

        const getMenus = async (oldMenuItems=[]) => { 
            let token = await AsyncStorage.getItem('access')
            axios.get(serverport+"/api/bazdidkhodro/menu_items/",{headers: {'Authorization':'Bearer '+token}}).
            then((respons) => {     
                if(respons.status == 200 && respons.data.results.length > 0 ){
                    let newMenuItems = oldMenuItems;
                    respons.data.results.map((item)=>{
                        let obj = {};
                        obj.name = item.name;
                        obj.link = item.link;
                        obj.isLink = item.isLink;
                        obj.navigate = item.navigate;
                        newMenuItems.push(obj);
                    });
                    setMenuItems(newMenuItems);
                }
            }).
            catch((error) => {
                    console.log(error)                
            });
        }
        initMobileData()
        

    },[null])
    return (
        <View style={styles.container}>

            <View style={styles.navProfile}>
                <TouchableOpacity onPress={logOut} style={styles.navProfileBtn} ><Text style={styles.navProfileBtnText}>خروج</Text></TouchableOpacity>
                <Text style={styles.navProfileMobile}>{mobile}</Text>
            </View>

            <FlatGrid
                itemDimension={130}
                data={menuItems}
                style={styles.gridView}
                // staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ index,item }) => (
                    <TouchableOpacity onPress={()=>{menuItemClicked(item.isLink,item.navigate,item.link)}} activeOpacity={0.5}  style={[styles.itemContainer, { backgroundColor: colors[index] }]}>
                        <Text  style={styles.itemName}>{item.name}</Text>
                    </TouchableOpacity >
                    
                )}
            />

        </View>
    )
}

const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)

    } catch (e) {
        // saving error
    }
}

export default HomeMenu

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    meniItem: {
        fontSize: 20,
        color: "blue",
    },
    rowItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        padding: 10,
        alignItems: 'flex-end',
    },
    navProfile: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3e3e3',
        borderBottomWidth: 1,
        borderBottomColor: '#d9d9d9',

    },
    navProfileBtn: {
        flex: 0.2,
        alignSelf: 'flex-start',
        backgroundColor: 'blue',
        padding: 5,
        borderRadius: 6,
    },
    navProfileBtnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navProfileMobile: {
        flex: 0.8,
        textAlign: 'right',
        alignSelf: 'flex-end',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gridView: {
        
        flex: 1,
      },
      itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        height: 150,
      },
      itemName: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        
      },    
})
