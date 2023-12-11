import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text,View,Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';


export default function Chat() {

  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 10
            }}
            onPress={onSignOut}
          >
            <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
          </TouchableOpacity>
        )
      });
    }, [navigation]);

  useLayoutEffect(() => {

      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsusbscribe');
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user
          }))
        );
      });
  return unsubscribe;
    }, []);

  const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
      // setMessages([...messages, ...messages]);
      const { _id, createdAt, text, user } = messages[0];    
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        user
      });
    }, []);
    const renderMessage = props => {
      const { currentMessage } = props;
    
      return (
        <View
          style={{
            borderRadius: 10,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 5,
            margin: 10,
            alignSelf: currentMessage.user._id === auth?.currentUser?.email ? 'flex-start' : 'flex-end',
            maxWidth: '80%',
          }}
        >
          <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Image
              source={{ uri: currentMessage.user.avatar }}
              style={{ width: 30, height: 30, borderRadius: 15, marginRight: 7 }}
            />
            <View>
              
                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ paddingRight: 10, fontSize: 16, fontWeight: 'bold' }}>{currentMessage.user._id.split('@')[0]}</Text>
                  <Text style={{ fontSize: 9, color: 'grey' }}>{currentMessage.createdAt.toLocaleTimeString()}</Text>
                </View>
              
              <Text style={{ fontSize: 13 }}>{currentMessage.text}</Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: auth?.currentUser?.email,
          avatar: 'https://i.pravatar.cc/300'
        }}
        renderMessage={renderMessage}
      />
    );
}

