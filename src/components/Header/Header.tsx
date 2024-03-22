import { Link } from 'react-router-dom'

import useAuth from 'src/hooks/useAuth.tsx'
import Spinner from 'components/ui/Spinner.tsx'

import style from './Header.module.scss'

function Header() {
  const { isAuth, logout, isLoadingUser, user } = useAuth()

  return (
    <header className={style.header}>
      <Link to="/" className={style.header__logo}>
        Realworld Blog
      </Link>
      {(isAuth && (
        <>
          <Link
            to="/new-article"
            type="button"
            className={`${style.header__button} ${style.header__buttonSuccess} ${style.header__buttonSmall}`}
          >
            Create Article
          </Link>
          <Link to="/profile" className={`${style.header__button} ${style.header__profile}`}>
            {isLoadingUser ? (
              <Spinner size="sm" />
            ) : (
              <>
                <span>{user?.username || 'Profile'}</span>
                <img
                  className={style.header__profileImg}
                  src={user?.image || '/Default_avatar.svg' || 'https://api.realworld.io/images/smiley-cyrus.jpeg'}
                  alt="Profile"
                />
              </>
            )}
          </Link>
          <button type="button" className={style.header__button} onClick={logout}>
            Log Out
          </button>
        </>
      )) || (
        <>
          <Link to="/sign-in" className={style.header__button}>
            Sign in
          </Link>
          <Link to="/sign-up" className={`${style.header__button} ${style.header__buttonSuccess}`}>
            Sign up
          </Link>
        </>
      )}
    </header>
  )
}

export default Header
