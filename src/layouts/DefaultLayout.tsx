import { Outlet } from 'react-router-dom'

import Header from 'components/Header/Header.tsx'
import { AuthProvider } from 'src/hooks/useAuth.tsx'

import style from './DefaultLayout.module.scss'

export default function DefaultLayout() {
  return (
    <AuthProvider>
      <Header />
      <section className={style.contentWrapper}>
        <Outlet />
      </section>
    </AuthProvider>
  )
}
