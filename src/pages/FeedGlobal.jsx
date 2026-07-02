// src/pages/FeedGlobal.jsx
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { postService } from '../services/postService'
import Swal from 'sweetalert2'
import {
  Heart,
  MessageCircle,
  Share2,
  Megaphone,
  CalendarDays,
  Send,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  X,
  Trash2,
  ZoomIn,
  Users,
  FileText,
  Activity,
  Cross,
  Church,
  BookOpen,
  Clock
} from 'lucide-react'

export default function FeedGlobal() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [novoPost, setNovoPost] = useState('')
  const [tipoPost, setTipoPost] = useState(null)
  const [mostrarComentarios, setMostrarComentarios] = useState({})
  const [novoComentario, setNovoComentario] = useState({})
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mensagemModal, setMensagemModal] = useState('')
  const [tipoModal, setTipoModal] = useState('success')
  const [postando, setPostando] = useState(false)
  const [imagensSelecionadas, setImagensSelecionadas] = useState([])
  const [uploadingImagens, setUploadingImagens] = useState(false)
  const [imagemZoom, setImagemZoom] = useState(null)
  const fileInputRef = useRef(null)
  const [deletando, setDeletando] = useState({})

  useEffect(() => {
    carregarPosts()
  }, [])

  const carregarPosts = async () => {
    try {
      setLoading(true)
      const postsData = await postService.getPosts()
      
      if (user) {
        const postsComCurtidas = await Promise.all(
          postsData.map(async (post) => {
            const curtido = await postService.verificarCurtida(post.id, user.id)
            return { ...post, curtido }
          })
        )
        setPosts(postsComCurtidas)
      } else {
        setPosts(postsData)
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      mostrarModalPersonalizado('Erro ao carregar posts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const mostrarModalPersonalizado = (mensagem, tipo = 'success') => {
    setMensagemModal(mensagem)
    setTipoModal(tipo)
    setMostrarModal(true)
  }

  const handleSelecionarImagens = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      mostrarModalPersonalizado('Máximo de 5 imagens por post', 'error')
      return
    }

    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setImagensSelecionadas(prev => [...prev, ...previews])
    e.target.value = ''
  }

  const removerImagemSelecionada = (index) => {
    setImagensSelecionadas(prev => {
      const novas = [...prev]
      URL.revokeObjectURL(novas[index].preview)
      novas.splice(index, 1)
      return novas
    })
  }

  const handlePublicar = async () => {
    if (!user) {
      mostrarModalPersonalizado('Faça login para publicar!', 'error')
      return
    }

    if (!novoPost.trim() && imagensSelecionadas.length === 0) {
      mostrarModalPersonalizado('Digite uma mensagem ou adicione uma imagem!', 'error')
      return
    }

    try {
      setPostando(true)
      setUploadingImagens(true)

      let imageUrls = []
      if (imagensSelecionadas.length > 0) {
        const files = imagensSelecionadas.map(item => item.file)
        const result = await postService.uploadImagens(files, user.id)
        imageUrls = result.urls
        
        if (result.errors.length > 0) {
          mostrarModalPersonalizado(`Algumas imagens não foram enviadas: ${result.errors.join(', ')}`, 'error')
        }
      }

      const postData = {
        user_id: user.id,
        autor: user?.name || user?.email?.split('@')[0] || 'Usuário',
        avatar: (user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase(),
        conteudo: novoPost || 'Post com imagem',
        tipo: tipoPost || 'outros',
        imagens: imageUrls
      }

      const novoPostObj = await postService.criarPost(postData)
      
      setPosts([{
        ...novoPostObj,
        curtidas: 0,
        comentarios: 0,
        curtido: false,
        comentariosLista: []
      }, ...posts])

      setNovoPost('')
      setTipoPost(null)
      setImagensSelecionadas([])
      mostrarModalPersonalizado('Post publicado com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao publicar:', error)
      mostrarModalPersonalizado(`Erro ao publicar: ${error.message}`, 'error')
    } finally {
      setPostando(false)
      setUploadingImagens(false)
    }
  }

  const handleDeletarPost = async (postId) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'Faça login para deletar posts!',
        confirmButtonColor: '#8b5e3c',
      })
      return
    }

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá desfazer esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      setDeletando(prev => ({ ...prev, [postId]: true }))
      await postService.deletarPost(postId, user.id)
      setPosts(posts.filter(post => post.id !== postId))
      
      Swal.fire({
        icon: 'success',
        title: 'Deletado!',
        text: 'O post foi removido com sucesso.',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      })
    } catch (error) {
      console.error('Erro ao deletar:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível deletar o post: ${error.message}`,
        confirmButtonColor: '#8b5e3c',
      })
    } finally {
      setDeletando(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleDeletarImagem = async (postId, imageUrl) => {
    const result = await Swal.fire({
      title: 'Remover imagem?',
      text: 'Esta imagem será removida do post.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      await postService.deletarImagem(postId, imageUrl, user.id)
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            imagens: post.imagens.filter(url => url !== imageUrl)
          }
        }
        return post
      }))

      Swal.fire({
        icon: 'success',
        title: 'Removida!',
        text: 'Imagem removida com sucesso.',
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      })
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível remover a imagem: ${error.message}`,
        confirmButtonColor: '#8b5e3c',
      })
    }
  }

  const handleCurtir = async (postId) => {
    if (!user) {
      mostrarModalPersonalizado('Faça login para curtir!', 'error')
      return
    }

    try {
      const resultado = await postService.toggleCurtida(postId, user.id)
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            curtidas: resultado.curtido ? post.curtidas + 1 : post.curtidas - 1,
            curtido: resultado.curtido
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Erro ao curtir:', error)
      mostrarModalPersonalizado('Erro ao curtir post', 'error')
    }
  }

  const handleComentar = async (postId) => {
    if (!user) {
      mostrarModalPersonalizado('Faça login para comentar!', 'error')
      return
    }

    const comentario = novoComentario[postId]
    if (!comentario?.trim()) {
      mostrarModalPersonalizado('Digite um comentário!', 'error')
      return
    }

    try {
      const novoComentarioObj = await postService.adicionarComentario(
        postId,
        user.id,
        user?.name || 'Usuário',
        comentario
      )

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comentarios: post.comentarios + 1,
            comentariosLista: [...post.comentariosLista, novoComentarioObj]
          }
        }
        return post
      }))

      setNovoComentario({ ...novoComentario, [postId]: '' })
    } catch (error) {
      console.error('Erro ao comentar:', error)
      mostrarModalPersonalizado('Erro ao comentar', 'error')
    }
  }

  const handleCompartilhar = async (postId) => {
    if (!user) {
      mostrarModalPersonalizado('Faça login para compartilhar!', 'error')
      return
    }

    try {
      await postService.compartilharPost(postId, user.id)
      const url = `${window.location.origin}/post/${postId}`
      
      if (navigator.share) {
        await navigator.share({
          title: 'Compartilhar post',
          text: 'Veja este post no nosso aplicativo!',
          url: url
        })
      } else {
        await navigator.clipboard.writeText(url)
        mostrarModalPersonalizado('Link copiado para a área de transferência!', 'success')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error)
        mostrarModalPersonalizado('Erro ao compartilhar', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f2ea' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f2ea', minHeight: 'calc(100vh - 70px)', padding: '24px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* ============================================ */}
        {/* BANNER - Feed da Comunidade Cristã */}
        {/* ============================================ */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5e3c, #b57a4b)',
          borderRadius: '20px',
          padding: '40px 36px',
          color: 'white',
          marginBottom: '28px',
          boxShadow: '0 12px 40px rgba(139, 94, 60, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Elemento decorativo - cruz sutil */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            fontSize: '180px',
            opacity: 0.06,
            color: 'white',
            transform: 'rotate(15deg)',
            pointerEvents: 'none',
            fontFamily: 'serif',
          }}>
            ✝
          </div>
          
          {/* Elementos decorativos - círculos */}
          <div style={{
            position: 'absolute',
            left: '-60px',
            bottom: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            right: '40px',
            bottom: '-80px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Tag da comunidade */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 16px 6px 12px',
              borderRadius: '100px',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)',
            }}>
              <Church size={18} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', opacity: 0.9 }}>
                Comunidade de Fé
              </span>
            </div>

            {/* Título principal */}
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              Feed da Comunidade
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              margin: '0 0 4px 0',
              fontWeight: '400',
              lineHeight: 1.6,
            }}>
              Compartilhe mensagens, fotos, anúncios e atividades com todos os membros.
            </p>

            {/* Versículo bíblico inspirador */}
            <div style={{
              marginTop: '14px',
              padding: '12px 18px',
              background: 'rgba(255,255,255,0.10)',
              borderRadius: '12px',
              borderLeft: '3px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              maxWidth: '500px',
            }}>
              <p style={{
                fontSize: '14px',
                fontStyle: 'italic',
                margin: 0,
                opacity: 0.9,
                lineHeight: 1.6,
              }}>
                "Porque onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles"
              </p>
              <p style={{
                fontSize: '13px',
                margin: '4px 0 0 0',
                opacity: 0.7,
                fontWeight: '300',
              }}>
                — Mateus 18:20
              </p>
            </div>

            {/* Estatísticas rápidas */}
            <div style={{
              display: 'flex',
              gap: '28px',
              marginTop: '18px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>458 membros</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{posts.length} posts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>Comunidade ativa</span>
              </div>
            </div>
          </div>
        </div>

        {/* PUBLICAR */}
        <div style={{
          background: 'white',
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '24px',
          border: '1px solid #e7dfd4',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <textarea
            value={novoPost}
            onChange={(e) => setNovoPost(e.target.value)}
            placeholder="Compartilhe uma mensagem de fé..."
            rows="2"
            style={{
              width: '100%',
              height: '70px',
              resize: 'none',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid #d9cfc0',
              background: '#f1ebe2',
              fontSize: '15px',
              outline: 'none',
              color: '#000000',
              marginBottom: '16px',
            }}
          />

          {/* Pré-visualização das imagens */}
          {imagensSelecionadas.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {imagensSelecionadas.map((item, index) => (
                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img
                    src={item.preview}
                    alt={`Preview ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <button
                    onClick={() => removerImagemSelecionada(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTipoPost(tipoPost === 'anuncio' ? null : 'anuncio')}
                style={{
                  border: tipoPost === 'anuncio' ? '2px solid #ea580c' : '1px solid #d9cfc0',
                  background: tipoPost === 'anuncio' ? '#fde7d2' : 'transparent',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <Megaphone size={18} color={tipoPost === 'anuncio' ? '#ea580c' : '#475569'} />
                Anúncio
              </button>

              <button
                onClick={() => setTipoPost(tipoPost === 'atividade' ? null : 'atividade')}
                style={{
                  border: tipoPost === 'atividade' ? '2px solid #16a34a' : '1px solid #d9cfc0',
                  background: tipoPost === 'atividade' ? '#dcfce7' : 'transparent',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <CalendarDays size={18} color={tipoPost === 'atividade' ? '#16a34a' : '#475569'} />
                Atividade
              </button>

              <button
                onClick={() => setTipoPost(tipoPost === 'outros' ? null : 'outros')}
                style={{
                  border: tipoPost === 'outros' ? '2px solid #6b7280' : '1px solid #d9cfc0',
                  background: tipoPost === 'outros' ? '#f3f4f6' : 'transparent',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <Send size={18} color={tipoPost === 'outros' ? '#6b7280' : '#475569'} />
                Outros
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1px solid #d9cfc0',
                  background: 'transparent',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <ImageIcon size={18} />
                Imagem
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelecionarImagens}
                style={{ display: 'none' }}
              />
            </div>

            <button
              onClick={handlePublicar}
              disabled={postando || uploadingImagens}
              style={{
                background: '#8b5e3c',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: (postando || uploadingImagens) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: (postando || uploadingImagens) ? 0.7 : 1,
              }}
            >
              {postando || uploadingImagens ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {postando ? 'Publicando...' : uploadingImagens ? 'Enviando imagens...' : 'Publicar'}
            </button>
          </div>
        </div>

        {/* POSTS */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '18px', color: '#64748b' }}>
            <p style={{ fontSize: '18px' }}>Nenhum post ainda. Seja o primeiro a publicar!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: 'white',
                borderRadius: '18px',
                padding: '24px',
                marginBottom: '20px',
                border: '1px solid #e7dfd4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative',
              }}
            >
              {/* Botão Deletar */}
              {user && post.user_id === user.id && (
                <button
                  onClick={() => handleDeletarPost(post.id)}
                  disabled={deletando[post.id]}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    cursor: deletando[post.id] ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    opacity: deletando[post.id] ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {deletando[post.id] ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              )}

              {/* TOPO */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
                <div style={{
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
                }}>
                  {post.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>
                      {post.autor}
                    </h3>

                    {post.tipo === 'anuncio' && (
                      <span style={{ background: '#fde7d2', color: '#ea580c', padding: '4px 10px', borderRadius: '999px', fontSize: '12px' }}>
                        Anúncio
                      </span>
                    )}
                    {post.tipo === 'atividade' && (
                      <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '999px', fontSize: '12px' }}>
                        Atividade
                      </span>
                    )}
                    {post.tipo === 'outros' && (
                      <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: '999px', fontSize: '12px' }}>
                        Outros
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                    {new Date(post.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* TEXTO */}
              {post.conteudo && (
                <p style={{ color: '#334155', lineHeight: '1.8', fontSize: '17px', marginBottom: '20px' }}>
                  {post.conteudo}
                </p>
              )}

              {/* IMAGENS */}
              {post.imagens && post.imagens.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: post.imagens.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                  gap: '10px',
                  marginBottom: '20px',
                }}>
                  {post.imagens.map((imgUrl, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                      <img
                        src={imgUrl}
                        alt={`Post ${index + 1}`}
                        style={{
                          width: '100%',
                          height: post.imagens.length === 1 ? '400px' : '200px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onClick={() => setImagemZoom(imgUrl)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {user && post.user_id === user.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletarImagem(post.id, imgUrl)
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.8)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e7dfd4', marginBottom: '18px' }} />

              {/* AÇÕES */}
              <div style={{ display: 'flex', gap: '26px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleCurtir(post.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: post.curtido ? '#dc2626' : '#475569',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  <Heart size={21} fill={post.curtido ? '#dc2626' : 'none'} />
                  {post.curtidas}
                </button>

                <button
                  onClick={() => setMostrarComentarios({
                    ...mostrarComentarios,
                    [post.id]: !mostrarComentarios[post.id],
                  })}
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
                  <MessageCircle size={21} />
                  {post.comentarios}
                </button>

                <button
                  onClick={() => handleCompartilhar(post.id)}
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
              {mostrarComentarios[post.id] && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      value={novoComentario[post.id] || ''}
                      onChange={(e) => setNovoComentario({
                        ...novoComentario,
                        [post.id]: e.target.value,
                      })}
                      placeholder="Escreva um comentário..."
                      style={{
                        color: 'black',
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #d9cfc0',
                        background: '#ffffff',
                        outline: 'none',
                      }}
                    />

                    <button
                      onClick={() => handleComentar(post.id)}
                      style={{
                        background: '#8b5e3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0 18px',
                        cursor: 'pointer',
                      }}
                    >
                      Enviar
                    </button>
                  </div>

                  {post.comentariosLista?.map((comentario) => (
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
                      <strong style={{ color: '#000000' }}>{comentario.autor}</strong>
                      <p style={{ margin: '6px 0 0 0', color: '#334155' }}>
                        {comentario.conteudo}
                      </p>
                      <small style={{ color: '#64748b', fontSize: '12px' }}>
                        {new Date(comentario.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODAL DE ZOOM */}
      {imagemZoom && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            cursor: 'pointer',
          }}
          onClick={() => setImagemZoom(null)}
        >
          <img
            src={imagemZoom}
            alt="Zoom"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
          <button
            onClick={() => setImagemZoom(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ✕
          </button>
        </div>
      )}

      {/* MODAL DE FEEDBACK */}
      {mostrarModal && (
        <div style={{
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
        }}>
          <div style={{
            background: '#fff',
            padding: '35px',
            borderRadius: '20px',
            width: '420px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: tipoModal === 'success' ? '#dff5e5' : '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: tipoModal === 'success' ? '#22c55e' : '#dc2626',
            }}>
              {tipoModal === 'success' ? <Check size={40} /> : <AlertCircle size={40} />}
            </div>

            <h2 style={{ color: '#8b5e3c', marginBottom: '10px' }}>
              {tipoModal === 'success' ? 'Sucesso!' : 'Atenção'}
            </h2>

            <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '25px' }}>
              {mensagemModal}
            </p>

            <button
              onClick={() => setMostrarModal(false)}
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