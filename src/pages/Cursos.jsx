import { useNavigate } from "react-router-dom";
import {
  Music,
  Hand,
  Mic,
  BookOpen,
  Users,
  Clock3,
  Church,
  Activity,
  Sparkles,
  GraduationCap,
  Award
} from "lucide-react";

export default function Cursos() {
  const navigate = useNavigate();

  const cursos = [
    {
      id: 1,
      nome: "Curso de Música para Louvor",
      professor: "Carlos Mendes",
      alunos: 234,
      duracao: "8 semanas",
      preco: 197,
      nivel: "Iniciante ao Avançado",
      cor: "linear-gradient(135deg, #9b6b4f 0%, #8b5e3c 100%)",
      icone: <Music size={30} color="white" />,
      topicos: [
        "Teoria Musical",
        "Técnica Vocal",
        "Liderança de Louvor",
        "Instrumentos",
      ],
    },
    {
      id: 2,
      nome: "Libras para o Ministério",
      professor: "Ana Paula",
      alunos: 189,
      duracao: "10 semanas",
      preco: 147,
      nivel: "Básico",
      cor: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      icone: <Hand size={30} color="white" />,
      topicos: [
        "Alfabeto",
        "Vocabulário Religioso",
        "Interpretação de Louvores",
        "Prática",
      ],
    },
    {
      id: 3,
      nome: "Oratória Cristã",
      professor: "Pastor João Silva",
      alunos: 312,
      duracao: "6 semanas",
      preco: 167,
      nivel: "Todos os níveis",
      cor: "linear-gradient(135deg, #ff6a00 0%, #ff4b2b 100%)",
      icone: <Mic size={30} color="white" />,
      topicos: [
        "Dicção",
        "Postura",
        "Pregação",
        "Comunicação Eficaz",
      ],
    },
    {
      id: 4,
      nome: "Regência de Coral",
      professor: "Ricardo Santos",
      alunos: 98,
      duracao: "12 semanas",
      preco: 247,
      nivel: "Intermediário",
      cor: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
      icone: <Music size={30} color="white" />,
      topicos: [
        "Técnicas de Regência",
        "Arranjos Vocais",
        "Ensaios",
        "Performance",
      ],
    },
  ];

  const handleInscrever = (curso) => {
    const { icone, ...cursoSemIcone } = curso;

    navigate("/cadastro-curso", {
      state: {
        curso: cursoSemIcone,
      },
    });
  };

  // Total de alunos e cursos
  const totalAlunos = cursos.reduce((acc, curso) => acc + curso.alunos, 0);
  const totalCursos = cursos.length;

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
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* ============================================ */}
        {/* BANNER - CURSOS (mesmo estilo das outras páginas) */}
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
            {/* Tag dos cursos */}
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
              <GraduationCap size={18} style={{ opacity: 0.9 }} />
              <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', opacity: 0.9 }}>
                Educação Cristã
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
              Cursos Cristãos
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              margin: '0 0 4px 0',
              fontWeight: '400',
              lineHeight: 1.6,
            }}>
              Aprenda e desenvolva seus talentos para servir ao Reino
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
                "Aplica o teu coração à instrução e os teus ouvidos às palavras do conhecimento"
              </p>
              <p style={{
                fontSize: '13px',
                margin: '4px 0 0 0',
                opacity: 0.7,
                fontWeight: '300',
              }}>
                — Provérbios 23:12
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
                <GraduationCap size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  {totalCursos} cursos
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  {totalAlunos} alunos
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>
                  Certificado reconhecido
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE CURSOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {cursos.map((curso) => (
            <div
              key={curso.id}
              style={{
                background: "white",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                minHeight: "330px",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* TOPO */}
              <div
                style={{
                  background: curso.cor,
                  height: "90px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {curso.icone}
              </div>

              {/* CONTEÚDO */}
              <div
                style={{
                  padding: "18px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      color: "#0f172a",
                      marginBottom: "6px",
                      fontWeight: "700",
                      lineHeight: "1.3",
                    }}
                  >
                    {curso.nome}
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "18px",
                    }}
                  >
                    Professor {curso.professor}
                  </p>

                  {/* INFO */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                      textAlign: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Users
                        size={18}
                        color="#94a3b8"
                        style={{ marginBottom: "5px" }}
                      />

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        {curso.alunos} alunos
                      </p>
                    </div>

                    <div style={{ flex: 1 }}>
                      <Clock3
                        size={18}
                        color="#94a3b8"
                        style={{ marginBottom: "5px" }}
                      />

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        {curso.duracao}
                      </p>
                    </div>

                    <div style={{ flex: 1 }}>
                      <BookOpen
                        size={18}
                        color="#94a3b8"
                        style={{ marginBottom: "5px" }}
                      />

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        {curso.nivel}
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e5e7eb",
                      marginBottom: "16px",
                    }}
                  />

                  {/* TÓPICOS */}
                  <h4
                    style={{
                      marginBottom: "10px",
                      color: "#0f172a",
                      fontSize: "14px",
                    }}
                  >
                    O que você vai aprender:
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "18px",
                    }}
                  >
                    {curso.topicos.map((topico, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#f1e6d5",
                          padding: "5px 10px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          color: "#8b5e3c",
                        }}
                      >
                        {topico}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RODAPÉ */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "11px",
                      }}
                    >
                      A partir de
                    </p>

                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#8b5e3c",
                      }}
                    >
                      R$ {curso.preco}.00
                    </p>
                  </div>

                  <button
                    onClick={() => handleInscrever(curso)}
                    style={{
                      background: "#8b5e3c",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#6b3f2a"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#8b5e3c"}
                  >
                    Inscrever-se
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BENEFÍCIOS */}
        <div
          style={{
            marginTop: "45px",
            background: "#9b6b4f",
            borderRadius: "16px",
            padding: "32px",
            color: "white",
          }}
        >
          <h3
            style={{
              fontSize: "28px",
              marginBottom: "22px",
              fontWeight: "700",
            }}
          >
            Por que fazer nossos cursos?
          </h3>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              fontSize: "16px",
              paddingLeft: "22px",
            }}
          >
            <li>
              Aprenda com profissionais experientes no ministério
            </li>

            <li>
              Certificado reconhecido ao concluir o curso
            </li>

            <li>
              Estude no seu próprio ritmo, quando e onde quiser
            </li>

            <li>
              Comunidade de alunos para networking e troca de experiências
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}