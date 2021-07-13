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
    useEffect(() => {      
        checkLogin();      
    },[]);

    const checkLogin = () => {
        getData('refresh').then((refresh) => {
            if(refresh.length > 1 ){            
                let url = serverport+'/api/token/refresh/';
                let headers = { 'content-type': 'application/json' }
                let data = {
                    'refresh': refresh,            
                }
                startFetch(url,headers,data).then((respons) => {
                    if(respons.data.access !== undefined){
                        storeData('access',respons.data.access)
                        route.params.setIsLogin(true);
                    }
                });
            }

        });
    }

    const clickedLogin = () => {
        let url = serverport+'/api/token/';
        let headers = { 'content-type': 'application/json' }
        let data = {
            'mobile': mobile,
            'password': password,
        }
        startFetch(url,headers,data).then((respons) => {
            if(respons != null){
                if (respons.status == 200 && respons.data.access !== undefined && respons.data.refresh !== undefined) {
                    storeData('mobile',mobile);
                    storeData('password',password);
                    storeData('refresh',respons.data.refresh);
                    storeData('access',respons.data.access);                    
                    route.params.setIsLogin(true);
                }
                else{
                    Alert.alert('نام کاربری و رمز عبور صحیح نمیباشد');
                }
            }
        });
        
    }
    const startFetch = async (url,headers,data) => {   
        setIsLoading(true)
        let resposne  = {};
        await axios({
            url: url,
            method: 'POST',
            headers: headers,
            data: data,
            }).
            then((respons) => {                
                resposne = respons;
            }).
            catch((error) => {
                console.log(error)                
            }).then(() => {
                setIsLoading(false)                
            });
        return resposne;    
    }

    return (
    <View style={styles.container}>
            <Image source={require('../../../assets/bimeh-kosar.jpg')} style={styles.img} />
            <Text style={styles.label}>نمایندگی سادات کیایی - کد ۵۰۲۱</Text>            
            <TextInput onChangeText={text => setMobile(text)} placeholder="تلفن همراه" style={styles.input} />
            <TextInput secureTextEntry={true} onChangeText={text => setPassword(text)} placeholder="رمز عبور" style={styles.input} />
            <TouchableOpacity onPress={clickedLogin} style={styles.btnLogin}>
                <Text style={styles.btnLoginText}>ورود</Text>
            </TouchableOpacity>
            {isLoading ? <Loading/> : <></>}
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
