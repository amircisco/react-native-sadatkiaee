import React, { useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator,Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TimeSheet = ({ navigation ,route }) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const [stateType, setStateType] = useState(2);
    const [currentDate, setCurrentDate] = useState('');
    const [enterTime, setEnterTime] = useState('');
    const [exitTime, setExitTime] = useState('');
    const [saveExit, setSaveExit] = useState(false);
    //bc:34:00:12:ab:90
    const [accessDenied, setAccessDenied] = useState(false);
    const [finsihLoading,setFinsihLoading] = useState(false);
    const [durringProcess,setDurringProcess] = useState(false);
    const [flgTextEnter,setFlgTextEnter] = useState(false); 
    const [flgTextExit,setFlgTextExit] = useState(false); 
    const sendTime = async (ac) => {
        if(durringProcess==false){
            setFlgTextEnter(true);
            setFlgTextExit(true);
            setDurringProcess(true);
        let url = (ac == "enter") ? serverport + "/api/timesheet/entertimesheet/" : serverport + "/api/timesheet/exittimesheet/";
        let token = await AsyncStorage.getItem('access');
        axios({
            url: url,
            method: 'POST',
            headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token },
            data: { 'action': ac }
        }).
            then((response) => {
                console.log(response);
                if (response.status === 200 ) {
                    if (stateType == 1) {
                        setCurrentDate(response.data.current_date);
                        setEnterTime(response.data.enter_time);
                        setStateType(2);
                    }
                    else if (stateType == 2) {
                        setExitTime(response.data.exit_time);
                        setSaveExit(true);
                    }
                }
                setDurringProcess(false);
                setFlgTextEnter(false);
                setFlgTextExit(false);
            }).
            catch((error) => {
                setFlgTextEnter(false);
                setFlgTextExit(false);
                setDurringProcess(false);
                console.log(error);
            });
        }
        else{
            Alert.alert(" در حال ارسال اطلاعات.لطفا صبر کنید");            
        }
    }
    useEffect(() => {

        NetInfo.fetch("wifi").then(state => {   
                 
            if (state.details.bssid != undefined && state.details.ssid != undefined ) {                
                const connect_to_server = async () => {
                    let token = await AsyncStorage.getItem('access');
                    axios({
                        url: serverport + "/api/timesheet/gettimesheet/",
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token, 'content-type': 'application/json' },
                        data: { details:state.details},
                    }).
                        then((response) => {          
                        
                            if (response.status === 200 ) {                                
                                setFinsihLoading(true);
                                setCurrentDate(response.data.current_date);
                                setEnterTime(response.data.enter_time);
                                setStateType(2);
                            }
                            else if (response.status === 202) {
                                setCurrentDate(response.data.current_date);
                                setFinsihLoading(true);
                                setStateType(1);
                            }
                            else if(response.status === 204){
                                Alert.alert("شما قبلا ساعت های ورود و خروج امروز را ثبت کرده اید");
                                navigation.navigate("homeMenu");
                            }
                        }).
                        catch((error) => {
                            console.log(error.response);
                            if (error.response.status === 401) {
                                setAccessDenied(true);
                            }
                        });
                }

                connect_to_server();
            }
            else{
                Alert.alert("اتصال خود را به شبکه دفتر بررسی نمایید");
                navigation.navigate("homeMenu");
            }
        });

    }, []);

    if (accessDenied) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20 }}>شما به شبکه اینترنت دفتر متصل نیستید</Text></View>
        );
    }
    else if(accessDenied==false && finsihLoading) {
        return (

            <View style={styles.container}>
                <Text style={styles.currentDate}>تاریخ : {currentDate}</Text>
                {
                    stateType == 1 ?
                        <TouchableOpacity onPress={() => { sendTime("enter") }} style={{ backgroundColor: '#5F9F9F', borderRadius: 10, padding: 20 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{flgTextEnter==false ? 'ثبت ساعت شروع کار' : 'لطفا صبر نمایید'}</Text>
                        </TouchableOpacity>
                        :
                        <>
                            <Text style={{ color: 'gray', fontSize: 20, marginBottom: 20 }}>ساعت ورود : {enterTime}</Text>
                            {
                                saveExit == true ?
                                    <Text style={{ color: 'gray', fontSize: 20 }}>ساعت خروج : {exitTime}</Text>
                                    :
                                    <TouchableOpacity onPress={() => { sendTime("exit") }} style={{ backgroundColor: '#5F9F9F', borderRadius: 10, padding: 20 }}>
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{flgTextExit==false ? 'ثبت ساعت پایان کار' : 'لطفا صبر نمایید'}</Text>
                                    </TouchableOpacity>

                            }

                        </>
                }

            </View>
        );
    }
    else if(finsihLoading==false){
        return (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color="green" ></ActivityIndicator></View>)
    }

}

export default TimeSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    currentDate: {
        position: 'absolute',
        top: 20,
        fontSize: 25,
    },
});














