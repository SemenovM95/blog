import { createBrowserRouter, Navigate } from 'react-router-dom'

import ArticleList from 'src/components/ArticleList/ArticleList.tsx'
import Article from 'components/Article/Article.tsx'
import DefaultLayout from 'src/layouts/DefaultLayout.tsx'
import LoginForm from 'components/LoginForm/LoginForm.tsx'
import RegisterForm from 'components/RegisterForm/RegisterForm.tsx'
import ProfileForm from 'components/ProfileForm/ProfileForm.tsx'
import ArticleForm from 'components/ArticleForm/ArticleForm.tsx'
import ProtectedRoute from 'src/router/ProtectedRoute.tsx'

// TODO: refactor routes

const routes = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/articles" replace />,
      },
    ],
  },
  {
    path: '/articles',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <ArticleList />,
      },
      {
        path: ':id',
        element: <Article fullSize />,
      },
      {
        path: ':slug/edit',
        element: <ProtectedRoute element={<ArticleForm isEditing />} />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <LoginForm />,
      },
    ],
  },
  {
    path: '/sign-up',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <RegisterForm />,
      },
    ],
  },
  {
    path: '/profile',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<ProfileForm />} />,
      },
    ],
  },
  {
    path: '/new-article',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<ArticleForm />} />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/articles" replace />,
    errorElement: <Navigate to="/articles" replace />,
  },
]

export default createBrowserRouter(routes)
