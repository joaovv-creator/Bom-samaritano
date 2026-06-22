import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Checkout() {
  const { carrinho = [], total = 0 } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const curso = location.state?.curso;
  const aluno = location.state?.aluno;

  const [pagamento, setPagamento] = useState("pix");
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const carrinhoVazio = !curso && carrinho.length === 0;

  const totalFinal = curso
    ? Number(curso.preco || 0)
    : Number(total || 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f1e8",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#8B5A2B",
            fontSize: "58px",
          }}
        >
          Checkout
        </h1>

        {/* RESUMO */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#64748b",
            }}
          >
            Resumo do Pedido
          </h3>

          {/* CURSO */}
          {curso ? (
            <div
              style={{
                background: "#f8fafc",
                padding: "15px",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  color: "#8B5A2B",
                  marginBottom: "15px",
                }}
              >
                {curso.nome}
              </h3>

              <p>
                <strong>Aluno:</strong>{" "}
                {aluno?.nome || "Não informado"}
              </p>

              <p>
                <strong>E-mail:</strong>{" "}
                {aluno?.email || "Não informado"}
              </p>

              <p>
                <strong>Telefone:</strong>{" "}
                {aluno?.telefone || "Não informado"}
              </p>

              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#8B5A2B",
                }}
              >
                Valor: R$ {Number(curso.preco).toFixed(2)}
              </p>
            </div>
          ) : carrinhoVazio ? (
            <p>Carrinho vazio</p>
          ) : (
            carrinho.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>
                  {item.nome} x {item.quantidade}
                </span>

                <span>
                  R${" "}
                  {(
                    Number(item.preco || 0) *
                    Number(item.quantidade || 1)
                  ).toFixed(2)}
                </span>
              </div>
            ))
          )}

          <hr
            style={{
              margin: "20px 0",
              border: "none",
              borderTop: "1px solid #ddd",
            }}
          />

          <div
            style={{
              textAlign: "right",
            }}
          >
            <h2
              style={{
                color: "#8B5A2B",
                margin: 0,
              }}
            >
              Total: R$ {totalFinal.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* PAGAMENTO */}
        <div
          style={{
            marginTop: "20px",
            background: "#fff",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              color: "#64748b",
            }}
          >
            Forma de Pagamento
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <label>
              <input
                type="radio"
                checked={pagamento === "pix"}
                onChange={() => setPagamento("pix")}
              />
              {" "}PIX
            </label>

            <label>
              <input
                type="radio"
                checked={pagamento === "cartao"}
                onChange={() => setPagamento("cartao")}
              />
              {" "}Cartão de Crédito
            </label>

            <label>
              <input
                type="radio"
                checked={pagamento === "boleto"}
                onChange={() => setPagamento("boleto")}
              />
              {" "}Boleto Bancário
            </label>
          </div>
        </div>

        {/* BOTÃO */}
        <button
          disabled={carrinhoVazio}
          onClick={() => setMostrarSucesso(true)}
          style={{
            marginTop: "25px",
            width: "100%",
            padding: "16px",
            background: carrinhoVazio
              ? "#ccc"
              : "#8B5A2B",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: carrinhoVazio
              ? "not-allowed"
              : "pointer",
          }}
        >
          Confirmar Pagamento
        </button>

        {/* MODAL */}
        {mostrarSucesso && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "420px",
                maxWidth: "90%",
                borderRadius: "20px",
                padding: "30px",
                textAlign: "center",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  color: "#8B5A2B",
                  marginBottom: "10px",
                }}
              >
                {curso
                  ? "Inscrição realizada!"
                  : "Compra realizada!"}
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginBottom: "25px",
                  lineHeight: "1.6",
                }}
              >
                {curso
                  ? "Sua inscrição foi realizada com sucesso."
                  : "Seu pedido foi recebido com sucesso."}

                <br />

                Forma de pagamento:
                <strong>
                  {" "}
                  {pagamento.toUpperCase()}
                </strong>
              </p>

              <button
                onClick={() => {
                  setMostrarSucesso(false);
                  navigate("/");
                }}
                style={{
                  background: "#8B5A2B",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Voltar para página inicial
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;