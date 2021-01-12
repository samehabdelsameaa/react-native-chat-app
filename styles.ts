import { StyleSheet } from "react-native";
import i18n from "../../i18n";
import colors from "./config/colors";

console.log('logged from styles ', (i18n.dir() === 'rtl'));


export const styles = StyleSheet.create({
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
        elevation: 4,
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
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: i18n.dir() === 'rtl' ? 'row-reverse' : 'row',
        justifyContent: 'space-around',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        direction: 'rtl',
        paddingLeft: i18n.dir() === 'rtl' ? 30 : 30,
        paddingRight: i18n.dir() === 'rtl' ? 30 : 0,
    },
    textControl: {
        height: 40,
        width: '100%',
    },
    chatControlContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    icon: {
        color: '#999',
    },
    closeIcon: {
        color: '#999',
        padding: 20,
    },
    mediaItem: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#dedede',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    sendIcon: {
        color: colors.secondary,
        marginRight: i18n.dir() === 'rtl' ? 30 : 30,
        marginLeft: i18n.dir() === 'rtl' ? -5 : 0,
        borderLeftColor: '#999',
        borderRightColor: '#999',
        borderLeftWidth: i18n.dir() === 'rtl' ? 1 : 1,
        paddingRight: i18n.dir() === 'rtl' ? 8 : 0,
        paddingLeft: 7,
        transform: i18n.dir() === 'rtl' ? [{rotateY: '180deg'}] : [{rotateY: '360deg'}],
    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    mediaItemText: {
        fontSize: 10,
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    mediaItemsContainer: {
        width: '100%',
        height: 250,
        elevation: 5,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
});