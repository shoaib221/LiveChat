

import React from 'react';
import ReactDOM from 'react-dom/client';
import {GoogleOAuthProvider} from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from 'react';


import './styles/index.css';
import reportWebVitals from './reportWebVitals.js';
import { AuthContextProvider } from './context/authContext.js';
import { Navbar, OptionBar } from './page/Navbar';
import { Auth } from './auth.jsx';
import { AuthContext } from './context/authContext';
import { GoogleAuth } from './GoogleAuth.jsx';
import { PageNotFound } from './page/PageNotFound';
import { Socket } from "./page/socket";

import { Chat } from "./page/chat";
import { Media } from './page/media.jsx';
import { Profile } from './page/profile.jsx';
import { Html } from './page/html.jsx';
import { FormDataDemo } from './page/FormData.jsx';
import { ChatHead } from './page/groupchat.jsx';
import { useLogout } from './hooks/auth.js';
import { Test } from './test.jsx';

const Home = () => {
	const { logout } = useLogout()
	
	return (
		<div id="home">
			
			<Link to='/livechat'  >Chat</Link>
			<button onClick={logout} > Log Out </button>
		</div>
	)
}

function App() {
	const { user } = useContext( AuthContext );
	//console.log(user);

  	return (
		<>
			
			<Routes>
				<Route exact path="/" element={ user? <Home/> :  <Navigate to='/auth' /> } ></Route>
				<Route exact path='/auth' element={ user ? <Navigate to="/" /> : <Auth /> } >  </Route>
				<Route exact path='/google-auth' element={ user ? <Navigate to="/" /> : <GoogleAuth /> } >  </Route>
				
				<Route exact path='/livechat' element={ user ? <ChatHead /> : <Navigate to="/auth" /> } ></Route>
				<Route exact path='/test' element={ <Test /> } ></Route>
				<Route path='*' element={ <PageNotFound/> } ></Route>
			</Routes>

			

		</>
  	);

}


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render (
  	
	<AuthContextProvider>
		<GoogleOAuthProvider clientId='538256178695-tshpqhedtonoe5psm1uf0c94heg065uh.apps.googleusercontent.com' >
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</GoogleOAuthProvider>
	</AuthContextProvider>
  	
);

reportWebVitals();
