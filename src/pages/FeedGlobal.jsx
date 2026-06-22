import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Heart,
  MessageCircle,
  Share2,
  Megaphone,
  CalendarDays,
  Send,
} from 'lucide-react'

export default function FeedGlobal() {
  const { user } = useAuth()

  const [posts, setPosts] = useState([
    {
      id: 1,
      autor: 'Maria Silva',
      avatar: 'M',
      tempo: 'Há 2 horas',
      tipo: null,
      conteudo:
        'Bom dia, irmãos! Que o Senhor abençoe cada um de vocês neste novo dia. "Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele." Salmos 118:24',
      curtidas: 42,
      comentarios: 8,
      curtido: false,
      comentariosLista: [],
    },

    {
      id: 2,
      autor: 'João Santos',
      avatar: 'J',
      tempo: 'Há 5 horas',
      tipo: 'anuncio',
      conteudo:
        'Culto de oração hoje às 19h! Venham todos participar. Local: Igreja Central',
      curtidas: 28,
      comentarios: 5,
      curtido: false,
      comentariosLista: [],
    },

    {
      id: 3,
      autor: 'Ana Costa',
      avatar: 'A',
      tempo: 'Há 1 dia',
      tipo: 'atividade',
      conteudo:
        'Grupo de estudo bíblico toda quarta-feira às 20h. Estamos estudando o livro de Atos. Interessados, entrar em contato!',
      curtidas: 35,
      comentarios: 12,
      curtido: false,
      comentariosLista: [],
    },
  ])

  const [novoPost, setNovoPost] =
    useState('')

  const [tipoPost, setTipoPost] =
    useState(null)

  const [mostrarComentarios,
    setMostrarComentarios] = useState({})

  const [novoComentario,
    setNovoComentario] = useState({})

    const [mostrarModal, setMostrarModal] =
  useState(false)

const [mensagemModal, setMensagemModal] =
  useState('')

  const handleCurtir = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,

            curtidas: post.curtido
              ? post.curtidas - 1
              : post.curtidas + 1,

            curtido: !post.curtido,
          }
        }

        return post
      })
    )
  }

  const handlePublicar = () => {
    if (!novoPost.trim()) {
     setMensagemModal(
  'Digite uma mensagem para publicar!'
)

setMostrarModal(true)
      return
    }

    const novoPostObj = {
      id: posts.length + 1,

      autor:
        user?.name ||
        user?.email?.split('@')[0] ||
        'Você',

      avatar: (
        user?.name?.[0] ||
        user?.email?.[0] ||
        'V'
      ).toUpperCase(),

      tempo: 'Agora mesmo',

      tipo: tipoPost,

      conteudo: novoPost,

      curtidas: 0,

      comentarios: 0,

      curtido: false,

      comentariosLista: [],
    }

    setPosts([novoPostObj, ...posts])

    setNovoPost('')

    setTipoPost(null)

   setMensagemModal('Post publicado com sucesso!')
   setMostrarModal(true)
  }

  const handleComentar = (postId) => {
    const comentario =
      novoComentario[postId]

    if (!comentario?.trim()) {
      alert('Digite um comentário!')

      return
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,

            comentarios:
              post.comentarios + 1,

            comentariosLista: [
              ...post.comentariosLista,

              {
                id: Date.now(),

                autor:
                  user?.name ||
                  'Você',

                conteudo: comentario,

                tempo: 'Agora mesmo',
              },
            ],
          }
        }

        return post
      })
    )

    setNovoComentario({
      ...novoComentario,

      [postId]: '',
    })
  }

  return (
    <div
      style={{
        background: '#f5f2ea',
        minHeight:
          'calc(100vh - 70px)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
        }}
      >
        {/* PUBLICAR */}
        <div
          style={{
            background: 'white',
            borderRadius: '18px',
            padding: '18px',
            marginBottom: '24px',
            border:
              '1px solid #e7dfd4',
            boxShadow:
              '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <textarea
            value={novoPost}
            onChange={(e) =>
              setNovoPost(e.target.value)
            }
            placeholder="Compartilhe uma mensagem de fé..."
            rows="2"
            style={{
              width: '100%',
              height: '70px',
              resize: 'none',
              padding: '14px',
              borderRadius: '14px',
              border:
                '1px solid #d9cfc0',
              background: '#f1ebe2',
              fontSize: '15px',
              outline: 'none',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '20px',
              }}
            >
              <button
                onClick={() =>
                  setTipoPost('anuncio')
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                <Megaphone size={18} />
                Anúncio
              </button>

              <button
                onClick={() =>
                  setTipoPost(
                    'atividade'
                  )
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                <CalendarDays size={18} />
                Atividade
              </button>
            </div>

            <button
              onClick={handlePublicar}
              style={{
                background: '#8b5e3c',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Send size={18} />
              Publicar
            </button>
          </div>
        </div>

        {/* POSTS */}
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '24px',
              marginBottom: '20px',
              border:
                '1px solid #e7dfd4',
              boxShadow:
                '0 2px 8px rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* TOPO */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#a9714d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '300',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {post.avatar}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: '#0f172a',
                      fontSize: '18px',
                    }}
                  >
                    {post.autor}
                  </h3>

                  {post.tipo ===
                    'anuncio' && (
                    <span
                      style={{
                        background:
                          '#fde7d2',
                        color: '#ea580c',
                        padding:
                          '4px 10px',
                        borderRadius:
                          '999px',
                        fontSize: '12px',
                      }}
                    >
                      Anúncio
                    </span>
                  )}

                  {post.tipo ===
                    'atividade' && (
                    <span
                      style={{
                        background:
                          '#dcfce7',
                        color: '#16a34a',
                        padding:
                          '4px 10px',
                        borderRadius:
                          '999px',
                        fontSize: '12px',
                      }}
                    >
                      Atividade
                    </span>
                  )}
                </div>

                <p
                  style={{
                    margin: '4px 0 0 0',
                    color: '#64748b',
                    fontSize: '14px',
                  }}
                >
                  {post.tempo}
                </p>
              </div>
            </div>

            {/* TEXTO */}
            <p
              style={{
                color: '#334155',
                lineHeight: '1.8',
                fontSize: '17px',
                marginBottom: '20px',
              }}
            >
              {post.conteudo}
            </p>

            <hr
              style={{
                border: 'none',
                borderTop:
                  '1px solid #ececec',
                marginBottom: '18px',
              }}
            />

            {/* AÇÕES */}
            <div
              style={{
                display: 'flex',
                gap: '26px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() =>
                  handleCurtir(post.id)
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: post.curtido
                    ? '#dc2626'
                    : '#475569',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                <Heart size={21} />
                {post.curtidas}
              </button>

              <button
                onClick={() =>
                  setMostrarComentarios({
                    ...mostrarComentarios,

                    [post.id]:
                      !mostrarComentarios[
                        post.id
                      ],
                  })
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                <MessageCircle
                  size={21}
                />
                {post.comentarios}
              </button>

              <button
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                <Share2 size={21} />
                Compartilhar
              </button>
            </div>

            {/* COMENTÁRIOS */}
            {mostrarComentarios[
              post.id
            ] && (
              <div
                style={{
                  marginTop: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <input
                    type="text"
                    value={
                      novoComentario[
                        post.id
                      ] || ''
                    }
                    onChange={(e) =>
                      setNovoComentario({
                        ...novoComentario,

                        [post.id]:
                          e.target.value,
                      })
                    }
                    placeholder="Escreva um comentário..."
                    style={{
                      flex: 1,
                      padding:
                        '12px 14px',
                      borderRadius:
                        '10px',
                      border:
                        '1px solid #d9cfc0',
                      background:
                        '#f8f5ef',
                      outline: 'none',
                    }}
                  />

                  <button
                    onClick={() =>
                      handleComentar(
                        post.id
                      )
                    }
                    style={{
                      background:
                        '#8b5e3c',
                      color: 'white',
                      border: 'none',
                      borderRadius:
                        '10px',
                      padding:
                        '0 18px',
                      cursor: 'pointer',
                    }}
                  >
                    Enviar
                  </button>
                </div>

                {post.comentariosLista.map(
                  (comentario) => (
                    <div
                      key={comentario.id}
                      style={{
                        background: '#f8f5ef',
                        border: '1px solid #d9cfc0',
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '10px',
                      }}
                    >
                        <strong
                      style={{
                        color: '#000000',
                      }}
                    >
                        {
                          comentario.autor
                        }
                      </strong>

                      <p
                        style={{
                          margin:
                            '6px 0 0 0',
                          color:
                            '#334155',
                        }}
                      >
                        {
                          comentario.conteudo
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>


      {mostrarModal && (
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
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: '#fff',
        padding: '35px',
        borderRadius: '20px',
        width: '420px',
        textAlign: 'center',
        boxShadow:
          '0 10px 30px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: '#dff5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#22c55e',
        }}
      >
        ✓
      </div>

      <h2
        style={{
          color: '#8b5e3c',
          marginBottom: '10px',
        }}
      >
        Atenção
      </h2>

      <p
        style={{
          color: '#64748b',
          fontSize: '18px',
          marginBottom: '25px',
        }}
      >
        {mensagemModal}
      </p>

      <button
        onClick={() =>
          setMostrarModal(false)
        }
        style={{
          background: '#8b5e3c',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 28px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  )
}
