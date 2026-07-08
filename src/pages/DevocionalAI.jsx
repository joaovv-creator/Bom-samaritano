import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Church,
  Activity,
  Heart,
  Users
} from "lucide-react";

export default function DevocionalAI() {
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
        {/* ============================================ */}
        {/* BANNER - DEVOCIONAL (mesmo estilo das outras páginas) */}
        {/* ============================================ */}
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
          {/* Elemento decorativo */}
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
            {/* Tag do devocional */}
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

            {/* Título principal */}
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              Devocional Diário
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              margin: '0 0 4px 0',
              fontWeight: '400',
              lineHeight: 1.6,
            }}>
              Alimente sua alma com a Palavra de Deus
            </p>

            {/* Versículo bíblico */}
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

            {/* Estatísticas */}
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
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#8b5e3c"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
              />

              <ChevronRight
                size={22}
                color="#64748b"
                style={{
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#8b5e3c"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
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
                "Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará. Nada vos será impossível."
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
              <br /><br />
              Em meio às dificuldades, incertezas e desafios da vida, somos convidados a lembrar que Deus permanece soberano e fiel às Suas promessas. A fé não elimina as tempestades, mas nos dá a certeza de que não estamos sozinhos enquanto atravessamos cada uma delas. Quando escolhemos confiar no Senhor, aprendemos a descansar em Sua vontade, mesmo quando não compreendemos todos os Seus caminhos.
              <br /><br />
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
              Senhor, aumenta minha fé. Ajuda-me a confiar mais em Ti e menos em minhas próprias forças. Que eu possa ver Teus milagres acontecendo em minha vida enquanto deposito minha confiança em Tuas promessas. Em nome de Jesus, Amém.
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
    </div>
  );
}