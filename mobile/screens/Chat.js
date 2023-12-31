import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { signOut } from 'firebase/auth';
import { auth, database, app } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackHandler } from 'react-native';


export default function Chat(props) {
  const backlog = props.route.params.backlog;
  const backlogs = props.route.params.backlogs;
  const currentDocumentId = props.route.params.currentDocumentId;
  console.log(currentDocumentId);
  console.log(backlogs);
  // console.log(backlog);

  // useEffect(()=>{

  //   const playSound = async() =>{
  //     const { sound } = await Audio.Sound.createAsync(
  //       { uri: "https://firebasestorage.googleapis.com/v0/b/tracko-f297a.appspot.com/o/audios%2F1702922662535.3gpp?alt=media&token=26022075-7a5f-4623-84bb-4fa02a24deb3" },
  //       { shouldPlay: true }
  //     );
  //     await sound.playAsync();
  //   }

  //     playSound()

  // },[])


  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissions, setPermissions] = useState(false);

  const route = useRoute();
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


  const onSend = useCallback((messages = []) => {


    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    if (messages[0].audio) {
      const { _id, createdAt, text, user } = messages[0];

      console.log('audio======', messages[0].user.downloadURL);
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        audio: messages[0].user.downloadURL,
        user,
        username: auth?.currentUser?.email.split('@')[0]
      });

      return

    } else {

      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        user,

      });
    }
  }, []);

  const renderMessage = props => {
    const { currentMessage } = props;
    if (currentMessage.user.downloadURL) console.log(currentMessage.user.downloadURL, "audi==========");
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

            <Text style={{ fontSize: 13 }}>{currentMessage.user.downloadURL ? <View>
              <TouchableOpacity onPress={async () => {
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
                    await Audio.requestPermissionsAsync()

                    if (currentMessage.user.downloadURL) {
                      const { sound } = await Audio.Sound.createAsync(
                        { uri: currentMessage.user.downloadURL },
                        { shouldPlay: true }
                      );
                      setSound(sound);
                      await sound.playAsync();
                    }



                  }
                } catch (error) {
                  console.log('Error:', error);
                }
              }}
              >
                <Text>
                  Play
                </Text>
              </TouchableOpacity>
            </View> : <Text>
              {currentMessage.text}
            </Text>}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleRevote = () => {
    console.log(backlog);
    deleteDoc(doc(database, 'current', currentDocumentId))
        .then(() => {

          console.log("Document successfully deleted!");
        }
        ).catch((error) => {
          console.error("Error removing document: ", error);
        });
    navigation.navigate('AssignStoryPoints', { backlog, revote: true, backlogs: backlogs });
  }

  const handleNext = () => {
    console.log(backlogs);
    const currentIndex = backlogs.findIndex((item) => item.product_backlog_id === backlog.product_backlog_id);

    if (currentIndex !== -1) {
      const currentIndexInArray = backlogs.findIndex((item) => item.product_backlog_id === backlogs[currentIndex].product_backlog_id);

      const nextIndex = currentIndexInArray + 1;
      deleteDoc(doc(database, 'current', currentDocumentId))
        .then(() => {

          console.log("Document successfully deleted!");
        }
        ).catch((error) => {
          console.error("Error removing document: ", error);
        });
      if (nextIndex < backlogs.length) {
        const nextElement = backlogs[nextIndex];
        console.log(nextElement);


        navigation.navigate('AssignStoryPoints', { backlog: nextElement, backlogs: backlogs });
      } else {
        console.log("No next element");
        deleteDoc(doc(database, 'current', currentDocumentId))
        .then(() => {

          console.log("Document successfully deleted!");
        }
        ).catch((error) => {
          console.error("Error removing document: ", error);
        });
        navigation.navigate('FinishScreen');
      }

    } else {
      console.log("Current backlog not found in array");
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={style.btn} onPress={() => handleRevote()}>
          <Text style={{ color: "white" }}>Re-Vote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.btn} onPress={() => handleNext()}>
          <Text style={{ color: "white" }}>Move to Next</Text>
        </TouchableOpacity>
      </View>
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
                          //play audio
                          sound.playAsync();
                          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);

                            const previousMessages = [{ _id: new Date().getTime(), createdAt: new Date(), audio: sound, user: { _id: auth?.currentUser?.email, avatar: 'https://i.pravatar.cc/300', downloadURL: downloadURL } }];
                            onSend(previousMessages);

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
    </View>
  );
}


const style = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowOpacity: .9,
    shadowRadius: 8,

  }
});