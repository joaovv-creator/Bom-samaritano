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
      descricao:
        'John Bunyan - Clássico da literatura cristã',
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
      descricao:
        'Charles Sheldon - O que Jesus faria?',
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
      descricao:
        'Histórias ilustradas para crianças',
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
      descricao:
        'C.S. Lewis - Obra-prima da apologética',
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
          {/* HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                Livraria Cristã
              </h1>

              <p style={{ color: '#64748b', margin: '4px 0 0' }}>
                Bíblias, livros e recursos para fortalecer sua fé
              </p>
            </div>

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
              }}
            >
              <ShoppingCart size={24} />

              {carrinho.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc2626',
                    color: '#fff',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>

          {/* BUSCA */}
          <div
            style={{
              position: 'relative',
              maxWidth: '550px',
              marginBottom: '20px',
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
              }}
            />
          </div>

          {/* CATEGORIAS */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
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
                  transition: '0.3s',
                }}
              >
                {item.charAt(0).toUpperCase() +
                  item.slice(1)}
              </button>
            ))}
          </div>

          {/* PRODUTOS */}
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
                      transition: '0.3s',
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
        </div>
      </div>

      {/* OVERLAY - z-index maior que o navbar */}
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
            zIndex: 9999, // ← Mudei de 40 para 9999
          }}
        />
      )}

      {/* CARRINHO LATERAL - z-index maior que o overlay */}
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
          zIndex: 10000, // ← Mudei de 50 para 10000
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
            }}
          >
            <X />
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
                      }}
                    >
                      <Minus size={16} />
                    </button>

                    <span
                      style={{
                        fontWeight: '600',
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
                      }}
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
                  }}
                >
                  <Trash2
                    size={18}
                    color="red"
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
          }}
        >
          <h3
            style={{
              margin: 0,
              color: '#1f2937',
            }}
          >
            Total: R$ {total.toFixed(2)}
          </h3>

          <button
            onClick={() =>
              navigate('/checkout')
            }
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '12px',
              background: '#8B5A2B',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
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