import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";
import { auth, database, app } from '../config/firebase';
import logo from "../assets/logo.png";
import { BackHandler } from 'react-native';
import { addDoc, collection, doc, updateDoc, onSnapshot,getDocs } from "firebase/firestore";

const Home = () => {
    const [text, setText] = useState('');
    const [inviteCode, setInviteCode] = useState("2ukp7")
    const [project, setProject] = useState([])
    const [backlog, setBacklog] = useState([])
    const navigation = useNavigation();
    const changeHandler = (val) => {
        setText(val);
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
    }
        , []);

        const handleInviteCode = async () => {
            try{
                const methodsCollectionRef = collection(database, 'methods');
            const querySnapshot = await getDocs(methodsCollectionRef);
            let method = null
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().method}`);
                method = doc.data().method
            });
            if(method===""){
                Alert.alert("No Method Selected in the Admin Panel")
            }
            else if(method==="Usecase Points"){
                console.log("Usecase Points")
                 try {
                const res = await fetch("http://192.168.45.59:19002/usecase", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'email': auth.currentUser.email,
                        'code': inviteCode
                    })
                });
                if (res.status === 400) {
                    const data = await res.json();
                    console.log(data.err);
                    return Alert.alert("Something went wrong!");
                }
                const data = await res.json();
                try{
                    if (data) {
                        
                        console.log(data.data.project);
                        console.log(data.data.usecases);
                        
                        console.log("________________count of usecases_____________")
                        console.log(data.data.usecases.length)
                        
                        navigation.navigate("Usecase", {
                           usecase: data.data.usecases[0],
                            usecasesData: data.data.usecases,
                            project: data.data.project, 
                            user: data.data.user
                        });                    
                    } else {
                        Alert.alert("Invalid Code");
                    }
                }
                catch (err) {
                    console.log(err);
                    Alert.alert(err)
                }
            } catch (err) {
                console.log(err);
                Alert.alert(err)
            }
            }
            else if(method==="FP Metrices"){
                try {
                    const res = await fetch("http://192.168.45.59:19002/code", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'email': auth.currentUser.email,
                            'code': inviteCode
                        })
                    });
                    console.log(res.status)
                    if (res.status === 400) {
                        return Alert.alert("Something went wrong!");
                    }
                    const data = await res.json();
                    try{
                        if (data.data.product_backlogs && data.data.project) {
                            console.log(data.data.product_backlogs);
                            const i = await data.data.product_backlogs
                            const j = await data.data.project
                            const k = await data.data.user
                            // console.log(i);
        
                
                            
                            navigation.navigate("AssignStoryPoints", {
                                backlog: i[0], 
                                backlogs: i,
                                project: j,
                                user: k,
                                mode:"FP"
                            });                    
                        } else {
                            Alert.alert("Invalid Code");
                        }
                    }
                    catch (err) {
                        console.log(err);
                        Alert.alert(err)
                    }
                } catch (err) {
                    console.log(err);
                    Alert.alert(err)
                }
            }
            
            else if(method==="User Story"){
                console.log("User Story")
                 try {
                const res = await fetch("http://192.168.45.59:19002/code", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'email': auth.currentUser.email,
                        'code': inviteCode
                    })
                });
                console.log(res.status)
                if (res.status === 400) {
                    return Alert.alert("Something went wrong!");
                }
                const data = await res.json();
                try{
                    if (data.data.product_backlogs && data.data.project) {
                        console.log(data.data.product_backlogs);
                        const i = await data.data.product_backlogs
                        const j = await data.data.project
                        const k = await data.data.user
                        // console.log(i);
    
            
                        
                        navigation.navigate("AssignStoryPoints", {
                            backlog: i[0], 
                            backlogs: i,
                            project: j,
                            user: k
                        });                    
                    } else {
                        Alert.alert("Invalid Code");
                    }
                }
                catch (err) {
                    console.log(err);
                    Alert.alert(err)
                }
            } catch (err) {
                console.log(err);
                Alert.alert(err)
            }
            }

            else{
                Alert.alert("Method not available")
            }
        }
            catch(err){
                console.log(err);
            }
           
        };
        

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <FontAwesome name="search" size={24} color={colors.gray} style={{ marginLeft: 15 }} />
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
            <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center', justifyContent: "center", textAlign: "center" }}>
                <Image source={logo} style={{ width: 300, height: 80 }} />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: "center", textAlign: "center" }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Welcome Back {auth.currentUser.email.split("@")[0]}</Text>
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                    Enter Invite Code to Join a Poker Planning Session
                </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                console.log('dismissed keyboard');
            }}>
                <View style={styles.content}>
                    <View>
                        <TextInput style={styles.new} placeholder="Invite Code" onChangeText={setInviteCode} />
                        <TouchableOpacity style={styles.btn} onPress={() => handleInviteCode()}>
                            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Join</Text>
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