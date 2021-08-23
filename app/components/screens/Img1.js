import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageBrowser } from 'expo-image-picker-multiple';
import * as MediaLibrary from 'expo-media-library';



const Img1 = () => {
    let submit = function(){};
    const [url,setUrl] = useState(null);
    const imagesCallback = (callback) => {

        callback.then(async (photos) => {
            for (let photo of photos) {
                //MediaLibrary.deleteAssetsAsync(photo).then(res=>{console.log("ok ",res)})                
                console.log(photo)
                setUrl(photo.uri);
            }
        })
            .catch((e) => console.log(e));
    };


    const updateHandler = (count, onSubmit) => {
      //  setOnSubmit(onSubmit);
      submit = onSubmit;
    };

    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );


    return (
        <View style={[styles.flex, styles.container]}>
            <ImageBrowser
                max={4}
                onChange={updateHandler}
                callback={imagesCallback}
                renderSelectedComponent={renderSelectedComponent}
            />
            <TouchableOpacity style={{ width: 100, height: 50, backgroundColor: 'blue', padding: 10, position: 'absolute', top: 50, left: 50, zIndex: 999 }} title={'Done'} onPress={()=>submit()}>
                <Text onPress={()=>submit()}>Done</Text>
            </TouchableOpacity>
            <Image source={{uri:url}} style={{position:'absolute',width:'100%',height:200,left:0,bottom:0,zIndex:9999}}/>
        </View>
    );

}
export default Img1;
const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        position: 'relative'
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
    }
});
