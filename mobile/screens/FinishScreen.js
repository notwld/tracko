import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';
const FinishScreen = ({ route,navigation }) => {
    const [storypoints, setStoryPoints] = useState([]);
    useEffect(() => {
        const dbRef = collection(database, 'storypoints');
        const unsubscribe = onSnapshot(dbRef, (querySnapshot) => {
            const points = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setStoryPoints(points);
        });
        return unsubscribe;
    }, []);

    const totalStoryPoints = storypoints.reduce((acc, curr) => {
        return acc + curr.storyPoint;
    }, 0);
    
    return (
        <View style={styles.container}>
        <Text style={styles.new}>Session has been ended</Text>
        <Text style={styles.new}>Total Story Points: {totalStoryPoints}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Home</Text>
        </TouchableOpacity>
        </View>
    );
    }

export default FinishScreen;
const myColor = 'rgb(0, 82, 204)';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#fff",
    },
    new: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        textAlign:"center"
    },
    btn: {
        backgroundColor: myColor,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,

    },
});
