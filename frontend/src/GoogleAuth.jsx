
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from './api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import { useContext } from 'react';
import { Auth } from './auth';

export const GoogleAuth = () => {
    const navigate = useNavigate();
	const { dispatch } = useContext(AuthContext);

    const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				
				console.log( "code", authResult.code );
				const result = await googleAuth(authResult.code);
				const {email, token} = result.data;
				const obj = {email, token};
				localStorage.setItem('user',JSON.stringify(obj));
				dispatch( { type: "LOGIN", payload: obj } );
				//console.log("success");
				navigate('/');
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e.message);
		}
	};

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code"
    })

    return <button id="google" onClick={googleLogin}> Enter With Google </button>
        
    
}

