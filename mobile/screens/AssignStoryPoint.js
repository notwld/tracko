import React, { useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from "react-native";
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { updateStoryPoint } from '../utils/backlogHook';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { auth, database, app } from '../config/firebase';
import { addDoc, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { BackHandler } from 'react-native';


export default function AssignStoryPoints({ route, navigation }) {
  const { mode } = route.params;
  console.log("Mode: ", mode);
  const { backlog } = route.params;
  const { backlogs } = route.params;
  const { revote } = route.params;
  const { project } = route.params;
  const { product_backlog_id, title } = backlog;
  const { user } = route.params;
  const metrics = [
    { key: 'inputs', label: 'Inputs' },
    { key: 'outputs', label: 'Outputs' },
    { key: 'inquiries', label: 'Inquiries' },
    { key: 'files', label: 'Files' },
    { key: 'externalInterfaces', label: 'External Interfaces' }
  ];

  const [metricValues, setMetricValues] = useState({
    inputs: '',
    outputs: '',
    inquiries: '',
    files: '',
    externalInterfaces: ''
  });
  const [selectedComplexity, setSelectedComplexity] = useState(null);
  const handleMetricChange = (key, value) => {
    setMetricValues({ ...metricValues, [key]: value });
  };
  const complexities = ['Low', 'Average', 'High'];
  const [metricCounts, setMetricCounts] = useState({
    inputs: 1,
    outputs: 1,
    inquiries: 1,
    files: 1,
    externalInterfaces: 1,
  });
  
  const [metricsData, setMetricsData] = useState({
    inputs: [
      { text: 'a', complexity: "High" },
    ],
    outputs: [
      { text: 'a', complexity: "High" },
    ],
    inquiries: [
      { text: 'q', complexity: "High" },
    ],
    files: [
      { text: '`', complexity: "High" },
    ],
    externalInterfaces: [
      { text: 'a', complexity: "High" },
    ],
  });
  
  // const handleComplexitySelect = (metricKey, complexity) => {
  //   setSelectedComplexity({ ...selectedComplexity, [metricKey]: complexity });
  // };

  // useEffect(() => {
  //   console.log("Metrics: ", selectedComplexity);  
  // }, [selectedComplexity]);

  const renderMetrics = () => {
    return metrics.map((metric) => (
      <View key={metric.key} style={styles.metricContainer}>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${metric.label}`}
          onChangeText={(value) => handleMetricChange(metric.key, value)}
        />
        <View style={styles.complexityButtons}>
          {complexities.map((complexity) => (
            <TouchableOpacity
              key={complexity}
              style={[
                styles.btn,
                {
                  backgroundColor: selectedComplexity?.[metric.key] === complexity ? 'green' : 'blue',
                }
              ]}
              onPress={() => handleComplexitySelect(metric.key, complexity)}
            >
              <Text style={styles.btnText}>{complexity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };



  const items = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const [selectedStoryPoint, setSelectedStoryPoint] = useState(null);
  const [allStories, setAllStories] = useState(null);
  const [documentId, setDocumentId] = useState('');
 
  const [currentDocumentId, setCurrentDocumentId] = useState('');
  const handleAssignStoryPoint = (point) => {
    setSelectedStoryPoint(point);


  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);

  }, []);
  const renderItems = () => {
    return items.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.fib, selectedStoryPoint === item && styles.selectedFib]}
        onPress={() => handleAssignStoryPoint(item)}
      >
        <Text style={styles.fibText}>{item}</Text>
      </TouchableOpacity>
    ));
  };
  const calculateTotalComplexityScore = (metrics) => {
    let totalScore = 0;

    // Define complexity multiplier values
    const complexityMultiplier = {
        Low: 3,
        Average: 4,
        High: 6,
    };

    // Calculate score for each metric category
    ['inputs', 'outputs', 'files', 'inquiries', 'externalInterfaces'].forEach((category) => {
        if (metrics[category]) {
            metrics[category].forEach((item) => {
                if (item.complexity in complexityMultiplier) {
                    totalScore += complexityMultiplier[item.complexity];
                }
            });
        }
    });

    return totalScore;
};
  
  const handleRevealWithFP = () => {
    const totalComplexityScore = calculateTotalComplexityScore(metricsData);  
    console.log("Total Complexity Score: ", totalComplexityScore);
    addDoc(collection(database, 'currentFP'), {
      product_backlog_id,
      title,
      storyPoint: selectedStoryPoint,
      metricsData,
      project_id: project.project_id,
      totalComplexityScore,
      assignedBy: auth.currentUser.email.split('@')[0].toString(),
     
    }).then((docRef) => {
      setCurrentDocumentId(docRef.id);
      console.log('Current Document written with ID: ', docRef.id);

      const storypointsCollectionWithFP = collection(database, 'storypointsWithFP');
      if (!revote) {
        addDoc(storypointsCollectionWithFP, {
          product_backlog_id,
          title,
          storyPoint: selectedStoryPoint,
          metricsData,
          totalComplexityScore,
          project_id: project.project_id,
          assignedBy: auth.currentUser.email.split('@')[0].toString()
        })
          .then((innerDocRef) => {
            console.log('Document written with ID: ', innerDocRef.id);
            setDocumentId(innerDocRef.id);
            console.log("Current Document ID: ", docRef.id, "Inner Document ID: ", innerDocRef.id);
            navigation.navigate("CardRevealFP", { backlog: backlog, docId: innerDocRef.id, backlogs: backlogs, currentDocumentId: docRef.id, project: project, user: user });
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
      } else {
        updateDoc(doc(storypointsCollectionWithFP, documentId), {
          storyPoint: selectedStoryPoint,
          metricsData,
          totalComplexityScore,
          project_id: project.project_id,

        })
          .then(() => {
            console.log('Document successfully updated!');
            navigation.navigate("CardRevealFP", { backlog: backlog, docId: documentId, backlogs: backlogs, currentDocumentId: docRef.id, project: project, user: user });
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      }
    }
    ).catch((error) => {
      console.error('Error writing document: ', error);
    });
  };

  const handleReveal = () => {
    addDoc(collection(database, 'current'), {
      product_backlog_id,
      title,
      storyPoint: selectedStoryPoint,
      assignedBy: auth.currentUser.email.split('@')[0].toString(),

    })
      .then((docRef) => {
        setCurrentDocumentId(docRef.id);
        console.log('Current Document written with ID: ', docRef.id);

        const storypointsCollection = collection(database, 'storypoints');
        if (!revote) {
          addDoc(storypointsCollection, {
            product_backlog_id,
            title,
            storyPoint: selectedStoryPoint,
            assignedBy: auth.currentUser.email.split('@')[0].toString(),
          })
            .then((innerDocRef) => {
              console.log('Document written with ID: ', innerDocRef.id);
              setDocumentId(innerDocRef.id);
              console.log("Current Document ID: ", docRef.id, "Inner Document ID: ", innerDocRef.id);
              navigation.navigate("CardReveal", { backlog: backlog, docId: innerDocRef.id, backlogs: backlogs, currentDocumentId: docRef.id, project: project, user: user });
            })
            .catch((error) => {
              console.error('Error writing document: ', error);
            });
        } else {
          updateDoc(doc(storypointsCollection, documentId), {
            storyPoint: selectedStoryPoint,
          })
            .then(() => {
              console.log('Document successfully updated!');
              navigation.navigate("CardReveal", { backlog: backlog, docId: documentId, backlogs: backlogs, currentDocumentId: docRef.id, project: project, user: user });
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };

  const renderMetricInputs = (metricKey) => {
    return metricsData[metricKey].map((item, index) => (
      <View key={index} style={styles.metricInputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${item.text}`}
          value={item.text}
          onChangeText={(value) => handleInputChange(metricKey, index, value)}
        />
        <View style={styles.complexityButtons}>
          {["Low", "Average", "High"].map((complexity) => (
            <TouchableOpacity
              key={complexity}
              style={[
                styles.complexityBtn,
                {
                  backgroundColor:
                    item.complexity === complexity ? "green" : "blue",
                },
              ]}
              onPress={() => handleComplexitySelect(metricKey, index, complexity)}
            >
              <Text style={styles.btnText}>{complexity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };
  
  

  const handleMetricCountChange = (metricKey, count) => {
    const newCounts = { ...metricCounts, [metricKey]: count };
    setMetricCounts(newCounts);
  
    const newMetricData = {};
    for (const key in newCounts) {
      newMetricData[key] = Array.from({ length: newCounts[key] }, () => ({
        text: "",
        complexity: null,
      }));
    }
    setMetricsData(newMetricData);
  };
  
  const handleInputChange = (metricKey, index, value) => {
    const updatedData = { ...metricsData };
    updatedData[metricKey][index].text = value;
    setMetricsData(updatedData);
  };
  
  const handleComplexitySelect = (metricKey, index, complexity) => {
    const updatedData = { ...metricsData };
    updatedData[metricKey][index].complexity = complexity;
    setMetricsData(updatedData);
  };
  
  return (
    <ScrollView><TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.new}>{title}</Text>
          <View style={styles.itemsContainer}>{renderItems()}</View>
          {mode=="FP"&&<View>
            <Text style={styles.heading}>Enter Metric Counts</Text>
            <View>
  {["inputs", "outputs", "inquiries", "files", "externalInterfaces"].map((metricKey) => (
    <View key={metricKey} style={styles.metricCountContainer}>
      <Text>{metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}:</Text>
      <TextInput
        style={styles.countInput}
        keyboardType="numeric"
        value={metricCounts[metricKey].toString()}
        onChangeText={(count) => handleMetricCountChange(metricKey, parseInt(count) || 0)}
      />
      {metricCounts[metricKey] > 0 && renderMetricInputs(metricKey)}
    </View>
  ))}
</View>

            
            </View>}
          {/* yahan hi input output puch lo agar fp metrice use ho raha h to */}
          <TouchableOpacity style={styles.btn} onPress={() => mode ? handleRevealWithFP() : handleReveal()}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Reveal your Card</Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
    </ScrollView>
    
  );
}


const myColor = 'rgb(0, 82, 204)';
const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 20,
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  content: {
    padding: 40,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  fib: {
    width: '30%',
    padding: 16,
    marginBottom: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  selectedFib: {
    backgroundColor: 'lightblue',
  },
  fibText: {
    textAlign: 'center',
  },
  title: {

    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  huzzu: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: "#fff",
  },
  metricContainer: {
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  complexityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btnText: {
    color: 'white',
  },
  activeBtn: {
    backgroundColor: 'green',
  },
  metricCountContainer: {
    marginBottom: 20,
  },
  countInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
  },
  metricInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
  },
  complexityButtons: {
    flexDirection: "row",
    marginLeft: 10,
  },
  complexityBtn: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  btnText: {
    color: "white",
  },
  
});
