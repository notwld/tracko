import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useNavigation } from "@react-navigation/native";

const CardReveal = ({ route }) => {
    const { backlog } = route.params;
    const { backLog, backlogId, storyPoint } = backlog;
    const [selectedStoryPoints, setSelectedStoryPoints] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        const dbRef = collection(database, 'storypoints');
        const unsubscribe = onSnapshot(dbRef, (querySnapshot) => {
            const points = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setSelectedStoryPoints(points);
            console.log(points);
        });

        return unsubscribe;
    }, []);

    const renderCard = ({ item }) => (
        
        item.backlogId === backlogId && (
            <View style={stylesheet.card}>
            <Text style={{textAlign:"center"}}>{item.assignedBy} selected {item.storyPoint}</Text>
        </View>
        )
    );

    return (
        <View style={
            {
                justifyContent: 'center',
                alignItems: 'center',
            }
        }>
            <Text style={stylesheet.backlog}>{backLog}</Text>
            <FlatList
                data={selectedStoryPoints}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                numColumns={2} // Set the number of columns as per your requirement
                contentContainerStyle={stylesheet.cardContainer}
            />
            <TouchableOpacity style={stylesheet.btn} onPress={() => navigation.navigate("Chat", { backlog: backlog })}>
                <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 15 }}>Move to Discussion</Text>
            </TouchableOpacity>

        </View>
    );
};

const stylesheet = StyleSheet.create({
    backlog: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginTop: 50,
    },
    cardContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: 'lightblue',
        borderRadius: 10,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    btn:{
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    }
});

export default CardReveal;
