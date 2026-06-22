import { useState } from "react";
import { useNavigate } from "react-router-dom";

function KidsArea() {
  const [atividadeAtiva, setAtividadeAtiva] =
    useState(null);

 const atividades = [
  {
    id: 1,
    titulo: "História de Davi e Golias",
    tipo: "Vídeo",
    duracao: "15 min",
    emoji: "▶",
    cor: "#3b82f6",
    link:
      "https://youtu.be/_Nv-3oOz3bY",
  },

  {
    id: 2,
    titulo: "Jogo da Memória Bíblico",
    tipo: "Jogo",
    duracao: "Livre",
    emoji: "🎮",
    cor: "#9a6649",
    link: "",
  },

  {
    id: 3,
    titulo: "Histórias da Bíblia",
    tipo: "Leitura",
    duracao: "10 min",
    emoji: "📖",
    cor: "#22c55e",
    link: "",
  },

  {
    id: 4,
    titulo: "Músicas de Adoração",
    tipo: "Música",
    duracao: "5 min",
    emoji: "🎵",
    cor: "#ff6b35",
    link:
      "https://youtu.be/DWGIkpyl9Rg?list=RDDWGIkpyl9Rg",
  },

  {
    id: 5,
    titulo: "A Arca de Noé",
    tipo: "Vídeo",
    duracao: "12 min",
    emoji: "▶",
    cor: "#6d5bd0",
    link:
      "https://youtu.be/Gz9IWzccNvI",
  },

  {
    id: 6,
    titulo: "Quiz Bíblico",
    tipo: "Jogo",
    duracao: "Livre",
    emoji: "🎮",
    cor: "#ff3d7f",
    link: "",
  },
]; 
 const abrirAtividade = (atividade) => {

  if (
    atividade.link.startsWith("http")
  ) {
    window.open(
      atividade.link,
      "_blank"
    );

    return;
  }

  navigate(atividade.link);
};     

  return (
    <div
      style={{
        background: "#f7f4ed",
        minHeight: "100vh",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "#9a6649",
            borderRadius: "22px",
            padding: "32px",
            display: "flex",
            alignItems: "center",
            gap: "22px",
            marginBottom: "45px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
            }}
          >
            ⭐
          </div>

          <div>
            <h1
              style={{
                color: "white",
                fontSize: "42px",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Kids - Área Infantil
            </h1>

            <p
              style={{
                color: "#f3e8e2",
                fontSize: "18px",
              }}
            >
              Aprenda sobre a Palavra de Deus de forma divertida!
            </p>
          </div>
        </div>

        {/* TÍTULO */}
        <h2
          style={{
            fontSize: "34px",
            color: "#0f172a",
            marginBottom: "30px",
            fontWeight: "700",
          }}
        >
          Atividades Disponíveis
        </h2>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 320px))",
            justifyContent: "center",
            gap: "26px",
            marginBottom: "40px",
          }}
        >
          {atividades.map((atv) => (
            <div
              key={atv.id}
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e7e5e4",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.04)",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";
              }}
              onClick={() =>
                  abrirAtividade(atv)
                     }
            >
              {/* ÍCONE */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: atv.cor,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  color: "white",
                  marginBottom: "22px",
                }}
              >
                {atv.emoji}
              </div>

              {/* TITULO */}
              <h3
               
  style={{
    fontSize: "28px",
    color: "#0f172a",
    marginBottom: "14px",
    fontWeight: "600",
    minHeight: "72px",
    display: "flex",
    alignItems: "flex-start",
  }}
>
  {atv.titulo}

              </h3>

              {/* INFO */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "15px",
                  }}
                >
                  {atv.tipo}
                </p>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "15px",
                  }}
                >
                  {atv.duracao}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* DICA */}
        <div
          style={{
            background: "#f8f4df",
            border: "1px solid #e9d66b",
            borderRadius: "18px",
            padding: "26px",
          }}
        >
          <h3
            style={{
              color: "#a16207",
              marginBottom: "12px",
              fontSize: "28px",
            }}
          >
            ✨ Dica para os Pais
          </h3>

          <p
            style={{
              color: "#57534e",
              lineHeight: "1.8",
              fontSize: "17px",
            }}
          >
            Esta área foi criada especialmente
            para ensinar as crianças sobre a
            Palavra de Deus de forma lúdica e
            educativa. Recomendamos que os pais
            acompanhem as atividades junto com
            as crianças para criar momentos
            especiais de aprendizado em família.
          </p>
        </div>

        {/* MODAL */}
        {atividadeAtiva && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "650px",
                padding: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#0f172a",
                    fontSize: "32px",
                  }}
                >
                  {atividadeAtiva.titulo}
                </h2>

                <button
                  onClick={() =>
                      abrirAtividade(atv)
                    }
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "28px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: "16px",
                  padding: "50px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "70px",
                    marginBottom: "20px",
                  }}
                >
                  {atividadeAtiva.emoji}
                </div>

                <p
                  style={{
                    fontSize: "18px",
                    color: "#475569",
                  }}
                >
                  Conteúdo da atividade será
                  exibido aqui.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KidsArea;