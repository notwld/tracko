import React from "react";
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
export default function AssignStoryPoints({ navigation }) {
  const items = [1, 2, 3, 5, 7, 9, 11]; // Define your list of items

  const renderItems = () => {
    return items.map((item, index) => (
      <TouchableOpacity key={index} style={styles.fib}>
        <Text style={styles.fibText}>{item}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      console.log('dismissed keyboard');
    }}>
      <View style={styles.container}>
  
        <View >
                <Text style={styles.title}>Story Points Assignment</Text></View>
        <View style={styles.content}>
          <Text style={styles.new}>As a User I want to love u</Text>
          <View style={styles.itemsContainer}>{renderItems()}</View>
          {/* <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('Discussion') }}> */}
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Chat")}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20 }}>Move to Discussion</Text>
          </TouchableOpacity>
          
          
        </View>
        <View style={styles.huzzu}>
          <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={24} color={colors.lightGray} />
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
    width: '30%', // Adjust the width to make three items in a row
    padding: 16,
    marginBottom: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  fibText: {
    textAlign: 'center',
  },
  title:{

    textAlign:'center',
    color:'#000',
    fontSize:20,
    fontWeight:'bold',
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
