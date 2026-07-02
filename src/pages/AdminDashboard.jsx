import { useState } from "react";
import Swal from 'sweetalert2';
import {
  Globe,
  Lock,
  Users,
  Music,
  Heart,
  Search,
  CheckCircle,
  Plus,
  Shield,
  MessageCircle,
  LogOut,
  ExternalLink,
  UserMinus
} from 'lucide-react';

export default function Comunidade() {
  const [activeTab, setActiveTab] = useState("globais");
  const [searchTerm, setSearchTerm] = useState("");
  const [comunidadesUsuario, setComunidadesUsuario] = useState([]);

  const comunidadesGlobais = [
    {
      id: 1,
      nome: "Comunidade Global",
      membros: 1523,
      descricao: "Comunidade principal para todos os membros",
      whatsapp: "https://chat.whatsapp.com/AAAA111111",
      icon: Globe,
      color: "#8b5e3c"
    },
    {
      id: 2,
      nome: "Jovens Cristãos",
      membros: 456,
      descricao: "Espaço para jovens compartilharem sua fé",
      whatsapp: "https://chat.whatsapp.com/BBBB222222",
      icon: Users,
      color: "#2563eb"
    },
    {
      id: 3,
      nome: "Músicos e Adoradores",
      membros: 289,
      descricao: "Para quem ama adorar através da música",
      whatsapp: "https://chat.whatsapp.com/CCCC333333",
      icon: Music,
      color: "#7c3aed"
    },
  ];

  const comunidadesPrivadas = [
    {
      id: 4,
      nome: "Líderes de Célula",
      membros: 89,
      descricao: "Grupo exclusivo para líderes",
      whatsapp: "https://chat.whatsapp.com/DDDD444444",
      icon: Shield,
      color: "#dc2626"
    },
    {
      id: 5,
      nome: "Missionários em Ação",
      membros: 67,
      descricao: "Comunidade missionária",
      whatsapp: "https://chat.whatsapp.com/EEEE555555",
      icon: Heart,
      color: "#059669"
    },
  ];

  const handleParticipar = (comunidade) => {
    if (!comunidadesUsuario.includes(comunidade.id)) {
      setComunidadesUsuario([
        ...comunidadesUsuario,
        comunidade.id,
      ]);

      // Abrir WhatsApp após participar
      window.open(comunidade.whatsapp, "_blank");
    }
  };

  const handleEntrarGrupo = (comunidade) => {
    window.open(comunidade.whatsapp, "_blank");
  };

  const handleSairComunidade = async (comunidade) => {
    const result = await Swal.fire({
      title: 'Deseja sair desta comunidade?',
      text: `Você está prestes a sair de "${comunidade.nome}". Esta ação pode ser desfeita a qualquer momento.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, sair da comunidade',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn-confirmar-sair',
        cancelButton: 'btn-cancelar-sair'
      }
    });

    if (result.isConfirmed) {
      try {
        // Simular remoção da comunidade
        setComunidadesUsuario(
          comunidadesUsuario.filter(
            (id) => id !== comunidade.id
          )
        );

        await Swal.fire({
          icon: 'success',
          title: 'Você saiu da comunidade!',
          text: `Você não faz mais parte de "${comunidade.nome}".`,
          timer: 2000,
          showConfirmButton: true,
          confirmButtonColor: '#8b5e3c',
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro ao sair',
          text: 'Não foi possível sair da comunidade. Tente novamente.',
          confirmButtonColor: '#8b5e3c',
        });
      }
    }
  };

  const handleCancelarParticipacao = async (comunidade) => {
    const result = await Swal.fire({
      title: 'Cancelar participação?',
      text: `Você não fará mais parte de "${comunidade.nome}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, cancelar participação',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setComunidadesUsuario(
        comunidadesUsuario.filter(
          (id) => id !== comunidade.id
        )
      );
      
      await Swal.fire({
        icon: 'success',
        title: 'Participação cancelada!',
        text: `Você não faz mais parte de "${comunidade.nome}".`,
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });
    }
  };

  const handleParticiparComSweetAlert = async (comunidade) => {
    // Verifica se já está participando
    if (comunidadesUsuario.includes(comunidade.id)) {
      return;
    }

    const result = await Swal.fire({
      title: `Participar de "${comunidade.nome}"?`,
      text: 'Você será redirecionado ao grupo do WhatsApp após confirmar.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#8b5e3c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, participar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setComunidadesUsuario([
        ...comunidadesUsuario,
        comunidade.id,
      ]);

      await Swal.fire({
        icon: 'success',
        title: 'Bem-vindo!',
        text: `Você agora faz parte de "${comunidade.nome}".`,
        timer: 1500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });

      // Abrir WhatsApp após participar
      setTimeout(() => {
        window.open(comunidade.whatsapp, "_blank");
      }, 500);
    }
  };

  const comunidadesAtuais =
    activeTab === "globais"
      ? comunidadesGlobais
      : comunidadesPrivadas;

  const comunidadesFiltradas =
    comunidadesAtuais.filter((com) =>
      com.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  // Estilos em objeto para melhor organização
  const styles = {
    container: {
      background: "#f7f4ed",
      minHeight: "100vh",
      padding: "40px 20px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
      flexWrap: "wrap",
      gap: "16px",
    },
    title: {
      fontSize: "42px",
      color: "#1e293b",
      margin: "0",
      fontWeight: "700",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      color: "#64748b",
      marginBottom: "40px",
      fontSize: "17px",
    },
    tabsContainer: {
      display: "flex",
      gap: "30px",
      borderBottom: "1px solid #d6d3d1",
      marginBottom: "30px",
    },
    tabButton: (isActive) => ({
      background: "none",
      border: "none",
      paddingBottom: "14px",
      cursor: "pointer",
      color: isActive ? "#7c4a2d" : "#64748b",
      fontWeight: "600",
      borderBottom: isActive ? "2px solid #7c4a2d" : "2px solid transparent",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s",
    }),
    searchContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "35px",
    },
    searchInput: {
      width: "500px",
      maxWidth: "100%",
      padding: "14px 18px 14px 44px",
      borderRadius: "12px",
      border: "1px solid #d6d3d1",
      fontSize: "15px",
      background: "#fff",
      outline: "none",
      transition: "all 0.3s",
    },
    searchWrapper: {
      position: "relative",
      width: "500px",
      maxWidth: "100%",
    },
    searchIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94a3b8",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(340px, 340px))",
      justifyContent: "center",
      gap: "24px",
    },
    card: {
      background: "#fff",
      borderRadius: "18px",
      padding: "24px",
      border: "1px solid #e7e5e4",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.3s, transform 0.3s",
    },
    iconBox: (color) => ({
      width: "58px",
      height: "58px",
      background: color,
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      marginBottom: "18px",
    }),
    cardTitle: {
      fontSize: "22px",
      color: "#0f172a",
      marginBottom: "10px",
      fontWeight: "600",
    },
    memberInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#64748b",
      marginBottom: "14px",
      fontSize: "14px",
    },
    description: {
      color: "#475569",
      lineHeight: "1.6",
      marginBottom: "22px",
      fontSize: "15px",
    },
    actionsContainer: {
      display: "flex",
      gap: "8px",
      flexDirection: "column",
    },
    actionsRow: {
      display: "flex",
      gap: "8px",
    },
    button: (isParticipando) => ({
      flex: 1,
      padding: "12px 16px",
      background: isParticipando ? "#16a34a" : "#7c4a2d",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.3s",
    }),
    buttonHover: (isParticipando) => ({
      background: isParticipando ? "#15803d" : "#6b3f2a",
      transform: "scale(1.02)",
    }),
    buttonWhatsapp: {
      flex: 1,
      padding: "12px 16px",
      background: "#25D366",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.3s",
    },
    buttonSair: {
      padding: "12px 16px",
      background: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "all 0.3s",
      minWidth: "48px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Comunidades</h1>
            <p style={styles.subtitle}>
              Conecte-se com irmãos em comunidades globais ou privadas
            </p>
          </div>
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            background: "white",
            padding: "6px 16px 6px 12px",
            borderRadius: "100px",
            border: "1px solid #e7e5e4",
          }}>
            <Users size={18} color="#8b5e3c" />
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              {comunidadesUsuario.length} participando
            </span>
          </div>
        </div>

        {/* ABAS */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab("globais")}
            style={styles.tabButton(activeTab === "globais")}
          >
            <Globe size={18} />
            Comunidades Globais
          </button>

          <button
            onClick={() => setActiveTab("privadas")}
            style={styles.tabButton(activeTab === "privadas")}
          >
            <Lock size={18} />
            Comunidades Privadas
          </button>
        </div>

        {/* BUSCA */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar comunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#7c4a2d";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(124, 74, 45, 0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d6d3d1";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* CARDS */}
        <div style={styles.grid}>
          {comunidadesFiltradas.map((com) => {
            const isParticipando = comunidadesUsuario.includes(com.id);
            const IconComponent = com.icon || Globe;

            return (
              <div
                key={com.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={styles.iconBox(com.color || "#8b5e3c")}>
                  <IconComponent size={28} />
                </div>

                <h2 style={styles.cardTitle}>
                  {com.nome}
                </h2>

                <div style={styles.memberInfo}>
                  <Users size={16} />
                  <span>{com.membros} membros</span>
                </div>

                <p style={styles.description}>
                  {com.descricao}
                </p>

                {/* Ações do Card */}
                <div style={styles.actionsContainer}>
                  {isParticipando ? (
                    <>
                      {/* Linha 1: Entrar no Grupo + Sair */}
                      <div style={styles.actionsRow}>
                        <button
                          onClick={() => handleEntrarGrupo(com)}
                          style={styles.buttonWhatsapp}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1da851";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#25D366";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <MessageCircle size={16} />
                          Entrar no Grupo
                        </button>

                        <button
                          onClick={() => handleSairComunidade(com)}
                          style={styles.buttonSair}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#b91c1c";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#dc2626";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          title="Sair da comunidade"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>

                      {/* Linha 2: Status de Participação */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px",
                        background: "#f0fdf4",
                        borderRadius: "8px",
                        border: "1px solid #bbf7d0",
                      }}>
                        <CheckCircle size={16} color="#16a34a" />
                        <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "500" }}>
                          Participando
                        </span>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleParticiparComSweetAlert(com)}
                      style={styles.button(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#6b3f2a";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#7c4a2d";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Plus size={16} />
                      Participar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estilos globais para SweetAlert */}
      <style>{`
        .btn-confirmar-sair {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
        }
        .btn-confirmar-sair:hover {
          background-color: #b91c1c !important;
          border-color: #b91c1c !important;
        }
        .btn-cancelar-sair {
          background-color: #6b7280 !important;
          border-color: #6b7280 !important;
        }
        .btn-cancelar-sair:hover {
          background-color: #4b5563 !important;
          border-color: #4b5563 !important;
        }
      `}</style>
    </div>
  );
}