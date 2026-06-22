import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Calendar, Mail, Pencil, Settings, X,} from 'lucide-react'

function Perfil() {
  const navigate = useNavigate()

  const { user, signOut } = useAuth()

  const [configAberta, setConfigAberta] =
    useState(null)

  /* MODAL DE EDIÇÃO */
  const [editarPerfil, setEditarPerfil] =
    useState(false)

  const [nome, setNome] = useState('')

  const [bio, setBio] = useState(
    'Serva de Cristo, amante da música e da Palavra. Buscando viver cada dia para a glória de Deus. ✝️'
  )

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setNome(
        user?.user_metadata?.name ||
          user?.email?.split('@')[0] ||
          'Usuário'
      )
    }
  }, [user, navigate])

  if (!user) return null

  const atividades = [
    {
      id: 1,
      texto:
        'Publicou uma mensagem na comunidade',
      tempo: 'Há 2 horas',
    },

    {
      id: 2,
      texto:
        'Entrou na comunidade Jovens Cristãos',
      tempo: 'Há 1 dia',
    },

    {
      id: 3,
      texto:
        'Concluiu o módulo 2 do Curso de Música',
      tempo: 'Há 3 dias',
    },

    {
      id: 4,
      texto: 'Comprou: Bíblia de Estudo',
      tempo: 'Há 5 dias',
    },
  ]

  const configuracoes = [
    {
      id: 'privacidade',
      titulo:
        'Configurações de Privacidade',
    },

    {
      id: 'notificacoes',
      titulo: 'Notificações',
    },

    {
      id: 'seguranca',
      titulo: 'Segurança e Login',
    },
  ]
  return (
             <div
      style={{
        background: '#f5f2ea',
        minHeight: '100vh',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        {/* PERFIL */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1px solid #e8dfd3',
            boxShadow:
              '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '24px',
          }}
        >
          {/* CAPA */}
          <div
            style={{
              height: '130px',
              background: '#a97150',
            }}
          ></div>

          {/* CONTEÚDO */}
          <div
            style={{
              padding: '0 32px 30px',
            }}
          >
            {/* TOPO */}
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '20px',
                marginTop: '-55px',
              }}
            >
              {/* AVATAR + INFO */}
              <div
                style={{
                  display: 'flex',
                  gap: '18px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '18px',
                    background: '#d2a176',
                    border:
                      '4px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'center',
                    color: 'white',
                    fontSize: '42px',
                    fontWeight: '700',
                  }}
                >
                  {(
                    user?.email?.[0] || 'U'
                  ).toUpperCase()}
                </div>

                <div
                  style={{
                    paddingTop: '60px',
                  }}
                >
                  <h1
                    style={{
                      fontSize: '20px',
                      color: '#0f172a',
                      marginBottom: '4px',
                    }}
                  >
                    {nome}
                  </h1>

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '15px',
                    }}
                  >
                    @
                    {user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>

              {/* BOTÃO EDITAR */}
              <button
                onClick={() =>
                  setEditarPerfil(true)
                }
                style={{
                  marginTop: '80px',
                  background: '#7b4b2a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 22px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '15px',
                }}
              >
                <Pencil size={18} />
                Editar Perfil
              </button>
            </div>

            {/* BIO */}
            <div
              style={{
                marginTop: '26px',
              }}
            >
              <p
                style={{
                  color: '#334155',
                  lineHeight: '1.8',
                  marginBottom: '18px',
                  fontSize: '15px',
                }}
              >
                {bio}
              </p>

              {/* INFOS */}
              <div
                style={{
                  display: 'flex',
                  gap: '22px',
                  flexWrap: 'wrap',
                  color: '#64748b',
                  fontSize: '14px',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin size={16} />
                  São Paulo, SP
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Calendar size={16} />
                  Membro desde Janeiro 2026
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Mail size={16} />
                  {user?.email}
                </div>
              </div>

                          {/* ESTATÍSTICAS */}
              <div
                style={{
                  borderTop:
                    '1px solid #ebe5dc',
                  borderBottom:
                    '1px solid #ebe5dc',
                  padding: '28px 0',
                  display: 'flex',
                  justifyContent:
                    'space-around',
                  textAlign: 'center',
                }}
              >
                <div>
                  <h2
                    style={{
                      color: '#0f172a',
                      fontSize: '20px',
                      marginBottom: '4px',
                    }}
                  >
                    42
                  </h2>

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                    }}
                  >
                    Posts
                  </p>
                </div>

                <div>
                  <h2
                    style={{
                      color: '#0f172a',
                      fontSize: '20px',
                      marginBottom: '4px',
                    }}
                  >
                    234
                  </h2>

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                    }}
                  >
                    Seguidores
                  </p>
                </div>

                <div>
                  <h2
                    style={{
                      color: '#0f172a',
                      fontSize: '20px',
                      marginBottom: '4px',
                    }}
                  >
                    189
                  </h2>

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                    }}
                  >
                    Seguindo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ATIVIDADES */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '26px',
            border: '1px solid #e8dfd3',
            boxShadow:
              '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              color: '#0f172a',
              marginBottom: '28px',
            }}
          >
            Atividade Recente
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {atividades.map((atividade) => (
              <div
                key={atividade.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '18px 0',
                  borderBottom:
                    '1px solid #f1ece4',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#eadcc8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#7b4b2a',
                      borderRadius: '50%',
                    }}
                  ></div>
                </div>

                <div>
                  <p
                    style={{
                      color: '#334155',
                      fontSize: '15px',
                      marginBottom: '4px',
                    }}
                  >
                    {atividade.texto}
                  </p>

                  <span
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                    }}
                  >
                    {atividade.tempo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
                {/* CONFIGURAÇÕES */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '26px',
            border: '1px solid #e8dfd3',
            boxShadow:
              '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                color: '#0f172a',
              }}
            >
              Configurações
            </h2>

            <Settings
              size={20}
              color="#94a3b8"
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
          {configuracoes.map((config) => (
  <button
    key={config.id}
    onClick={() =>
      navigate(`/configuracoes/${config.id}`)
    }
    style={{
      background: '#f8f5ef',
      border: 'none',
      padding: '18px',
      borderRadius: '12px',
      textAlign: 'left',
      cursor: 'pointer',
      color: '#334155',
      fontSize: '15px',
      transition: '0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background =
        '#efe6da'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        '#f8f5ef'
    }}
  >
    {config.titulo}
  </button>
))}
            {/* SAIR */}
            <button
              onClick={signOut}
              style={{
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                color: 'red',
                fontSize: '16px',
                marginTop: '10px',
                cursor: 'pointer',
                padding: '8px 4px',
              }}
            >
              Sair da Conta
            </button>
          </div>
        </div>

        {/* MODAL EDITAR PERFIL */}
        {editarPerfil && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: '#fff',
                width: '90%',
                maxWidth: '450px',
                borderRadius: '18px',
                padding: '30px',
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: '25px',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: '#0f172a',
                  }}
                >
                  Editar Perfil
                </h2>

                <button
                  onClick={() =>
                    setEditarPerfil(false)
                  }
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* NOME */}
              <div
                style={{
                  marginBottom: '18px',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#334155',
                    fontWeight: '600',
                  }}
                >
                  Nome
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* BIO */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#334155',
                    fontWeight: '600',
                  }}
                >
                  Bio
                </label>

                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid #d1d5db',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* BOTÕES */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: '12px',
                  marginTop: '25px',
                }}
              >
                <button
                  onClick={() =>
                    setEditarPerfil(false)
                  }
                  style={{
                     padding:
                      '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#7b4b2a',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={() =>
                    setEditarPerfil(false)
                  }
                  style={{
                    padding:
                      '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#7b4b2a',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Perfil
  