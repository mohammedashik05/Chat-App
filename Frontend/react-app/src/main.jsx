import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.jsx'; // Home page
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import Updatepass from './components/Updatepass.jsx';
import Chat from './Chat.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/updatepass', element: <Updatepass /> },
  { path: '/Chat',  element :<Chat /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


//CreatebrowserRouter 
// is used for navigation like when the page load into the webpage the browser will get all the funtion and request from the server .
//if i want to navigate no another page by click a link or href mean it will send an request to server each time which cause wiat time and referesh but 
//but using browerrouter it will get all access from the server and using we dont to request the server for all the time , browser router will take care of it

//RouterProvieder is used to give a way to communicate with the another page content without req the server
