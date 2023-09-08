import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface IProtectedRoute {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
    const location = useLocation()
    const cookie = JSON.parse(localStorage?.getItem('loggedUser') as string)

    if (!cookie) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
