import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { auth,database } from '../config/firebase';
import { addDoc, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";

const FPQuestions = ({
    navigation,
    route
}) => {
    const { projectId } = route.params;
    const [complexities, setComplexities] = useState({
        "Does the system require reliable backup and recovery?": 0,
        "Are specialized data communications required to transfer information to or from the application? ": 0,
        "Are there distributed processing functions?": 0,
        "Is performance critical?": 0,
        "Will the system run in an existing, heavily utilized operational environment?": 0,
        "Does the system require online data entry?": 0,
        "Does the online data entry require the input transaction to be built over multiple screens or operations?": 0,
        "Are the ILFS updated online?": 0,
        "Are the inputs, outputs, files, or inquiries complex? ": 0,
        "Is the internal processing complex?": 0,
        "Is the code designed to be reusable?": 0,
        "Are conversion and installation included in the design?": 0,
        "Is the system designed for multiple installations in different organizations?": 0,
        "Is the application designed to facilitate change and ease of use by the user?": 0,
    });

    const handleComplexityChange = (question, value) => {
        setComplexities({
            ...complexities,
            [question]: parseInt(value) || 0 
        });
    };

    const renderQuestions = () => {
        return (
            <View style = {styles.container}>
                <Text style={styles.header}>Questions For Analysis</Text>
                {Object.keys(complexities).map((question, index) => (
                    <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={(value) => handleComplexityChange(question, value)}
                            value={complexities[question].toString()}
                        />
                    </View>
                ))}
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        );
    };

    const handleSubmit = () => {
       const collectionRef = collection(database, "questions");
         addDoc(collectionRef, {
              complexities,
              user: auth.currentUser.email.split('@')[0],
              projectId: projectId
         }).then(() => {
            alert('Complexities added successfully');
            navigation.navigate('Home');
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });

    };

    return (
        <ScrollView >
            {renderQuestions()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    questionContainer: {
        marginBottom: 15,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default FPQuestions;
