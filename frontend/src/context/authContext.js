

import { createContext, useReducer, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { api } from '../api';

export const AuthContext = createContext();


export const authReducer = (state, action) => {
    if (action.type === 'LOGIN') {
        localStorage.setItem('user', JSON.stringify(action.payload));
        return { user: action.payload };
    }
    else if ( action.type === 'LOGOUT' ) {
        localStorage.removeItem('user');
        return { user: null };
    }
    else return state;
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });
    const [ socket, setSocket ] = useState(null);

    function connectSocket () {
        
        const client = io( 'http://localhost:4000', {
            query: {
                auth: `Bearer ${state.user.token}`
            }
        } )
        setSocket( client );
    }
    

    async function  Init() {
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if(!user) return;
            
            const response = await api.get("/auth/init", {
                headers: {'Authorization': `Bearer ${user.token}`}
            });
            dispatch({ type: 'LOGIN', payload: user });

        } catch (err) {
            dispatch( { type: 'LOGOUT' } );
            if(err.message) alert(err.message);
        }
    }

    useEffect(() => {  
        Init();
    }, [])

    useEffect(() => {
        if( state.user ) connectSocket();
    }, [state.user] )

    //console.log('AuthContext state:', state)
    
    return (
        <AuthContext.Provider value={{ ...state, dispatch, socket }}>
        { children }
        </AuthContext.Provider>
    )

}

