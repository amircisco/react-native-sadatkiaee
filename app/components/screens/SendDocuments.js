import React, { useState, useEffect } from 'react'
import { Modal,ActivityIndicator, StyleSheet, Text, View, ImageBackground, Alert, Platform, Button, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import {Picker} from '@react-native-community/picker'
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfirmDialog } from 'react-native-simple-dialogs';


const allWidth = Dimensions.get('window').width;
const allHeight = Dimensions.get('window').height;
const current_datetime = (seprator) => {
    let d = new Date().getDay();
    d = (String(d).length == 1) ? "0" + String(d) : d
    let m = new Date().getMonth();
    m = (String(m).length == 1) ? "0" + String(m) : m
    let y = new Date().getFullYear();
    let h = new Date().getHours();
    h = (String(h).length == 1) ? "0"+String(h) : h
    let i = new Date().getMinutes();
    i = (String(i).length == 1) ? "0" + String(i) : i
    return d + seprator + m + seprator + y + "  " + h + ":" + i;
}



const SendDocuments = ({route}) => {
    const serverport =  "http://192.168.42.95:8000";    
    const [arrImages, setArrImages] = useState([]); 
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex,setCurrentIndex] = useState(null);
    const [dateDay,setDateDay] = useState('');
    const [dateMonth,setDateMonth] = useState('');
    const [dateYear,setDateYear] = useState('');
    const [dateHour,setDateHour] = useState('');
    const [dateMin,setDateMin] = useState('');
    const [progress,setProgress] = useState(0);
    const [showProgressDialog,setShowProgressDialog] = useState(false);
    const [dialogVisible,setDialogVisible] = useState(false);
    const [selectedValue,setSelectedValue] = useState("0");
    const [customers,setCustomers] = useState([{name:'انتخاب بیمه گذار',id:'0'}]);
    const [progressText,setProgressText] = useState('در حال ارسال');
    const [pillowImage,setPillowImage] = useState(false);
    useEffect(() => {
        async function checkPerms(){
            if (Platform.OS != 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("you dont access to library");
                }
            }
        }

        async function getList() {
            let token = await AsyncStorage.getItem('access')
            axios.get(serverport+"/api/bazdidkhodro/insurer_list/",{headers: {'Authorization':'Bearer '+token}}
            )
            .then(response=>{
                if(response.data.results!=="undefined" && Array.isArray(response.data.results)){
                    let count = response.data.count;
                    let newData = [...customers];
                    response.data.results.map(item=>{
                        newData.push({id:item.id,name:item.name+"("+item.mobile+") "});
                    });
                    setCustomers(newData);
                }
            })
            .catch(error=>{
                console.log(error)
                Alert.alert("ارتباط با سرور برقرار نشد");
            });
        }
        
        checkPerms();
        getList();
    }, []);



    const removeFromArrImages = (id) => {
        let newArrImages = arrImages.filter((item) => {
            return item.id !== id
        });

        newArrImages.map((item, index) => {
            item.id = String(index);
        });

        setArrImages(newArrImages);
    }

    const showModal = (index,text) => {
        let arr = text.split('  ');
        let date = arr[0].split('/')
        let time = arr[1].split(':')                
        setDateDay(date[0])
        setDateMonth(date[1])
        setDateYear(date[2])
        setDateHour(time[0])
        setDateMin(time[1])
        setCurrentIndex(index)
        setModalVisible(true)
    }

    const clickBtnCanel = () => {
        setCurrentIndex(null)
        setModalVisible(false)
    }
    const clickBtnSave = () => {
        if(currentIndex !== null){
            let datetime = dateDay+"/"+dateMonth+"/"+dateYear+"  "+dateHour+":"+dateMin
            let tmpArrImages = arrImages;
            tmpArrImages.map((item) => {
                if(item.id === currentIndex){
                    item.datetime = datetime;
                }
            });
            setArrImages(tmpArrImages);
        }

        setModalVisible(false)
    }
    //aspect: [4, 3],
    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,

            quality: 1
        });

        if (!result.cancelled) {
            setArrImages(arrImages => [...arrImages, { id: String(arrImages.length), data: result.uri ,datetime : current_datetime('/')}]);
        }
    }

    const sendImagesOrg = async () => {
        setDialogVisible(false)
        let formData = new FormData();
        let year = new Date().getFullYear();
        arrImages.map((item,index)=>{
            let localUri = item.data;
            let filename = localUri.split('/').pop();
          
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            formData.append('imgs',{ uri: localUri, name: filename, type });
        });
        formData.append('insurer',selectedValue);
        setShowProgressDialog(true);
        let token = await AsyncStorage.getItem('access')
        axios({
            url:route.params.SERVERINFO.SERVERPORT+'/api/bazdidkhodro/document_create/',
            method:'POST',
            headers: {'content-type':'multipart/form-data','Authorization':'Bearer '+token},
            onUploadProgress: progressEvent => {
                let p = (progressEvent.loaded / progressEvent.total) * 100;
                setProgress(parseInt(p));
                if(p>99){
                    //setShowProgressDialog(false);  
                    setPillowImage(true)
                    setProgressText("لطفا صبر کنید");
                }
            },            
            data: formData
        }).then(response=>{           
            if(parseInt(response.data.state)===1){ 
                setShowProgressDialog(false); 
                setPillowImage(false); 
                setProgressText("در حال ارسال");
                setSelectedValue("0");
                setArrImages([]);
                Alert.alert('با موفقیت به اتمام رسید');
            }
            else if(parseInt(response.data.state)===0){
                //Alert.alert(response.data.message);
                Alert.alert("اطلاعات ارسال نشد");
            }
            else if(parseInt(response.data.state)===-1){
                //Alert.alert(response.data.message);
                Alert.alert("شما دسترسی به ارسال مجدد ندارید");
            }            
        }).catch(error=>{
            console.log(error)
        });
    }

    const sendImages = async () => {
        if(selectedValue!="0" && arrImages.length > 0){
            setDialogVisible(true);
        }
        else{

            if(selectedValue=="0" && arrImages.length==0)
                Alert.alert("انتخاب بیمه گذار و حداقل یک فایل الزامی است");
            else if(selectedValue=="0" && arrImages.length >0 )
                Alert.alert("انتخاب بیمه گذار الزامی است")    
            if(arrImages.length==0 && selectedValue!="0")
                Alert.alert("انتخاب حداقل یک فایل الزامی است");
        }

    }


   
    return (
        <View style={styles.container}>
        <ConfirmDialog
            title="ارسال فایل"
            message="آیا از ارسال فایل ها اطمینان دارید؟"
            visible={dialogVisible}
            onTouchOutside={() => setDialogVisible(false)}
            positiveButton={{
                title: "بله",
                onPress: () => sendImagesOrg()
            }}
            negativeButton={{
                title: "خیر",
                onPress: () => setDialogVisible(false)
            }}
        />            
        <Modal onRequestClose={() => null} visible={showProgressDialog}>
            <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
                <Text style={{ fontSize: 20 }}>{ progressText }
                    { pillowImage==false ? progress.toString()+" %" : <ActivityIndicator
                    animating = {true}
                    color = '#bc2b78'
                    size = "small"
                    />
                    }
                </Text>
                <Button title="انصراف" onPress={()=>{setShowProgressDialog(false)}} />
            </View>
            </View>
        </Modal>

            <Modal                
                animationType="slide"                                
                visible={modalVisible}>
                    <View style={styles.parentDateTimeInputs}>
                        <TextInput onChangeText={ (text) => setDateDay(text)} style={[styles.DateTimeInputs,{width:40,padding: 3,textAlign:'center'}]} value={dateDay}></TextInput>
                        <Text style={styles.slash}>/</Text>
                        <TextInput onChangeText={ (text) => setDateMonth(text)} style={[styles.DateTimeInputs,{width:40,padding: 3,textAlign:'center'}]} value={dateMonth}></TextInput>
                        <Text style={styles.slash}>/</Text>
                        <TextInput onChangeText={ (text) => setDateYear(text)} style={[styles.DateTimeInputs,{width:60,padding: 3,textAlign:'center'}]} value={dateYear}></TextInput>

                        <TextInput onChangeText={ (text) => setDateHour(text)} style={[styles.DateTimeInputs,{width:40,padding: 3,textAlign:'center',marginLeft:25}]} value={dateHour}></TextInput>
                        <Text style={styles.slash}>:</Text>
                        <TextInput onChangeText={ (text) => setDateMin(text)} style={[styles.DateTimeInputs,{width:40,padding: 3,textAlign:'center'}]} value={dateMin}></TextInput>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={{flex: 1,padding:10,backgroundColor:'green'}}>
                            <Text style={{color: 'white',textAlign: 'center',fontSize:25}} onPress={() => clickBtnSave()}>ذخیره</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1,padding:10,backgroundColor:'red'}} onPress={ () => clickBtnCanel()}>
                            <Text style={{color: 'white',textAlign: 'center',fontSize:25}}>انصراف</Text>
                        </TouchableOpacity>                        
                    </View>

            </Modal>
            <Button style={styles.btnAddImage} title="اضافه کردن فایل" onPress={selectImage} />
            <Picker
                selectedValue={selectedValue}                
                style={styles.PickerBox}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                { customers.map(item=>{
                        return <Picker.Item key={item.id} label={item.name} value={item.id} />
                })}
                
                
            </Picker>
            <ScrollView style={styles.viewScrollView}>
                {arrImages.map((item) =>
                (
                    <ImageBackground imageStyle={{ borderRadius: 6 }} key={item.id} source={{ uri: item.data }} style={styles.imageRow} >
                        <TouchableOpacity style={styles.textRowBtn}  >
                            <Text onPress={ () => showModal(item.id,item.datetime) } style={styles.textRow}>{item.datetime}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnRemove} onPress={() => removeFromArrImages(item.id)}>
                            <Text style={styles.textBtnRemove}>حذف</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                )
                )}
            </ScrollView>
            <Button style={styles.btnSendImages} onPress={()=>{sendImages()}} title="ارسال فایل ها" />

        </View>
    )
}

export default SendDocuments

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnAddImage: {
        justifyContent: 'flex-start',
        alignSelf: 'center',

    },
    PickerBox: {
        width: 250,
        justifyContent: 'flex-start',
        alignSelf: 'flex-end',

    },    
    btnSendImages: {
        justifyContent: 'flex-end',
        alignSelf: 'center',

    },
    viewScrollView: {
        margin: 15,
    },
    imageRow: {
        flex: 1,
        width: allWidth - 50,
        height: allHeight / 3.5,
        alignSelf: 'center',
        margin: 5,
    },
    textRowBtn: {
        position: 'absolute',
        bottom: 5,
        right: 10,
    },
    textRow: {
        color: 'white',
    },
    btnRemove: {
        position: 'absolute',
        left: 10,
        bottom: 5,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    textBtnRemove: {
        color: 'white',
        textAlign: 'center',
    },
    parentDateTimeInputs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    DateTimeInputs: {
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        fontSize: 20,
    },
    slash: {
        fontSize: 28,
        color: 'red',
    },
})

