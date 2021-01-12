import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Image,
    Button,
    Modal,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AirbnbRating } from 'react-native-elements';
import colors from './config/colors';
import Comments from './components/comments/Comments';
// import * as ImagePicker from 'expo-image-picker';
// import { getData, storeData } from './utils/storage';
import { uploadPhoto } from './api/uploadPhoto';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import UploadScreen from './components/common/UploadScreen';
import {
    JOIN_ROOM,
    RECEIVE_MESSAGE,
    CONNECT,
    SEND_MESSAGE,
    CLOSE_CHAT,
    DELIVER_LOCATION,
    SHARE_LOCATION,
    TERMINATE_CHAT,
} from './config/events';
import { useSocket } from './providers/SocketProvider';
import { useMessages } from './providers/MessagesProvider';
import { styles } from './styles';

export default function Chat({ navigation, route }) {
    const {
        driver: { name: username, avatar, rate },
        owner: { name: recepient },
        id,
    } = route.params.item;

    const { socket } = useSocket();
    const { messages, sendMessages } = useMessages();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isVisible, setIsvisible] = useState(false);

    const [progress, setProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [location, setLocation] = useState({});

    React.useEffect(() => {
        socket.on(CONNECT, () => {
            console.log('connected from client');
        });

        socket.emit(JOIN_ROOM, { room: id, clientData: route.params.item });
        socket.on(CLOSE_CHAT, () => {
            navigation.goBack();
        });
    }, [id]);

    React.useEffect(() => {
        socket.on(RECEIVE_MESSAGE, (data) => {
            sendMessages(data, id);
        });
        return () => socket.off(RECEIVE_MESSAGE);
    }, [sendMessages]);



    let interval;
    React.useEffect(() => {

        socket.on(DELIVER_LOCATION, (data) => {
            if (data.id === id) {
                interval = setInterval(() => {
                    watchDriverLocation();
                    socket.emit(SHARE_LOCATION, { location, id })
                }, 2000);
            }
        });
        
        return () => {
            socket.off(DELIVER_LOCATION);
            clearInterval(interval);
        }
    }, [interval, location]);

    const handleSubmit = () => {
        if (message.length > 0 && message !== '') {
            socket.emit(SEND_MESSAGE, {
                message,
                room: id,
                dataType: 'text',
                sender: username,
                recepient,
            });
            sendMessages(
                {
                    text: message,
                    dataType: 'text',
                    sender: username,
                    recepient,
                    created: Date.now(),
                },
                id,
            );
            setMessage('');
        }
    };


    const watchDriverLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setLocation({ longitude: position.coords.longitude, latitude: position.coords.latitude })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    
    const openCamera = async () => {
        try {
            const result = await ImagePicker.openCamera({ width: 300, height: 400 });
            if (result) {
                setIsvisible(false);
                let filename = result.path.replace(/^.*[\\\/]/, '').split('.')[1];
                let imageData = {
                    uri: result.path,
                    type: result.mime,
                    name: `haderapp.${filename}`,
                };
                uploadImage(imageData)
            }
        } catch (error) {
            console.log('error reading an image', error);
        }
    }
    
    
    const selectImage = async () => {
        try {
            const result = await ImagePicker.openPicker({ width: 300, height: 400 });
    
            if (result) {
                setIsvisible(false);
                let filename = result.path.replace(/^.*[\\\/]/, '').split('.')[1];
                let imageData = {
                    uri: result.path,
                    type: result.mime,
                    name: `haderapp.${filename}`,
                };
                uploadImage(imageData)
            }
        } catch (error) {
            console.log('error reading an image', error);
        }
    };

    const uploadImage = (img) => {
        setProgress(0);
        setUploadProgress(true);
        uploadPhoto(img, (progress) => setProgress(progress)).then((result) => {
            socket.emit(SEND_MESSAGE, { message: result.data.url, room: id, dataType: 'image', sender: username, recepient });
            sendMessages({ text: result.data.url, dataType: 'image', sender: username, recepient, created: Date.now() }, id);
            setUploadProgress(false);
        });
    };

    const cancelOrder = () => {
        // navigation.navigate('HomeScreen');
        socket.emit(TERMINATE_CHAT);

    };

    return (
        <View style={styles.ChatContainer}>
            <UploadScreen progress={progress} visible={uploadProgress} />
            <View
                style={[
                    styles.chatHeader,
                    { display: 'flex', justifyContent: 'space-between' },
                ]}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: avatar }}
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            marginRight: 5,
                        }}
                    />
                    <View style={[styles.detailsContainer, { flexDirection: 'column' }]}>
                        <Text style={[styles.title, { color: '#333' }]} numberOfLines={1}>
                            {' '}
                            {username}{' '}
                        </Text>
                        <AirbnbRating
                            count={5}
                            defaultRating={rate}
                            showRating={false}
                            size={10}
                        />
                    </View>
                </View>

            </View>
            <View style={styles.chatBody}>
                <Comments messages={messages[id] || []} user={username} />
            </View>
            <View style={styles.chatControl}>
                <View style={styles.chatControlContainer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <FontAwesome
                                style={styles.icon}
                                name="ellipsis-h"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textControlContainer}>
                        <TextInput
                            style={styles.textControl}
                            onChangeText={(text) => setMessage(text)}
                            value={message}
                            onSubmitEditing={() => handleSubmit()}
                        />
                        <TouchableOpacity onPress={handleSubmit}>
                            <FontAwesome style={styles.sendIcon} name="send" size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => setIsvisible(true)}>
                            <FontAwesome
                                style={styles.icon}
                                name="paperclip"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsvisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.mediaItemsContainer}>
                        <AntDesign style={styles.closeIcon} name="close" size={24} onPress={() => setIsvisible(false)} />
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={selectImage}>
                                <View style={styles.mediaItem}>
                                    <FontAwesome name="photo" size={24} />
                                    <Text style={styles.mediaItemText}>  Gallery </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCamera}>
                                <View style={styles.mediaItem}>
                                    <FontAwesome name="camera" size={24} />
                                    <Text style={styles.mediaItemText}>  Camera </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                style={[styles.modalPreview, { marginTop: '50%' }]}
                animationType="slide"
                visible={modalVisible}>
                <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                    color="#4ecdc4"
                />
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={cancelOrder}>
                        <Text style={styles.modalItems}> Cancel </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

