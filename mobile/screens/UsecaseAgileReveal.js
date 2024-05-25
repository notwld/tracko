import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { auth, database } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const UsecaseAgileReveal = ({ route, navigation }) => {
    const { usecase, usecases, currentDocumentId, project, user } = route.params;
    const usecaseID = usecase.title;
    const [data, setData] = useState(null);

    useEffect(() => {
        const usecasesFirebase = collection(database, 'usecasesAgile');
        const unsubscribe = onSnapshot(usecasesFirebase, (querySnapshot) => {
            const info = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setData(info);
        });
        return unsubscribe;
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{usecase.title}</Text>
            </View>
            <View style={styles.usecaseList}>
                {data && data.map((usecaseItem, index) => (
                    usecaseItem.usecase.title === usecaseID && (
                        <View key={index} style={styles.usecaseCard}>
                            <Text style={styles.user}>{usecaseItem.user} assigned</Text>
                            <Text style={styles.pointsText}>
                                {usecaseItem.useCasePoints} to this usecase and
                            </Text>
                            <View style={styles.actorWeights}>
                                {Object.keys(usecaseItem.actorWeights).map((actor, i) => (
                                    <Text key={i} style={styles.actorWeightText}>
                                        assigned {usecaseItem.actorWeights[actor]} to {actor}.
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ChatClone", { usecase, usecases, project, user, currentDocumentId,mode:"agile" })}
                >
                    <Text style={styles.buttonText}>Move to Discussion</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginVertical: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    usecaseList: {
        marginTop: 20,
    },
    usecaseCard: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    user: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    assignedText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    actorWeights: {
        marginTop: 10,
    },
    actorWeightText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgb(0, 82, 204)',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
    },
});

export default UsecaseAgileReveal;
