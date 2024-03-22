import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as Store } from 'react-redux'

import App from 'components/App.tsx'
import store from 'src/store/store.ts'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Store store={store}>
      <App />
    </Store>
  </React.StrictMode>
)
