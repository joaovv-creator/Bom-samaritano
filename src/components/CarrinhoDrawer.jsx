import { X, Trash2 } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'

export default function CarrinhoDrawer({
  aberto,
  fechar,
}) {
  const {
    carrinho,
    removerDoCarrinho,
    total,
  } = useCart()

  const [pagamento, setPagamento] =
    useState('pix')

  if (!aberto) return null

  const falarComVendedor = () => {
    let mensagem =
      'Olá! Tenho interesse nos seguintes produtos:%0A%0A'

    carrinho.forEach((item) => {
      mensagem += `${item.nome} (${item.quantidade}x)%0A`
    })

    mensagem += `%0AForma de pagamento: ${pagamento}`
    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`

    window.open(
      `https://wa.me/5531999999999?text=${mensagem}`,
      '_blank'
    )
  }

  return (
    <>
      <div
        onClick={fechar}
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'rgba(0,0,0,.45)',
          zIndex: 999,
        }}
      />

      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '380px',
          height: '100vh',
          background: '#fff',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <h2>🛒 Carrinho</h2>

          <button
            onClick={fechar}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <X />
          </button>
        </div>

        {carrinho.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom:
                '1px solid #eee',
              padding: '15px 0',
            }}
          >
            <h4>{item.nome}</h4>

            <p>
              Qtd: {item.quantidade}
            </p>

            <p>
              R$
              {(
                item.preco *
                item.quantidade
              ).toFixed(2)}
            </p>

            <button
              onClick={() =>
                removerDoCarrinho(
                  item.id
                )
              }
              style={{
                border: 'none',
                background: 'none',
                color: '#dc2626',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <h2
          style={{
            marginTop: '20px',
          }}
        >
          Total: R$ {total.toFixed(2)}
        </h2>

        <h3>Forma de pagamento</h3>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() =>
              setPagamento('pix')
            }
          >
            PIX
          </button>

          <button
            onClick={() =>
              setPagamento(
                'boleto'
              )
            }
          >
            Boleto
          </button>

          <button
            onClick={() =>
              setPagamento(
                'cartão'
              )
            }
          >
            Cartão
          </button>
        </div>

        <button
          onClick={falarComVendedor}
          style={{
            width: '100%',
            height: '50px',
            border: 'none',
            borderRadius: '10px',
            background: '#22c55e',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <FaWhatsapp />
          Falar com o vendedor
        </button>
      </div>
    </>
  )
}