import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert,Button } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './Loading'

const Login = ({ route }) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const [isLoading, setIsLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    useEffect(()=>{
        const initdata = async () => {
            const u = await getData('kosar_username');
            const p = await getData('kosar_password');        
            setMobile(u);
            setPassword(p);
        }
        initdata();
    },[null]);
    const clickedSave = () => {
        if(mobile.length > 0 && password.length > 0){
            storeData("kosar_username",mobile);
            storeData("kosar_password",password);
            Alert.alert("اطلاعات با موفقیت ذخیره شد");
        }
        else{
            Alert.alert("لطفا نام کاربری  رمز عبور  را به طور صحیح وارد کنید");
        }
    }
    return (
    <View style={styles.container}>                        
            <TextInput value={mobile} onChangeText={text => setMobile(text)} placeholder="نام کاربری" style={styles.input} />
            <TextInput value={password}  secureTextEntry={true} onChangeText={text => setPassword(text)} placeholder="رمز عبور" style={styles.input} />
            <TouchableOpacity onPress={clickedSave} style={styles.btnLogin}>
                <Text style={styles.btnLoginText}>ذخیره</Text>
            </TouchableOpacity>
    </View>
    
        
    )
}

const storeData = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}

const removeData = async (key,value) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        // saving error
    }
}



const getData = async (key) => {
    let ret = '';
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            ret = value;
        }
    } catch (e) {
        // error reading value
    }

    return ret
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
    },
    input: {
        marginVertical: 10,
        width: '70%',
        padding: 10,
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        textAlign: 'right'
    },
    btnLogin: {
        padding: 15,
        width: '70%',
        backgroundColor: 'blue',
        borderRadius: 6,
    },
    btnLoginText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,


    },
    img: {
        width: 120,
        height: 120,
        marginBottom:10,
    },
    label:{
        fontWeight: 'bold',
        marginBottom:50,
    },
})
