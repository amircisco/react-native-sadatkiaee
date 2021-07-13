import React, {useState,useEffect} from 'react'
import { StyleSheet, Text, View, FlatList,Image,ActivityIndicator } from 'react-native'

const ShowImages = ({route}) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const [arr,setArr] = useState(route.params.arr);
    const [activityLoading,setActivityLoading] = useState(true);
    const ItemSeparator = () => {
        return (<View style={{
            padding:10,
            }}
        />)
    }

    useEffect(() => {
        let delay = parseInt(arr.length / 2) * 1000;
        setTimeout(()=>{setActivityLoading(false)},delay)
    },[])
    return (
        <View style={styles.container}>
        { activityLoading ? (<ActivityIndicator animating={true} size="large" color = '#bc2b78' style={{position:'absolute',left:'45%',top:'40%'}} /> ) : <></> }
        <FlatList
            data={arr}
            renderItem={({ item }) => (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        margin: 1
                    }}>
                    <Image
                        style={styles.imageThumbnail}
                        source={{ uri: serverport + "/media/" + item.src }}
                    />
                    
                </View>

            )}
            //Setting the number of column
            numColumns={1}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={ItemSeparator}
        />
        </View>
    )
}

export default ShowImages

const styles = StyleSheet.create({
    container:{
        marginTop:10,
        width:'90%',
        flex:1,
        flexDirection: 'row',
        alignSelf:'center',
    },
    imageThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
      },
})
