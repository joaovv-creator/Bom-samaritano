import { useNavigate } from "react-router-dom";
import {
  Music,
  Hand,
  Mic,
  BookOpen,
  Users,
  Clock3,
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
        {/* TÍTULO */}
        <div style={{ marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            Cursos Cristãos
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Aprenda e desenvolva seus talentos para servir ao Reino
          </p>
        </div>

        {/* GRID */}
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
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
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

