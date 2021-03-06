import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, AppState,Alert } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Img from './Img';
import HomeMenu from './HomeMenu';
import NewUser from './NewUser';
import MySendered from './MySendered';
import ShowImages from './ShowImages';
import SendDocuments from './SendDocuments';
import Login from './Login'
import CustomHeader from './CustomHeader';
import WebView from './WebView';
import TimeSheet from './TimeSheet';
import InfoLogin from './InfoLogin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();
//const server = "http://192.168.43.84";
//const port = '8000';

//const server = "https://sadat-kiaee.ir";
const server = "http://sadat-kiaee.ir";
const port = '443';

const SERVER = server;
const PORT = port;
//const SERVERPORT = SERVER + ':' + PORT;
const SERVERPORT = SERVER ;
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
                method: 'POST',
                headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token },
                data: { id: lastWebViewId, action: 'enter' }
            }).
                then((response) => {

                }).
                catch((error) => {                    
                    console.log(error) 
                    if (error.response.status === 401) {
                        removeAllConfigUser();
                    }
                });
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
                    method: 'POST',
                    headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token },
                    data: { id: lastWebViewId, action: 'leave' }
                }).
                then((response) => {

                }).
                catch((error) => {
                    //console.log(error)
                    if (error.response.status === 401) {
                        removeAllConfigUser();
                    }
                });
        }
        if (setZiro)
            AsyncStorage.setItem("lastWebViewId", "0");

    }

    const removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key)

        } catch (e) {
            // saving error
        }
    }

    const removeAllConfigUser = () => {
        removeData('mobile');
        removeData('password');
        removeData('access');
        removeData('refresh');
        removeData('groups');
        removeData("kosar_username");
        removeData("kosar_password");
        setIsLogin(false);
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
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="????????" /> }} initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} name="login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else if (isLogin === true) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="???????? ????????" /> }} name="homeMenu" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO, blur: blur }} component={HomeMenu} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="?????? ???????? ????????" /> }} name="newUser" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={NewUser} />                    
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="?????????? ???????? ????????????" /> }} name="img" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={Img} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="???????????? ?????? ????" /> }} name="mySendered" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={MySendered} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="????????????" /> }} name="showImages" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={ShowImages} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="?????????? ??????????" /> }} name="sendDocuments" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={SendDocuments} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="?????????????? ????????" /> }} name="infoLogin" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={InfoLogin} />
                    <Stack.Screen options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="?????? ???????? ????????" /> }} name="timeSheet" initialParams={{ setIsLogin: setIsLogin, SERVERINFO: SERVERINFO }} component={TimeSheet} />                    
                    <Stack.Screen listeners={({ navigation, route }) => ({
                        focus: e => {
                            focus();
                        },

                    })} options={{ headerStyle: { backgroundColor: 'orange' }, headerTitle: () => <CustomHeader textHeader="???????? ?????????? ????????" /> }} name="webView" component={WebView} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Home

const styles = StyleSheet.create({})
