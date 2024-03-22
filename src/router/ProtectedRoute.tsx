import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import useAuth from 'src/hooks/useAuth.tsx'
import Spinner from 'components/ui/Spinner.tsx'

export default function ProtectedRoute({ element }: { element: ReactNode }) {
  const { isAuth, isLoadingLogin, isLoadingUser } = useAuth()

  useEffect(() => {
    console.log('from route: ', isAuth)
  })

  if (isLoadingLogin || isLoadingUser) {
    return <Spinner centered />
  }

  if (!isAuth) {
    return <Navigate to="/login" />
  }
  return element
}
