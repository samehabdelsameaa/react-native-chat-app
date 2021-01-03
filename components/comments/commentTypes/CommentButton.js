import React, { useState } from 'react';
import { View, Image, Text, TouchableHighlight, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from '../../../../components/Modal';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import Screen from '../../../../components/Screen';

const CommentButton = ({ currentUser, message, messageTime }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        currentUser
            ?
            <View style={[styles.renderImage, styles.right, { display: 'flex', flex: 1, flexDirection: 'row-reverse' }]}>
                <Modal
                    style={styles.imagePreview}
                    animationType="slide"
                    visible={modalVisible}
                >
                    <Screen>
                        <Button title="Close" onPress={() => setModalVisible(false)} color="#4ecdc4" />
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        </View>
                    </Screen>
                </Modal>
                <TouchableHighlight onPress={() => setModalVisible(true)}>
                    <View>
                        <Text style={[styles.commentDialog, styles.right, styles.borderedRight]}>
                            {'MY Location'}
                        </Text>
                        <Text style={[styles.commentSeen, styles.right]}>
                            <MaterialIcons name="check" style={styles.seenIcon} />
                        seen {`${messageTime.getHours()} : ${messageTime.getMinutes()} `}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
            :
            <View style={[styles.renderImage, styles.left]}>
                <Modal
                    style={styles.imagePreview}
                    animationType="slide"
                    visible={modalVisible}
                >

                    <Button title="Close" onPress={() => setModalVisible(false)} color="#4ecdc4" />
                    <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MapView
                            style={StyleSheet.absoluteFillObject}
                            provider={MapView.PROVIDER_GOOGLE}
                            initialRegion={{
                                latitude: message.latitude,
                                longitude: message.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker coordinate={{ latitude: message.latitude, longitude: message.longitude }} />
                        </MapView>
                    </View>
                </Modal>
                <TouchableHighlight onPress={() => setModalVisible(true)}>
                    <View>
                        <Text style={[styles.commentDialog, styles.borderedLeft]}>  {'Driver Location'}  </Text>
                        <Text style={styles.commentSeen}>
                            <MaterialIcons name="check" style={styles.seenIcon} />
                            seen {`${messageTime.getHours()} : ${messageTime.getMinutes()} `}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
    );
}

const styles = StyleSheet.create({
    comment: {
        margin: 10,
        maxWidth: '100%',
        alignItems: "flex-start",
    },
    commentDialog: {
        backgroundColor: '#139bd1',
        padding: 12,
        paddingRight: 32,
        paddingLeft: 32,
        color: '#fff',
        borderRadius: 10,
    },
    commentSeen: {
        color: '#999',
        fontSize: 11,
        marginRight: 5,
        marginLeft: 5,
    },
    right: {
        textAlign: 'right',
    },
    left: {
        textAlign: 'left',
        writingDirection: 'ltr',
    },
    commentDialogRight: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row-reverse'
    },
    commentRight: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 25,
        elevation: 2,
    },
    commentLeft: {
        backgroundColor: '#fff',
        color: '#666',
        borderWidth: 0.5,
        borderColor: '#f3f3f3',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 25,
        elevation: 2,
    },
    imagePreview: {
        width: 300, height: 400, 
        borderWidth: 3, 
        borderColor: '#dedede',
    },
    imageThumbnail: {
        width: 200, 
        height: 200, 
        borderWidth: 3, 
        borderColor: '#dedede', 
    }
})

export default CommentButton;