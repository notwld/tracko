import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, query, getDocs, where } from 'firebase/firestore';

function UsecaseAgile({ route,navigation }) {
    const navigate = useNavigation();
    const { usecase, usecasesData, currentDocumentId, project, user, revote } = route.params;
    const [useCasePoints, setUseCasePoints] = useState(0);
    const [actorWeights, setActorWeights] = useState({});
    const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const [documentId, setDocumentId] = useState('');

    const handleReveal = async () => {
        const data = {
            usecase,
            useCasePoints,
            actorWeights,
            user: auth.currentUser.email.split('@')[0].toString(),
        };

        try {
            // Add to the usecaseAgile collection
            const docRef = await addDoc(collection(database, 'usecaseAgile'), data);
            setDocumentId(docRef.id);
            console.log('Current Document written with ID: ', docRef.id);

            const usecasesCollection = collection(database, 'usecasesAgile');
            const currentUsecaseAgileCollection = collection(database, 'currentUsecaseAgile');

            if (!revote) {
                // Add to the usecasesAgile collection
                const innerDocRef = await addDoc(usecasesCollection, {
                    usecase: usecase,
                    useCasePoints: useCasePoints,
                    actorWeights: actorWeights,
                    user: auth.currentUser.email.split('@')[0].toString(),
                });
                console.log('Document written with ID: ', innerDocRef.id);
                setDocumentId(innerDocRef.id);

                // Add to the currentUsecaseAgile collection
                await addDoc(currentUsecaseAgileCollection, {
                    usecase: usecase,
                    useCasePoints: useCasePoints,
                    actorWeights: actorWeights,
                    user: auth.currentUser.email.split('@')[0].toString(),
                    currentDocumentId: docRef.id,
                    project_id: project.project_id,
                });

                console.log("Current Document ID: ", docRef.id, "Inner Document ID: ", innerDocRef.id);
                navigation.navigate("UsecaseAgileReveal", { usecase: usecase, usecases: usecasesData, project: project, user: user, currentDocumentId: docRef.id, docId: innerDocRef.id });
            } else {
                // Update the existing document in the usecasesAgile collection
                await updateDoc(doc(usecasesCollection, documentId), {
                    usecase: usecase,
                    useCasePoints: useCasePoints,
                    actorWeights: actorWeights,
                    user: auth.currentUser.email.split('@')[0].toString(),
                });

                // Update the existing document in the currentUsecaseAgile collection
                const querySnapshot = await getDocs(query(currentUsecaseAgileCollection, where("currentDocumentId", "==", docRef.id)));
                querySnapshot.forEach(async (doc) => {
                    await updateDoc(doc.ref, {
                        useCasePoints: useCasePoints,
                        actorWeights: actorWeights,
                    });
                });

                console.log('Document successfully updated!');
                navigation.navigate("UsecaseAgileReveal", { usecase: usecase, usecases: usecasesData, project: project, user: user, currentDocumentId: docRef.id, docId: documentId });
            }
        } catch (error) {
            Alert.alert('Error', error.message);
            console.error('Error adding or updating document: ', error);
        }
    };

    const handleActorWeightChange = (actor, weight) => {
        setActorWeights(prevWeights => ({ ...prevWeights, [actor]: weight }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.usecaseContainer}>
                <Text style={styles.title}>{usecase.title}</Text>
                <Text style={styles.description}>{usecase.description}</Text>
                <Text style={styles.label}>Actors:</Text>
                {usecase.actors.map((actor, index) => (
                    <View key={index} style={styles.actorContainer}>
                        <Text style={styles.actor}>{actor.name}</Text>
                        <View style={styles.fibonacciContainer}>
                            {fibonacci.map((point) => (
                                <TouchableOpacity
                                    key={point}
                                    style={[
                                        styles.fibonacciButton,
                                        actorWeights[actor.name] === point && styles.selectedFibonacciButton,
                                    ]}
                                    onPress={() => handleActorWeightChange(actor.name, point)}
                                >
                                    <Text style={[
                                        styles.fibonacciText,
                                        actorWeights[actor.name] === point && styles.selectedFibonacciText,
                                    ]}>
                                        {point}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <Text style={styles.label}>Precondition:</Text>
                <Text style={styles.detail}>{usecase.pre_condition}</Text>
                <Text style={styles.label}>Steps:</Text>
                <Text style={styles.detail}>{usecase.steps}</Text>
                <Text style={styles.label}>Postcondition:</Text>
                <Text style={styles.detail}>{usecase.post_condition}</Text>
                <View style={styles.fibonacciContainer}>
                    {fibonacci.map((point) => (
                        <TouchableOpacity
                            key={point}
                            style={[
                                styles.fibonacciButton,
                                useCasePoints === point && styles.selectedFibonacciButton,
                            ]}
                            onPress={() => setUseCasePoints(point)}
                        >
                            <Text style={[
                                styles.fibonacciText,
                                useCasePoints === point && styles.selectedFibonacciText,
                            ]}>
                                {point}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Button title="Reveal" onPress={handleReveal} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    usecaseContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    actorContainer: {
        marginBottom: 10,
    },
    actor: {
        fontSize: 16,
        marginLeft: 10,
    },
    detail: {
        fontSize: 16,
        marginLeft: 10,
    },
    fibonacciContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    fibonacciButton: {
        margin: 5,
        padding: 10,
        backgroundColor: '#6200ea',
        borderRadius: 10,
    },
    selectedFibonacciButton: {
        backgroundColor: 'black',
    },
    fibonacciText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedFibonacciText: {
        color: 'white',
    },
});

export default UsecaseAgile;
