import { useState } from "react";
import {
  Globe,
  Lock,
  Users,
  Music,
  Church,
  Heart,
  Search,
  User,
  MessageCircle,
  Star,
  Shield,
  CheckCircle,
  Plus,
  Minus,
  Group,
  Share2,
  MapPin,
  Calendar,
  BookOpen,
  Coffee,
  Sparkles
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

      window.open(comunidade.whatsapp, "_blank");
    } else {
      setComunidadesUsuario(
        comunidadesUsuario.filter(
          (id) => id !== comunidade.id
        )
      );
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
      position: "relative",
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
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 320px))",
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
    cardHover: {
      boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
      transform: "translateY(-4px)",
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
    button: (isParticipando) => ({
      width: "100%",
      padding: "14px",
      background: isParticipando ? "#16a34a" : "#7c4a2d",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s",
    }),
    buttonHover: (isParticipando) => ({
      background: isParticipando ? "#15803d" : "#6b3f2a",
      transform: "scale(1.02)",
    }),
  };

  // Renderização condicional para ícones das tabs
  const TabIcon = ({ tab }) => {
    if (tab === "globais") return <Globe size={18} />;
    return <Lock size={18} />;
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
            onMouseEnter={(e) => {
              if (activeTab !== "globais") {
                e.currentTarget.style.color = "#7c4a2d";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "globais") {
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            <Globe size={18} />
            Comunidades Globais
          </button>

          <button
            onClick={() => setActiveTab("privadas")}
            style={styles.tabButton(activeTab === "privadas")}
            onMouseEnter={(e) => {
              if (activeTab !== "privadas") {
                e.currentTarget.style.color = "#7c4a2d";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "privadas") {
                e.currentTarget.style.color = "#64748b";
              }
            }}
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
                  e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                  e.currentTarget.style.transform = styles.cardHover.transform;
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

                <button
                  onClick={() => handleParticipar(com)}
                  style={styles.button(isParticipando)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isParticipando ? "#15803d" : "#6b3f2a";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isParticipando ? "#16a34a" : "#7c4a2d";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {isParticipando ? (
                    <>
                      <CheckCircle size={18} />
                      Participando
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Participar
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}