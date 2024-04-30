import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useNavigation } from "@react-navigation/native";

const CardRevealFP = ({ route }) => {

    const { backlog } = route.params;
    const { backlogs } = route.params;
    const {currentDocumentId} = route.params;
    const { title, product_backlog_id } = backlog;

    const {project} = route.params;
    const {user} = route.params;
    const [selectedStoryPoints, setSelectedStoryPoints] = useState([]);
    const [maxStoryPoint, setMaxStoryPoint] = useState(null);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const navigation = useNavigation();
   
    useEffect(() => {
        const dbRef = collection(database, 'storypointsWithFP');
        const unsubscribe = onSnapshot(dbRef, (querySnapshot) => {
            const points = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setSelectedStoryPoints(points);

            const frequencyMap = {};
            points.forEach(item => {
                if (item.product_backlog_id === product_backlog_id) {
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

        return () => unsubscribe();
    }, [product_backlog_id]);

    const renderCard = ({ item }) => {
        const metrics = item.metricsData;
        
            return (
               item.product_backlog_id === product_backlog_id && (
                <View style={styles.card}>
                <Text style={styles.cardText}>
                    {item.assignedBy} selected {item.storyPoint}
                </Text>
                <View style={styles.metricContainer}>
                    <Text style={styles.metricTitle}>Metrics:</Text>
                    <Text style={styles.metricTitle}>Inputs:</Text>
                   {metrics.inputs&&metrics.inputs.map((input, index) => (
                        <Text key={index} style={styles.metricItem}>
                            {input.text} - {input.complexity}
                        </Text>
                    ))}
                    <Text style={styles.metricTitle}>Outputs:</Text>

                   {metrics.outputs&&metrics.outputs.map((input, index) => (
                        <Text key={index} style={styles.metricItem}>
                            {input.text} - {input.complexity}
                        </Text>
                    ))}
                    <Text style={styles.metricTitle}>Files:</Text>
                   {metrics.files&&metrics.files.map((input, index) => (
                        <Text key={index} style={styles.metricItem}>
                            {input.text} - {input.complexity}
                        </Text>
                    ))}
                    <Text style={styles.metricTitle}>Inquiries:</Text>
                   {metrics.inquiries&&metrics.inquiries.map((input, index) => (
                        <Text key={index} style={styles.metricItem}>
                            {input.text} - {input.complexity}
                        </Text>
                    ))}
                    <Text style={styles.metricTitle}>External Interfaces:</Text>
                   {metrics.externalInterfaces&&metrics.externalInterfaces.map((input, index) => (
                        <Text key={index} style={styles.metricItem}>
                            {input.text} - {input.complexity}
                        </Text>
                    ))}
                    <Text style={styles.metricTitle}>
                        Total Count:
                         {item.totalComplexityScore}
                    </Text>
                    </View>
                
                
            </View>
                )
            );
       
    };

    return (
        <View style={styles.container}>
            <Text style={styles.backlogTitle}>{backlog.title}</Text>
            <Text style={styles.mostFrequentText}>
                Most frequent assigned weight: {maxStoryPoint} (appeared {maxFrequency} times)
            </Text>
            <FlatList
                data={selectedStoryPoints}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={styles.cardContainer}
            />
                       <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Chat", { backlog: backlog ,backlogs:backlogs,currentDocumentId:currentDocumentId, project:project, user:user,mode:"FP"})}>

                <Text style={styles.moveDiscussionText}>Move to Discussion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    backlogTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mostFrequentText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    cardContainer: {
        flexGrow: 1,
        width: '100%',
    },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
    },
    cardText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    metricContainer: {
        marginBottom: 5,
    },
    metricTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 3,
    },
    metricItem: {
        fontSize: 14,
    },
    moveDiscussionBtn: {
        backgroundColor: 'rgb(0, 82, 204)',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    moveDiscussionText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
    },
    btn: {
        backgroundColor: 'rgb(0, 82, 204)',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});

export default CardRevealFP;
