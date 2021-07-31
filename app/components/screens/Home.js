import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, AppState } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SendImage from './SendImage';
import HomeMenu from './HomeMenu';
import NewUser from './NewUser';
import MySendered from './MySendered';
import ShowImages from './ShowImages';
import SendDocuments from './SendDocuments';
import Login from './Login'
import CustomHeader from './CustomHeader';
import WebView from './WebView';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();
const server = "http://192.168.43.84";
const port = '8000';

//const server = "sadatkiaee.dd-ns.ir";
//const port = '80';

const SERVER = server;
const PORT = port;
const SERVERPORT = SERVER + ':' + PORT;
const SERVERINFO = {
    SERVER: SERVER,
    PORT: PORT,
    SERVERPORT: SERVERPORT
};
const Home = () => {
    const [isLogin, setIsLogin] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const focus = async () => { 
        let lastWebViewId = await AsyncStorage.getItem("lastWebViewId");
        lastWebViewId = parseInt(lastWebViewId);
        if (lastWebViewId > 0) {
            let token = await AsyncStorage.getItem('access');
            
            axios({
                url: SERVERPORT + "/api/bazdidkhodro/mobile_signal/",
                method:'POST',
                headers: { 'content-type':'application/json', 'Authorization': 'Bearer ' + token } ,
                data : { id: lastWebViewId, action: 'enter' }
                }).
                then((response) => {

                }).
                catch((error) => { console.log(error) });
        }
    }

    const blur = async (setZiro = false) => { 
        let lastWebViewId = await AsyncStorage.getItem("lastWebViewId");
        lastWebViewId = parseInt(lastWebViewId);
        if (lastWebViewId > 0) {
            let token = await AsyncStorage.getItem('access');
            axios(
                {
                    url: SERVERPORT + "/api/bazdidkhodro/mobile_signal/",
                    method:'POST',
                    headers: { 'content-type':'application/json', 'Authorization': 'Bearer ' + token },
                    data: { id: lastWebViewId, action: 'leave'}
                }).
                then((response) => {

                }).
                catch((error) => { console.log(error) });
        }
        if (setZiro)
            AsyncStorage.setItem("lastWebViewId","0");
        
    }

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, [null]);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            focus();
        }
        else {
            blur();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);

    };


    if (isLogin !== true) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="ورود" /> }} initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} name="login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else if (isLogin === true) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="صفحه اصلی" /> }} name="homeMenu" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO,blur:blur }} component={HomeMenu} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="ثبت بیمه گذار" /> }} name="newUser" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={NewUser} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="بازدید جدید" /> }} name="sendImage" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={SendImage} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="بازدید های من" /> }} name="mySendered" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={MySendered} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="تصاویر" /> }} name="showImages" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={ShowImages} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="ارسال مدارک" /> }} name="sendDocuments" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={SendDocuments} />
                    <Stack.Screen listeners={({ navigation, route }) => ({
                        focus: e => {
                            focus();
                        },

                    })} options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="بیمه مرکزی کوثر" /> }} name="webView" component={WebView} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Home

const styles = StyleSheet.create({})
