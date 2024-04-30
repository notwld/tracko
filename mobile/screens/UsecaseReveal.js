import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { auth, database } from "../config/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";


const UsecaseReveal = ({ route, navigation }) => {
    const { usecase } = route.params;
    const { usecases } = route.params;
    const { currentDocumentId } = route.params;
    const { project } = route.params;
    const { user } = route.params;
    const usecaseID = usecase.title
    const [data, setData] = useState(null)
    useEffect(() => {
        console.log("_______checking props_______")
        // console.log(usecase)
        console.log(usecases)
        console.log(currentDocumentId)
        const usecasesFirebase = collection(database, 'usecases');
        const unsubscribe = onSnapshot(usecasesFirebase, (querySnapshot) => {
            const info = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setData(info);
            // console.log(info);
        });
    }, [])
    return (
        <ScrollView>
            <View style={{
                marginVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,

            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>
                    {usecase.title}
                </Text>
                <View>
                    {
                        data  && data.map((usecase, index) => (
                            usecase.usecase.title==usecaseID &&  <View key={index} style={{
                                marginVertical: 10,
                                padding: 10,
                                backgroundColor: '#f9c2ff',
                                justifyContent: 'center',

                                marginHorizontal: 10,
                                borderRadius: 10,
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>
                                    {usecase.user}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    marginTop: 5,
                                }}>
                                    assigned...
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    marginTop: 5,
                                }}>
                                    Usecase Complexity: {usecase.useCaseComplexity}
                                </Text>

                                {/* Render actor complexities dynamically */}
                                {usecase.actorComplexity && Object.keys(usecase.actorComplexity).map(actorKey => (
                                    <View key={actorKey} style={{ marginTop: 5 }}>
                                        <Text style={{ fontSize: 14 }}>
                                            {actorKey}: {usecase.actorComplexity[actorKey].complexity}
                                        </Text>
                                    </View>
                                ))}
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    marginTop: 10,
                                }}>
                                    Technical Factors:
                                </Text>
                                {usecase.technicalComplexity && usecase.technicalComplexity.map((technicalFactor, techIndex) => (
                                    <View key={techIndex} style={{ marginTop: 5 }}>
                                        <Text style={{ fontSize: 14 }}>
                                            Name: {technicalFactor.description}
                                        </Text>
                                        
                                        <Text style={{ fontSize: 14 }}>
                                            Complexity: {technicalFactor.complexity}
                                        </Text>
                                    </View>

                                ))}
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    marginTop: 10,
                                }}>
                                    Environmental Factors:
                                </Text>
                                {usecase.environmentalComplexity && usecase.environmentalComplexity.map((envFactor, envIndex) => (
                                    <View key={envIndex} style={{ marginTop: 5 }}>
                                        <Text style={{ fontSize: 14 }}>
                                            Name: {envFactor.description}
                                        </Text>
                                       
                                        <Text style={{ fontSize: 14 }}>
                                            Complexity: {envFactor.complexity}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))
                    }



                </View>
                <View>
                    <TouchableOpacity style={{
                        backgroundColor: 'rgb(0, 82, 204)',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                    }} onPress={() => navigation.navigate("ChatClone", { usecase: usecase, usecases: usecases, project: project, user: user, currentDocumentId: currentDocumentId })}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', color: "white", fontSize: 15 }}>
                            Move to Discussion
                        </Text>

                    
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default UsecaseReveal;