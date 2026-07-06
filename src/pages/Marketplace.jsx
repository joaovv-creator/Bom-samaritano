import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Star,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Church,
  BookOpen,
  Activity,
  Users,
  Sparkles
} from 'lucide-react'

import { useCart } from '../contexts/CartContext'
import Navbar from '../components/common/Navbar'

function Marketplace() {
  const {
    carrinho,
    adicionarAoCarrinho,
    aumentarQuantidade,
    diminuirQuantidade,
    removerDoCarrinho,
    total,
  } = useCart()

  const navigate = useNavigate()

  const [abrirCarrinho, setAbrirCarrinho] = useState(false)
  const [categoria, setCategoria] = useState('todos')
  const [busca, setBusca] = useState('')
  const [pagamento, setPagamento] = useState('pix')

  const produtos = [
    {
      id: 1,
      nome: 'Bíblia Sagrada NVI',
      preco: 89.9,
      avaliacao: 4.9,
      avaliacoes: 234,
      categoria: 'biblias',
      descricao: 'Nova Versão Internacional com capa luxo',
      imagem:
        'https://media.istockphoto.com/id/1759751957/pt/foto/biblia-sagrada.webp?a=1&b=1&s=612x612&w=0&k=20&c=31buEX22q6SVqvHE10-0uNI8PiseR_aEr_YrQmOAtOQ=',
    },
    {
      id: 2,
      nome: 'Bíblia de Estudo',
      preco: 149.9,
      avaliacao: 5.0,
      avaliacoes: 187,
      categoria: 'biblias',
      descricao: 'Com comentários e mapas ilustrados',
      imagem:
        'https://m.media-amazon.com/images/I/81+e5daLKvL._AC_UF1000,1000_QL80_.jpg',
    },
    {
      id: 3,
      nome: 'O Peregrino',
      preco: 45.9,
      avaliacao: 5.0,
      avaliacoes: 187,
      categoria: 'livros',
      descricao: 'John Bunyan - Clássico da literatura cristã',
      imagem:
        'https://images.tcdn.com.br/img/img_prod/1199365/livro_o_peregrino_john_bunyan_capa_dura_871_1_3b00167d9bc22d624b7b38e2778486f7.jpg',
    },
    {
      id: 4,
      nome: 'Em Seus Passos',
      preco: 35.9,
      avaliacao: 5.0,
      avaliacoes: 187,
      categoria: 'livros',
      descricao: 'Charles Sheldon - O que Jesus faria?',
      imagem:
        'https://plenitudedistribuidora.com.br/cdn/shop/files/282252-1.jpg?v=1772137658',
    },
    {
      id: 5,
      nome: 'Bíblia Infantil',
      preco: 59.9,
      avaliacao: 5.0,
      avaliacoes: 187,
      categoria: 'biblias',
      descricao: 'Histórias ilustradas para crianças',
      imagem:
        'https://livrariascuritiba.vteximg.com.br/arquivos/ids/1868407-525-525/LV450888.jpg?v=638682192530600000',
    },
    {
      id: 6,
      nome: 'Cristianismo Puro e Simples',
      preco: 42.9,
      avaliacao: 5.0,
      avaliacoes: 187,
      categoria: 'livros',
      descricao: 'C.S. Lewis - Obra-prima da apologética',
      imagem:
        'https://acdn-us.mitiendanube.com/stores/001/677/619/products/cristianismo-puro-e-simples-c-s-lewis-editora-thomas-nelson-min1-b84493540daa6a223b16360545390730-1024-1024.webp',
    },
  ]

  const produtosFiltrados = produtos.filter(
    (produto) => {
      const matchCategoria =
        categoria === 'todos' ||
        produto.categoria === categoria

      const matchBusca =
        produto.nome
          .toLowerCase()
          .includes(busca.toLowerCase()) ||
        produto.descricao
          .toLowerCase()
          .includes(busca.toLowerCase())

      return matchCategoria && matchBusca
    }
  )

  // Total de produtos disponíveis
  const totalProdutos = produtos.length

  return (
    <>
      <Navbar />
      
      <div
        style={{
          background: '#f5f1e8',
          minHeight: 'calc(100vh - 70px)',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
          }}
        >
          {/* ============================================ */}
          {/* BANNER - MARKETPLACE (mesmo estilo das outras páginas) */}
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
            {/* Elemento decorativo */}
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
              {/* Tag da loja */}
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

              {/* Título principal */}
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}>
                Marketplace
              </h1>

              {/* Subtítulo */}
              <p style={{
                fontSize: '17px',
                opacity: 0.95,
                margin: '0 0 4px 0',
                fontWeight: '400',
                lineHeight: 1.6,
              }}>
                Bíblias, livros e recursos para fortalecer sua fé
              </p>

              {/* Versículo bíblico */}
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

              {/* Estatísticas */}
              <div style={{
                display: 'flex',
                gap: '28px',
                marginTop: '18px',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>
                    {totalProdutos} produtos
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>
                    {carrinho.length} no carrinho
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} style={{ opacity: 0.85 }} />
                  <span style={{ fontSize: '14px', opacity: 0.85 }}>
                    {['biblias', 'livros'].length} categorias
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* HEADER COM BUSCA E CARRINHO */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* BUSCA */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                maxWidth: '550px',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              />

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

            <button
              onClick={() => setAbrirCarrinho(true)}
              style={{
                border: 'none',
                background: '#8B5A2B',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#7b4b2a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#8B5A2B'}
            >
              <ShoppingCart size={20} />
              <span>Carrinho</span>

              {carrinho.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc2626',
                    color: '#fff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                  }}
                >
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>

          {/* CATEGORIAS */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            {['todos', 'biblias', 'livros'].map((item) => (
              <button
                key={item}
                onClick={() => setCategoria(item)}
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  background:
                    categoria === item
                      ? '#8B5A2B'
                      : '#e8dcc7',
                  color:
                    categoria === item
                      ? '#fff'
                      : '#8B5A2B',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (categoria !== item) {
                    e.currentTarget.style.background = '#d9cbb7'
                  }
                }}
                onMouseLeave={(e) => {
                  if (categoria !== item) {
                    e.currentTarget.style.background = '#e8dcc7'
                  }
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
                Nenhum produto encontrado com esse termo
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
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
                  <img
                    src={prod.imagem}
                    alt={prod.nome}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />

                  <div
                    style={{
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        color: '#1f2937',
                        fontSize: '18px',
                      }}
                    >
                      {prod.nome}
                    </h2>

                    <p
                      style={{
                        color: '#64748b',
                        fontSize: '14px',
                        marginTop: '8px',
                        lineHeight: '1.5',
                        flex: 1,
                      }}
                    >
                      {prod.descricao}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: '10px',
                      }}
                    >
                      <Star
                        size={14}
                        color="#facc15"
                        fill="#facc15"
                      />

                      <span
                        style={{
                          color: '#1f2937',
                          fontWeight: '600',
                        }}
                      >
                        {prod.avaliacao}
                      </span>

                      <span
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                        }}
                      >
                        ({prod.avaliacoes})
                      </span>
                    </div>

                    <h3
                      style={{
                        marginTop: '12px',
                        color: '#8B5A2B',
                        fontSize: '22px',
                        fontWeight: '700',
                      }}
                    >
                      R$ {prod.preco.toFixed(2)}
                    </h3>

                    <button
                      onClick={() =>
                        adicionarAoCarrinho(prod)
                      }
                      style={{
                        marginTop: '12px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '15px',
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
          onClick={() =>
            setAbrirCarrinho(false)
          }
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'rgba(0,0,0,0.4)',
            zIndex: 9999,
          }}
        />
      )}

      {/* CARRINHO LATERAL */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          height: '100vh',
          background: '#fff',
          boxShadow:
            '-2px 0 10px rgba(0,0,0,0.2)',
          transform: abrirCarrinho
            ? 'translateX(0)'
            : 'translateX(100%)',
          transition: '0.3s ease',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* HEADER DO CARRINHO */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            padding: '15px',
            borderBottom:
              '1px solid #eee',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#1f2937',
            }}
          >
            Carrinho
          </h2>

          <button
            onClick={() =>
              setAbrirCarrinho(false)
            }
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

        {/* LISTA DE ITENS */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
          }}
        >
          {carrinho.length === 0 ? (
            <p
              style={{
                color: '#64748b',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              Seu carrinho está vazio
            </p>
          ) : (
            carrinho.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '15px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '10px',
                }}
              >
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
                  <p
                    style={{
                      margin: 0,
                      fontWeight: '600',
                      color: '#1f2937',
                      fontSize: '14px',
                    }}
                  >
                    {item.nome}
                  </p>

                  <p
                    style={{
                      color: '#8B5A2B',
                      fontWeight: '700',
                      margin: '5px 0',
                    }}
                  >
                    R$ {item.preco.toFixed(2)}
                  </p>

                  {/* CONTROLE DE QUANTIDADE */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <button
                      onClick={() =>
                        diminuirQuantidade(item.id)
                      }
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

                    <span
                      style={{
                        fontWeight: '600',
                        minWidth: '24px',
                        textAlign: 'center',
                      }}
                    >
                      {item.quantidade}
                    </span>

                    <button
                      onClick={() =>
                        aumentarQuantidade(item.id)
                      }
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
                  onClick={() =>
                    removerDoCarrinho(item.id)
                  }
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
                  <Trash2
                    size={18}
                    color="#dc2626"
                  />
                </button>
              </div>
            ))
          )}
        </div>

        {/* TOTAL */}
        <div
          style={{
            padding: '15px',
            borderTop: '1px solid #eee',
            background: '#f8fafc',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: '#1f2937',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Total:</span>
            <span style={{ color: '#8B5A2B' }}>R$ {total.toFixed(2)}</span>
          </h3>

          <button
            onClick={() =>
              navigate('/checkout')
            }
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
    </>
  )
}

export default Marketplace