import * as React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator, Dimensions, Alert } from 'react-native';
//import Loading from './Loading'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WebViewComponent = ({ navigation, route }) => {
    const [kosarUsername, setKosarUsername] = useState('');
    const [kosarPassword, setKosarPassword] = useState('');
    const [innerhtml, setInnerhtml] = useState('شما اجازه دسترسی به بیمه مرکزی را ندارید');
    const url = route.params.url;
    
    useEffect(() => {
        const getData = async () => {
            try {
                const ku = await AsyncStorage.getItem("kosar_username");                
                const kp = await AsyncStorage.getItem("kosar_password");
                if (ku.length > 0 && kp.length > 0) {
                    setKosarUsername(ku);
                    setKosarPassword(kp);
                    setInnerhtml(" برای ورود اتوماتیک به سیستم اینجا کلیک کنید");
                }
                else {
                    Alert.alert('شما اجازه دسترسی به بیمه مرکزی را ندارید');
                    navigation.navigate("homeMenu");
                }
            }
            catch(e){
                Alert.alert('شما اجازه دسترسی به بیمه مرکزی را ندارید');
                navigation.navigate("homeMenu");
            }
            
        }
        getData();
    },[null]);
    
    const Loading = () => {        
        const all_width = Dimensions.get('window').width;
        const all_height = Dimensions.get('window').height;
        return (

            <ActivityIndicator style={styles.loading}
                size="large"
                color="#bc2b78"
                style={{ width: all_width, height: all_height, justifyContent: 'center', alignItems: 'center', }}>
            </ActivityIndicator>

        );
    }



    return (

        <WebView
            style={styles.container}
            originWhitelist={['*']}
            source={{ uri: url }}
            startInLoadingState={true}
            javaScriptEnabledAndroid={true}
            injectedJavaScript={`
            if(document.querySelector("#username") != undefined && document.querySelector("#password") != undefined && document.querySelector(".btn1") != undefined ){
                let btn = document.createElement("button");
                btn.id = "btnaddinfo";
                btn.style = "border:1px solid red;border-radius:10px;z-index:99999;width:84%;height:70%;position:fixed;top:15%;text-align:center;left:7%;padding:2%;font-size:80px;background-color:red;color:white;";
                btn.addEventListener("click", function(){
                    document.querySelector("#username").value="${kosarUsername}";
                    document.querySelector("#password").value="${kosarPassword}";            
                    document.querySelector(".btn1").click();
                    document.querySelector("#btnaddinfo").innerHTML  = "در حال ورود.لطفا صبر نمایید...";
                });    
                btn.innerHTML = "${innerhtml}";
                document.body.appendChild(btn);
            }
            `}
            renderLoading={() => <Loading />}
        />
    );
}

export default WebViewComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});