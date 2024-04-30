import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { auth, database, app } from '../config/firebase';
import { addDoc, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";

import { getDoc } from "firebase/firestore";
const FinishScreen = ({ route, navigation }) => {
    const project = route.params.project;
    const user = route.params.user;
    console.log(project);
    console.log(user);
    const usecases = [];
    const usecasesCollection = collection(database, "usecases");
    onSnapshot(usecasesCollection, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            usecases.push(doc.data());
        });
    }
    );


    let simpleActorCount = 0;
    let averageActorCount = 0;
    let complexActorCount = 0;

    let simpleUseCaseCount = 0;
    let averageUseCaseCount = 0;
    let complexUseCaseCount = 0;

    usecases.forEach(item => {
        // For actors
        for (const actor in item.actorComplexity) {
            const complexity = item.actorComplexity[actor].complexity.toLowerCase();
            if (complexity === "simple") {
                simpleActorCount++;
            } else if (complexity === "average") {
                averageActorCount++;
            } else if (complexity === "complex") {
                complexActorCount++;
            }
        }

        // For use cases
        const useCaseComplexity = item.useCaseComplexity.toLowerCase();
        if (useCaseComplexity === "simple") {
            simpleUseCaseCount++;
        } else if (useCaseComplexity === "average") {
            averageUseCaseCount++;
        } else if (useCaseComplexity === "complex") {
            complexUseCaseCount++;
        }
    });

    const actorWeights = {
        "simple": 1,
        "average": 2,
        "complex": 3
    };

    const useCaseWeights = {
        "simple": 5,
        "average": 10,
        "complex": 15
    };

    const UAW = (actorWeights["simple"] * simpleActorCount) + (actorWeights["average"] * averageActorCount) + (actorWeights["complex"] * complexActorCount);
    console.log("UAW:", UAW);

    const UUCW = (useCaseWeights["simple"] * simpleUseCaseCount) + (useCaseWeights["average"] * averageUseCaseCount) + (useCaseWeights["complex"] * complexUseCaseCount);
    console.log("UUCW:", UUCW);

    const UUCP = UAW + UUCW;
    console.log("UUCP:", UUCP);

    let TCF = 0;
    let EF = 0;

    usecases.forEach(item => {
        TCF += item.calculatedTechnicalWeight;
        EF += item.calculatedEnvironmentalWeight;
    });

    console.log("TCF:", TCF);
    console.log("EF:", EF);

    const UCP = UUCP * TCF * EF
    console.log("UCP:", UCP);

    addDoc(collection(database, "calculatedAdjustedValue"), {
        UAW,
        UUCW,
        UUCP,
        TCF,
        EF,
        UCP
    });


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

    const handleNavigateionToHome = () => {
        // storypoints.forEach((point) => {
        //     console.log(point);
        //     fetch("http://192.168.1.104:19002/update-estimates", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         'user_id': user.user_id,
        //         'product_backlog_id': point.product_backlog_id,
        //         'point': point.storyPoint
        //     })
        // }).then((res) => res.json())
        //     .then((data) => {
        //         console.log(data);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        // }
        // );
        addDoc(collection(database, 'totalStoryPoints'), {
            points: totalStoryPoints,
            project_id: project.project_id,
            project_name: project.title
        })
            .then((docRef) => {
                console.log('Total Story Points Document written with ID: ', docRef.id);
                navigation.navigate("Home");
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
            });
    }


    return (
        <View style={styles.container}>
            <Text style={styles.new}>Session has been ended</Text>
            <Text style={styles.new}>Total Story Points: {totalStoryPoints}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleNavigateionToHome()}>
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
        backgroundColor: "#fff",
    },
    new: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        textAlign: "center"
    },
    btn: {
        backgroundColor: myColor,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,

    },
});
