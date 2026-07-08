import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Home,
  Users,
  Smile,
  ShoppingBag,
  GraduationCap,
  BookOpen,
  User,
  HeartHandshake,
  Menu,
  X
} from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const { user } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const links = [
    { nome: 'Início', path: '/', icon: <Home size={18} /> },
    { nome: 'Comunidades', path: '/comunidade', icon: <Users size={18} /> },
    { nome: 'Kids', path: '/kids', icon: <Smile size={18} /> },
    { nome: 'Loja', path: '/loja', icon: <ShoppingBag size={18} /> },
    { nome: 'Cursos', path: '/cursos', icon: <GraduationCap size={18} /> },
    { nome: 'Devocional', path: '/devocional', icon: <BookOpen size={18} /> },
    { nome: 'Perfil', path: '/perfil', icon: <User size={18} /> },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e8e2d8',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#f6ead8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e7d6bf',
            }}
          >
            <HeartHandshake size={20} color="#8B5A2B" />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                color: '#8B5A2B',
                fontSize: '20px',
                fontWeight: '700',
              }}
            >
              O Bom Samaritano
            </h1>
            <span
              style={{
                color: '#94a3b8',
                fontSize: '10px',
                display: 'block',
              }}
            >
              Fé • Comunidade • Conhecimento
            </span>
          </div>
        </Link>

        {/* 🔥 BOTÃO MENU MOBILE */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8B5A2B',
            padding: '8px',
            '@media (max-width: 1024px)': {
              display: 'block',
            }
          }}
          className="menu-mobile-btn"
        >
          {menuAberto ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navegação Desktop */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            '@media (max-width: 1024px)': {
              display: 'none',
            }
          }}
          className="nav-desktop"
        >
          {links.map((link) => {
            const ativo = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all .3s ease',
                  background: ativo ? '#f6ead8' : 'transparent',
                  color: ativo ? '#8B5A2B' : '#475569',
                  border: ativo ? '1px solid #d8c1a4' : '1px solid transparent',
                  boxShadow: ativo ? '0 4px 12px rgba(139,90,43,.12)' : 'none',
                  fontWeight: ativo ? '700' : '500',
                  fontSize: '14px',
                }}
              >
                {link.icon}
                {link.nome}
              </Link>
            )
          })}
        </nav>

        {/* Usuário Desktop */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              '@media (max-width: 1024px)': {
                display: 'none',
              }
            }}
            className="user-desktop"
          >
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                Bem-vindo
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {user.email}
              </p>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#8B5A2B,#B67B49)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(139,90,43,.25)',
                flexShrink: 0,
              }}
            >
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>

      {/* 🔥 MENU MOBILE */}
      {menuAberto && (
        <div
          style={{
            display: 'none',
            flexDirection: 'column',
            padding: '16px 20px',
            borderTop: '1px solid #e8e2d8',
            background: 'white',
            '@media (max-width: 1024px)': {
              display: 'flex',
            }
          }}
          className="nav-mobile"
        >
          {links.map((link) => {
            const ativo = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuAberto(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all .3s ease',
                  background: ativo ? '#f6ead8' : 'transparent',
                  color: ativo ? '#8B5A2B' : '#475569',
                  fontWeight: ativo ? '700' : '500',
                  fontSize: '15px',
                  borderBottom: '1px solid #f0ebe4',
                }}
              >
                {link.icon}
                {link.nome}
              </Link>
            )
          })}
          
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                marginTop: '8px',
                borderTop: '1px solid #e8e2d8',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#8B5A2B,#B67B49)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                  {user.email}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}