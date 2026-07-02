import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  QrCode,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Wallet,
  Smartphone,
  ArrowLeft,
  ShoppingBag,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  HelpCircle,
  MessageCircle,
  Info,
  Gift,
  Send,
  Camera,
  Play,
  Share2,
  Globe,
  LogIn,
  ShoppingCart,
  Truck,
  Headphones,
  Sparkles,
  ChevronRight,
  CircleCheck,
  Clock,
  Building2,
  MapPin
} from 'lucide-react';

// Importe o contexto de autenticação
// import { useAuth } from '../contexts/AuthContext';

function Checkout() {
  const { carrinho = [], total = 0 } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Descomente quando tiver o AuthContext configurado
  // const { user } = useAuth();
  // const isAuthenticated = !!user;

  // Mock para teste - remova quando tiver o AuthContext
  const isAuthenticated = true; // Mude para false para testar o bloqueio

  const curso = location.state?.curso;
  const aluno = location.state?.aluno;

  const [pagamento, setPagamento] = useState("pix");
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [mostrarDetalhesPix, setMostrarDetalhesPix] = useState(false);
  const [cartaoData, setCartaoData] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    parcelas: 1
  });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  const carrinhoVazio = !curso && carrinho.length === 0;
  const totalFinal = curso ? Number(curso.preco || 0) : Number(total || 0);

  // Dados PIX fictícios
  const dadosPix = {
    chave: "comunidade@obomsamaritano.com",
    nome: "O Bom Samaritano",
    cidade: "São Paulo - SP",
    codigo: "00020126360014BR.GOV.BCB.PIX0114comunidade@obomsamaritano.com5204000053039865802BR5915O Bom Samaritano6009Sao Paulo62070503***6304E2F8"
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(dadosPix.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const validarCartao = () => {
    const novosErros = {};
    
    if (!cartaoData.numero.replace(/\s/g, '').match(/^\d{16}$/)) {
      novosErros.numero = 'Número inválido (16 dígitos)';
    }
    if (!cartaoData.nome.trim()) {
      novosErros.nome = 'Nome obrigatório';
    }
    if (!cartaoData.validade.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      novosErros.validade = 'Formato MM/AA';
    }
    if (!cartaoData.cvv.match(/^\d{3,4}$/)) {
      novosErros.cvv = 'CVV inválido';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleConfirmarPagamento = async () => {
    if (pagamento === 'cartao' && !validarCartao()) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setMostrarSucesso(true);
  };

  const opcoesPagamento = [
    {
      id: 'pix',
      label: 'PIX',
      icon: QrCode,
      description: 'Pagamento instantâneo',
      color: '#10b981'
    },
    {
      id: 'cartao',
      label: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Parcelável em até 12x',
      color: '#6366f1'
    },
    {
      id: 'boleto',
      label: 'Boleto Bancário',
      icon: Banknote,
      description: 'Vencimento em 3 dias',
      color: '#f59e0b'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      icon: Wallet,
      description: 'Pagamento internacional',
      color: '#0070ba'
    },
    {
      id: 'googlepay',
      label: 'Google Pay',
      icon: Smartphone,
      description: 'Pagamento rápido',
      color: '#4285f4'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Botão Voltar - CORRIGIDO para /marketplace */}
        <button 
          onClick={() => navigate('/loja')} 
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.color = '#8B5A2B'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={20} />
          Voltar à loja
        </button>

        {/* Header com progresso */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Finalizar Compra</h1>
            <p style={styles.subtitle}>Preencha os dados abaixo para concluir seu pedido</p>
          </div>
          <div style={styles.steps}>
            <div style={{ ...styles.step, ...styles.stepActive }}>
              <span style={styles.stepNumber}>1</span>
              <span style={styles.stepLabel}>Carrinho</span>
            </div>
            <div style={styles.stepLine} />
            <div style={{ ...styles.step, ...styles.stepActive }}>
              <span style={styles.stepNumber}>2</span>
              <span style={styles.stepLabel}>Pagamento</span>
            </div>
            <div style={styles.stepLine} />
            <div style={{ ...styles.step, ...(mostrarSucesso ? styles.stepActive : styles.stepInactive) }}>
              <span style={styles.stepNumber}>3</span>
              <span style={styles.stepLabel}>Confirmação</span>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* COLUNA ESQUERDA - Resumo e Pagamento */}
          <div style={styles.leftColumn}>
            {/* Resumo do Pedido */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <ShoppingBag size={20} color="#8B5A2B" />
                <h3 style={styles.cardTitle}>Resumo do Pedido</h3>
              </div>

              {curso ? (
                <div style={styles.cursoCard}>
                  <h4 style={styles.cursoNome}>{curso.nome}</h4>
                  <div style={styles.alunoInfo}>
                    <User size={16} />
                    <span>{aluno?.nome || 'Não informado'}</span>
                  </div>
                  <div style={styles.alunoInfo}>
                    <Mail size={16} />
                    <span>{aluno?.email || 'Não informado'}</span>
                  </div>
                  <div style={styles.alunoInfo}>
                    <Phone size={16} />
                    <span>{aluno?.telefone || 'Não informado'}</span>
                  </div>
                  <div style={styles.cursoPreco}>
                    R$ {Number(curso.preco).toFixed(2)}
                  </div>
                </div>
              ) : carrinhoVazio ? (
                <p style={styles.emptyText}>Carrinho vazio</p>
              ) : (
                carrinho.map((item) => (
                  <div key={item.id} style={styles.itemRow}>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemNome}>{item.nome}</span>
                      <span style={styles.itemQtd}>x {item.quantidade}</span>
                    </div>
                    <span style={styles.itemPreco}>
                      R$ {(Number(item.preco || 0) * Number(item.quantidade || 1)).toFixed(2)}
                    </span>
                  </div>
                ))
              )}

              <div style={styles.divider} />

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>R$ {totalFinal.toFixed(2)}</span>
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <CreditCard size={20} color="#8B5A2B" />
                <h3 style={styles.cardTitle}>Forma de Pagamento</h3>
              </div>

              <div style={styles.paymentOptions}>
                {opcoesPagamento.map((op) => {
                  const Icon = op.icon;
                  const isSelected = pagamento === op.id;
                  
                  return (
                    <button
                      key={op.id}
                      onClick={() => setPagamento(op.id)}
                      style={{
                        ...styles.paymentOption,
                        ...(isSelected ? styles.paymentOptionSelected : {}),
                        borderColor: isSelected ? op.color : '#e5e7eb'
                      }}
                    >
                      <div style={{
                        ...styles.paymentIcon,
                        background: isSelected ? op.color + '15' : '#f5f1e8',
                        color: isSelected ? op.color : '#64748b'
                      }}>
                        <Icon size={22} />
                      </div>
                      <div style={styles.paymentInfo}>
                        <span style={styles.paymentLabel}>{op.label}</span>
                        <span style={styles.paymentDescription}>{op.description}</span>
                      </div>
                      {isSelected && <CheckCircle size={18} color={op.color} />}
                    </button>
                  );
                })}
              </div>

              {/* Detalhes do PIX */}
              {pagamento === 'pix' && (
                <div style={styles.pixDetails}>
                  <div style={styles.pixHeader}>
                    <QrCode size={24} color="#10b981" />
                    <span style={styles.pixTitle}>Pague com PIX</span>
                  </div>

                  <div style={styles.qrCodeContainer}>
                    <div style={styles.qrCode}>
                      <div style={styles.qrCodeGrid}>
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              ...styles.qrBlock,
                              background: Math.random() > 0.6 ? '#1a1a1a' : 'white'
                            }}
                          />
                        ))}
                      </div>
                      <div style={styles.qrCenter}>PIX</div>
                    </div>
                  </div>

                  <div style={styles.pixInfo}>
                    <div style={styles.pixRow}>
                      <span style={styles.pixLabel}>Chave PIX:</span>
                      <span style={styles.pixValue}>{dadosPix.chave}</span>
                    </div>
                    <div style={styles.pixRow}>
                      <span style={styles.pixLabel}>Beneficiário:</span>
                      <span style={styles.pixValue}>{dadosPix.nome}</span>
                    </div>
                    <div style={styles.pixRow}>
                      <span style={styles.pixLabel}>Cidade:</span>
                      <span style={styles.pixValue}>{dadosPix.cidade}</span>
                    </div>
                    <div style={styles.pixRow}>
                      <span style={styles.pixLabel}>Valor:</span>
                      <span style={{ ...styles.pixValue, fontWeight: '700', color: '#10b981' }}>
                        R$ {totalFinal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={copiarPix}
                    style={styles.copyButton}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                  >
                    {copiado ? (
                      <>
                        <Check size={18} />
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
              )}

              {/* Formulário Cartão */}
              {pagamento === 'cartao' && (
                <div style={styles.cartaoDetails}>
                  <div style={styles.cartaoHeader}>
                    <CreditCard size={24} color="#6366f1" />
                    <span style={styles.cartaoTitle}>Dados do Cartão</span>
                  </div>

                  <div style={styles.cartaoForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cartaoData.numero}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                          setCartaoData({ ...cartaoData, numero: formatted });
                        }}
                        maxLength="19"
                        style={{
                          ...styles.formInput,
                          ...(erros.numero ? styles.formInputError : {})
                        }}
                      />
                      {erros.numero && <span style={styles.errorText}>{erros.numero}</span>}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nome do Titular</label>
                      <input
                        type="text"
                        placeholder="Como está no cartão"
                        value={cartaoData.nome}
                        onChange={(e) => setCartaoData({ ...cartaoData, nome: e.target.value.toUpperCase() })}
                        style={{
                          ...styles.formInput,
                          ...(erros.nome ? styles.formInputError : {})
                        }}
                      />
                      {erros.nome && <span style={styles.errorText}>{erros.nome}</span>}
                    </div>

                    <div style={styles.formRow}>
                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.formLabel}>Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cartaoData.validade}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              const formatted = value.replace(/(\d{2})/, '$1/').trim();
                              setCartaoData({ ...cartaoData, validade: formatted });
                            }
                          }}
                          maxLength="5"
                          style={{
                            ...styles.formInput,
                            ...(erros.validade ? styles.formInputError : {})
                          }}
                        />
                        {erros.validade && <span style={styles.errorText}>{erros.validade}</span>}
                      </div>

                      <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.formLabel}>CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          value={cartaoData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setCartaoData({ ...cartaoData, cvv: value });
                          }}
                          maxLength="4"
                          style={{
                            ...styles.formInput,
                            ...(erros.cvv ? styles.formInputError : {})
                          }}
                        />
                        {erros.cvv && <span style={styles.errorText}>{erros.cvv}</span>}
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Parcelas</label>
                      <select
                        value={cartaoData.parcelas}
                        onChange={(e) => setCartaoData({ ...cartaoData, parcelas: Number(e.target.value) })}
                        style={styles.formSelect}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                          <option key={n} value={n}>
                            {n}x de R$ {(totalFinal / n).toFixed(2)}
                            {n > 1 && ' sem juros'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.cartaoSeguro}>
                      <Lock size={14} color="#64748b" />
                      <span>Seus dados estão seguros e criptografados</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes do Boleto */}
              {pagamento === 'boleto' && (
                <div style={styles.boletoDetails}>
                  <div style={styles.boletoHeader}>
                    <Banknote size={24} color="#f59e0b" />
                    <span style={styles.boletoTitle}>Boleto Bancário</span>
                  </div>

                  <div style={styles.boletoInfo}>
                    <div style={styles.boletoRow}>
                      <Clock size={16} color="#64748b" />
                      <span>Vencimento: <strong>5 dias úteis</strong></span>
                    </div>
                    <div style={styles.boletoRow}>
                      <AlertCircle size={16} color="#64748b" />
                      <span>Após o vencimento, o boleto será cancelado</span>
                    </div>
                    <div style={styles.boletoRow}>
                      <Shield size={16} color="#64748b" />
                      <span>Boleto registrado no Banco do Brasil</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Boleto gerado com sucesso!')}
                    style={styles.boletoButton}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
                  >
                    <Banknote size={18} />
                    Gerar Boleto
                  </button>
                </div>
              )}

              {/* Detalhes PayPal */}
              {pagamento === 'paypal' && (
                <div style={styles.paypalDetails}>
                  <div style={styles.paypalHeader}>
                    <Wallet size={24} color="#0070ba" />
                    <span style={styles.paypalTitle}>PayPal</span>
                  </div>

                  <div style={styles.paypalInfo}>
                    <p>Você será redirecionado para o PayPal para concluir o pagamento.</p>
                    <div style={styles.paypalSeguro}>
                      <Shield size={16} color="#0070ba" />
                      <span>Pagamento seguro com criptografia SSL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes Google Pay */}
              {pagamento === 'googlepay' && (
                <div style={styles.googlepayDetails}>
                  <div style={styles.googlepayHeader}>
                    <Smartphone size={24} color="#4285f4" />
                    <span style={styles.googlepayTitle}>Google Pay</span>
                  </div>

                  <div style={styles.googlepayInfo}>
                    <div style={styles.googlepayRow}>
                      <CircleCheck size={16} color="#4285f4" />
                      <span>Pagamento rápido e seguro</span>
                    </div>
                    <div style={styles.googlepayRow}>
                      <CircleCheck size={16} color="#4285f4" />
                      <span>Use seus cartões salvos no Google</span>
                    </div>
                    <div style={styles.googlepayRow}>
                      <CircleCheck size={16} color="#4285f4" />
                      <span>Confirmação em tempo real</span>
                    </div>
                    <button
                      onClick={() => alert('Redirecionando para Google Pay...')}
                      style={styles.googlepayButton}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#3367d6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#4285f4'}
                    >
                      <Smartphone size={18} />
                      Pagar com Google Pay
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Confirmar */}
            <button
              disabled={carrinhoVazio || loading}
              onClick={handleConfirmarPagamento}
              style={{
                ...styles.confirmButton,
                ...(carrinhoVazio || loading ? styles.confirmButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!carrinhoVazio && !loading) {
                  e.currentTarget.style.background = '#7b4b2a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 90, 43, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!carrinhoVazio && !loading) {
                  e.currentTarget.style.background = '#8B5A2B';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <div style={styles.loadingSpinner}>
                  <div style={styles.spinner} />
                  Processando...
                </div>
              ) : (
                <>
                  <Lock size={18} />
                  Confirmar Pagamento - R$ {totalFinal.toFixed(2)}
                </>
              )}
            </button>

            {/* Selo de segurança */}
            <div style={styles.securityBadge}>
              <Shield size={16} color="#8B5A2B" />
              <span>Pagamento 100% seguro com criptografia SSL</span>
            </div>
          </div>

          {/* COLUNA DIREITA - Resumo/Informações */}
          <div style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>
                <Lock size={16} color="#8B5A2B" style={{ marginRight: '8px' }} />
                Compra Segura
              </h4>
              <ul style={styles.infoList}>
                <li style={styles.infoListItem}>
                  <CircleCheck size={16} color="#10b981" />
                  <span>Dados criptografados</span>
                </li>
                <li style={styles.infoListItem}>
                  <CircleCheck size={16} color="#10b981" />
                  <span>Certificado SSL</span>
                </li>
                <li style={styles.infoListItem}>
                  <CircleCheck size={16} color="#10b981" />
                  <span>Garantia de entrega</span>
                </li>
              </ul>
            </div>

            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>
                <Truck size={16} color="#8B5A2B" style={{ marginRight: '8px' }} />
                Entregamos em todo Brasil
              </h4>
              <p style={styles.infoText}>Prazo de entrega: 5 a 10 dias úteis</p>
            </div>

            <div style={styles.infoCard}>
              <h4 style={styles.infoTitle}>
                <Headphones size={16} color="#8B5A2B" style={{ marginRight: '8px' }} />
                Suporte
              </h4>
              <div style={styles.socialLinks}>
                <a 
                  href="#" 
                  style={{ ...styles.socialLink, background: '#25D36615' }}
                  title="WhatsApp"
                >
                  <MessageCircle size={20} color="#25D366" />
                </a>
                <a 
                  href="#" 
                  style={{ ...styles.socialLink, background: '#E4405F15' }}
                  title="Instagram"
                >
                  <Camera size={20} color="#E4405F" />
                </a>
                <a 
                  href="#" 
                  style={{ ...styles.socialLink, background: '#FF000015' }}
                  title="YouTube"
                >
                  <Play size={20} color="#FF0000" />
                </a>
                <a 
                  href="#" 
                  style={{ ...styles.socialLink, background: '#1877f215' }}
                  title="Facebook"
                >
                  <Send size={20} color="#1877f2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      {mostrarSucesso && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>
              <CircleCheck size={56} color="#10b981" />
            </div>
            <h2 style={styles.modalTitle}>
              {curso ? "Inscrição realizada!" : "Compra realizada!"}
            </h2>
            <p style={styles.modalMessage}>
              {curso
                ? "Sua inscrição foi realizada com sucesso."
                : "Seu pedido foi recebido com sucesso."}
            </p>
            <p style={styles.modalPayment}>
              Forma de pagamento: <strong>{opcoesPagamento.find(o => o.id === pagamento)?.label || pagamento.toUpperCase()}</strong>
            </p>
            <div style={styles.modalDivider} />
            <div style={styles.modalOrderSummary}>
              <span>Total pago:</span>
              <strong>R$ {totalFinal.toFixed(2)}</strong>
            </div>
            <button
              onClick={() => {
                setMostrarSucesso(false);
                navigate("/");
              }}
              style={styles.modalButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#7b4b2a';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#8B5A2B';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Voltar para página inicial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f1e8",
    padding: "40px 20px"
  },
  wrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    marginBottom: "24px",
    padding: "8px 0",
    fontSize: "15px",
    transition: "all 0.3s"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px"
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "#64748b",
    margin: 0,
    fontSize: "16px"
  },
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px"
  },
  stepActive: {
    color: "#8B5A2B",
    fontWeight: "600"
  },
  stepInactive: {
    color: "#94a3b8"
  },
  stepNumber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#8B5A2B",
    color: "white",
    fontSize: "12px",
    fontWeight: "700"
  },
  stepLabel: {
    fontSize: "13px"
  },
  stepLine: {
    width: "24px",
    height: "2px",
    background: "#d6d3d1"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: "24px"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #e7e5e4"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px"
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#1f2937",
    fontWeight: "600"
  },
  cursoCard: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px"
  },
  cursoNome: {
    margin: "0 0 12px 0",
    color: "#8B5A2B",
    fontSize: "18px"
  },
  alunoInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#475569",
    fontSize: "14px",
    marginBottom: "6px"
  },
  cursoPreco: {
    marginTop: "12px",
    fontWeight: "700",
    fontSize: "20px",
    color: "#8B5A2B"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f0ed"
  },
  itemInfo: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },
  itemNome: {
    color: "#1f2937",
    fontSize: "15px"
  },
  itemQtd: {
    color: "#64748b",
    fontSize: "14px"
  },
  itemPreco: {
    color: "#1f2937",
    fontWeight: "500"
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e7e5e4",
    margin: "16px 0"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937"
  },
  totalValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#8B5A2B"
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    padding: "20px 0"
  },
  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px"
  },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.3s",
    width: "100%"
  },
  paymentOptionSelected: {
    borderColor: "#8B5A2B",
    background: "#faf7f0",
    boxShadow: "0 0 0 4px rgba(139, 90, 43, 0.08)"
  },
  paymentIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  paymentInfo: {
    flex: 1,
    textAlign: "left"
  },
  paymentLabel: {
    display: "block",
    fontWeight: "600",
    color: "#1f2937",
    fontSize: "15px"
  },
  paymentDescription: {
    display: "block",
    fontSize: "13px",
    color: "#64748b"
  },
  pixDetails: {
    marginTop: "16px",
    padding: "20px",
    background: "#f0fdf4",
    borderRadius: "12px",
    border: "1px solid #bbf7d0"
  },
  pixHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px"
  },
  pixTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#065f46"
  },
  qrCodeContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px"
  },
  qrCode: {
    width: "160px",
    height: "160px",
    background: "white",
    borderRadius: "12px",
    padding: "12px",
    border: "2px solid #d1fae5",
    position: "relative"
  },
  qrCodeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(25, 1fr)",
    gridTemplateRows: "repeat(25, 1fr)",
    width: "100%",
    height: "100%"
  },
  qrBlock: {
    width: "100%",
    height: "100%",
    border: "0.5px solid #f0fdf4"
  },
  qrCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
    color: "#10b981"
  },
  pixInfo: {
    marginBottom: "16px"
  },
  pixRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "14px"
  },
  pixLabel: {
    color: "#64748b"
  },
  pixValue: {
    color: "#1f2937",
    fontWeight: "500"
  },
  copyButton: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s"
  },
  cartaoDetails: {
    marginTop: "16px",
    padding: "20px",
    background: "#f8f7ff",
    borderRadius: "12px",
    border: "1px solid #c7d2fe"
  },
  cartaoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px"
  },
  cartaoTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#4338ca"
  },
  cartaoForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937"
  },
  formInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d6d3d1",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s"
  },
  formInputError: {
    borderColor: "#dc2626",
    boxShadow: "0 0 0 3px rgba(220,38,38,0.1)"
  },
  formSelect: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d6d3d1",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    cursor: "pointer"
  },
  formRow: {
    display: "flex",
    gap: "12px"
  },
  errorText: {
    fontSize: "12px",
    color: "#dc2626"
  },
  cartaoSeguro: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: "#f1f5f9",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#475569"
  },
  boletoDetails: {
    marginTop: "16px",
    padding: "20px",
    background: "#fffbeb",
    borderRadius: "12px",
    border: "1px solid #fde68a"
  },
  boletoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px"
  },
  boletoTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#92400e"
  },
  boletoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px"
  },
  boletoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#475569"
  },
  boletoButton: {
    width: "100%",
    padding: "12px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s"
  },
  paypalDetails: {
    marginTop: "16px",
    padding: "20px",
    background: "#eff6ff",
    borderRadius: "12px",
    border: "1px solid #93c5fd"
  },
  paypalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px"
  },
  paypalTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#0070ba"
  },
  paypalInfo: {
    color: "#475569",
    fontSize: "14px"
  },
  paypalSeguro: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
    padding: "10px 14px",
    background: "white",
    borderRadius: "8px",
    border: "1px solid #93c5fd"
  },
  googlepayDetails: {
    marginTop: "16px",
    padding: "20px",
    background: "#f0f7ff",
    borderRadius: "12px",
    border: "1px solid #a3c4f7"
  },
  googlepayHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px"
  },
  googlepayTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#4285f4"
  },
  googlepayInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  googlepayRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#475569"
  },
  googlepayButton: {
    marginTop: "12px",
    padding: "12px",
    background: "#4285f4",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s"
  },
  confirmButton: {
    width: "100%",
    padding: "16px",
    background: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s"
  },
  confirmButtonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
    opacity: 0.7
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  securityBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    padding: "10px",
    fontSize: "13px",
    color: "#64748b"
  },
  infoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e7e5e4",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
  },
  infoTitle: {
    margin: "0 0 10px 0",
    fontSize: "15px",
    color: "#1f2937",
    display: "flex",
    alignItems: "center"
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  infoListItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 0",
    fontSize: "14px",
    color: "#475569"
  },
  infoText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px"
  },
  socialLinks: {
    display: "flex",
    gap: "12px",
    marginTop: "6px"
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#f5f1e8",
    transition: "all 0.3s",
    textDecoration: "none",
    border: "none",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "20px"
  },
  modalContent: {
    background: "#fff",
    width: "440px",
    maxWidth: "100%",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    animation: "modalSlideUp 0.3s ease"
  },
  modalIcon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalTitle: {
    color: "#1f2937",
    fontSize: "24px",
    margin: "0 0 8px 0",
    fontWeight: "700"
  },
  modalMessage: {
    color: "#64748b",
    fontSize: "16px",
    margin: "0 0 8px 0",
    lineHeight: "1.6"
  },
  modalPayment: {
    color: "#475569",
    fontSize: "15px",
    margin: "0 0 16px 0"
  },
  modalDivider: {
    border: "none",
    borderTop: "1px solid #e7e5e4",
    margin: "16px 0"
  },
  modalOrderSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    marginBottom: "20px"
  },
  modalButton: {
    background: "#8B5A2B",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    transition: "all 0.3s",
    width: "100%"
  }
};

// Estilos globais para animações
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  </style>
`);

export default Checkout;