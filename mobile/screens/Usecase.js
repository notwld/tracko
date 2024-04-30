import React, { Component, useEffect } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View, TextInput, Button, Alert } from 'react-native'
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../config/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
const complexities = [
    { label: 'Simple', value: 'simple' },
    { label: 'Average', value: 'average' },
    { label: 'Complex', value: 'complex' }
];
const environmentalFactors = [
    { factor: 'E1', description: 'Project Model Familiarity', weight: 1.5 },
    { factor: 'E2', description: 'Application Experience', weight: 0.5 },
    { factor: 'E3', description: 'Object-Oriented Experience', weight: 1.0 },
    { factor: 'E4', description: 'Lead Analyst Capability', weight: 0.5 },
    { factor: 'E5', description: 'Motivation', weight: 1.0 },
    { factor: 'E6', description: 'Stable Requirements', weight: 2.0 },
    { factor: 'E7', description: 'Part-time Staff', weight: -1.0 },
    { factor: 'E8', description: 'Difficult Programming Language', weight: -1.0 }
];

const technicalFactors = [
    { factor: 'T1', description: 'Distributed System', weight: 2.0 },
    { factor: 'T2', description: 'Response time or throughput performance objectives', weight: 1.0 },
    { factor: 'T3', description: 'End user efficiency', weight: 1.0 },
    { factor: 'T4', description: 'Complex internal processing', weight: 1.0 },
    { factor: 'T5', description: 'Code must be reusable', weight: 1.0 },
    { factor: 'T6', description: 'Easy to install', weight: 0.5 },
    { factor: 'T7', description: 'Easy to use', weight: 0.5 },
    { factor: 'T8', description: 'Portable', weight: 2.0 },
    { factor: 'T9', description: 'Easy to change', weight: 1.0 },
    { factor: 'T10', description: 'Concurrent', weight: 1.0 },
    { factor: 'T11', description: 'Includes special security objectives', weight: 1.0 },
    { factor: 'T12', description: 'Provides direct access for third parties', weight: 1.0 },
    { factor: 'T13', description: 'Special user training facilities are required', weight: 1.0 }
];

