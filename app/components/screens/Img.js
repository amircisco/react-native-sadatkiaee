import React, { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { Modal, ActivityIndicator, Image, StyleSheet, Text, View, ImageBackground, Alert, Platform, Button, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import FileSystem from 'expo-file-system';
import ViewShot, { captureRef, releaseCapture } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';


const allWidth = Dimensions.get('window').width;
const allHeight = Dimensions.get('window').height;
const Img = ({ route }) => {
    const [arrImages, setArrImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [progress, setProgress] = useState(0);
    const [selectedValue, setSelectedValue] = useState("0");
    const [currentDate, setCurrentDate] = useState('');
    const [textProcess, setTextProcess] = useState('در حال آماده سازی.لطفا صبر کنید');
    const [textCancel, setTextCancel] = useState('انصراف');
    const [lodingDialog, setLodingDialog] = useState(true);
    const [showProgressDialog, setShowProgressDialog] = useState(false);
    const refs = {};
    const updateRef = (index, el) => {
        let key = "key_" + index.toString();
        refs[key] = el;
    }

    const sendData = async () => {
        Object.entries(refs).forEach(([key, value]) => {
            captureRef(value, {
                format: 'jpg',
                quality: 0.9,
            })
                .then(uri => {
                    MediaLibrary.saveToLibraryAsync(uri)
                        .then(res => {

                        });
                })
                .catch(err => { })

        });

        return "ok";
    }
    const sendImages = () => {
        if (Object.entries(refs).length > 0) {
            setShowProgressDialog(true);
            sendData().then((res)=>{
                setLodingDialog(false);
                setTextProcess("با موفقیت انجام شد");
                setTextCancel("اتمام");
                setArrImages([]);
            });
        }
        else {
            Alert.alert("هیچ تصویری انتخاب نشده است");
        }
    }


    const checkPerms = async () => {
        if (Platform.OS != 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("برای کار با این بخش نیاز به دسترسی دارید.");
            }
        }
    }

    useEffect(() => {
        setCurrentDate(current_datetime("/"));
        checkPerms();
    }, []);

    const current_datetime = (seprator) => {
        let d = new Date().getDate().toString()
        d = (String(d).length == 1) ? "0" + String(d) : d
        let m = new Date().getMonth() + 1;
        m = (String(m).length == 1) ? "0" + String(m) : m
        let y = new Date().getFullYear();
        let h = new Date().getHours();
        h = (String(h).length == 1) ? "0" + String(h) : h
        let i = new Date().getMinutes();
        i = (String(i).length == 1) ? "0" + String(i) : i
        return y + seprator + m + seprator + d + "  " + h + ":" + i;
    }

    const removeFromArrImages = (id) => {
        let newArrImages = arrImages.filter((item) => {
            return item.id !== id
        });

        newArrImages.map((item, index) => {
            item.id = String(index);
        });

        setArrImages(newArrImages);

    }

    //aspect: [4, 3],
    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,

            quality: 1
        });

        if (!result.cancelled) {
            setArrImages(arrImages => [...arrImages, { id: String(arrImages.length), data: result.uri, w: result.width, h: result.height }]);
        }
    }



    return (
        <View style={styles.container}>

            <Button style={styles.btnAddImage} title="اضافه کردن تصویر" onPress={selectImage} />
            <TextInput style={{ alignSelf: 'center', padding: 10, textAlign: 'center', width: '100%' }} onChangeText={text => setCurrentDate(text)} value={currentDate} />
            <ScrollView style={styles.viewScrollView}>
                {arrImages.map((item, index) =>
                (
                    <>
                        <ImageBackground imageStyle={{ borderRadius: 6 }} key={item.id} source={{ uri: item.data }} style={styles.imageRow} >
                            <TouchableOpacity style={styles.btnRemove} onPress={() => removeFromArrImages(item.id)}>
                                <Text style={styles.textBtnRemove}>حذف</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                        <ScrollView style={{width: allWidth - 50,alignSelf: 'center'}}>
                            <ScrollView horizontal={true}>
                                <ViewShot ref={el => updateRef(index, el)} style={{ width: 1024, height: 768 }}>
                                    <Image source={{ uri: item.data }} style={{ width: 1024, height: 768 }}></Image>
                                    <Text style={{ fontSize: 32, color: "#e89520", position: 'relative', left: '69%', bottom: '15%', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 1, textShadowColor: '#000' }}>{currentDate}</Text>
                                </ViewShot>
                            </ScrollView>
                        </ScrollView>
                    </>
                )
                )}
            </ScrollView>
            <Button style={styles.btnSendImages} onPress={sendImages} title="آماده سازی تصاویر" />

            <Modal onRequestClose={() => null} visible={showProgressDialog}>
                <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>{textProcess}
                            {
                                lodingDialog ?
                                    <ActivityIndicator
                                        animating={true}
                                        color='#bc2b78'
                                        size="small"
                                    />
                                    :
                                    <></>
                            }
                        </Text>
                        <Button title={textCancel} onPress={() => { setShowProgressDialog(false); setLodingDialog(true); setTextProcess("در حال آماده سازی.لطفا صبر کنید"); setTextCancel("انصراف"); }} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Img

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
    centerPosition: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

