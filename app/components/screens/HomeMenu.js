import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeMenu = ({ navigation,route}) => { 
    const [mobile,setMobile] = useState('');
    const logOut = () => {        
        removeData('mobile');
        removeData('password');
        removeData('access');
        removeData('refresh');
        route.params.setIsLogin(false);
    }

    useEffect(()=>{
        const initMobileData = async() => {
            const value = await AsyncStorage.getItem("mobile")
            if(value!="" && value!=null)
                setMobile(value)
        }

        initMobileData()

    })
    return (
        <View style={styles.container}>

            <View style={styles.navProfile}>
                <TouchableOpacity onPress={logOut} style={styles.navProfileBtn} ><Text style={styles.navProfileBtnText}>خروج</Text></TouchableOpacity>
                <Text style={styles.navProfileMobile}>{mobile}</Text>
            </View>

            <View>
                <View style={styles.rowItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('newUser')}>
                        <Text style={styles.meniItem}>ثبت اطلاعات بیمه گزار جدید</Text>
                    </TouchableOpacity>
                </View>                
                <View style={styles.rowItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('sendImage')}>
                        <Text style={styles.meniItem}>بازدید جدید</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('mySendered')}>
                        <Text style={styles.meniItem}>بازدید های من</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('sendDocuments')}>
                        <Text style={styles.meniItem}>ارسال مدارک</Text>
                    </TouchableOpacity>
                </View>                                
            </View>

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
    }
})
