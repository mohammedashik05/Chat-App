import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import { Toaster } from "react-hot-toast";

import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import Updatepass from './components/Updatepass.jsx';
import Chat from './Chat.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';   // <-- Add this

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/updatepass', element: <Updatepass /> },

  // 🔒 PROTECTED CHAT ROUTE
  {
    path: '/Chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" />

  </StrictMode>
);
