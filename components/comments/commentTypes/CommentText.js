import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CommentText = ({ currentUser, message, messageTime }) => {
    return (
        currentUser
            ?
            <View style={[styles.comment, styles.right, styles.commentDialogRight]}>
                <View>
                    <Text style={[styles.commentDialog, styles.right, styles.commentRight]}>
                        {message}
                    </Text>
                    <Text style={[styles.commentSeen, styles.right]}>
                        <MaterialIcons name="check" style={styles.seenIcon} />
                            seen {`${messageTime.getHours()} : ${messageTime.getMinutes()} `}
                    </Text>
                </View>
            </View>
            :
            <View style={[styles.comment, styles.left]}>
                <Text style={[styles.commentDialog, styles.commentLeft]}>  {message}  </Text>
                <Text style={styles.commentSeen}>
                    seen {`${messageTime.getHours()} : ${messageTime.getMinutes()} `}
                    <MaterialIcons name="check" style={styles.seenIcon} />
                </Text>
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
})

export default CommentText;