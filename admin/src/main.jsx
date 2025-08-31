import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { AuthProvider } from "../src/context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthProvider>
     <Provider store={store}>
    <App />
    </Provider>
    </AuthProvider>
  // </React.StrictMode>
)