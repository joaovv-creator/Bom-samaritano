import { X, Trash2, QrCode, FileText, CreditCard, Banknote, Copy, Check, User, Mail, Phone, MapPin, Calendar, Lock, ShoppingBag, ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function CarrinhoDrawer({
  aberto,
  fechar,
}) {
  const {
    carrinho,
    removerDoCarrinho,
    total,
  } = useCart()

  const [pagamento, setPagamento] = useState('pix')
  const [copiado, setCopiado] = useState(false)
  const [mostrarQRCode, setMostrarQRCode] = useState(false)
  const [mostrarBoleto, setMostrarBoleto] = useState(false)
  const [etapa, setEtapa] = useState(1)

  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
  })

  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nomeTitular: '',
    validade: '',
    cvv: '',
    parcelas: 1,
  })

  const [dadosEntrega, setDadosEntrega] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  if (!aberto) return null

  const gerarPix = () => {
    const chave = 'pix@obomsamaritano.com.br'
    const nome = 'O Bom Samaritano'
    const cidade = 'Belo Horizonte'
    const valor = total.toFixed(2)
    
    return `00020101021226930014BR.GOV.BCB.PIX2571${chave}5204000053039865802BR5915${nome}6008${cidade}62070503***6304`
  }

  const gerarCodigoBarras = () => {
    const valorFormatado = total.toFixed(2).replace('.', '')
    const codigo = `00190.00009 01234.567890 12345.678901 5 6789012345`
    return codigo
  }

  const gerarNumeroBoleto = () => {
    const now = new Date()
    const data = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    return `${data}${random}`
  }

  const handleCopiarPix = () => {
    const codigoPix = gerarPix()
    navigator.clipboard.writeText(codigoPix)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  const handleFinalizarCompra = () => {
    if (pagamento === 'cartao') {
      if (!dadosCartao.numero || dadosCartao.numero.length < 16) {
        alert('Por favor, preencha o número do cartão corretamente.')
        return
      }
      if (!dadosCartao.nomeTitular) {
        alert('Por favor, preencha o nome do titular.')
        return
      }
      if (!dadosCartao.validade || dadosCartao.validade.length < 5) {
        alert('Por favor, preencha a validade do cartão (MM/AA).')
        return
      }
      if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
        alert('Por favor, preencha o CVV do cartão.')
        return
      }
    }

    setEtapa(3)
    
    setTimeout(() => {
      alert(`✅ Compra finalizada com sucesso!\n\n` +
        `Forma de pagamento: ${pagamento === 'pix' ? 'PIX' : pagamento === 'boleto' ? 'Boleto' : pagamento === 'cartao' ? 'Cartão de Crédito' : 'Dinheiro'}\n` +
        `Total: R$ ${total.toFixed(2)}\n\n` +
        `Obrigado pela compra! 🙏`)
      
      setEtapa(1)
      fechar()
    }, 1500)
  }

  const falarComVendedor = () => {
    let mensagem = 'Olá! Tenho interesse nos seguintes produtos:%0A%0A'

    carrinho.forEach((item) => {
      mensagem += `${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`
    })

    mensagem += `%0A📝 Forma de pagamento: ${pagamento === 'pix' ? 'PIX' : pagamento === 'boleto' ? 'Boleto' : pagamento === 'cartao' ? 'Cartão de Crédito' : 'Dinheiro'}`
    mensagem += `%0A💰 Total: R$ ${total.toFixed(2)}`

    window.open(
      `https://wa.me/5531999999999?text=${mensagem}`,
      '_blank'
    )
  }

  const opcoesPagamento = [
    { id: 'pix', label: 'PIX', icon: QrCode, color: '#22c55e' },
    { id: 'boleto', label: 'Boleto', icon: FileText, color: '#3b82f6' },
    { id: 'cartao', label: 'Cartão', icon: CreditCard, color: '#8b5e3c' },
    { id: 'dinheiro', label: 'Dinheiro', icon: Banknote, color: '#f59e0b' },
  ]

  // Estilos responsivos
  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.45)',
      zIndex: 999,
      animation: 'fadeIn 0.3s ease',
    },
    drawer: {
      position: 'fixed',
      right: 0,
      top: 0,
      width: '480px',
      maxWidth: '100%',
      height: '100vh',
      background: '#fff',
      zIndex: 1000,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexShrink: 0,
    },
    headerTitle: {
      margin: 0,
      color: '#0f172a',
      fontSize: '24px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    closeButton: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: '0.2s',
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#94a3b8',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px',
    },
    emptySubtitle: {
      fontSize: '14px',
      color: '#94a3b8',
    },
    itemCard: {
      borderBottom: '1px solid #f1f3f4',
      padding: '16px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      margin: 0,
      color: '#0f172a',
      fontSize: '16px',
      fontWeight: '500',
    },
    itemDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '4px',
      flexWrap: 'wrap',
    },
    itemQtd: {
      color: '#64748b',
      fontSize: '14px',
    },
    itemPrice: {
      color: '#8b5e3c',
      fontWeight: 'bold',
      fontSize: '15px',
    },
    removeButton: {
      border: 'none',
      background: 'none',
      color: '#dc2626',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: '0.2s',
    },
    totalContainer: {
      borderTop: '2px solid #f1f3f4',
      paddingTop: '16px',
      marginBottom: '16px',
      flexShrink: 0,
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0f172a',
    },
    totalValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#8b5e3c',
    },
    primaryButton: {
      width: '100%',
      height: '54px',
      border: 'none',
      borderRadius: '12px',
      background: '#8b5e3c',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: '0.2s',
    },
    primaryButtonHover: {
      background: '#7b4b2a',
    },
    secondaryButton: {
      flex: 1,
      height: '48px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      background: 'transparent',
      color: '#64748b',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: '0.2s',
    },
    successButton: {
      width: '100%',
      height: '48px',
      border: 'none',
      borderRadius: '12px',
      background: '#22c55e',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      transition: '0.2s',
    },
    whatsappButton: {
      width: '100%',
      height: '48px',
      marginTop: '12px',
      border: 'none',
      borderRadius: '12px',
      background: '#25d366',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: '0.2s',
      flexShrink: 0,
    },
    paymentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      marginBottom: '16px',
    },
    paymentButton: (isActive, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: isActive ? `2px solid ${color}` : '1px solid #e2e8f0',
      background: isActive ? `${color}10` : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: isActive ? '600' : '400',
      color: isActive ? color : '#64748b',
      width: '100%',
    }),
    formGroup: {
      marginBottom: '12px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '4px',
      color: '#64748b',
      fontSize: '14px',
      fontWeight: '500',
    },
    formInput: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      background: 'white',
      transition: '0.2s',
    },
    formSelect: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      background: 'white',
    },
    infoBox: {
      padding: '12px',
      borderRadius: '8px',
      fontSize: '13px',
      textAlign: 'left',
    },
    infoBoxWarning: {
      background: '#fef3c7',
      color: '#92400e',
    },
    infoBoxSuccess: {
      background: '#dcfce7',
      color: '#166534',
    },
    infoBoxInfo: {
      background: '#f1f5f9',
      color: '#64748b',
    },
    qrContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '16px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    copyButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      background: 'white',
      cursor: 'pointer',
      color: '#0f172a',
      fontSize: '14px',
      transition: '0.2s',
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
      flexShrink: 0,
    },
    confirmationContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
    },
    confirmationIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: '#dcfce7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    confirmationTitle: {
      color: '#0f172a',
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    confirmationText: {
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.6',
    },
    confirmationDetails: {
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px',
      marginTop: '16px',
      width: '100%',
      textAlign: 'left',
      fontSize: '14px',
      color: '#64748b',
    },
    boletoContainer: {
      marginTop: '16px',
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    },
    boletoHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      flexWrap: 'wrap',
      gap: '8px',
    },
    boletoCodigo: {
      background: '#f8fafc',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '12px',
      textAlign: 'center',
      fontFamily: 'monospace',
      fontSize: '14px',
      letterSpacing: '2px',
      color: '#0f172a',
      overflow: 'hidden',
      wordBreak: 'break-all',
    },
    boletoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      fontSize: '13px',
      color: '#64748b',
    },
    boletoItem: {
      marginBottom: '4px',
    },
    boletoLabel: {
      fontWeight: '600',
      display: 'block',
      color: '#0f172a',
      fontSize: '12px',
    },
    boletoValue: {
      fontSize: '13px',
    },
    pixContainer: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      textAlign: 'center',
    },
    pixCode: {
      marginTop: '8px',
      padding: '10px',
      background: '#f1f5f9',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#64748b',
      wordBreak: 'break-all',
      maxHeight: '60px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cardContainer: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
    },
  }

  return (
    <>
      <div onClick={fechar} style={styles.overlay} />
      
      <div style={styles.drawer}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <ShoppingBag size={22} color="#8b5e3c" />
            {etapa === 1 ? 'Carrinho' : etapa === 2 ? 'Pagamento' : 'Confirmação'}
          </h2>

          <button
            onClick={fechar}
            style={styles.closeButton}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f3f4'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={24} color="#64748b" />
          </button>
        </div>

        {/* ETAPA 1: CARRINHO */}
        {etapa === 1 && (
          <>
            <div style={styles.content}>
              {carrinho.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🛒</div>
                  <p style={styles.emptyTitle}>Seu carrinho está vazio</p>
                  <p style={styles.emptySubtitle}>Adicione alguns produtos!</p>
                </div>
              ) : (
                carrinho.map((item) => (
                  <div key={item.id} style={styles.itemCard}>
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.nome}</h4>
                      <div style={styles.itemDetails}>
                        <span style={styles.itemQtd}>Qtd: {item.quantidade}</span>
                        <span style={styles.itemPrice}>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      style={styles.removeButton}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* TOTAL */}
            <div style={styles.totalContainer}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalValue}>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {carrinho.length > 0 && (
              <button
                onClick={() => setEtapa(2)}
                style={styles.primaryButton}
                onMouseEnter={(e) => e.currentTarget.style.background = '#7b4b2a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8b5e3c'}
              >
                Continuar para Pagamento
              </button>
            )}
          </>
        )}

        {/* ETAPA 2: PAGAMENTO */}
        {etapa === 2 && (
          <>
            <div style={styles.content}>
              {/* FORMAS DE PAGAMENTO */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '16px', fontWeight: '600' }}>
                  Selecione a forma de pagamento
                </h3>

                <div style={styles.paymentGrid}>
                  {opcoesPagamento.map((opcao) => {
                    const Icon = opcao.icon
                    const isActive = pagamento === opcao.id

                    return (
                      <button
                        key={opcao.id}
                        onClick={() => {
                          setPagamento(opcao.id)
                          setMostrarQRCode(false)
                          setMostrarBoleto(false)
                        }}
                        style={styles.paymentButton(isActive, opcao.color)}
                      >
                        <Icon size={18} />
                        {opcao.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* PIX */}
              {pagamento === 'pix' && carrinho.length > 0 && (
                <div style={styles.pixContainer}>
                  <button
                    onClick={() => setMostrarQRCode(!mostrarQRCode)}
                    style={{
                      background: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      width: '100%',
                      transition: '0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
                  >
                    {mostrarQRCode ? 'Ocultar QR Code' : 'Gerar QR Code PIX'}
                  </button>

                  {mostrarQRCode && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={styles.qrContainer}>
                        <QRCodeSVG
                          value={gerarPix()}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="L"
                          includeMargin={true}
                        />
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <button
                          onClick={handleCopiarPix}
                          style={styles.copyButton}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          {copiado ? (
                            <>
                              <Check size={18} color="#22c55e" />
                              Código copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={18} />
                              Copiar código PIX
                            </>
                          )}
                        </button>
                      </div>

                      <div style={styles.pixCode}>
                        {gerarPix()}
                      </div>

                      <div style={{ ...styles.infoBox, ...styles.infoBoxWarning, marginTop: '12px' }}>
                        <strong>💡 Dica:</strong> O código PIX expira em 30 minutos. 
                        Faça o pagamento dentro deste prazo para garantir a reserva dos produtos.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BOLETO */}
              {pagamento === 'boleto' && carrinho.length > 0 && (
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <button
                    onClick={() => setMostrarBoleto(!mostrarBoleto)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      width: '100%',
                      transition: '0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                  >
                    {mostrarBoleto ? 'Ocultar Boleto' : 'Gerar Boleto'}
                  </button>

                  {mostrarBoleto && (
                    <div style={styles.boletoContainer}>
                      <div style={styles.boletoHeader}>
                        <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>
                          📄 Boleto Bancário
                        </span>
                        <span style={{
                          background: '#f1f5f9',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          Vencimento: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div style={styles.boletoCodigo}>
                        {gerarCodigoBarras()}
                      </div>

                      <div style={styles.boletoGrid}>
                        <div style={styles.boletoItem}>
                          <span style={styles.boletoLabel}>Beneficiário</span>
                          <span style={styles.boletoValue}>O Bom Samaritano</span>
                        </div>
                        <div style={styles.boletoItem}>
                          <span style={styles.boletoLabel}>CNPJ/CPF</span>
                          <span style={styles.boletoValue}>12.345.678/0001-90</span>
                        </div>
                        <div style={styles.boletoItem}>
                          <span style={styles.boletoLabel}>Valor</span>
                          <span style={styles.boletoValue}>R$ {total.toFixed(2)}</span>
                        </div>
                        <div style={styles.boletoItem}>
                          <span style={styles.boletoLabel}>Vencimento</span>
                          <span style={styles.boletoValue}>{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div style={{ ...styles.infoBox, ...styles.infoBoxWarning, marginTop: '12px' }}>
                        <strong>📌 Atenção:</strong> O boleto vence em 3 dias úteis. 
                        Após o vencimento, será necessário gerar um novo boleto.
                      </div>

                      <button
                        onClick={() => {
                          alert('📄 BOLETO GERADO COM SUCESSO!\n\n' +
                            `Número: ${gerarNumeroBoleto()}\n` +
                            `Valor: R$ ${total.toFixed(2)}\n` +
                            `Vencimento: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}\n` +
                            `Código de barras: ${gerarCodigoBarras()}\n\n` +
                            'O boleto será enviado para seu e-mail em até 5 minutos.')
                        }}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '10px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: '0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                      >
                        Baixar Boleto (PDF)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CARTÃO DE CRÉDITO */}
              {pagamento === 'cartao' && carrinho.length > 0 && (
                <div style={styles.cardContainer}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} color="#8b5e3c" />
                    Dados do Cartão
                  </h4>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                      value={dadosCartao.numero}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setDadosCartao({ ...dadosCartao, numero: value })
                      }}
                      style={styles.formInput}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nome do Titular</label>
                    <input
                      type="text"
                      placeholder="Como está no cartão"
                      value={dadosCartao.nomeTitular}
                      onChange={(e) => setDadosCartao({ ...dadosCartao, nomeTitular: e.target.value.toUpperCase() })}
                      style={styles.formInput}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ ...styles.formGroup, flex: 1, minWidth: '100px' }}>
                      <label style={styles.formLabel}>Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={dadosCartao.validade}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4)
                          }
                          setDadosCartao({ ...dadosCartao, validade: value })
                        }}
                        style={styles.formInput}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1, minWidth: '80px' }}>
                      <label style={styles.formLabel}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        value={dadosCartao.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          setDadosCartao({ ...dadosCartao, cvv: value })
                        }}
                        style={styles.formInput}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Parcelas</label>
                    <select
                      value={dadosCartao.parcelas}
                      onChange={(e) => setDadosCartao({ ...dadosCartao, parcelas: Number(e.target.value) })}
                      style={styles.formSelect}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n}x de R$ {(total / n).toFixed(2)} {n === 1 ? '(sem juros)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ ...styles.infoBox, ...styles.infoBoxWarning }}>
                    <strong>🔒 Seguro:</strong> Todos os dados são criptografados e processados com segurança.
                  </div>
                </div>
              )}

              {/* DINHEIRO */}
              {pagamento === 'dinheiro' && carrinho.length > 0 && (
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                  <Banknote size={48} color="#f59e0b" style={{ marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>
                    Pagamento em Dinheiro
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
                    Você pagará em dinheiro no ato da entrega.
                  </p>
                  <div style={{ ...styles.infoBox, ...styles.infoBoxWarning }}>
                    <strong>📌 Atenção:</strong> Tenha o valor exato em mãos para facilitar o troco.
                    O vendedor confirmará sua disponibilidade para entrega.
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES ETAPA 2 */}
            <div style={styles.buttonRow}>
              <button
                onClick={() => setEtapa(1)}
                style={styles.secondaryButton}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <ArrowLeft size={18} style={{ marginRight: '4px' }} />
                Voltar
              </button>

              <button
                onClick={handleFinalizarCompra}
                style={styles.successButton}
                onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
              >
                Finalizar Compra
              </button>
            </div>

            {/* BOTÃO WHATSAPP */}
            <button
              onClick={falarComVendedor}
              style={styles.whatsappButton}
              onMouseEnter={(e) => e.currentTarget.style.background = '#20bd5e'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#25d366'}
            >
              <FaWhatsapp size={20} />
              Falar com o vendedor
            </button>
          </>
        )}

        {/* ETAPA 3: CONFIRMAÇÃO */}
        {etapa === 3 && (
          <div style={styles.confirmationContainer}>
            <div style={styles.confirmationIcon}>
              <Check size={48} color="#22c55e" />
            </div>

            <h2 style={styles.confirmationTitle}>Compra Finalizada!</h2>

            <p style={styles.confirmationText}>
              Sua compra foi realizada com sucesso!
              <br />
              Forma de pagamento: <strong>{pagamento === 'pix' ? 'PIX' : pagamento === 'boleto' ? 'Boleto' : pagamento === 'cartao' ? 'Cartão de Crédito' : 'Dinheiro'}</strong>
              <br />
              Total: <strong>R$ {total.toFixed(2)}</strong>
            </p>

            <div style={styles.confirmationDetails}>
              <p style={{ margin: '4px 0' }}>📧 Um e-mail de confirmação foi enviado</p>
              <p style={{ margin: '4px 0' }}>📱 O vendedor entrará em contato em breve</p>
              <p style={{ margin: '4px 0' }}>📦 Prazo de entrega: 3-5 dias úteis</p>
              <p style={{ margin: '4px 0' }}>
                <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Compra 100% segura
              </p>
            </div>

            <button
              onClick={() => {
                setEtapa(1)
                fechar()
              }}
              style={styles.primaryButton}
              onMouseEnter={(e) => e.currentTarget.style.background = '#7b4b2a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#8b5e3c'}
            >
              Voltar à Loja
            </button>
          </div>
        )}
      </div>

      {/* ANIMAÇÕES CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        /* Responsividade para telas menores */
        @media (max-width: 640px) {
          .drawer-content {
            padding: 16px !important;
          }
          .drawer-header {
            margin-bottom: 16px !important;
          }
          .drawer-title {
            font-size: 20px !important;
          }
          .payment-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
          }
          .boleto-grid {
            grid-template-columns: 1fr !important;
          }
          .button-row {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .item-card {
            padding: 12px 0 !important;
          }
          .item-name {
            font-size: 14px !important;
          }
        }
      `}</style>
    </>
  )
}