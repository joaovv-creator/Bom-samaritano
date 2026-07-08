import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import Swal from 'sweetalert2';

export default function CadastroCurso() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const curso = location.state?.curso;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!curso) {
    navigate("/cursos");
    return null;
  }

  const continuar = async () => {
    if (!nome || !email || !telefone) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, preencha todos os campos.',
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Verificar se o usuário está logado
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Faça login!',
        text: 'Você precisa estar logado para se inscrever em um curso.',
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'Fazer login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      setLoading(true);

      // 🔥 CHAMAR A FUNÇÃO CORRETA
      await adminService.criarMatricula({
        aluno_id: user.id,
        curso_id: curso.id,
      });

      Swal.fire({
        icon: 'success',
        title: 'Inscrição realizada!',
        text: `Você foi inscrito no curso "${curso.titulo}" com sucesso!`,
        timer: 2500,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
        confirmButtonText: 'Ver meus cursos',
      }).then(() => {
        navigate('/perfil');
      });

    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      
      // Verifica se o erro é de matrícula duplicada
      if (error.message?.includes('já está matriculado') || error.code === '23505') {
        Swal.fire({
          icon: 'info',
          title: 'Já inscrito!',
          text: 'Você já está inscrito neste curso.',
          confirmButtonColor: '#8b5e3c',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro na inscrição',
          text: error.message || 'Não foi possível realizar a inscrição. Tente novamente.',
          confirmButtonColor: '#8b5e3c',
          confirmButtonText: 'OK',
        });
      }
    } finally {
      setLoading(false);
    }
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
            {curso.titulo}
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
          <p>
            <strong>Alunos inscritos:</strong> {curso.alunos || 0}
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
            color: '#000',
            background: '#fff',
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
            color: '#000',
            background: '#fff',
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
            color: '#000',
            background: '#fff',
          }}
        />

        <button
          onClick={continuar}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#8b5e3c",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Processando...' : 'Continuar para Pagamento'}
        </button>
      </div>
    </div>
  );
}