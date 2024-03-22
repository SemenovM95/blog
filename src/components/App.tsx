import { RouterProvider, ScrollRestoration } from 'react-router-dom'

import router from 'src/router/routerView.tsx'

import styles from './App.module.scss'

// TODO: fix types
function App() {
  return (
    <div className={styles.App}>
      <RouterProvider router={router}>
        <ScrollRestoration />
      </RouterProvider>
    </div>
  )
}

export default App
