import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { AdminModal } from '../components/AdminModal';
import Swal from 'sweetalert2';
import {
  Star,
  Play,
  Gamepad2,
  BookOpen,
  Music2,
  Ship,
  Award,
  Sparkles,
  Heart,
  Film,
  Brain,
  Clock,
  Tag,
  X,
  ExternalLink,
  ChevronRight,
  Users,
  Smile,
  Rocket,
  Lightbulb,
  Globe,
  Loader2,
  PlusCircle
} from 'lucide-react';

// Mapeamento de ícones para exibição
const iconMap = {
  Film: Film,
  Gamepad2: Gamepad2,
  BookOpen: BookOpen,
  Music2: Music2,
  Ship: Ship,
  Brain: Brain,
  Star: Star,
  Heart: Heart,
  Globe: Globe,
  Sparkles: Sparkles,
  Users: Users,
  Smile: Smile,
  Rocket: Rocket,
  Play: Play,
  Award: Award
};

function KidsArea() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [atividadeAtiva, setAtividadeAtiva] = useState(null);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [deletando, setDeletando] = useState({});
  const [carregandoAdmin, setCarregandoAdmin] = useState(true);

  useEffect(() => {
    carregarDados();
    verificarAdmin();
  }, [user]);

  const verificarAdmin = async () => {
    try {
      setCarregandoAdmin(true);
      if (user) {
        const admin = await adminService.isAdmin(user.id);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      setIsAdmin(false);
    } finally {
      setCarregandoAdmin(false);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await adminService.getAtividades();
      setAtividades(dados || []);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar as atividades.',
        confirmButtonColor: '#8b5e3c',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriarAtividade = async (dados) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem criar atividades.',
        confirmButtonColor: '#8b5e3c',
      });
      return;
    }

    try {
      const novaAtividade = await adminService.criarAtividade(dados);
      setAtividades(prev => [...prev, novaAtividade]);
      
      Swal.fire({
        icon: 'success',
        title: 'Atividade criada!',
        text: `"${novaAtividade.titulo}" foi adicionada com sucesso.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível criar a atividade.',
        confirmButtonColor: '#8b5e3c',
      });
      throw error;
    }
  };

  const handleDeletarAtividade = async (id, titulo) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem deletar atividades.',
        confirmButtonColor: '#8b5e3c',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a deletar "${titulo}". Esta ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletando(prev => ({ ...prev, [id]: true }));
      await adminService.deletarAtividade(id);
      setAtividades(prev => prev.filter(a => a.id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deletada!',
        text: `"${titulo}" foi removida.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível deletar a atividade.',
        confirmButtonColor: '#8b5e3c',
      });
    } finally {
      setDeletando(prev => ({ ...prev, [id]: false }));
    }
  };

  const abrirAtividade = (atividade) => {
    if (atividade.link && atividade.link.startsWith("http")) {
      window.open(atividade.link, "_blank");
      return;
    }
    setAtividadeAtiva(atividade);
  };

  const fecharModal = () => {
    setAtividadeAtiva(null);
  };

  const camposAtividade = [
    { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Ex: História de Davi e Golias', required: true },
    { name: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'Vídeo', label: 'Vídeo' },
      { value: 'Jogo', label: 'Jogo' },
      { value: 'Leitura', label: 'Leitura' },
      { value: 'Música', label: 'Música' },
    ], required: true },
    { name: 'duracao', label: 'Duração', type: 'text', placeholder: 'Ex: 15 min ou Livre', required: true },
    { name: 'link', label: 'Link (opcional)', type: 'text', placeholder: 'https://youtu.be/...' },
    { name: 'emoji', label: 'Emoji', type: 'text', placeholder: '⭐', required: true },
    { name: 'cor', label: 'Cor', type: 'text', placeholder: '#3b82f6', required: true },
    { name: 'bg_cor', label: 'Cor de Fundo', type: 'text', placeholder: '#eff6ff', required: true },
    { name: 'icone', label: 'Ícone', type: 'select', options: [
      { value: 'Film', label: 'Filme' },
      { value: 'Gamepad2', label: 'Gamepad' },
      { value: 'BookOpen', label: 'Livro' },
      { value: 'Music2', label: 'Música' },
      { value: 'Ship', label: 'Navio' },
      { value: 'Brain', label: 'Cérebro' },
      { value: 'Heart', label: 'Coração' },
      { value: 'Star', label: 'Estrela' },
      { value: 'Sparkles', label: 'Brilho' },
      { value: 'Globe', label: 'Globo' },
      { value: 'Play', label: 'Play' },
      { value: 'Award', label: 'Prêmio' },
    ], required: true },
  ];

  const styles = {
    container: {
      background: "#f7f4ed",
      minHeight: "100vh",
      padding: "30px 20px",
    },
    wrapper: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    header: {
      background: "linear-gradient(135deg, #9a6649, #b8836a)",
      borderRadius: "22px",
      padding: "32px 36px",
      display: "flex",
      alignItems: "center",
      gap: "24px",
      marginBottom: "45px",
      position: "relative",
      overflow: "hidden",
    },
    headerDecor: {
      position: "absolute",
      right: "-40px",
      top: "-40px",
      fontSize: "200px",
      opacity: 0.06,
      color: "white",
      pointerEvents: "none",
      fontFamily: "serif",
    },
    headerIconBox: {
      width: "72px",
      height: "72px",
      background: "rgba(255,255,255,0.15)",
      borderRadius: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      flexShrink: 0,
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(255,255,255,0.1)",
    },
    headerTitle: {
      color: "white",
      fontSize: "42px",
      marginBottom: "6px",
      fontWeight: "700",
      letterSpacing: "-0.5px",
    },
    headerSubtitle: {
      color: "#f3e8e2",
      fontSize: "18px",
      margin: 0,
      opacity: 0.95,
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    sectionTitle: {
      fontSize: "34px",
      color: "#0f172a",
      margin: 0,
      fontWeight: "700",
      letterSpacing: "-0.5px",
    },
    sectionDivider: {
      flex: 1,
      height: "2px",
      background: "linear-gradient(to right, #e7e5e4, transparent)",
      marginLeft: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 320px))",
      justifyContent: "center",
      gap: "26px",
      marginBottom: "40px",
    },
    card: {
      background: "#fff",
      borderRadius: "20px",
      padding: "28px",
      border: "1px solid #e7e5e4",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    cardHover: {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
    },
    iconBox: (cor, bgCor) => ({
      width: "60px",
      height: "60px",
      background: bgCor || cor + "20",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: cor,
      marginBottom: "22px",
      border: "2px solid " + (bgCor ? cor + "40" : "transparent"),
    }),
    cardTitle: {
      fontSize: "24px",
      color: "#0f172a",
      marginBottom: "14px",
      fontWeight: "600",
      minHeight: "60px",
      display: "flex",
      alignItems: "flex-start",
      lineHeight: "1.3",
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "14px",
      borderTop: "1px solid #f0ebe3",
    },
    tag: (cor) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 12px",
      borderRadius: "100px",
      background: cor + "15",
      color: cor,
      fontSize: "13px",
      fontWeight: "500",
    }),
    duracao: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      color: "#94a3b8",
      fontSize: "13px",
      fontWeight: "500",
    },
    badge: (cor) => ({
      position: "absolute",
      top: "16px",
      right: "16px",
      background: cor,
      color: "white",
      padding: "4px 12px",
      borderRadius: "100px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.3px",
      zIndex: 1,
    }),
    tipBox: {
      background: "linear-gradient(135deg, #fef9e7, #fef3c7)",
      border: "1px solid #fcd34d",
      borderRadius: "18px",
      padding: "28px 32px",
    },
    tipTitle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#a16207",
      marginBottom: "12px",
      fontSize: "26px",
      fontWeight: "700",
    },
    tipText: {
      color: "#57534e",
      lineHeight: "1.8",
      fontSize: "17px",
      margin: 0,
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      padding: "20px",
      animation: "fadeIn 0.3s ease",
    },
    modalContent: {
      background: "white",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "650px",
      padding: "32px",
      animation: "slideUp 0.3s ease",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    modalTitle: {
      color: "#0f172a",
      fontSize: "30px",
      fontWeight: "700",
      margin: 0,
    },
    modalClose: {
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
      color: "#475569",
    },
    modalBody: (cor) => ({
      background: cor + "10",
      borderRadius: "16px",
      padding: "50px",
      textAlign: "center",
      border: "2px dashed " + cor + "40",
    }),
    modalIcon: (cor) => ({
      fontSize: "64px",
      marginBottom: "16px",
      color: cor,
      display: "block",
    }),
    modalText: {
      fontSize: "18px",
      color: "#475569",
      margin: "8px 0 0 0",
    },
    modalSubText: {
      fontSize: "14px",
      color: "#94a3b8",
      margin: "8px 0 0 0",
    },
  };

  if (loading || carregandoAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f2ea' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerDecor}>✨</div>
          <div style={styles.headerDecor}>
            <div style={{ position: "absolute", right: "80px", bottom: "-60px", fontSize: "140px", opacity: 0.05 }}>
              ✨
            </div>
          </div>

          <div style={styles.headerIconBox}>
            <Sparkles size={34} />
          </div>

          <div>
            <h1 style={styles.headerTitle}>Kids - Área Infantil</h1>
            <p style={styles.headerSubtitle}>
              Aprenda sobre a Palavra de Deus de forma divertida!
            </p>
          </div>

          <div style={{
            marginLeft: "auto",
            display: "flex",
            gap: "8px",
            opacity: 0.3,
          }}>
            <Star size={20} fill="white" color="white" />
            <Star size={16} fill="white" color="white" />
            <Star size={24} fill="white" color="white" />
            <Star size={14} fill="white" color="white" />
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <Rocket size={28} color="#9a6649" style={{ flexShrink: 0 }} />
          <h2 style={styles.sectionTitle}>Atividades Disponíveis</h2>
          <div style={styles.sectionDivider} />
          
          {isAdmin && (
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
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6b3f2a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#8b5e3c'}
            >
              <PlusCircle size={20} />
              Adicionar Atividade
            </button>
          )}
        </div>

        {atividades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '18px' }}>
            <Sparkles size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
            <p style={{ color: '#64748b', fontSize: '18px' }}>
              Nenhuma atividade disponível ainda.
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
                Criar primeira atividade
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {atividades.map((atv) => {
              const IconComponent = iconMap[atv.icone] || Star;
              const isInteractive = atv.link && atv.link.startsWith("http");

              return (
                <div
                  key={atv.id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = styles.cardHover.transform;
                    e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                  onClick={() => abrirAtividade(atv)}
                >
                  {/* 🔥 BOTÃO DELETAR - CANTO SUPERIOR DIREITO */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletarAtividade(atv.id, atv.titulo);
                      }}
                      disabled={deletando[atv.id]}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(220, 38, 38, 0.9)',
                        border: 'none',
                        color: 'white',
                        cursor: deletando[atv.id] ? 'not-allowed' : 'pointer',
                        padding: '6px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        zIndex: 10,
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: deletando[atv.id] ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {deletando[atv.id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  )}

                  {/* 🔥 BADGE - POSIÇÃO AJUSTADA */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '50px',
                    background: atv.cor,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.3px',
                    zIndex: 1,
                  }}>
                    {isInteractive ? "Disponível" : "Em breve"}
                  </div>

                  <div style={styles.iconBox(atv.cor, atv.bg_cor)}>
                    <IconComponent size={28} />
                  </div>

                  <h3 style={styles.cardTitle}>
                    {atv.titulo}
                  </h3>

                  <div style={styles.cardFooter}>
                    <span style={styles.tag(atv.cor)}>
                      <Tag size={14} />
                      {atv.tipo}
                    </span>
                    <span style={styles.duracao}>
                      <Clock size={14} />
                      {atv.duracao}
                    </span>
                  </div>

                  <div style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    color: "#cbd5e1",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#9a6649"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#cbd5e1"}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.tipBox}>
          <div style={styles.tipTitle}>
            <Lightbulb size={28} color="#d97706" />
            Dica para os Pais
          </div>
          <p style={styles.tipText}>
            Esta área foi criada especialmente para ensinar as crianças sobre a
            Palavra de Deus de forma lúdica e educativa. Recomendamos que os pais
            acompanhem as atividades junto com as crianças para criar momentos
            especiais de aprendizado em família.
          </p>
          <div style={{
            display: "flex",
            gap: "12px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              background: "white",
              borderRadius: "100px",
              fontSize: "13px",
              color: "#57534e",
              border: "1px solid #fcd34d",
            }}>
              <Heart size={14} color="#dc2626" />
              Aprendizado em família
            </span>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              background: "white",
              borderRadius: "100px",
              fontSize: "13px",
              color: "#57534e",
              border: "1px solid #fcd34d",
            }}>
              <Users size={14} color="#3b82f6" />
              Momentos especiais
            </span>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              background: "white",
              borderRadius: "100px",
              fontSize: "13px",
              color: "#57534e",
              border: "1px solid #fcd34d",
            }}>
              <Smile size={14} color="#22c55e" />
              Diversão e aprendizado
            </span>
          </div>
        </div>

        {atividadeAtiva && (
          <div style={styles.modalOverlay} onClick={fecharModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {atividadeAtiva.titulo}
                </h3>
                <button
                  onClick={fecharModal}
                  style={styles.modalClose}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.transform = "rotate(0)";
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={styles.modalBody(atividadeAtiva.cor)}>
                <div style={styles.modalIcon(atividadeAtiva.cor)}>
                  {atividadeAtiva.emoji || "⭐"}
                </div>
                <p style={styles.modalText}>
                  {atividadeAtiva.link && atividadeAtiva.link.startsWith("http")
                    ? "Você será redirecionado para o conteúdo!"
                    : "Esta atividade estará disponível em breve!"}
                </p>
                <p style={styles.modalSubText}>
                  {atividadeAtiva.tipo} • {atividadeAtiva.duracao}
                </p>

                {atividadeAtiva.link && atividadeAtiva.link.startsWith("http") && (
                  <button
                    onClick={() => {
                      window.open(atividadeAtiva.link, "_blank");
                      fecharModal();
                    }}
                    style={{
                      marginTop: "20px",
                      padding: "12px 28px",
                      background: atividadeAtiva.cor,
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <ExternalLink size={18} />
                    Abrir Atividade
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {isAdmin && (
          <AdminModal
            isOpen={modalCriarOpen}
            onClose={() => setModalCriarOpen(false)}
            onSave={handleCriarAtividade}
            title="Nova Atividade"
            fields={camposAtividade}
            initialData={{
              titulo: '',
              tipo: 'Vídeo',
              duracao: '',
              link: '',
              emoji: '⭐',
              cor: '#3b82f6',
              bg_cor: '#eff6ff',
              icone: 'Film'
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
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
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f7f4ed;
        }
        ::-webkit-scrollbar-thumb {
          background: #c4b5a5;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9a6649;
        }
      `}</style>
    </div>
  );
}

export default KidsArea;