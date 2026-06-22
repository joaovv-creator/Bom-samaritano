import { Link, useLocation } from 'react-router-dom'
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
} from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const { user } = useAuth()

  const links = [
    {
      nome: 'Início',
      path: '/',
      icon: <Home size={18} />,
    },
    {
      nome: 'Comunidades',
      path: '/comunidade',
      icon: <Users size={18} />,
    },
    {
      nome: 'Kids',
      path: '/kids',
      icon: <Smile size={18} />,
    },
    {
      nome: 'Loja',
      path: '/loja',
      icon: <ShoppingBag size={18} />,
    },
    {
      nome: 'Cursos',
      path: '/cursos',
      icon: <GraduationCap size={18} />,
    },
    {
      nome: 'Devocional',
      path: '/devocional',
      icon: <BookOpen size={18} />,
    },
    {
      nome: 'Perfil',
      path: '/perfil',
      icon: <User size={18} />,
    },
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
          padding: '14px 40px',
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
            gap: '14px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#f6ead8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e7d6bf',
            }}
          >
            <HeartHandshake
              size={24}
              color="#8B5A2B"
            />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                color: '#8B5A2B',
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              O Bom Samaritano
            </h1>

            <span
              style={{
                color: '#94a3b8',
                fontSize: '12px',
              }}
            >
              Fé • Comunidade • Conhecimento
            </span>
          </div>
        </Link>

        {/* Navegação */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {links.map((link) => {
            const ativo =
              location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  transition: 'all .3s ease',

                  background: ativo
                    ? '#f6ead8'
                    : 'transparent',

                  color: ativo
                    ? '#8B5A2B'
                    : '#475569',

                  border: ativo
                    ? '1px solid #d8c1a4'
                    : '1px solid transparent',

                  boxShadow: ativo
                    ? '0 4px 12px rgba(139,90,43,.12)'
                    : 'none',

                  fontWeight: ativo
                    ? '700'
                    : '500',
                }}
              >
                {link.icon}
                {link.nome}
              </Link>
            )
          })}
        </nav>

        {/* Usuário */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#334155',
                  fontWeight: '600',
                }}
              >
                Bem-vindo
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#94a3b8',
                }}
              >
                {user.email}
              </p>
            </div>

            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg,#8B5A2B,#B67B49)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                boxShadow:
                  '0 4px 12px rgba(139,90,43,.25)',
              }}
            >
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}