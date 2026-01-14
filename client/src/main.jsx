import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider.jsx'
import LoaderContextProvider from './context/LoaderContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <LoaderContextProvider>
            <App />
          </LoaderContextProvider>
        </SnackbarProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
