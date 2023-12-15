import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database, app } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default function Chat() {



  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissions, setPermissions] = useState(false);

  const [recordings, setRecordings] = useState([]);
  const [recordingFile, setRecordingFile] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      setPermissions(status === 'granted');
    })();
  }, []);

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
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
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

  
  const sendAudio = (audio) => {
    const newMessage = {
      _id: new Date().getTime(),
      createdAt: new Date(),
      user: {
        _id: auth?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300'
      },
      audio: audio
    };
  
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [newMessage])
    );
  
    // Save the message to Firestore
    addDoc(collection(database, 'chats'), newMessage);
  }
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
    console.log('currentMessage', currentMessage);
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
        {currentMessage.audio ? <View>
    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
      <Text style={{ paddingRight: 10, fontSize: 16, fontWeight: 'bold' }}>{currentMessage.user._id.split('@')[0]}</Text>
      <Text style={{ fontSize: 9, color: 'grey' }}>{currentMessage.createdAt.toLocaleTimeString()}</Text>
      <View>
        <TouchableOpacity
          onPress={async () => {
            try {
              if (isPlaying) {
                setIsPlaying(false);
                console.log('Stopping audio..');

                if (sound) {
                  await sound.stopAsync();
                  console.log('Audio stopped');
                } else {
                  console.log('Sound object is undefined. Unable to stop audio.');
                }
              } else {
                setIsPlaying(true);
                console.log('Playing audio..');
                const { sound } = await Audio.Sound.createAsync(
                  { uri: currentMessage.audio },
                  { shouldPlay: true }
                );
                setSound(sound);
              }
            } catch (error) {
              console.log('Error:', error);
            }
          }}
        >
          <Text>play</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
            : <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
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
        </View>}
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
      renderActions={() => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              try {
                if (isRecording) {
                  setIsRecording(false);
                  console.log('Stopping recording..');

                  if (recording) {
                    await recording.stopAndUnloadAsync();
                    console.log('Recording stopped and stored at', recording.getURI());
                    const { sound, status } = await recording.createNewLoadedSoundAsync();

                    setSound(sound);

                    const info = await FileSystem.getInfoAsync(recording.getURI());
                    const blob = await new Promise((resolve, reject) => {
                      const fetchXHR = new XMLHttpRequest();
                      fetchXHR.onload = function () {
                        resolve(fetchXHR.response);
                      };
                      fetchXHR.onerror = function (e) {
                        reject(new TypeError('Network request failed'));
                      };
                      fetchXHR.responseType = 'blob';
                      fetchXHR.open('GET', info.uri, true);
                      fetchXHR.send(null);
                    }).catch((err) => console.log(err));

                    const storage = getStorage(app);
                    const storageRef = ref(storage, `audios/${new Date().getTime()}.3gpp`);
                    const uploadTask = uploadBytesResumable(storageRef, blob);
                    uploadTask.on('state_changed',
                      (snapshot) => {
                        
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                          case 'paused':
                            console.log('Upload is paused');
                            break;
                          case 'running':
                            console.log('Upload is running');
                            break;
                        }
                      },
                      (error) => {
                        // Handle unsuccessful uploads
                      },
                      () => {
                        
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                          console.log('File available at', downloadURL);
                          
                          sendAudio(downloadURL);

                        });
                      }
                    );
                  } else {
                    console.log('Recording object is undefined. Unable to stop recording.');
                  }
                } else {
                  if (permissions) {
                    setIsRecording(true);
                    const recording = new Audio.Recording();
                    try {
                      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                      await recording.startAsync();
                      setRecording(recording);
                      console.log('Recording started');
                    } catch (error) {
                      console.log('Error starting recording: ', error);
                    }
                  }
                }
              } catch (error) {
                console.log('Error:', error);
              }

            }
            }
          >
            <View
              style={{
                width: 45,
                height: 45,
                marginLeft: 10,
                borderRadius: 25,
                backgroundColor: isRecording ? 'red' : 'green',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AntDesign name={isRecording ? 'close' : 'play'} size={24} color="white" />
            </View>
          </TouchableOpacity>
        </ View>
      )}
    />
  );
}

