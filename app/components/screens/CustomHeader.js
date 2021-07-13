import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CustomHeader = ({textHeader}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{textHeader}</Text>
        </View>
    )
}

export default CustomHeader

const styles = StyleSheet.create({
    container:{        
        justifyContent: 'center',
        alignItems: 'center',        
    },
    text:{fontSize:18,fontWeight:'bold',color:'white'}
})
