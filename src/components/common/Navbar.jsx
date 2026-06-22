import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileMenuRef = useRef(null)

  // Fechar menu do perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Pegar usuário do localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = !!localStorage.getItem('user')

  const navItems = [
    { path: '/', label: 'Início' },
    { path: '/comunidade', label: 'Comunidades' },
    { path: '/kids', label: 'Kids' },
    { path: '/loja', label: 'Loja' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/devocional', label: 'Devocional' },
    { path: '/perfil', label: 'Perfil' },
  ]

  const isActive = (path) => location.pathname === path

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
    setProfileMenuOpen(false)
  }

  // Se não estiver logado, não mostra o navbar
  if (!isLoggedIn) {
    return null
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      borderBottom: '1px solid #eaeef2'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#3498db',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>✝️</span>
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
              O Bom Samaritano
            </span>
          </Link>

          {/* BARRA DE PESQUISA (Desktop) */}
          <form onSubmit={handleSearch} style={{ display: 'none', flex: 1, maxWidth: '400px', margin: '0 20px' }} className="search-desktop">
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar na comunidade..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: '#f0f2f5',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }}>
                🔍
              </span>
            </div>
          </form>

          {/* LINKS DESKTOP */}
          <div style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive(item.path) ? '600' : '400',
                  color: isActive(item.path) ? '#3498db' : '#7f8c8d',
                  background: isActive(item.path) ? '#ebf5fb' : 'transparent'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ÁREA DO USUÁRIO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Menu do Perfil */}
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '20px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#3498db',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {user.nome?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '13px', color: '#2c3e50', display: 'none' }} className="user-name">
                  {user.nome?.split(' ')[0] || user.email?.split('@')[0] || 'Usuário'}
                </span>
              </button>

              {/* Dropdown do Perfil */}
              {profileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '220px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #eaeef2',
                  zIndex: 50
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #eaeef2' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                      {user.nome || 'Usuário'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#95a5a6' }}>{user.email}</p>
                  </div>
                  
                  <Link to="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '13px', color: '#2c3e50' }}>
                    👤 Meu Perfil
                  </Link>
                  
                  <div style={{ borderTop: '1px solid #eaeef2', margin: '4px 0' }}></div>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#e74c3c',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid #eaeef2',
          background: 'white',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* Barra de pesquisa mobile */}
          <form onSubmit={handleSearch} style={{ padding: '12px 16px', borderBottom: '1px solid #eaeef2' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  background: '#f0f2f5',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            </div>
          </form>
          
          <div style={{ padding: '8px 0' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  color: isActive(item.path) ? '#3498db' : '#2c3e50',
                  background: isActive(item.path) ? '#ebf5fb' : 'transparent'
                }}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div style={{ borderTop: '1px solid #eaeef2', margin: '8px 0' }}></div>
            
            <Link to="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '15px', color: '#2c3e50' }}>
              👤 Meu Perfil
            </Link>
            
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#e74c3c',
                width: '100%',
                textAlign: 'left'
              }}
            >
              🚪 Sair
            </button>
          </div>
        </div>
      )}

      {/* Estilos CSS para responsividade */}
      <style>{`
        @media (min-width: 768px) {
          .search-desktop {
            display: flex !important;
          }
          .nav-desktop {
            display: flex !important;
          }
          .user-name {
            display: inline !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar;