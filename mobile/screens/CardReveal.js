import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from 'react-native';

const CardReveal = ({ route }) => {
    const { backlog } = route.params;
    const { backLog, backlogId, storyPoint } = backlog;
    const [selectedStoryPoints, setSelectedStoryPoints] = useState([]);
    const [maxStoryPoint, setMaxStoryPoint] = useState(null);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);

        const dbRef = collection(database, 'storypoints');
        const unsubscribe = onSnapshot(dbRef, (querySnapshot) => {
            const points = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setSelectedStoryPoints(points);

            const frequencyMap = {};
            points.forEach(item => {
                if(item.backlogId === backlogId){ // ye check krega k screen me jo backlog hai usi k story points show honge
                    const point = item.storyPoint;
                    frequencyMap[point] = (frequencyMap[point] || 0) + 1;
                }
            });

            for (const point in frequencyMap) {
                if (frequencyMap[point] > maxFrequency) {
                    setMaxStoryPoint(point);
                    setMaxFrequency(frequencyMap[point]);
                }
            }
        });

        return unsubscribe;
    }, []);

    const renderCard = ({ item }) => (
        item.backlogId === backlogId && (
            <View style={stylesheet.card}>
                <Text style={{ textAlign: "center" }}>{item.assignedBy} selected {item.storyPoint}</Text>
            </View>
        )
    );

    return (
        <View style={
            {
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }
        }>
            <Text style={stylesheet.backlog}>{backLog}</Text>
            <Text style={{
                textAlign: 'center',
                marginVertical: 2,
            }}>
                Most frequent assigned wieght: {maxStoryPoint} (appeared {maxFrequency} times)
            </Text>
            <FlatList
                data={selectedStoryPoints}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                numColumns={3}
                contentContainerStyle={stylesheet.cardContainer}
            />
            <TouchableOpacity style={stylesheet.btn} onPress={() => navigation.navigate("Chat", { backlog: backlog })}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center',color:"white", fontSize: 15 }}>Move to Discussion</Text>
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
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 8,
        width: 100,
        height: 70,
        borderWidth: auth.currentUser ? 1 : 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: 'rgb(0, 82, 204)',
        padding: 10,
        borderRadius: 5,
        marginVertical: 20,
    }
});

export default CardReveal;
