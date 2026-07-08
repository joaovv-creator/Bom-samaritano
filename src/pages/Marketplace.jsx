import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Star,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  BookOpen,
  Activity,
  Users,
  Sparkles,
  Loader2,
  PlusCircle,
  Image as ImageIcon
} from 'lucide-react'

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { adminService } from '../services/adminService'
import { AdminModal } from '../components/AdminModal'
import Swal from 'sweetalert2'
import Navbar from '../components/common/Navbar'

function Marketplace() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    carrinho,
    adicionarAoCarrinho,
    aumentarQuantidade,
    diminuirQuantidade,
    removerDoCarrinho,
    total,
  } = useCart()

  const [abrirCarrinho, setAbrirCarrinho] = useState(false)
  const [categoria, setCategoria] = useState('todos')
  const [busca, setBusca] = useState('')
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalCriarOpen, setModalCriarOpen] = useState(false)
  const [deletando, setDeletando] = useState({})
  const [carregandoAdmin, setCarregandoAdmin] = useState(true)

  useEffect(() => {
    carregarProdutos()
    verificarAdmin()
  }, [])

  const verificarAdmin = async () => {
    try {
      setCarregandoAdmin(true)
      if (user) {
        const admin = await adminService.isAdmin(user.id)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error)
      setIsAdmin(false)
    } finally {
      setCarregandoAdmin(false)
    }
  }

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const dados = await adminService.getProdutos()
      setProdutos(dados || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar os produtos.',
        confirmButtonColor: '#8b5e3c',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCriarProduto = async (dados) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem criar produtos.',
        confirmButtonColor: '#8b5e3c',
      })
      return
    }

    try {
      const novoProduto = await adminService.criarProduto(dados)
      setProdutos(prev => [...prev, novoProduto])
      
      Swal.fire({
        icon: 'success',
        title: 'Produto criado!',
        text: `"${novoProduto.nome}" foi adicionado com sucesso.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      })
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível criar o produto.',
        confirmButtonColor: '#8b5e3c',
      })
      throw error
    }
  }

  const handleDeletarProduto = async (id, nome) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem deletar produtos.',
        confirmButtonColor: '#8b5e3c',
      })
      return
    }

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a deletar "${nome}". Esta ação não pode ser desfeita!`,
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
      setDeletando(prev => ({ ...prev, [id]: true }))
      await adminService.deletarProduto(id)
      setProdutos(prev => prev.filter(p => p.id !== id))
      
      Swal.fire({
        icon: 'success',
        title: 'Deletado!',
        text: `"${nome}" foi removido.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      })
    } catch (error) {
      console.error('Erro ao deletar:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível deletar o produto.',
        confirmButtonColor: '#8b5e3c',
      })
    } finally {
      setDeletando(prev => ({ ...prev, [id]: false }))
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const matchCategoria = categoria === 'todos' || produto.categoria === categoria
    const matchBusca = produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                       produto.descricao?.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  const totalProdutos = produtos.length

  // 🔥 CAMPOS DO FORMULÁRIO - SEM AVALIAÇÃO
  const camposProduto = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex: Bíblia Sagrada', required: true },
    { name: 'preco', label: 'Preço (R$)', type: 'number', placeholder: '89.90', required: true, step: '0.01', min: 0 },
    { name: 'categoria', label: 'Categoria', type: 'select', options: [
      { value: 'biblias', label: 'Bíblias' },
      { value: 'livros', label: 'Livros' },
    ], required: true },
    { name: 'descricao', label: 'Descrição', type: 'text', placeholder: 'Breve descrição do produto', required: true },
    { name: 'imagem', label: 'URL da Imagem', type: 'text', placeholder: 'https://...', required: true },
  ]

  if (loading || carregandoAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f2ea' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      
      <div style={{
        background: '#f5f1e8',
        minHeight: 'calc(100vh - 70px)',
        padding: '24px 16px',
      }}>
        <div style={{
          maxWidth: '820px',
          margin: '0 auto',
        }}>
          
          {/* BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5e3c, #b57a4b)',
            borderRadius: '20px',
            padding: '40px 36px',
            color: 'white',
            marginBottom: '16px',
            boxShadow: '0 12px 40px rgba(139, 94, 60, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}>
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
                <BookOpen size={18} style={{ opacity: 0.9 }} />
                <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', opacity: 0.9 }}>
                  Livraria Cristã
                </span>
              </div>

              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}>
                Marketplace
              </h1>

              <p style={{
                fontSize: '17px',
                opacity: 0.95,
                margin: '0 0 4px 0',
                fontWeight: '400',
                lineHeight: 1.6,
              }}>
                Bíblias, livros e recursos para fortalecer sua fé
              </p>

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
                  "A tua palavra é lâmpada para os meus pés e luz para o meu caminho"
                </p>
                <p style={{
                  fontSize: '13px',
                  margin: '4px 0 0 0',
                  opacity: 0.7,
                  fontWeight: '300',
                }}>
                  — Salmos 119:105
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '28px',
                marginTop: '18px',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>{totalProdutos} produtos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>{carrinho.length} no carrinho</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>2 categorias</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 BOTÃO ADMIN - FORA DO BANNER, EM BAIXO */}
          {isAdmin && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '16px',
            }}>
              <button
                onClick={() => setModalCriarOpen(true)}
                style={{
                  background: '#8b5e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(139, 94, 60, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6b3f2a'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#8b5e3c'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <PlusCircle size={18} />
                Adicionar Produto
              </button>
            </div>
          )}

          {/* HEADER - BUSCA E CARRINHO */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '550px',
              minWidth: '200px',
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }} />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar livros..."
                style={{
                  width: '100%',
                  padding: '12px 15px 12px 42px',
                  borderRadius: '12px',
                  border: '1px solid #d6d3d1',
                  outline: 'none',
                  background: '#fff',
                  fontSize: '15px',
                  color: '#000',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8b5e3c'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 94, 60, 0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d6d3d1'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* 🔥 ÍCONE DO CARRINHO - SEM TEXTO */}
            <button
              onClick={() => setAbrirCarrinho(true)}
              style={{
                border: 'none',
                background: '#8B5A2B',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#7b4b2a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#8B5A2B'}
            >
              <ShoppingCart size={22} />

              {carrinho.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#dc2626',
                  color: '#fff',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                }}>
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>

          {/* CATEGORIAS */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            {['todos', 'biblias', 'livros'].map((item) => (
              <button
                key={item}
                onClick={() => setCategoria(item)}
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: categoria === item ? '#8B5A2B' : '#e8dcc7',
                  color: categoria === item ? '#fff' : '#8B5A2B',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {/* PRODUTOS */}
          {produtosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '18px' }}>
              <Search size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
              <p style={{ color: '#64748b', fontSize: '18px' }}>
                {busca ? 'Nenhum produto encontrado com esse termo' : 'Nenhum produto disponível'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setModalCriarOpen(true)}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: '#8b5e3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#6b3f2a'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#8b5e3c'}
                >
                  <PlusCircle size={18} style={{ marginRight: '8px' }} />
                  Adicionar primeiro produto
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px',
            }}>
              {produtosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid #e7e5e4',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* 🔥 BOTÃO DELETAR - APENAS ADMIN */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletarProduto(prod.id, prod.nome)
                      }}
                      disabled={deletando[prod.id]}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(220, 38, 38, 0.9)',
                        border: 'none',
                        color: 'white',
                        cursor: deletando[prod.id] ? 'not-allowed' : 'pointer',
                        padding: '6px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        zIndex: 10,
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: deletando[prod.id] ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      {deletando[prod.id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  )}

                  <img
                    src={prod.imagem}
                    alt={prod.nome}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/220x200/8b5e3c/ffffff?text=Imagem+Indispon%C3%ADvel'
                    }}
                  />

                  <div style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                    <h2 style={{
                      margin: 0,
                      color: '#1f2937',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}>
                      {prod.nome}
                    </h2>

                    <p style={{
                      color: '#64748b',
                      fontSize: '13px',
                      marginTop: '6px',
                      lineHeight: '1.5',
                      flex: 1,
                    }}>
                      {prod.descricao}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '10px',
                    }}>
                      <Star size={14} color="#facc15" fill="#facc15" />
                      <span style={{ color: '#1f2937', fontWeight: '600' }}>{prod.avaliacao || 0}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>({prod.avaliacoes || 0})</span>
                    </div>

                    <h3 style={{
                      marginTop: '10px',
                      color: '#8B5A2B',
                      fontSize: '20px',
                      fontWeight: '700',
                    }}>
                      R$ {prod.preco?.toFixed(2) || '0.00'}
                    </h3>

                    <button
                      onClick={() => adicionarAoCarrinho(prod)}
                      style={{
                        marginTop: '10px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {abrirCarrinho && (
        <div
          onClick={() => setAbrirCarrinho(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 9999,
          }}
        />
      )}

      {/* CARRINHO LATERAL */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '380px',
        maxWidth: '90vw',
        height: '100vh',
        background: '#fff',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.2)',
        transform: abrirCarrinho ? 'translateX(0)' : 'translateX(100%)',
        transition: '0.3s ease',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px',
          borderBottom: '1px solid #eee',
        }}>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Carrinho</h2>
          <button
            onClick={() => setAbrirCarrinho(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '15px',
        }}>
          {carrinho.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>
              Seu carrinho está vazio
            </p>
          ) : (
            carrinho.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '15px',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
              }}>
                <img
                  src={item.imagem}
                  alt={item.nome}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                    {item.nome}
                  </p>
                  <p style={{ color: '#8B5A2B', fontWeight: '700', margin: '5px 0' }}>
                    R$ {item.preco?.toFixed(2) || '0.00'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => diminuirQuantidade(item.id)}
                      style={{
                        border: 'none',
                        background: '#e8dcc7',
                        color: '#8B5A2B',
                        padding: '6px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#d9cbb7'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#e8dcc7'}
                    >
                      <Minus size={16} />
                    </button>

                    <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                      {item.quantidade}
                    </span>

                    <button
                      onClick={() => aumentarQuantidade(item.id)}
                      style={{
                        border: 'none',
                        background: '#e8dcc7',
                        color: '#8B5A2B',
                        padding: '6px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#d9cbb7'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#e8dcc7'}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removerDoCarrinho(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={18} color="#dc2626" />
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{
          padding: '15px',
          borderTop: '1px solid #eee',
          background: '#f8fafc',
        }}>
          <h3 style={{
            margin: 0,
            color: '#1f2937',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>Total:</span>
            <span style={{ color: '#8B5A2B' }}>R$ {total?.toFixed(2) || '0.00'}</span>
          </h3>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '14px',
              background: '#8B5A2B',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#7b4b2a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#8B5A2B'}
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      {/* 🔥 MODAL PARA CRIAR PRODUTO - APENAS ADMIN */}
      {isAdmin && (
        <AdminModal
          isOpen={modalCriarOpen}
          onClose={() => setModalCriarOpen(false)}
          onSave={handleCriarProduto}
          title="Novo Produto"
          fields={camposProduto}
          initialData={{
            nome: '',
            preco: '',
            categoria: 'biblias',
            descricao: '',
            imagem: '',
          }}
        />
      )}

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

export default Marketplace