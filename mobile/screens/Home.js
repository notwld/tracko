import React, { useEffect ,useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet,TextInput, TouchableWithoutFeedback, Keyboard, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";
import {backlogs} from '../utils/backlogHook';

const Home = () => {
    const [text, setText] = useState('');
    const [inviteCode,setInviteCode] = useState("SaU")
    const navigation = useNavigation();
    const changeHandler = (val) => {
        setText(val);
    }

    const handleInviteCode = () => {
        fetch("http://192.168.1.104:19001/connect",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: inviteCode
            })
        })
        .then(res => {return res.json()})
        .then(data => {
            if(data.success){
                navigation.navigate("AssignStoryPoints", { backlog: backlogs[0] });

                }        
                else
                Alert.alert("Invalid Code")
            })
        .catch(err => {
            console.log(err)
        }
        )
    }

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <FontAwesome name="search" size={24} color={colors.gray} style={{marginLeft: 15}}/>
            ),
            headerRight: () => (
                <Image
                    source={{ uri: catImageUrl }}
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 15,
                    }}
                />
            ),
        });
    }, [navigation]);

    return (
        
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            console.log('dismissed keyboard');
        }}>
            <View style={styles.content}>
                    <View>
                        <TextInput style={styles.new} placeholder="Invite Code" onChangeText={setInviteCode} />
                        <TouchableOpacity style={styles.btn} onPress={()=>handleInviteCode()}>
                            <Text  style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            
        </View>
    );
    };

    export default Home;
    const myColor = 'rgb(0, 82, 204)';
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#fff",
        },
        chatButton: {
            backgroundColor: colors.primary,
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginRight: 20,
            marginBottom: 50,
        },
        input: {
            marginBottom: 10,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            fontSize: 20,
        },
        new: {
            marginBottom: 10,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            fontSize: 20,
        },
        btn: {
            backgroundColor: myColor,
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
    
        },
        content: {
            padding: 40,
        },
    });