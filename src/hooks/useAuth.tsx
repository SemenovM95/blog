import { useState, useCallback, createContext, useContext, ReactNode, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation, UserData, AuthData, useLazyGetCurrentUserQuery } from 'src/services/RWBService.ts'

const authData = () => {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | false>(false)
  const [user, setUser] = useState<UserData | null>(null)

  const [userLogin, { isLoading: isLoadingLogin }] = useLoginMutation()
  const [getUserData, { isLoading: isLoadingUser }] = useLazyGetCurrentUserQuery()

  const loginUser = async (data: AuthData): Promise<boolean> => {
    setIsAuth(false)
    setAuthError(false)
    return userLogin(data)
      .unwrap()
      .then((res) => {
        if (res) {
          const { token: userToken } = res as unknown as UserData
          localStorage.setItem('token', userToken)
          setUser(res)
          setIsAuth(true)
        }
        return true
      })
      .catch((err) => {
        setAuthError(err)
        throw new Error(err)
      })
  }

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setIsAuth(false)
    setUser(null)
    navigate('/')
  }
  const getToken = useCallback(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }, [isAuth])

  useLayoutEffect(() => {
    const findToken = getToken()
    setIsAuth(!!findToken)
    if (findToken && !user) {
      getUserData(findToken)
        .unwrap()
        .then((res) => setUser(() => res))
        .then(() => console.log('user:', user))
    }
    console.log('from context: ', isAuth)
  }, [])

  return { logout, loginUser, getToken, isAuth, isLoadingLogin, authError, user, isLoadingUser }
}

interface AuthContextProps {
  isAuth: boolean
  authError: string | false
  loginUser: (data: AuthData) => Promise<boolean>
  logout: () => void
  getToken: () => string | null
  isLoadingLogin: boolean
  isLoadingUser: boolean
  user: UserData | null
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = authData()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
