import { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { api } from '../api';


export const useAuth = () => {
    const { dispatch } = useContext(AuthContext);

    const signup = async (email, password) => {


        try {
            if( email==="" ) throw Error("Email is empty");
            if( password==="" ) throw Error("Password is empty");
            
            const response = await api.post("/auth/register" , 
                { email, password }
            );
			
		    dispatch({ type: "LOGIN", payload: response.data });

        } catch (err) {
            if( err.message ) alert( err.message )
            else alert( err.response.data.error )
        }
        
			
        
    }

    const login = async (email, password) => {
        try {
            if( email==="" ) throw Error("Email is empty");
            if( password==="" ) throw Error("Password is empty");
            
            const response = await api.post("/auth/login" , 
                { email, password }
            );
			
		    dispatch({ type: "LOGIN", payload: response.data });

        } catch (err) {
            if( err.message ) alert( err.message )
            else alert( err.response.data.error )
        }
    }


    const logout = () => {    
        dispatch({ type: 'LOGOUT' });
    }

    return { login, logout, signup }
    
}