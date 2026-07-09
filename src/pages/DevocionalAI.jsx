import { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Church,
  Activity,
  Heart,
  Users,
  Edit2,
  Trash2,
  Plus,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

export default function DevocionalAI() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@obomsamaritano.com';
  
  const [devocionais, setDevocionais] = useState([]);
  const [devocionalAtual, setDevocionalAtual] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editando, setEditando] = useState(false);
  
  // Estado para o formulário de criação/edição
  const [formData, setFormData] = useState({
    titulo: "",
    versiculo: "",
    referencia: "",
    reflexao: "",
    oracao: "",
    data: new Date().toISOString().split('T')[0]
  });

  // Dados padrão para o devocional
  const devocionalPadrao = {
    id: 1,
    titulo: "A Fé que Move Montanhas",
    versiculo: "Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará. Nada vos será impossível.",
    referencia: "Mateus 17:20",
    reflexao: "Hoje refletimos sobre o poder da fé genuína. Não se trata do tamanho da nossa fé, mas da grandeza do Deus em quem confiamos. Mesmo uma fé pequena, quando colocada no Deus Todo-Poderoso, pode realizar o impossível. Que possamos cultivar nossa fé diariamente através da oração, leitura da Palavra e comunhão com Deus.\n\nEm meio às dificuldades, incertezas e desafios da vida, somos convidados a lembrar que Deus permanece soberano e fiel às Suas promessas. A fé não elimina as tempestades, mas nos dá a certeza de que não estamos sozinhos enquanto atravessamos cada uma delas. Quando escolhemos confiar no Senhor, aprendemos a descansar em Sua vontade, mesmo quando não compreendemos todos os Seus caminhos.\n\nQue hoje você entregue a Deus os seus medos, preocupações e sonhos. Permita que Ele fortaleça o seu coração e renove a sua esperança. Continue caminhando com perseverança, sabendo que o Senhor honra aqueles que O buscam com sinceridade. Que a sua fé seja alimentada todos os dias pela presença de Deus, transformando cada passo da sua jornada em uma oportunidade de testemunhar o Seu amor, a Sua graça e o Seu cuidado.",
    oracao: "Senhor, aumenta minha fé. Ajuda-me a confiar mais em Ti e menos em minhas próprias forças. Que eu possa ver Teus milagres acontecendo em minha vida enquanto deposito minha confiança em Tuas promessas. Em nome de Jesus, Amém.",
    data: new Date().toISOString().split('T')[0]
  };

  useEffect(() => {
    carregarDevocionais();
  }, []);

  const carregarDevocionais = () => {
    try {
      setLoading(true);
      // Busca devocionais do localStorage
      const devocionaisSalvos = localStorage.getItem('devocionais');
      if (devocionaisSalvos) {
        const parsed = JSON.parse(devocionaisSalvos);
        setDevocionais(parsed);
        if (parsed.length > 0) {
          // Pega o devocional do dia (ou o primeiro da lista)
          const hoje = new Date().toISOString().split('T')[0];
          const devocionalHoje = parsed.find(d => d.data === hoje) || parsed[0];
          setDevocionalAtual(devocionalHoje);
          setIndiceAtual(parsed.indexOf(devocionalHoje));
        }
      } else {
        // Cria devocional padrão
        const devocionalInicial = [devocionalPadrao];
        localStorage.setItem('devocionais', JSON.stringify(devocionalInicial));
        setDevocionais(devocionalInicial);
        setDevocionalAtual(devocionalInicial[0]);
        setIndiceAtual(0);
      }
    } catch (error) {
      console.error('Erro ao carregar devocionais:', error);
      // Fallback
      setDevocionais([devocionalPadrao]);
      setDevocionalAtual(devocionalPadrao);
    } finally {
      setLoading(false);
    }
  };

  // Salvar devocionais no localStorage
  const salvarDevocionais = (novosDevocionais) => {
    localStorage.setItem('devocionais', JSON.stringify(novosDevocionais));
    setDevocionais(novosDevocionais);
  };

  // Navegar entre devocionais
  const navegarDevocional = (direcao) => {
    const novoIndice = indiceAtual + direcao;
    if (novoIndice >= 0 && novoIndice < devocionais.length) {
      setIndiceAtual(novoIndice);
      setDevocionalAtual(devocionais[novoIndice]);
    }
  };

  // Abrir modal de criação/edição
  const abrirFormulario = (devocional = null) => {
    if (devocional) {
      setFormData({
        titulo: devocional.titulo || "",
        versiculo: devocional.versiculo || "",
        referencia: devocional.referencia || "",
        reflexao: devocional.reflexao || "",
        oracao: devocional.oracao || "",
        data: devocional.data || new Date().toISOString().split('T')[0]
      });
      setEditando(true);
    } else {
      setFormData({
        titulo: "",
        versiculo: "",
        referencia: "",
        reflexao: "",
        oracao: "",
        data: new Date().toISOString().split('T')[0]
      });
      setEditando(false);
    }
    setModoEdicao(true);
  };

  // Fechar modal
  const fecharFormulario = () => {
    setModoEdicao(false);
    setEditando(false);
  };

  // Salvar devocional (criar ou editar)
  const salvarDevocional = () => {
    // Validação
    if (!formData.titulo.trim() || !formData.versiculo.trim() || !formData.referencia.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha pelo menos o título, versículo e referência.',
        confirmButtonColor: '#8b5e3c'
      });
      return;
    }

    if (editando) {
      // Editando devocional existente
      const devocionalEditado = {
        ...devocionalAtual,
        ...formData
      };
      const novosDevocionais = devocionais.map(d => 
        d.id === devocionalAtual.id ? devocionalEditado : d
      );
      salvarDevocionais(novosDevocionais);
      setDevocionalAtual(devocionalEditado);
      
      Swal.fire({
        icon: 'success',
        title: 'Devocional atualizado!',
        text: 'O devocional foi atualizado com sucesso.',
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c'
      });
    } else {
      // Criando novo devocional
      const novoDevocional = {
        id: Date.now(),
        ...formData
      };
      const novosDevocionais = [...devocionais, novoDevocional];
      salvarDevocionais(novosDevocionais);
      setDevocionalAtual(novoDevocional);
      setIndiceAtual(novosDevocionais.length - 1);
      
      Swal.fire({
        icon: 'success',
        title: 'Devocional criado!',
        text: 'O novo devocional foi adicionado com sucesso.',
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c'
      });
    }
    fecharFormulario();
  };

  // Deletar devocional
  const deletarDevocional = async () => {
    if (devocionais.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Não é possível deletar',
        text: 'Você precisa ter pelo menos um devocional.',
        confirmButtonColor: '#8b5e3c'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Deletar devocional?',
      text: `Tem certeza que deseja deletar "${devocionalAtual.titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      const novosDevocionais = devocionais.filter(d => d.id !== devocionalAtual.id);
      salvarDevocionais(novosDevocionais);
      
      if (novosDevocionais.length > 0) {
        setDevocionalAtual(novosDevocionais[0]);
        setIndiceAtual(0);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Deletado!',
        text: 'O devocional foi removido com sucesso.',
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c'
      });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#f5f2ea' 
      }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f2ea",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* BANNER - DEVOCIONAL */}
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
                Palavra de Deus
              </span>
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              Devocional Diário
            </h1>

            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              margin: '0 0 4px 0',
              fontWeight: '400',
              lineHeight: 1.6,
            }}>
              Alimente sua alma com a Palavra de Deus
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
                "Examinais as Escrituras, porque vós cuidais ter nelas a vida eterna, e são elas que de mim testificam"
              </p>
              <p style={{
                fontSize: '13px',
                margin: '4px 0 0 0',
                opacity: 0.7,
                fontWeight: '300',
              }}>
                — João 5:39
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
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  Devocional do Dia
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  Para sua alma
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  Renove sua fé
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "34px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            marginBottom: "28px",
            position: "relative",
          }}
        >
          {/* TOPO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#9b6b4f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarDays
                  size={24}
                  color="white"
                />
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#0f172a",
                    marginBottom: "4px",
                  }}
                >
                  {devocionalAtual?.titulo || "Devocional do Dia"}
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                  }}
                >
                  {devocionalAtual?.data 
                    ? new Date(devocionalAtual.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : "Data não disponível"}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {/* Botões Admin */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => abrirFormulario(devocionalAtual)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.color = '#8b5e3c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }}
                    title="Editar devocional"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={deletarDevocional}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }}
                    title="Deletar devocional"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}

              <button
                onClick={() => navegarDevocional(-1)}
                disabled={indiceAtual === 0}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: indiceAtual === 0 ? '#d6d3d1' : '#64748b',
                  cursor: indiceAtual === 0 ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (indiceAtual !== 0) {
                    e.currentTarget.style.color = '#8b5e3c';
                    e.currentTarget.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  if (indiceAtual !== 0) {
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={() => navegarDevocional(1)}
                disabled={indiceAtual === devocionais.length - 1}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: indiceAtual === devocionais.length - 1 ? '#d6d3d1' : '#64748b',
                  cursor: indiceAtual === devocionais.length - 1 ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (indiceAtual !== devocionais.length - 1) {
                    e.currentTarget.style.color = '#8b5e3c';
                    e.currentTarget.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  if (indiceAtual !== devocionais.length - 1) {
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                <ChevronRight size={22} />
              </button>

              {/* Botão Adicionar Novo - Admin */}
              {isAdmin && (
                <button
                  onClick={() => abrirFormulario()}
                  style={{
                    border: 'none',
                    background: '#8b5e3c',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#7a5235';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#8b5e3c';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Plus size={18} />
                  Novo
                </button>
              )}
            </div>
          </div>

          {/* INDICADOR DE PÁGINA */}
          {devocionais.length > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '20px',
            }}>
              {devocionais.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === indiceAtual ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: index === indiceAtual ? '#8b5e3c' : '#d6d3d1',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setIndiceAtual(index);
                    setDevocionalAtual(devocionais[index]);
                  }}
                />
              ))}
            </div>
          )}

          {/* VERSÍCULO */}
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <BookOpen
                size={22}
                color="#8b5e3c"
              />

              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Versículo do Dia
              </h3>
            </div>

            <div
              style={{
                background: "#efe2cd",
                borderRadius: "14px",
                padding: "22px",
                borderLeft: "4px solid #8b5e3c",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.8",
                  color: "#1e293b",
                  fontStyle: "italic",
                  marginBottom: "14px",
                }}
              >
                {devocionalAtual?.versiculo || "Versículo não disponível"}
              </p>

              <p
                style={{
                  color: "#8b5e3c",
                  fontWeight: "600",
                }}
              >
                {devocionalAtual?.referencia || "Referência não disponível"}
              </p>
            </div>
          </div>

          {/* REFLEXÃO */}
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Reflexão
            </h3>

            <p
              style={{
                color: "#334155",
                lineHeight: "2",
                fontSize: "18px",
                whiteSpace: "pre-wrap",
              }}
            >
              {devocionalAtual?.reflexao || "Reflexão não disponível"}
            </p>
          </div>

          {/* ORAÇÃO */}
          <div
            style={{
              background: "#edf2f7",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Oração
            </h3>

            <p
              style={{
                color: "#334155",
                lineHeight: "2",
                fontSize: "18px",
                fontStyle: "italic",
                whiteSpace: "pre-wrap",
              }}
            >
              {devocionalAtual?.oracao || "Oração não disponível"}
            </p>
          </div>
        </div>

        {/* RODAPÉ */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: "40px",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            ✝️ "A tua palavra é lâmpada para os meus pés e luz para o meu caminho" — Salmos 119:105
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE CRIAÇÃO/EDIÇÃO - FUNDO BRANCO */}
      {/* ============================================ */}
      {modoEdicao && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.2)", // Fundo semi-transparente
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            backdropFilter: "blur(2px)",
          }}
          onClick={fecharFormulario}
        >
          <div
            style={{
              background: "white", // Fundo BRANCO
              borderRadius: "24px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "modalSlideUp 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {editando ? "Editar Devocional" : "Novo Devocional"}
              </h2>

              <button
                onClick={fecharFormulario}
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.transform = "rotate(0)";
                }}
              >
                <X size={22} color="#475569" />
              </button>
            </div>

            {/* FORMULÁRIO */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Título do Devocional *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ex: A Fé que Move Montanhas"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Versículo do Dia *
                </label>
                <textarea
                  value={formData.versiculo}
                  onChange={(e) =>
                    setFormData({ ...formData, versiculo: e.target.value })
                  }
                  placeholder="Digite o versículo completo..."
                  rows="2"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Referência *
                </label>
                <input
                  type="text"
                  value={formData.referencia}
                  onChange={(e) =>
                    setFormData({ ...formData, referencia: e.target.value })
                  }
                  placeholder="Ex: Mateus 17:20"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Reflexão
                </label>
                <textarea
                  value={formData.reflexao}
                  onChange={(e) =>
                    setFormData({ ...formData, reflexao: e.target.value })
                  }
                  placeholder="Digite a reflexão do devocional..."
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Oração
                </label>
                <textarea
                  value={formData.oracao}
                  onChange={(e) =>
                    setFormData({ ...formData, oracao: e.target.value })
                  }
                  placeholder="Digite a oração do devocional..."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d6d3d1",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s",
                    background: "white",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5e3c";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(139,94,60,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d6d3d1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <button
                  onClick={salvarDevocional}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#8b5e3c",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#7a5235";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#8b5e3c";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Save size={20} />
                  {editando ? "Atualizar Devocional" : "Criar Devocional"}
                </button>

                <button
                  onClick={fecharFormulario}
                  style={{
                    padding: "14px 24px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMAÇÕES CSS */}
      <style>{`
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
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}