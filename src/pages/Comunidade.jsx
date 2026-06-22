import { useState } from "react";

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
    },
    {
      id: 2,
      nome: "Jovens Cristãos",
      membros: 456,
      descricao: "Espaço para jovens compartilharem sua fé",
      whatsapp: "https://chat.whatsapp.com/BBBB222222",
    },
    {
      id: 3,
      nome: "Músicos e Adoradores",
      membros: 289,
      descricao: "Para quem ama adorar através da música",
      whatsapp: "https://chat.whatsapp.com/CCCC333333",
    },
  ];

  const comunidadesPrivadas = [
    {
      id: 4,
      nome: "Líderes de Célula",
      membros: 89,
      descricao: "Grupo exclusivo para líderes",
      whatsapp: "https://chat.whatsapp.com/DDDD444444",
    },
    {
      id: 5,
      nome: "Missionários em Ação",
      membros: 67,
      descricao: "Comunidade missionária",
      whatsapp: "https://chat.whatsapp.com/EEEE555555",
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

  return (
    <div
      style={{
        background: "#f7f4ed",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            color: "#1e293b",
            marginBottom: "10px",
            fontWeight: "700",
          }}
        >
          Comunidades
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "40px",
            fontSize: "17px",
          }}
        >
          Conecte-se com irmãos em comunidades globais ou privadas
        </p>

        {/* ABAS */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            borderBottom: "1px solid #d6d3d1",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => setActiveTab("globais")}
            style={{
              background: "none",
              border: "none",
              paddingBottom: "14px",
              cursor: "pointer",
              color:
                activeTab === "globais"
                  ? "#7c4a2d"
                  : "#64748b",
              fontWeight: "600",
              borderBottom:
                activeTab === "globais"
                  ? "2px solid #7c4a2d"
                  : "2px solid transparent",
              fontSize: "16px",
            }}
          >
            🌎 Comunidades Globais
          </button>

          <button
            onClick={() => setActiveTab("privadas")}
            style={{
              background: "none",
              border: "none",
              paddingBottom: "14px",
              cursor: "pointer",
              color:
                activeTab === "privadas"
                  ? "#7c4a2d"
                  : "#64748b",
              fontWeight: "600",
              borderBottom:
                activeTab === "privadas"
                  ? "2px solid #7c4a2d"
                  : "2px solid transparent",
              fontSize: "16px",
            }}
          >
            🔒 Comunidades Privadas
          </button>
        </div>

        {/* BUSCA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "35px",
          }}
        >
          <input
            type="text"
            placeholder="Buscar comunidades..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "500px",
              maxWidth: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #d6d3d1",
              fontSize: "15px",
              background: "#fff",
              outline: "none",
            }}
          />
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 320px))",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {comunidadesFiltradas.map((com) => {
            const isParticipando =
              comunidadesUsuario.includes(com.id);

            return (
              <div
                key={com.id}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "24px",
                  border: "1px solid #e7e5e4",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    background: "#9a6649",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    marginBottom: "18px",
                  }}
                >
                  🌎
                </div>

                <h2
                  style={{
                    fontSize: "24px",
                    color: "#0f172a",
                    marginBottom: "10px",
                  }}
                >
                  {com.nome}
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    marginBottom: "14px",
                    fontSize: "14px",
                  }}
                >
                  👥 {com.membros} membros
                </p>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: "1.6",
                    marginBottom: "22px",
                    fontSize: "15px",
                  }}
                >
                  {com.descricao}
                </p>

                <button
                  onClick={() =>
                    handleParticipar(com)
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: isParticipando
                      ? "#16a34a"
                      : "#7c4a2d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  {isParticipando
                    ? "✓ Participando"
                    : "Participar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}