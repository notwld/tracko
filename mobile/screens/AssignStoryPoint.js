import React, { useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { updateStoryPoint } from '../utils/backlogHook';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { auth, database, app } from '../config/firebase';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";


export default function AssignStoryPoints({ route, navigation }) {
  const { backlog } = route.params;
  const { revote } = route.params;
  const { backlogId, storyPoint, backLog } = backlog;

  const items = [1, 2, 3, 5, 7, 9, 11];
  const [selectedStoryPoint, setSelectedStoryPoint] = useState(null);
  const [documentId, setDocumentId] = useState('');

  const handleAssignStoryPoint = (point) => {
    setSelectedStoryPoint(point);

  };

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

  const handleReveal = () => {
    if (!revote) {
      const storypointsCollection = collection(database, 'storypoints');
      addDoc(storypointsCollection, {
        backlogId,
        backLog,
        storyPoint: selectedStoryPoint,
        assignedBy: auth.currentUser.email.split('@')[0].toString(),
      })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
          setDocumentId(docRef.id);
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    } else {
      const storypointsCollection = collection(database, 'storypoints');
      updateDoc(doc(storypointsCollection, documentId), {
        storyPoint: selectedStoryPoint,
      })
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });

    }
    navigation.navigate("CardReveal", { backlog: backlog });
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.new}>{backLog}</Text>
          <View style={styles.itemsContainer}>{renderItems()}</View>
          <TouchableOpacity style={styles.btn} onPress={() => handleReveal()} disabled={storyPoint == null}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Reveal your Card</Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}


const myColor = 'rgb(0, 82, 204)';
const styles = StyleSheet.create({
  input: {
    marginTop: 100,
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
});
