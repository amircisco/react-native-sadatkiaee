import React, { useState, useEffect, useRef } from 'react'
import { CheckBox, Modal, ActivityIndicator, Image, StyleSheet, Text, View, ImageBackground, Alert, Platform, Button, ScrollView, Dimensions, TouchableOpacity, TextInput, PermissionsAndroid } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as Localization from 'expo-localization';
import { ImageBrowser } from 'expo-image-picker-multiple';


const allWidth = Dimensions.get('window').width;
const allHeight = Dimensions.get('window').height;
const rowImgWidth = 250;
const rowImgHeight = 200;
const Img = ({ route }) => {
    const [arrImages, setArrImages] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [textProcess, setTextProcess] = useState('لطفا صبر کنید');
    const [textCancel, setTextCancel] = useState('انصراف');
    const [lodingDialog, setLodingDialog] = useState(true);
    const [showProgressDialog, setShowProgressDialog] = useState(false);
    const [fromLeft, setFromLeft] = useState('67%');
    const [fromBottom, setFromBottom] = useState('18%');
    const [fontDynamic, setFontDynamic] = useState(32);
    const [currentUri, setCurrentUri] = useState(null);
    const refViewShot = useRef(null);
    const [showImageBrowser, setShowImageBrowser] = useState(false);
    const [removed, setRemoved] = useState(false);
    let submit = function () { };
    // left 67%
    // bottom 18%
    // font 32
    // font 25

    const sendData = async () => {
        captureRef(refViewShot, {
            format: 'jpg',
            quality: 0.9,
        })
            .then(uri => {
                MediaLibrary.saveToLibraryAsync(uri)
                    .then(res => {

                    });
            })
            .catch(err => { });
    }
    const sendImages = () => {
        if (arrImages.length > 0) {
            setShowProgressDialog(true);
            let uris = [];
            arrImages.map((item) => {
                uris.push(item.uri);
            });

            setCurrentUri(uris[0]);
            let kol = uris.length;
            let done = 1;
            setTextProcess(parseInt((done * 100) / kol).toString() + '% لطفا صبر کنید');
            var interval = setInterval(async () => {
                setTextProcess(parseInt((done * 100) / kol).toString() + '% لطفا صبر کنید');
                await sendData();
                uris.splice(0, 1);
                done += 1;
                if (uris.length == 0) {
                    clearInterval(interval);
                    setLodingDialog(false);
                    setTextProcess("با موفقیت انجام شد");
                    setTextCancel("اتمام");
                    setArrImages([]);
                    setCurrentUri(null);
                    deleteSourceImages();
                }
                setCurrentUri(uris[0]);
            }, 2000);
        }
        else {
            Alert.alert("هیچ تصویری انتخاب نشده است");
        }
    }


    const deleteSourceImages = () => {
        if (removed) {
            for (let item of arrImages) {
                try {
                    MediaLibrary.deleteAssetsAsync(item).then(res => {
                        //console.log("delete file", item.filename) 
                    })
                }
                catch (e) {
                    //console.log("error at deleting ", item.filename);
                }

            }
            //Alert.alert("فایل های اصلی نیز حذف شدند");
            setTextProcess("فایل های اصلی نیز حذف شدند");
        }

    }

    const checkPerms = async () => {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "دسترسی نوشتن در حافظه",
                    message:
                        "جهت ذخیره سازی اطلاعات دسترسی به حافظه نمیاز میباشد",
                    buttonNeutral: "انصراف",
                    buttonNegative: "نه مجاز نیست",
                    buttonPositive: "مجاز است"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "دسترسی خواندن از حافظه",
                        message:
                            "جهت ذخیره سازی اطلاعات دسترسی به حافظه نمیاز میباشد",
                        buttonNeutral: "انصراف",
                        buttonNegative: "نه مجاز نیست",
                        buttonPositive: "مجاز است"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                }
            }
        } catch (err) {
            console.warn(err);
        }

    }

    useEffect(() => {

        if (allWidth > 360) {
            setFontDynamic(25);
        }
        if (Localization.isRTL) {
            setFromLeft("-" + fromLeft);
        }
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

    const beforeSubmit = () => {
        setShowImageBrowser(false);
        submit();
    }

    const imagesCallback = (callback) => {

        callback.then(async (photos) => {
            setArrImages([...arrImages, ...photos]);
            //setArrImages(arrImages => [...arrImages, { id: String(arrImages.length), data: result.uri, w: result.width, h: result.height }]);
        })
            .catch((e) => console.log(e));
    };


    const updateHandler = (count, onSubmit) => {
        submit = onSubmit;
    };

    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {
                showImageBrowser ?
                    <View style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, zIndex: 999 }}>
                        <ImageBrowser
                            max={100}
                            onChange={updateHandler}
                            callback={imagesCallback}
                            renderSelectedComponent={renderSelectedComponent}
                        />
                        <View style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 9999, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ width: '50%', padding: 10, backgroundColor: 'black', borderWidth: 1, borderColor: 'orange' }} onPress={() => setShowImageBrowser(false)}>
                                <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }} onPress={() => setShowImageBrowser(false)}>انصراف</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '50%', padding: 10, backgroundColor: 'black', borderWidth: 1, borderColor: 'orange' }} onPress={() => beforeSubmit()}>
                                <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }} onPress={() => beforeSubmit()}>انتخاب</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <></>
            }
            <View style={{ position: 'absolute', top: 0, left: 0, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, width: '100%' }}>
                <Text style={{ color: 'black', width: '10%' }} >{arrImages.length > 0 ? arrImages.length.toString() : ''}</Text>
                <TouchableOpacity style={{ width: '70%', backgroundColor: '#429df2', borderRadius: 6 }} onPress={() => { setShowImageBrowser(true); }} >
                    <Text style={{ color: 'white', alignSelf: 'center', padding: 7, fontSize: 16 }}>اضافه کردن تصویر</Text>
                </TouchableOpacity>
                <CheckBox
                    style={{ width: '10%' }}
                    value={removed}
                    onValueChange={(val) => setRemoved(val)}
                />

            </View>

            <TextInput style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center', width: '100%', padding: 8 }} onChangeText={text => setCurrentDate(text)} value={currentDate} />

            <ScrollView style={styles.viewScrollView}>
                {arrImages.map((item, index) =>
                (
                    <>
                        <ImageBackground imageStyle={{ borderRadius: 6 }} key={item.id} source={{ uri: item.uri }} style={styles.imageRow} >
                            <TouchableOpacity key={index} style={styles.btnRemove} onPress={() => removeFromArrImages(item.id)}>
                                <Text style={styles.textBtnRemove}>حذف</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </>
                )
                )}
                <ScrollView style={{ width: rowImgWidth, alignSelf: 'center' }}>
                    <ScrollView horizontal={true}>
                        <ViewShot ref={refViewShot} style={{ width: 1024, height: 768 }} options={{ format: "jpg", quality: 0.9 }}>
                            <Image source={{ uri: currentUri }} style={{ width: 1024, height: 768 }}></Image>
                            <Text style={{ fontSize: fontDynamic, color: "#e89520", position: 'relative', left: fromLeft, bottom: fromBottom, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 1, textShadowColor: '#000' }}>{arrImages.length > 0 ? currentDate : ''}</Text>
                        </ViewShot>
                    </ScrollView>
                </ScrollView>
            </ScrollView>






            <TouchableOpacity style={{ width: '100%', backgroundColor: '#429df2' }} onPress={sendImages} >
                <Text style={{ color: 'white', alignSelf: 'center', padding: 7, fontSize: 16 }}>آماده سازی تصاویر</Text>
            </TouchableOpacity>

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
        width: '90%',
        textAlign: 'center'
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

    },
    imageRow: {
        flex: 1,
        width: rowImgWidth,
        height: rowImgHeight,
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
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    },
})

