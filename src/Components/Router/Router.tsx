import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from '../../App'
import ProtectedRoute from '../ProtectedRoute'
import Login from '../../Pages/Login'
import Register from '../../Pages/Register'

const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
    },

    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]

export const router = createBrowserRouter(routes)
