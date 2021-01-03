import React, { useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CommentText from './commentTypes/CommentText';
import CommentButton from './commentTypes/CommentButton';
import CommentImage from './commentTypes/CommentImage';


const Comments = ({ user, messages }) => {
    let flatList = useRef(null);
    return (
        <View>
            <FlatList
                ref={flatList}
                onContentSizeChange={() => flatList.current.scrollToEnd()}
                data={messages}
                keyExtractor={(message) => message.created.toString()}
                renderItem={({ item }) => (
                    <CommentItem
                        message={item.text}
                        username={item.sender}
                        created={item.created}
                        name={user}
                        dataType={item.dataType}
                    />
                )}
            />
        </View>
    );
}

export default Comments;

const CommentItem = ({ message, username, dataType, created, name }) => {
    let currentUser = false;
    let currentTime = new Date(created);

    if (username.toLowerCase().trim() === name.toLowerCase().trim()) {
        currentUser = true;
    }

    return (
        <View style={{paddingRight: 15, paddingLeft: 15}}>
            {
            dataType && dataType === 'image'
                ?
                <CommentImage
                    currentUser={currentUser}
                    message={message}
                    messageTime={currentTime}
                />
                :
                dataType && dataType === 'button'
                    ?
                    <CommentButton
                        currentUser={currentUser}
                        message={message}
                        messageTime={currentTime}
                    />
                    :
                    <CommentText
                        currentUser={currentUser}
                        message={message}
                        messageTime={currentTime}
                    />
            }
        </View>

    )
}

const styles = StyleSheet.create({});