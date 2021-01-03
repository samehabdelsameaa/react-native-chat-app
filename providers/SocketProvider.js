import React, { Children, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { setting } from '../config/constants';
import { getData, storeData } from '../utils/storage';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext)
}

const SocketProvider = ({children}) => {
    const [cid, setCid] = useState('');
    const [socket, setSocket] = useState();

    useEffect(() => {
        getData('cid')
            .then( str => setCid(str));
    }, []);

    const updateCid = (id) => {
        setCid(id);
        storeData('cid', id);
    }

    useEffect(() => {
        const newSocket = io(setting.SOCKET_ENDPOINT);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [setting.SOCKET_ENDPOINT, cid]);

    return(
        <SocketContext.Provider value={{socket, cid, updateCid}}>
            { children }
        </SocketContext.Provider>
    );
}

export default SocketProvider;