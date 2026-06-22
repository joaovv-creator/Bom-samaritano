

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [abaAtual, setAbaAtual] = useState("dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [denuncias, setDenuncias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setCarregando(true);

    setTimeout(() => {
      setEstatisticas({
        totalUsuarios: 1247,
        novosUsuariosHoje: 23,
        totalPosts: 3456,
        postsHoje: 47,
        totalVendas: 892,
        faturamentoMes: 48750.9,
        taxaCrescimento: 12.5,
        usuariosAtivos: 845,
        denunciasPendentes: 8,
      });

      setUsuarios([
        {
          id: 1,
          nome: "Maria Silva",
          email: "maria@email.com",
          username: "@mariasilva",
          status: "ativo",
          posts: 42,
          seguidores: 234,
          plano: "Premium",
        },
        {
          id: 2,
          nome: "João Santos",
          email: "joao@email.com",
          username: "@joaosantos",
          status: "ativo",
          posts: 128,
          seguidores: 567,
          plano: "Premium",
        },
        {
          id: 3,
          nome: "Ana Costa",
          email: "ana@email.com",
          username: "@anacosta",
          status: "inativo",
          posts: 8,
          seguidores: 45,
          plano: "Free",
        },
      ]);

      setPosts([
        {
          id: 1,
          autor: "Maria Silva",
          conteudo: "Bom dia irmãos!",
          curtidas: 42,
          comentarios: 8,
          status: "aprovado",
          denuncias: 0,
        },
        {
          id: 2,
          autor: "João Santos",
          conteudo: "Culto hoje às 19h!",
          curtidas: 28,
          comentarios: 5,
          status: "pendente",
          denuncias: 2,
        },
      ]);

      setDenuncias([
        {
          id: 1,
          postId: 2,
          postConteudo: "Culto hoje às 19h!",
          denunciante: "ana",
          motivo: "Spam",
        },
      ]);

      setProdutos([
        {
          id: 1,
          nome: "Bíblia Sagrada",
          preco: 89.9,
          vendas: 234,
          estoque: 45,
          status: "ativo",
        },
        {
          id: 2,
          nome: "Kit Devocional",
          preco: 79.9,
          vendas: 89,
          estoque: 0,
          status: "esgotado",
        },
      ]);

      setCarregando(false);
    }, 1000);
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getStatusCor = (status) => {
    switch (status) {
      case "ativo":
      case "aprovado":
        return {
          bg: "#dcfce7",
          text: "#166534",
        };

      case "pendente":
        return {
          bg: "#fef9c3",
          text: "#854d0e",
        };

      case "inativo":
      case "esgotado":
        return {
          bg: "#e5e7eb",
          text: "#374151",
        };

      default:
        return {
          bg: "#fee2e2",
          text: "#991b1b",
        };
    }
  };

  const CardEstatistica = ({
    titulo,
    valor,
    icone,
    cor,
    variacao,
  }) => (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            background: cor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          {icone}
        </div>

        {variacao && (
          <span
            style={{
              color: "#16a34a",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            +{variacao}%
          </span>
        )}
      </div>

      <h2
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {valor}
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginTop: "6px",
        }}
      >
        {titulo}
      </p>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Painel Administrativo
            </h1>

            <p style={{ color: "#6b7280" }}>
              Gerencie toda a plataforma
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                background: "white",
                border: "1px solid #d1d5db",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              📥 Exportar
            </button>

            <button
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              🔄 Sincronizar
            </button>
          </div>
        </div>

        {/* ABAS */}
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            marginBottom: "30px",
            overflowX: "auto",
            display: "flex",
          }}
        >
          {[
            ["dashboard", "📊 Dashboard"],
            ["usuarios", "👥 Usuários"],
            ["posts", "💬 Posts"],
            ["denuncias", "🚩 Denúncias"],
            ["produtos", "🛒 Produtos"],
          ].map(([valor, label]) => (
            <button
              key={valor}
              onClick={() => setAbaAtual(valor)}
              style={{
                padding: "16px 24px",
                border: "none",
                background:
                  abaAtual === valor ? "#eff6ff" : "transparent",
                color:
                  abaAtual === valor ? "#2563eb" : "#6b7280",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {carregando ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              fontSize: "22px",
            }}
          >
            Carregando...
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {abaAtual === "dashboard" && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <CardEstatistica
                    titulo="Usuários"
                    valor={estatisticas.totalUsuarios}
                    icone="👥"
                    cor="#dbeafe"
                    variacao={12}
                  />

                  <CardEstatistica
                    titulo="Posts"
                    valor={estatisticas.totalPosts}
                    icone="💬"
                    cor="#dcfce7"
                    variacao={8}
                  />

                  <CardEstatistica
                    titulo="Faturamento"
                    valor={formatarMoeda(
                      estatisticas.faturamentoMes
                    )}
                    icone="💰"
                    cor="#ede9fe"
                    variacao={15}
                  />

                  <CardEstatistica
                    titulo="Usuários Ativos"
                    valor={estatisticas.usuariosAtivos}
                    icone="⭐"
                    cor="#fef3c7"
                  />
                </div>
              </>
            )}

            {/* USUÁRIOS */}
            {abaAtual === "usuarios" && (
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead
                    style={{
                      background: "#f9fafb",
                    }}
                  >
                    <tr>
                      <th style={th}>Usuário</th>
                      <th style={th}>Email</th>
                      <th style={th}>Status</th>
                      <th style={th}>Plano</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => {
                      const statusCor = getStatusCor(
                        usuario.status
                      );

                      return (
                        <tr key={usuario.id}>
                          <td style={td}>
                            <strong>{usuario.nome}</strong>
                            <br />
                            <span
                              style={{
                                color: "#6b7280",
                                fontSize: "12px",
                              }}
                            >
                              {usuario.username}
                            </span>
                          </td>

                          <td style={td}>{usuario.email}</td>

                          <td style={td}>
                            <span
                              style={{
                                background: statusCor.bg,
                                color: statusCor.text,
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontSize: "12px",
                              }}
                            >
                              {usuario.status}
                            </span>
                          </td>

                          <td style={td}>{usuario.plano}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* POSTS */}
            {abaAtual === "posts" && (
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <h3>{post.autor}</h3>

                    <p style={{ margin: "10px 0" }}>
                      {post.conteudo}
                    </p>

                    <span>
                      ❤️ {post.curtidas} | 💬{" "}
                      {post.comentarios}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* DENÚNCIAS */}
            {abaAtual === "denuncias" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {denuncias.map((denuncia) => (
                  <div
                    key={denuncia.id}
                    style={{
                      background: "white",
                      borderLeft: "5px solid red",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    <h3>🚩 Denúncia #{denuncia.id}</h3>

                    <p>
                      <strong>Motivo:</strong>{" "}
                      {denuncia.motivo}
                    </p>

                    <p>
                      <strong>Post:</strong>{" "}
                      {denuncia.postConteudo}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* PRODUTOS */}
            {abaAtual === "produtos" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "16px",
                    }}
                  >
                    <h3>{produto.nome}</h3>

                    <p
                      style={{
                        fontWeight: "bold",
                        margin: "10px 0",
                      }}
                    >
                      {formatarMoeda(produto.preco)}
                    </p>

                    <p>📦 Estoque: {produto.estoque}</p>

                    <p>🛒 Vendas: {produto.vendas}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "16px",
  borderBottom: "1px solid #e5e7eb",
  color: "#ffffff",
};

const td = {
  padding: "16px",
  borderBottom: "1px solid #f3f4f6",
};
