import React, { useEffect } from "react";
import { View,Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/Styles";



const SplachScreen = ({navigation})=>{
    
    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Login')
        },3000);
    })
    return(
        <View style={styles.container}>
            <View style={{flex:4,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#000',fontSize:30,fontWeight:'600',color:'tomato'}}>Churn  
                 <Text style={{color:'green'}}> Centurion</Text>
            </Text>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("Login")}>
                    <Text style={styles.btntext}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default SplachScreen;