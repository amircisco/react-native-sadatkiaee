import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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


const Stack = createStackNavigator(); 
const server = "http://192.168.43.10";
const port = '8000';    

//const server = "http://sadat-kiaee.ir";
//const port = '443';

const SERVER = server;
const PORT = port;
const SERVERPORT = SERVER+':'+PORT;
const SERVERINFO = {
    SERVER:SERVER,
    PORT:PORT,
    SERVERPORT:SERVERPORT
};
const Home = () => {
    const [isLogin, setIsLogin] = useState(false);
    if (isLogin !==true) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="ورود" /> }} initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} name="login" component={Login}   />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else if(isLogin===true){
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="صفحه اصلی" /> }} name="homeMenu" initialParams={{setIsLogin:setIsLogin}} component={HomeMenu}  />
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="ثبت بیمه گذار" /> }} name="newUser" initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} component={NewUser}  />
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="بازدید جدید" /> }} name="sendImage" initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} component={SendImage}  />
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="بازدید های من" /> }} name="mySendered" initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} component={MySendered}  />
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="تصاویر" /> }} name="showImages" initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} component={ShowImages}  />
                    <Stack.Screen options={{headerStyle:{backgroundColor:'orange'},headerTitle: ()=> <CustomHeader textHeader="ارسال مدارک" /> }} name="sendDocuments" initialParams={{setIsLogin:setIsLogin,SERVERINFO:SERVERINFO}} component={SendDocuments}  />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Home

const styles = StyleSheet.create({})
