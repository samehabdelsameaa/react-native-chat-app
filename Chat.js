import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-elements';
import colors from '../config/colors';
import Comments from './components/comments/Comments';
import * as ImagePicker from 'expo-image-picker';
import { getData, storeData } from './utils/storage';
import Modal from '../components/Modal';
import { Button } from 'react-native';
import Screen from '../components/Screen';
import routes from '../navigation/routes';
import { uploadPhoto } from './api/uploadPhoto';
import UploadScreen from './components/common/UploadScreen';
import { JOIN_ROOM, RECEIVE_MESSAGE, CONNECT, SEND_MESSAGE, CLOSE_CHAT } from './config/events';
import { requestImagePermission } from './utils/permissions';
import { useSocket } from './providers/SocketProvider';
import { useMessages } from './providers/MessagesProvider';

export default function Chat({ navigation, route }) {
    // console.log('data', route.params.item);
    const { username, id, type, room, client } = route.params.item;

    const { socket, cid } = useSocket();
    const { messages, sendMessages } = useMessages();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [progress, setProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(false);

    if (type === "user") {
        cid = id;
    };

    React.useEffect(() => {
        requestImagePermission();
    }, []);


    React.useEffect(() => {
        socket.on(CONNECT, () => {
            console.log('connected from client');
        });

        socket.emit(JOIN_ROOM, { room: cid, clientData: route.params.item });
        socket.on(DELIVER_LOCATION, (data) => {
            sendMessages(data);
        });

        socket.on(CLOSE_CHAT, () => {
            if (type === 'user') {
                navigation.navigate(routes.ORDERS, { status: 'clear' });
            } else {
                navigation.navigate(routes.DRIVERS);
            }
        })

    }, [cid]);

    React.useEffect(() => {
        socket.on(RECEIVE_MESSAGE, (data) => {
            sendMessages(data);
        });

        return () => socket.off(RECEIVE_MESSAGE)
    }, [sendMessages]);

    const handleSubmit = () => {
        let targetRoom = type === "driver" ? id : room;
        let sender = type === "driver" ? client : username;
        let recepient = type === "driver" ? username : client;

        if (message.length > 0 && message !== '') {
            socket.emit(SEND_MESSAGE, { message, room: targetRoom, dataType: 'text', sender, recepient });
            sendMessages({ text: message, dataType: 'text', sender, recepient, created: Date.now() });
            setMessage('');
        }
    }


    let avatar = require("../assets/mosh.jpg");

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled) {
                let imageData = {
                    uri: result.uri,
                    type: `haderapp/${result.uri.split('.')[1]}`,
                    name: `haderapp.${result.uri.split('.')[1]}`
                };
                uploadImage(imageData);
            }
        } catch (error) {
            console.log('error reading an image');
        }
    }

    const uploadImage = (img) => {
        let targetRoom = type === "driver" ? id : room;
        let sender = type === "driver" ? client : username;
        let recepient = type === "driver" ? username : client;

        setProgress(0);
        setUploadProgress(true);
        uploadPhoto(img, (progress) => setProgress(progress))
            .then(result => {
                socket.emit(SEND_MESSAGE, { message: result.data.url, room: targetRoom, dataType: 'image', sender, recepient });
                sendMessages({ text: result.data.url, dataType: 'image', sender, recepient, created: Date.now() });
                setUploadProgress(false);
            })
    }

    const cancelOrder = () => {
        storeData('messages', []);
        socket.emit(TERMINATE_CHAT);
    }

    return (
        <View style={styles.ChatContainer}>
            <UploadScreen progress={progress} visible={uploadProgress} />
            <View style={styles.chatHeader}>
                <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 5 }} />
                <View style={[styles.detailsContainer, { flexDirection: 'column' }]}>
                    <Text style={styles.title, { color: '#333' }} numberOfLines={1}> {username} </Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={11}
                        showRating={false}
                        size={10}
                    />
                </View>
                <TouchableOpacity style={{alignItems: 'flex-end'}}>
                    <FontAwesome5 name="map-marker-alt" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.chatBody}>
                <Comments messages={messages} user={type === "driver" ? client : username} />
            </View>
            <View style={styles.chatControl}>
                <View style={styles.chatControlContainer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <FontAwesome5 style={styles.icon} name="ellipsis-h" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textControlContainer}>
                        <TextInput style={styles.textControl}
                            onChangeText={text => setMessage(text)}
                            value={message}
                            onSubmitEditing={() => handleSubmit()}
                        />
                        <TouchableOpacity onPress={handleSubmit}>
                            <FontAwesome style={styles.sendIcon} name="send" size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={selectImage}>
                            <FontAwesome5 style={styles.icon} name="camera" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                style={[styles.modalPreview, { marginTop: '50%' }]}
                animationType="slide"
                visible={modalVisible}
            >
                <Screen>
                    <Button title="Close" onPress={() => setModalVisible(false)} color="#4ecdc4" />
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={cancelOrder}>
                            <Text style={styles.modalItems}> Cancel </Text>
                        </TouchableOpacity>
                    </View>
                </Screen>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    ChatContainer: {
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    chatHeader: {
        backgroundColor: colors.secondary,
        flexDirection: 'row',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
        elevation: 4
    },
    chatBody: {
        flex: 6,
        backgroundColor: '#f5f5f5',
    },
    chatControl: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopColor: '#dedede',
        backgroundColor: '#eee',
        padding: 7,
        borderTopWidth: 1,
    },
    textControlContainer: {
        flex: 6,
        alignItems: "center",
        justifyContent: "center",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingLeft: 30
    },
    textControl: {
        height: 40,
        width: '100%',
    },
    chatControlContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around"
    },
    icon: {
        color: '#999',
    },
    sendIcon: {
        color: colors.secondary,
        marginRight: 30,
        borderLeftColor: '#999', borderLeftWidth: 1, paddingLeft: 7
    },
    iconContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalPreview: {
        marginTop: '100%',
    },
    modalItems: {
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingBottom: 7,
        width: '100%',
        fontSize: 22,
        paddingTop: 30,
    }
});
