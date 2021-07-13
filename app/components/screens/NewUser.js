import React,{useState} from 'react'
import { StyleSheet, Text, View,TextInput,Button,Alert,TouchableOpacity } from 'react-native'
import {Picker} from '@react-native-community/picker'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';


const NewUser = ({route}) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const [name,setName] = useState("");
    const [mobile,setMobile] = useState("");
    const [p1,setP1] = useState("");
    const [p2,setP2] = useState("");
    const [p3,setP3] = useState("");
    const [p4,setP4] = useState("");
    const [selectedValue,setSelectedValue] = useState("ج");
    const horof = [
        {'id':'1','name':'الف'},
        {'id':'2','name':'ب'},
        {'id':'3','name':'پ'},
        {'id':'4','name':'ت'},
        {'id':'5','name':'ث'},
        {'id':'6','name':'ج'},
        {'id':'7','name':'چ'},
        {'id':'8','name':'ح'},
        {'id':'9','name':'خ'},
        {'id':'10','name':'د'},
        {'id':'11','name':'ذ'},
        {'id':'12','name':'ر'},
        {'id':'13','name':'ز'},
        {'id':'14','name':'س'},
        {'id':'15','name':'ش'},
        {'id':'16','name':'ص'},
        {'id':'17','name':'ض'},
        {'id':'18','name':'ط'},
        {'id':'19','name':'ظ'},
        {'id':'20','name':'ع'},
        {'id':'21','name':'غ'},
        {'id':'22','name':'ف'},
        {'id':'23','name':'ق'},
        {'id':'24','name':'ک'},
        {'id':'25','name':'گ'},
        {'id':'26','name':'ل'},
        {'id':'27','name':'م'},
        {'id':'28','name':'ن'},
        {'id':'29','name':'و'},
        {'id':'30','name':'ه'},
        {'id':'31','name':'ی'},
        {'id':'32','name':'معلول'},
    ];

    const is_numeric = (str) => {
        return /^\d+$/.test(str);
    }
    const sendInfo = async() => {
        if(name.length > 0 && mobile.length > 0 && p1.length > 0 && p2.length > 0 && p3.length > 0 && p4.length > 0 ){
            if(mobile.length!=11 || mobile.indexOf("0")!=0 || !is_numeric(mobile)){
                Alert.alert(" شماره موبایل معتبر نمیباشد");
                return false;
            }
            if(p1.length!=2 || p2.length!=1 || p3.length!=3 || p4.length!=2 ){
                Alert.alert(" شماره پلاک معتبر نمیباشد");
                return false;
            }
            let token = await AsyncStorage.getItem('access');
            axios.post(serverport+"/api/bazdidkhodro/insurer_create/",{name:name,mobile:mobile,p1:p1,p2:p2,p3:p3,p4:p4},{headers: {'Authorization':'Bearer '+token}})
            .then(response=>{
                if(parseInt(response.data.state)===1){
                    Alert.alert("با موفقیت ثبت شد");
                }
                else if(parseInt(response.data.state)===-1){
                    Alert.alert("شماره موبایل قبلا در سیستم ثبت شده است");
                }
                else if(parseInt(response.data.state)===-2){
                    Alert.alert("شماره پلاک قبلا در سیستم ثبت شده است");
                }                
                else if(parseInt(response.data.state)===0){
                    Alert.alert("انجام نشد");
                }
            })
            .catch(error=>{
                Alert.alert("ارتباط با سرور برقرار نشد");
            });
        }
        else{            
            Alert.alert("پر کردن همه فیلدها الزامی است")
        }
    }
    return (
        <View style={styles.container}>
            <TextInput
            style={styles.textInput1}
            placeholder="نام بیمه گذار"                
            onChangeText={text => setName(text) }                    
            />
            <TextInput
            style={styles.textInput1}
            placeholder="موبایل بیمه گذار"         
            onChangeText={(text)=>{setMobile(text)}}   
            />
            
            <View style={styles.row}>
                <TextInput
                style={styles.textInput2}
                placeholder="۲۲"            
                onChangeText={(text)=>{setP1(text)}}
                />
                <Picker
                    selectedValue={selectedValue}                
                    style={styles.PickerBox}
                    onValueChange={itemValue => {setP2(itemValue); setSelectedValue(itemValue);}}
                >
                    { horof.map(item=>{
                            return <Picker.Item key={item.id} label={item.name} value={item.name} />
                    })}
                    
                    
                </Picker>
                <TextInput
                style={styles.textInput3}
                placeholder="۶۶۶"            
                onChangeText={(text)=>{setP3(text)}}
                />              
                <TextInput
                style={styles.textInput2}
                placeholder="۶۸"                            
                onChangeText={(text)=>{setP4(text)}}
                />                        
            </View>    
            {
            /*<View style={{flexDirection: 'row',justifyContent:'center',width:'40%',alignSelf:'center',marginTop:10,}}>
                <Text style={{color:'gray',fontSize:17,marginRight:2,}}>۲۲</Text>
                <Text style={{color:'gray',fontSize:17,marginRight:6,}}>ج</Text>
                <Text style={{color:'gray',fontSize:17,marginRight:6,}}>۶۶۶</Text>
                <Text style={{color:'gray',fontSize:17,}}>۶۸ </Text>
                <Text style={{color:'gray',fontSize:17,}}>ایران-</Text>
            </View>*/
            }           
            <TouchableOpacity style={styles.btnSend} onPress={()=>{sendInfo()}} >
                <Text style={styles.btnSendText}>ثبت بیمه گذار</Text>
                </TouchableOpacity>                          
        </View>
    )
}

export default NewUser

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        width: '100%',
        marginTop: 20,
                
    },
    row:{
        
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop:40,
        width: '70%',
        alignSelf: 'center',
                        
    },
    textInput1:{
        width: '70%',
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1,
        alignSelf:'center',
        padding: 10,
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        textAlign: 'right'        
    },
    textInput2:{
        marginHorizontal: 10,
        height: 40,
        fontSize: 19,
        borderColor: '#7a42f4',
        borderWidth: 1,
        textAlign: 'center',
        minWidth: 40,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
    },
    textInput3:{
        marginHorizontal: 10,
        height: 40,
        fontSize: 19,
        borderColor: '#7a42f4',
        borderWidth: 1,
        textAlign: 'center',
        minWidth: 60,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
    },    
    PickerBox: {
        minWidth: 100,
        marginHorizontal: 10,
        fontWeight: 'bold',        
    },
    btnSend: {
        width:'70%',
        padding:10,
        backgroundColor: '#00CDCD',  
        alignSelf: 'center',   
        marginTop: 40,
        borderRadius: 5,  
    },
    btnSendText:{
        color:'white',
        textAlign: 'center',
        fontSize:18,
    },        
})
