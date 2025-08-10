

import React from 'react';
import ReactDOM from 'react-dom/client';
import {GoogleOAuthProvider} from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from 'react';


import './styles/index.css';
import reportWebVitals from './reportWebVitals.jsx';
import { AuthContextProvider } from './context/authContext.js';
import { Navbar, OptionBar } from './page/Navbar.jsx';
import { Auth } from './auth.jsx';
import { AuthContext } from './context/authContext.js';
import { GoogleAuth } from './GoogleAuth.jsx';
import { PageNotFound } from './page/PageNotFound.jsx';
import { Socket } from "./page/socket.jsx";

import { Chat } from "./page/chat.jsx";
import { Profile } from './page/profile.jsx';
import { ChatHead } from './page/groupchat.jsx';
import { useLogout } from './hooks/auth.js';
import { Test } from './test.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { Groups } from './page/Groups.jsx';
import { Story } from './page/story.jsx';

const Nantu = () => {
	
	
	return (
		<div>
			Hi Nantu
		</div>
	)
}

const Home = () => {
	
	const navigate = useNavigate()

	return (
		<div id="home" style={{ display: 'flex' }} >
			<nav style={{ borderRight: '2px solid var(--color4)' }} >
                
                <div className="navop" onClick={()=> navigate("/groups")} > Groups   </div>
                <div className='navop' onClick={()=> navigate('/profile') }  > Profile </div>
                <div className='navop' onClick={()=> navigate('/story') }  > Story </div>
            </nav>
			
			<Outlet />
			
		</div>
	)
}

function App() {
	const { user } = useContext( AuthContext );
	//console.log(user);

  	return (
		<>
			
			<Routes>
				<Route exact path="/" element={ user ? <Home/> : <Navigate to="/auth" /> } >
					<Route path='groups/' element={ <Groups /> }  ></Route>
					<Route path='profile/' element={ <Profile /> } ></Route>
					<Route path='story/' element={ <Story /> } ></Route>
				</Route>
				<Route exact path='/auth' element={ user ? <Navigate to="/" /> : <Auth /> } >  </Route>
				<Route exact path='/google-auth' element={ user ? <Navigate to="/" /> : <GoogleAuth /> } >  </Route>
				
				
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
