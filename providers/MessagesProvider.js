import React, { useContext, useEffect, useState } from 'react'
import { getData, storeData } from '../utils/storage';

const MessagesContext = React.createContext();

export function useMessages() {
  return useContext(MessagesContext)
}

const MessagesProvider = ({children}) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        storeData('messages', []);
        // getData('messages')
        //     .then( records => records && records.length > 0 && setMessages(records));
    }, []);

    const sendMessages = (message) => {
        // getData('messages')
        //     .then( records => {
        //         if(records && records.length > 0) {
        //             storeData('messages', [...records, message]);
        //             setMessages([...records, message]);
        //         }else{
        //             storeData('messages', [message]);
        //             setMessages([message]);
        //         }
        //     })
        setMessages([...messages, message]);
        storeData('messages', [...messages, message]);
    } 

    return(
        <MessagesContext.Provider value={{messages, sendMessages}}>
            { children }
        </MessagesContext.Provider>
    );
}

export default MessagesProvider;