

import { useState, useContext } from 'react'
import { loginURL, registerURL } from '../urls'
import { AuthContext } from '../context/authContext'


export const useSignup = () => {
    const { dispatch } = useContext(AuthContext);

    const signup = async (email, password) => {
        if( email==="" ) throw Error("Email is empty");
        if( password==="" ) throw Error("Password is empty");
        
        const response = await fetch(registerURL, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ email, password })
        });

        const json = await response.json();

        if (!response.ok) 
        {
            console.log(111);
            throw Error(json.error);
        }

        if (response.ok) {
			
			localStorage.setItem('user', JSON.stringify(json));
			dispatch({ type: "LOGIN", payload: json });
			
        }
    }

  	return { signup }
}


export const useLogin = () => {
    const { dispatch } = useContext(AuthContext);

    const login = async (email, password) => {
        if( email==="" ) throw Error("Email is empty");
        if( password==="" ) throw Error("Password is empty");

        const response = await fetch( loginURL , {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ email, password })
        });

        const json = await response.json();

        if (!response.ok) throw Error(json.error);

        if (response.ok) {
			
			localStorage.setItem('user', JSON.stringify(json));
			dispatch({ type: "LOGIN", payload: json });
			
        }
    }

  	return { login }
}



export const useLogout =  () => {
    const { dispatch } = useContext(AuthContext)


    const logout = () => {    
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    }

  return { logout }
}