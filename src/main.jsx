import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './store/StoreConfig.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
         </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
