import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid,Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios'



const HomeMenu = ({ navigation, route }) => {

    const serverport = route.params.SERVERINFO.SERVERPORT;
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9','#e67e22', '#e74c3c', '#95a5a6', '#c0392b', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#e67e22', '#e74c3c', '#95a5a6', '#c0392b', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12','#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9','#e67e22', '#e74c3c', '#95a5a6', '#c0392b', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#e67e22', '#e74c3c', '#95a5a6', '#c0392b', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#2980b9', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12'];
    const [menuItems, setMenuItems] = useState([]);

    const menuItemClicked = async (isLink, navigate, link, id) => {
        AsyncStorage.setItem("lastWebViewId", id.toString());
        if (isLink == 1) {
            navigation.navigate('webView', { url: link, isLink: isLink, id: id })
        }
        else if (isLink == 0) {
            navigation.navigate(navigate, { isLink: isLink })
        }
    }
    const [mobile, setMobile] = useState('');
    const refresh = () => {
        route.params.setIsLogin(false);   
    }
    const logOut = () => {
        removeData('mobile');
        removeData('password');
        removeData('access');
        removeData('refresh');
        removeData('groups');
        removeData("kosar_username");
        removeData("kosar_password");
        route.params.setIsLogin(false);
    }

    useEffect(() => {
        
        navigation.addListener('focus', payload => {
            route.params.blur(true);
        });

        const initMobileData = async () => {
            let grps = await AsyncStorage.getItem("groups") 
            const value = await AsyncStorage.getItem("mobile")
            if (value != "" && value != null && grps != "" && grps != null) {
                if (grps == "employee") {
                    grps = "کارمند";
                }
                else if (grps == "visitor") {
                    grps = "بازدید کننده";
                }

                else if (grps == "admin" || grps == "superuser" || grps == "administrator") {
                    grps = "مدیر";
                }

                let oldMenuItems = [...menuItems,
                //{ id: -1, name: 'ثبت اطلاعات بیمه گذار جدید', isLink: 0, navigate: 'newUser', link: '' },
                { id: -1, name: 'بازدید جدید', isLink: 0, navigate: 'img', link: '' },
                //{ id: -2, name: 'بازدیدهای من', isLink: 0, navigate: 'mySendered', link: '' },
                { id: -2, name: 'تنظیمات ورود', isLink: 0, navigate: 'infoLogin', link: '' },
                { id: -3, name: 'ثبت ساعت کاری', isLink: 0, navigate: 'timeSheet', link: '' },
                    //{ name: 'ارسال مدارک',isLink:0, navigate:'sendDocuments', link:''},                       
                ];
                getMenus(oldMenuItems)
                setMobile(value + " - " + grps)
            }

        }

        const getMenus = async (oldMenuItems = []) => {
            let token = await AsyncStorage.getItem('access')
            axios.get(serverport + "/api/bazdidkhodro/menu_items/", { headers: { 'Authorization': 'Bearer ' + token } }).
                then((respons) => {
                    if (respons.status == 200 && respons.data.results.length > 0) {
                        let newMenuItems = oldMenuItems;
                        respons.data.results.map((item) => {
                            let obj = {};
                            obj.id = item.id;
                            obj.name = item.name;
                            obj.link = item.link;
                            obj.isLink = item.isLink;
                            obj.navigate = item.navigate;
                            newMenuItems.push(obj);
                        });
                        setMenuItems(newMenuItems);
                        
                    }
                    else {
                        setMenuItems(oldMenuItems);
                    }
                }).
                catch((error) => {
                    setMenuItems(oldMenuItems);
                    console.log(error)
                });
        }
        initMobileData()
        return () => {
            navigation.removeListener('focus');
        }

    }, [null])
    return (
        <View style={styles.container}>

            <View style={styles.navProfile}>
                <TouchableOpacity onPress={logOut} style={styles.navProfileBtn} ><Text style={styles.navProfileBtnText}>خروج</Text></TouchableOpacity>
                <TouchableOpacity onPress={refresh} style={styles.navProfileBtnR} ><Text style={styles.navProfileBtnText}>نوسازی</Text></TouchableOpacity>
                <Text style={styles.navProfileMobile}>{mobile}</Text>
            </View>

            <FlatGrid
                itemDimension={130}
                data={menuItems}
                style={styles.gridView}
                // staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ index, item }) => (
                    <TouchableOpacity onPress={() => { menuItemClicked(item.isLink, item.navigate, item.link, item.id) }} activeOpacity={0.5} style={[styles.itemContainer, { backgroundColor: colors[index] }]}>
                        <Text style={styles.itemName}>{item.name}</Text>
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
    navProfileBtnR:{
        flex: 0.2,
        alignSelf: 'flex-start',
        backgroundColor: 'blue',
        padding: 5,
        marginLeft: 5,
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