function Usecase({ route, navigation }) {
    const navigate = useNavigation();
    const { usecase } = route.params;
    const { usecasesData } = route.params;
    const {currentDocumentId} = route.params;
    const { project } = route.params;
    const { user } = route.params;
    const { revote } = route.params;



    const [useCaseComplexity, setUseCaseComplexity] = useState(null);
    const [actorComplexity, setActorComplexity] = useState(null);
    const [technicalComplexity, setTechnicalComplexity] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalENVVisible, setModalENVVisible] = useState(false);
    const [selectedTechnicalFactor, setSelectedTechnicalFactor] = useState(null);
    const [selectedENVFactor, setSelectedENVFactor] = useState(null);
    const [environmentalComplexity, setEnvironmentalComplexity] = useState([]);

    useEffect(()=>{
        // setusecase(usecase)
        if(!revote){
            setActorComplexity([])
            setUseCaseComplexity(null)
            setTechnicalComplexity([])
            setEnvironmentalComplexity([])
            setSelectedENVFactor(null)
            setSelectedTechnicalFactor(null)
        }
    },[])


    const calculateEnvironmentalWeight = () => {
        let totalWeight = 0;
    
        environmentalComplexity.forEach(item => {
            const selectedENVFactor = environmentalFactors.find(factor => factor.factor === item.factor);
            
            if (selectedENVFactor) {
                // Multiply weight and complexity and add to totalWeight
                const factorWeight = selectedENVFactor.weight;
                const factorComplexity = item.complexity;
                const weightedValue = factorWeight * factorComplexity;
    
                totalWeight += (weightedValue * -0.03)+1.4   ;
            }
        });
    
        return totalWeight;
    };
    

    const handleUseCaseComplexitySelection = (value) => {
        setUseCaseComplexity(value);
    };

    const handleActorComplexitySelection = (index, actor, value) => {
        setActorComplexity((prev) => ({
            ...prev,
            [actor]: value
        })
        );
    };

    const toggleTechnicalFactor = (factor) => {
        const isSelected = technicalComplexity.some(item => item.factor === factor);
        if (isSelected) {
            setTechnicalComplexity(prev => prev.filter(item => item.factor !== factor));
        } else {
            setModalVisible(true);
            setSelectedTechnicalFactor(factor);
        }
    };

    const toggleEnvironmentalFactor = (factor) => {
        const isSelected = environmentalComplexity.some(item => item.factor === factor);
        if (isSelected) {
            setEnvironmentalComplexity(prev => prev.filter(item => item !== factor));
        } else {
            setModalENVVisible(true);
            setSelectedENVFactor(factor);
        }
    };


    const setTechnicalFactorComplexity = (value) => {
        if (selectedTechnicalFactor) {
            // Find the selected technical factor object
            const selectedFactor = technicalFactors.find(item => item.factor === selectedTechnicalFactor);

            if (selectedFactor) {
                const updatedFactors = [...technicalComplexity.filter(item => item.factor !== selectedTechnicalFactor)];

                if (value > 0) {
                    // Include description and weight along with factor and complexity
                    updatedFactors.push({
                        factor: selectedTechnicalFactor,
                        description: selectedFactor.description,
                        weight: selectedFactor.weight,
                        complexity: value
                    });
                }

                console.log("inside func", updatedFactors);
                setTechnicalComplexity(updatedFactors);
            }
        }

        setModalVisible(false);
        setSelectedTechnicalFactor(null);
    };

    const calculateTechnicalWeight = () => {
        let totalWeight = 0;
    
        technicalComplexity.forEach(item => {
            const selectedTechnicalFactor = technicalFactors.find(factor => factor.factor === item.factor);
            
            if (selectedTechnicalFactor) {
                // Calculate weighted value for the factor
                const factorWeight = selectedTechnicalFactor.weight;
                const factorComplexity = item.complexity;
    
                // Calculate the weighted value of the factor (including adjustments)
                const weightedValue = (factorWeight * factorComplexity * 0.01) + 0.6;
    
                // Add the weighted value to the total weight
                totalWeight += weightedValue;
            }
        });
    
        return totalWeight;
    };
    
    const handleENVFactorComplexitySelection = (factor, value) => {
        if (factor) {
            // Find the selected environmental factor object
            const selectedFactor = environmentalFactors.find(item => item.factor === factor);

            if (selectedFactor) {
                const updatedFactors = [...environmentalComplexity.filter(item => item.factor !== factor)];

                if (value > 0) {
                    // Include description and weight along with the factor
                    updatedFactors.push({
                        factor: factor,
                        description: selectedFactor.description,
                        weight: selectedFactor.weight,
                        complexity: value
                    });
                }

                console.log("inside func", updatedFactors);
                setEnvironmentalComplexity(updatedFactors);
            }
        }

        setModalENVVisible(false);
        setSelectedENVFactor(null);
    };

    function calculateTransactionsAndWeight(complexity) {
        switch (complexity) {
            case "simple":
                return { transactions: 5, weight: 1 };
            case "average":
                return { transactions: 10, weight: 2 };
            case "complex":
                return { transactions: 15, weight: 3 };
            default:
                return { transactions: 0, weight: 0 };
        }
    }
    const [documentId, setDocumentId] = useState('');
    const handleReveal = async () => {
        const data = {
            usecase,
            useCaseComplexity,
            actorComplexity: Object.fromEntries(
                Object.entries(actorComplexity).map(([key, complexity]) => [
                    key,
                    {
                        complexity,
                        ...calculateTransactionsAndWeight(complexity)
                    }
                ])
            ),
            technicalComplexity,
            environmentalComplexity,
            calculatedTechnicalWeight: calculateTechnicalWeight(),
            calculatedEnvironmentalWeight: calculateEnvironmentalWeight(),
            user: auth.currentUser.email.split('@')[0].toString()
        }
        console.log("___________________data__________________________")
        console.log(data)
        console.table(data)
        addDoc(collection(database, 'usecase'), data).then((docRef) => {
            setDocumentId(docRef.id);
            console.log('Current Document written with ID: ', docRef.id);
            const usecases = collection(database, 'usecases');
            if (!revote) {
                addDoc(usecases, {
                    usecase: usecase,
                    useCaseComplexity,
                    actorComplexity: Object.fromEntries(
                        Object.entries(actorComplexity).map(([key, complexity]) => [
                            key,
                            {
                                complexity,
                                ...calculateTransactionsAndWeight(complexity)
                            }
                        ])
                    ),
                    technicalComplexity,
                    environmentalComplexity,
                    calculatedTechnicalWeight: calculateTechnicalWeight(),
                    calculatedEnvironmentalWeight: calculateEnvironmentalWeight(),
                    user: auth.currentUser.email.split('@')[0].toString()
                }).then((innerDocRef) => {
                    setDocumentId(innerDocRef.id);
                    console.log("________________________________checking data__________________________")
                    console.log(usecasesData)
                    navigate.navigate("UsecaseReveal", { usecase: usecase, usecases: usecasesData, project: project, user: user,currentDocumentId:docRef.id,docId:innerDocRef.id });
                    console.log('Document successfully written!');
                }
                ).catch((error) => {
                    Alert.alert("Error", error);
                    console.error('Error writing document: ', error);
                });

            }
            else {
                updateDoc(doc(usecases, documentId), {
                    usecase: usecase,
                    useCaseComplexity,
                    calculatedTechnicalWeight: calculateTechnicalWeight(),
                    calculatedEnvironmentalWeight: calculateEnvironmentalWeight(),
                    actorComplexity: Object.fromEntries(
                        Object.entries(actorComplexity).map(([key, complexity]) => [
                            key,
                            {
                                complexity,
                                ...calculateTransactionsAndWeight(complexity)
                            }
                        ])
                    ),

                    technicalComplexity,
                    environmentalComplexity,
                    user: auth.currentUser.email.split('@')[0].toString()
                }).then(() => {
                    navigate.navigate("UsecaseReveal", { usecase: usecase, usecases: usecasesData, project: project, user: user,currentDocumentId:docRef.id,docId: documentId });
                    console.log('Document successfully updated!');
                }
                ).catch((error) => {
                    Alert.alert("Error", error);
                    console.error('Error updating document: ', error);
                });


            }

        }).catch((error) => {
            Alert.alert("Error", error);
            console.error('Error adding document: ', error);
        });


    }

    useEffect(() => {
        console.log(actorComplexity)
    }, [actorComplexity])
    // useEffect(() => {
    //     console.log(environmentalComplexity)
    // },[environmentalComplexity])
    // useEffect(() => {
    //     console.log(technicalComplexity)
    // },[technicalComplexity])
    return (
        <ScrollView>
            <View style={{ flex: 1, alignItems: 'flex-start', marginVertical: 50, marginHorizontal: 20 }}>
                <Text style={{ paddingBottom: 10, fontWeight: "bold" }}>{usecase.title}</Text>
                <Text style={{ paddingBottom: 10 }}>{usecase.description}</Text>
                <Text style={{ paddingBottom: 10 }}>Actors:
                    {usecase.actors.map((actor) => (
                        <Text style={{
                            marginHorizontal: 2
                        }}>
                            {actor.name}
                        </Text>
                    ))}
                </Text>
                <Text style={{ paddingBottom: 10 }}>Precondition: {usecase.pre_condition}</Text>
                <Text style={{ paddingBottom: 10 }}>Steps: {usecase.steps}</Text>
                <Text>
                    Postcondition: {usecase.post_condition}
                </Text>
                <View>
                    <Text style={{ paddingVertical: 10, fontWeight: "bold" }}>Use Case Complexity</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        {complexities.map((complexity) => (
                            <TouchableOpacity
                                key={complexity.value}
                                style={{
                                    backgroundColor: useCaseComplexity === complexity.value ? "blue" : "grey",
                                    padding: 10,
                                    marginVertical: 5
                                }}
                                onPress={() => handleUseCaseComplexitySelection(complexity.value)}
                            >
                                <Text style={{
                                    color: "white",
                                    textAlign: "center"
                                }}>{complexity.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Actor Complexity Selection */}
                <View>
                    <Text style={{ paddingVertical: 10, fontWeight: "bold" }}>Actor Complexity</Text>
                    {usecase.actors.map((actor, index) => (
                        <View>
                            <Text>
                                {actor.name}
                            </Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>

                                {complexities.map((complexity, Cindex) => (
                                    <TouchableOpacity
                                        key={complexity.value}
                                        style={{
                                            backgroundColor: complexity.value === actorComplexity?.[actor.name] ? "blue" : "grey",
                                            padding: 10,
                                            marginVertical: 5
                                        }}
                                        onPress={() => handleActorComplexitySelection(index, actor.name, complexity.value)}
                                    >
                                        <Text style={{
                                            color: "white",
                                            textAlign: "center"
                                        }}>{complexity.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                </View>
                <View style={{ width: "100%" }}>
                    <Text style={{ paddingVertical: 10, fontWeight: "bold" }}>Technical Complexity</Text>
                    <View style={{ flexDirection: "column", width: "100%", justifyContent: "center" }}>
                        {technicalFactors.map((factor) => (
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <TouchableOpacity
                                    key={factor.factor}
                                    style={{
                                        backgroundColor: technicalComplexity.find(item => item.factor === factor.factor) ? "blue" : "grey",
                                        padding: 10,
                                        marginVertical: 5,
                                        width: "100%"
                                    }}
                                    onPress={() => toggleTechnicalFactor(factor.factor)}
                                >
                                    <Text style={{ color: "white", textAlign: "center" }}>
                                        {factor.description}
                                    </Text>

                                </TouchableOpacity>

                            </View>
                        ))}
                    </View>
                    <Text style={{ paddingTop: 10 }}>
                        Total Technical Weight: {calculateTechnicalWeight()}
                    </Text>

                </View>
                {/* Environmental Complexity Selection */}
                <View style={{ width: "100%" }}>
                    <Text style={{ paddingVertical: 10, fontWeight: "bold" }}>Environmental Complexity</Text>
                    {environmentalFactors.map((factor) => (
                        <TouchableOpacity
                            key={factor.factor}
                            style={{
                                backgroundColor: environmentalComplexity.some(item => item.factor === factor.factor) ? "blue" : "grey",
                                padding: 10,
                                marginVertical: 5
                            }}
                            onPress={() => toggleEnvironmentalFactor(factor.factor)}
                        >
                            <Text style={{ color: "white", textAlign: "center" }}>
                                {factor.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={{ paddingTop: 10 }}>
                        Total Environmental Weight: {calculateEnvironmentalWeight()}
                    </Text>
                    <TouchableOpacity style={{ backgroundColor: "grey", padding: 10, marginVertical: 10, width: "100%" }} onPress={() => {
                        setTechnicalComplexity([]);
                        setEnvironmentalComplexity([]);
                    }}>
                        <Text style={{ paddingVertical: 10, fontWeight: "bold", color: "white", textAlign: "center" }}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "blue", padding: 10, marginVertical: 10, width: "100%" }} onPress={() => {
                        handleReveal();
                    }}>
                        <Text style={{ paddingVertical: 10, fontWeight: "bold", color: "white", textAlign: "center" }}>Reveal</Text>
                    </TouchableOpacity>
                </View>

                {/* Modals for selecting complexity */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Choose Technical Complexity</Text>
                            <TextInput
                                keyboardType="numeric"
                                placeholder="Select complexity (0-5)"
                                onChangeText={(value) => value<=5?setTechnicalFactorComplexity(Number(value)):Alert.alert("Please enter a value between 0 and 5")}
                                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalENVVisible}
                    onRequestClose={() => setModalENVVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Choose Environmental Complexity</Text>
                            <TextInput
                                keyboardType="numeric"
                                placeholder="Select complexity (0-5)"
                                onChangeText={(value) => {
                                    value<=5?handleENVFactorComplexitySelection(selectedENVFactor, Number(value)):Alert.alert("Please enter a value between 0 and 5");
                                }}
                                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

export default Usecase

