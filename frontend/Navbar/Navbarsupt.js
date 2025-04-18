import React from "react";
import { View, Text, TouchableOpacity } from "react-native"; 
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

function Navbarsupt() {
    const navbar = useNavigation(); 

    return (
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navbar.navigate('supporthome')}>
                <Text style={styles.footerText}><Entypo name="home" size={30} color="black" /></Text>
            </TouchableOpacity>
            

            <TouchableOpacity onPress={() => navbar.navigate('supptschedule')}>
                <Text style={styles.footerText}><FontAwesome name="calendar" size={30} color="black" /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navbar.navigate('ticketsSuppt')}>
                <Text style={styles.footerText}><FontAwesome6 name="ticket" size={24} color="black" /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navbar.navigate('profilesuppt')}>
                <Text style={styles.footerText}><MaterialIcons name="account-circle" size={30} color="black" /></Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
        backgroundColor: "white", 
        elevation:5,
    },
    footerText: {
        color: "white",
        fontSize: 15,
    },
});

export default Navbarsupt;
