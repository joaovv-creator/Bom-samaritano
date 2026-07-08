import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Calendar, Mail, Pencil, X, Camera, User } from 'lucide-react'
import Swal from 'sweetalert2'
import { uploadAvatar } from '../services/uploadService'

function Perfil() {
  const navigate = useNavigate()
  const { user, signOut, atualizarAvatar } = useAuth()

  /* MODAL DE EDIÇÃO */
  const [editarPerfil, setEditarPerfil] = useState(false)
  const [nome, setNome] = useState('')
  const [bio, setBio] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState(null) // URL da foto
  const [fotoArquivo, setFotoArquivo] = useState(null) // Arquivo para upload
  const [carregando, setCarregando] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setNome(
        user?.user_metadata?.name ||
          user?.email?.split('@')[0] ||
          'Usuário'
      )
      // Carregar foto do perfil se existir
      if (user?.avatar_url) {
        setFotoPerfil(user.avatar_url)
      }
    }
  }, [user, navigate])

  if (!user) return null

  const atividades = [
    {
      id: 1,
      texto: 'Publicou uma mensagem na comunidade',
      tempo: 'Há 2 horas',
    },
    {
      id: 2,
      texto: 'Entrou na comunidade Jovens Cristãos',
      tempo: 'Há 1 dia',
    },
    {
      id: 3,
      texto: 'Concluiu o módulo 2 do Curso de Música',
      tempo: 'Há 3 dias',
    },
    {
      id: 4,
      texto: 'Comprou: Bíblia de Estudo',
      tempo: 'Há 5 dias',
    },
  ]

  const handleFotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Por favor, selecione uma imagem válida (JPG, PNG, etc.)',
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'OK',
      })
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Arquivo muito grande',
        text: 'A imagem deve ter no máximo 5MB.',
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'OK',
      })
      return
    }

    // Criar URL para preview
    const url = URL.createObjectURL(file)
    setFotoPerfil(url)
    setFotoArquivo(file)
  }

  const salvarPerfil = async () => {
    try {
      setCarregando(true)

      let avatarUrl = null

      // Se tiver uma nova foto para fazer upload
      if (fotoArquivo) {
        // Faz upload da foto para o Supabase Storage
        avatarUrl = await uploadAvatar(user.id, fotoArquivo)
        
        // Atualiza o perfil no banco com a URL da foto
        await atualizarAvatar(user.id, avatarUrl)
      }

      // Se tiver alterações no nome ou bio, salvar também
      // Por enquanto, apenas fechamos o modal

      await Swal.fire({
        icon: 'success',
        title: 'Perfil atualizado!',
        text: 'Suas informações foram salvas com sucesso.',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'OK',
      })
      
      setEditarPerfil(false)
      setFotoArquivo(null) // Limpar o arquivo após salvar
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: error.message || 'Não foi possível salvar as alterações. Tente novamente.',
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'OK',
      })
    } finally {
      setCarregando(false)
    }
  }

  const handleSair = async () => {
    const result = await Swal.fire({
      title: 'Deseja sair?',
      text: 'Você será desconectado da sua conta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      await signOut()
      navigate('/login')
    }
  }

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
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '24px',
          }}
        >
          {/* CAPA */}
          <div
            style={{
              height: '130px',
              background: 'linear-gradient(135deg, #8b5e3c, #b57a4b)',
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
                justifyContent: 'space-between',
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
                  alignItems: 'center',
                }}
              >
                {/* AVATAR COM OPÇÃO DE ALTERAR */}
                <div
                  style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    borderRadius: '18px',
                    border: '4px solid white',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  onClick={handleFotoClick}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.foto-overlay')
                    if (overlay) overlay.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.foto-overlay')
                    if (overlay) overlay.style.opacity = '0'
                  }}
                >
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt="Foto de perfil"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#d2a176',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '42px',
                        fontWeight: '700',
                      }}
                    >
                      {(user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                  )}

                  {/* OVERLAY PARA TROCAR FOTO */}
                  <div
                    className="foto-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <Camera size={28} />
                    <span style={{ fontSize: '12px', marginTop: '4px' }}>
                      Alterar foto
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    style={{ display: 'none' }}
                  />
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
                    @{user?.email?.split('@')[0]}
                  </p>
                </div>
              </div>

              {/* BOTÃO EDITAR */}
              <button
                onClick={() => setEditarPerfil(true)}
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
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#6b3f2a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#7b4b2a'}
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
              {bio ? (
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
              ) : (
                <p
                  style={{
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    marginBottom: '18px',
                    fontSize: '15px',
                  }}
                >
                  Nenhuma bio adicionada ainda. Clique em "Editar Perfil" para adicionar uma.
                </p>
              )}

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
                  <Mail size={16} />
                  {user?.email}
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
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
                  borderBottom: '1px solid #f1ece4',
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
                    justifyContent: 'center',
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

        {/* BOTÃO SAIR */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '20px 26px',
            border: '1px solid #e8dfd3',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleSair}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc2626',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '12px 30px',
              borderRadius: '12px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Sair da Conta
          </button>
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
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditarPerfil(false)
            }}
          >
            <div
              style={{
                background: '#fff',
                width: '90%',
                maxWidth: '450px',
                borderRadius: '18px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
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
                  onClick={() => setEditarPerfil(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={22} />
                </button>
              </div>

              {/* FOTO DE PERFIL NO MODAL */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #e8dfd3',
                    cursor: 'pointer',
                  }}
                  onClick={handleFotoClick}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.modal-foto-overlay')
                    if (overlay) overlay.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.modal-foto-overlay')
                    if (overlay) overlay.style.opacity = '0'
                  }}
                >
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt="Foto de perfil"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#d2a176',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '36px',
                        fontWeight: '700',
                      }}
                    >
                      <User size={40} />
                    </div>
                  )}

                  <div
                    className="modal-foto-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      borderRadius: '50%',
                    }}
                  >
                    <Camera size={24} />
                    <span style={{ fontSize: '10px', marginTop: '2px' }}>
                      Alterar
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={handleFotoClick}
                >
                  Clique para alterar a foto
                </span>
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
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    color: '#000',
                    background: '#ffffff',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
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
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva algo sobre você..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    color: '#000',
                    background: '#ffffff',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* BOTÕES */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '25px',
                }}
              >
                <button
                  onClick={() => setEditarPerfil(false)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    background: 'transparent',
                    color: '#334155',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Cancelar
                </button>

                <button
                  onClick={salvarPerfil}
                  disabled={carregando}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#7b4b2a',
                    color: '#fff',
                    cursor: carregando ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    opacity: carregando ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!carregando) e.currentTarget.style.background = '#6b3f2a'
                  }}
                  onMouseLeave={(e) => {
                    if (!carregando) e.currentTarget.style.background = '#7b4b2a'
                  }}
                >
                  {carregando ? 'Salvando...' : 'Salvar'}
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