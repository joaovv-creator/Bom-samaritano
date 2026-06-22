
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function DevocionalAI() {
  const [mostrarIA, setMostrarIA] =
    useState(false);

  const [necessidade, setNecessidade] =
    useState("");

  const [devocionalGerado, setDevocionalGerado] =
    useState(null);

  const [carregando, setCarregando] =
    useState(false);

  const gerarDevocionalIA = () => {
    if (!necessidade.trim()) {
      alert(
        "Por favor, descreva sua necessidade espiritual"
      ); 
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      const devocionais = {
        ansiedade: {
          titulo:
            "A Paz que Excede Todo Entendimento",

          versiculo:
            "Não andem ansiosos por coisa alguma... Filipenses 4:6-7",

          reflexao: `Deus conhece suas preocupações. Você disse: "${necessidade}". Entregue suas ansiedades a Ele.`,

          oracao:
            "Senhor, entrego minhas ansiedades em Tuas mãos. Amém.",
        },

        padrao: {
          titulo: "Deus ouve sua Oração",

          versiculo:
            "Antes que clamem, eu responderei... Isaías 65:24",

          reflexao: `Deus ouviu quando você disse: "${necessidade}". Ele já está agindo.`,

          oracao:
            "Pai, obrigado por ouvir minha voz. Amém.",
        },
      };

      let resposta = devocionais.padrao;

      if (
        necessidade
          .toLowerCase()
          .includes("ansiedade") ||
        necessidade
          .toLowerCase()
          .includes("medo")
      ) {
        resposta = devocionais.ansiedade;
      }

      setDevocionalGerado(resposta);

      setCarregando(false);
    }, 1500);
  };

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
        {/* TÍTULO */}
        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "10px",
            }}
          >
            Devocional Diário
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Alimente sua alma com a Palavra de
            Deus
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div
          style={{
            background: "white",
            borderRadius: "22px",
            padding: "34px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.05)",
            marginBottom: "28px",
          }}
        >
          {/* TOPO */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
              marginBottom: "30px",
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
                  A Fé que Move Montanhas
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                  }}
                >
                  30 de Abril de 2026
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
              }}
            >
              <ChevronLeft
                size={22}
                color="#64748b"
                style={{
                  cursor: "pointer",
                }}
              />

              <ChevronRight
                size={22}
                color="#64748b"
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

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
                borderLeft:
                  "4px solid #8b5e3c",
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
                "Se tiverdes fé como um grão de
                mostarda, direis a este monte:
                Passa daqui para acolá, e ele
                passará. Nada vos será
                impossível."
              </p>

              <p
                style={{
                  color: "#8b5e3c",
                  fontWeight: "600",
                }}
              >
                Mateus 17:20
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
              }}
            >
             Hoje refletimos sobre o poder da fé genuína. Não se trata do tamanho da nossa fé, mas da grandeza do Deus em quem confiamos. Mesmo uma fé pequena, quando colocada no Deus Todo-Poderoso, pode realizar o impossível. Que possamos cultivar nossa fé diariamente através da oração, leitura da Palavra e comunhão com Deus.
             <br></br>
             Em meio às dificuldades, incertezas e desafios da vida, somos convidados a lembrar que Deus permanece soberano e fiel às Suas promessas. A fé não elimina as tempestades, mas nos dá a certeza de que não estamos sozinhos enquanto atravessamos cada uma delas. Quando escolhemos confiar no Senhor, aprendemos a descansar em Sua vontade, mesmo quando não compreendemos todos os Seus caminhos.

             Que hoje você entregue a Deus os seus medos, preocupações e sonhos. Permita que Ele fortaleça o seu coração e renove a sua esperança. Continue caminhando com perseverança, sabendo que o Senhor honra aqueles que O buscam com sinceridade. Que a sua fé seja alimentada todos os dias pela presença de Deus, transformando cada passo da sua jornada em uma oportunidade de testemunhar o Seu amor, a Sua graça e o Seu cuidado. ✝️🙏
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
              }}
            >
              Senhor, aumenta minha fé.
              Ajuda-me a confiar mais em Ti e
              menos em minhas próprias forças.
              Que eu possa ver Teus milagres
              acontecendo em minha vida
              enquanto deposito minha confiança
              em Tuas promessas. Em nome de
              Jesus, Amém.
            </p>
          </div>
        </div>

        {/* DEVOCIONAL IA */}
        <div
          style={{
            background: "#9b6b4f",
            borderRadius: "20px",
            padding: "30px",
            color: "white",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                Gerar Devocional Personalizado
                com I.A.
              </h2>

              <p
                style={{
                  lineHeight: "1.8",
                  fontSize: "18px",
                  marginBottom: "22px",
                }}
              >
                Nossa inteligência artificial
                pode criar um devocional
                personalizado baseado em suas
                necessidades espirituais do
                momento. Receba uma palavra
                específica para você hoje!
              </p>

              {!mostrarIA ? (
                <button
                  onClick={() =>
                    setMostrarIA(true)
                  }
                  style={{
                    background: "white",
                    color: "#8b5e3c",
                    border: "none",
                    padding:
                      "14px 26px",
                    borderRadius: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Sparkles size={18} />
                  Gerar Devocional
                </button>
              ) : (
                <div>
                  <textarea
                    value={necessidade}
                    onChange={(e) =>
                      setNecessidade(
                        e.target.value
                      )
                    }
                    placeholder="Ex: Estou passando por um momento de ansiedade..."
                    rows="4"
                    style={{
                      width: "90%",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "none",
                      resize: "none",
                      marginBottom: "18px",
                      fontSize: "15px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={
                        gerarDevocionalIA
                      }
                      disabled={carregando}
                      style={{
                        background:
                          "white",
                        color: "#8b5e3c",
                        border: "none",
                        padding:
                          "12px 22px",
                        borderRadius:
                          "10px",
                        fontWeight:
                          "700",
                        cursor: "pointer",
                      }}
                    >
                      {carregando
                        ? "Gerando..."
                        : "Gerar Meu Devocional"}
                    </button>

                    <button
                      onClick={() =>
                        setMostrarIA(
                          false
                        )
                      }
                      style={{
                        background:
                          "rgba(255,255,255,0.15)",
                        color: "white",
                        border:
                          "1px solid rgba(255,255,255,0.3)",
                        padding:
                          "12px 22px",
                        borderRadius:
                          "10px",
                        fontWeight:
                          "600",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESULTADO IA */}
        {devocionalGerado && (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "28px",
              border:
                "1px solid #d1fae5",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                color: "#10b981",
                marginBottom: "16px",
              }}
            >
              ✨ {devocionalGerado.titulo}
            </h2>

            <p
              style={{
                fontStyle: "italic",
                marginBottom: "18px",
                color: "#334155",
              }}
            >
              "
              {
                devocionalGerado.versiculo
              }
              "
            </p>

            <p
              style={{
                lineHeight: "1.8",
                marginBottom: "16px",
                color: "#334155",
              }}
            >
              {
                devocionalGerado.reflexao
              }
            </p>

            <p
              style={{
                color: "#334155",
              }}
            >
              <strong>Oração:</strong>{" "}
              {devocionalGerado.oracao}
            </p>
          </div>
        )}

        {/* LINK */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: "40px",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#8b5e3c",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >

          </button>
        </div>
      </div>
    </div>
  );
}
