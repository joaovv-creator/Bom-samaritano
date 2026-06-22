import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {

  const usuarioLogado = true

  if (!usuarioLogado) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute