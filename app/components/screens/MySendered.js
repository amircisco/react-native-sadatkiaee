import { StyleSheet, Text, View, Alert, Image, TouchableOpacity ,ActivityIndicator} from 'react-native'
import React, { useState, useEffect,useCallback } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MySendered = ({navigation,route}) => {
    const serverport = route.params.SERVERINFO.SERVERPORT;
    const [firstRender,setFirstRender] = useState(false);  
    const [arr,setArr] = useState([]);
    const [activityLoading,setActivityLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            let token = await AsyncStorage.getItem('access');
            axios.get(serverport+"/api/bazdidkhodro/visit_list/",{headers: {'Authorization':'Bearer '+token}})
           .then(response=> {                
                if(response.data.results!= undefined && Array.isArray(response.data.results)){
                    setFirstRender(true); setArr(response.data.results);
                }
                else Alert.alert("هیچ اطلاعاتی موجود");
                setActivityLoading(false)
            })
           .catch(error=>{console.log(error); setActivityLoading(false);});         
        }
        if(firstRender==false)
            fetchData();
    })
    
    const clickGoShowImages = (data) => {
        let arr = [];
        data.map((item,index)=>{
            arr.push({'id':index,'src':item});

        });
        navigation.navigate("showImages",{arr:arr});
    }
    return (
        <View style={styles.container}>
            
            { activityLoading ? (<ActivityIndicator animating={true} size="large" color = '#bc2b78' style={{position:'absolute',left:'45%',top:'40%'}} /> ) : <></> }
            {                
                arr.map((item,index)=>{
                return(
                    <View key={index} style={styles.row} >
                        <TouchableOpacity style={styles.item,styles.btnShow} onPress={()=>clickGoShowImages(item.images)}>
                            <Text style={{color:'white'}}> مشاهده تصاویر</Text>
                        </TouchableOpacity>
                        <Text style={styles.item}>{item.year}</Text>  
                        <Text style={styles.item}>{item.insurer_name}</Text>
                        
                    </View>
                )
            })
            }
        </View>
    )
}

export default MySendered

const styles = StyleSheet.create({
    container:{
        width: '95%',
        alignSelf: 'center',
        flex:1,
        flexDirection: 'column',
    },
    row:{
        justifyContent: 'space-between',        
        flexDirection: 'row',           
        borderBottomWidth:1,   
        alignItems:'center',  
        width:'100%',
    },
    item:{
        flex:1,
        paddingVertical:15,
        paddingHorizontal:5,       
        textAlign: 'center',
    },
    btnShow:{
        backgroundColor: '#77B5FE',
        padding:10,
        borderRadius:5,
        marginVertical:12,
    }
})
