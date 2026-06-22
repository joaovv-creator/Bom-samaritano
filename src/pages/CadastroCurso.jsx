import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CadastroCurso() {
  const navigate = useNavigate();
  const location = useLocation();
  const curso = location.state?.curso;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  if (!curso) {
    navigate("/cursos");
    return null;
  }

  const continuar = () => {
    if (!nome || !email || !telefone) {
      setModalAberto(true);
      return;
    }

    navigate("/checkout", {
      state: {
        curso,
        aluno: {
          nome,
          telefone,
          email,
        },
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f2ea",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "550px",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ color: "#8b5e3c", marginBottom: "10px" }}>
          Cadastro para o Curso
        </h2>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Complete seus dados para continuar.
        </p>

        <div
          style={{
            background: "#f8fafc",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ color: "#8b5e3c", marginBottom: "8px" }}>
            {curso.nome}
          </h3>

          <p>
            <strong>Valor:</strong> R$ {curso.preco.toFixed(2)}
          </p>

          <p>
            <strong>Professor:</strong> {curso.professor}
          </p>

          <p>
            <strong>Duração:</strong> {curso.duracao}
          </p>
        </div>

        <input
          type="text"
          placeholder="Nome Completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={continuar}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#8b5e3c",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Continuar para Pagamento
        </button>

        {modalAberto && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                textAlign: "center",
                width: "300px",
              }}
            >
             <h2 style={{ color: "#000", marginBottom: "10px", fontWeight: "700" }}> Atenção ⚠️
              </h2>
              <p>Preencha todos os campos.</p>

              <button
                onClick={() => setModalAberto(false)}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#8b5e3c",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}