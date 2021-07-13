import React from 'react'
import { StyleSheet, Text, View,Image,Dimensions } from 'react-native'

const all_width = Dimensions.get('window').width;
const all_height = Dimensions.get('window').height;
const Loading = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require('../../../assets/ajax-loader.gif')}/>
            <Text style={styles.txt}>لطفا صبر کنید...</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        opacity: 0.7,
        position: 'absolute',
        flex:1,
        width: all_height,
        height: all_height,
        zIndex: 9999,            
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 200,
        height: 200,
    },
    txt: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
        
    }
})