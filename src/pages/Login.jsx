import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/SupabaseClient';
import Swal from 'sweetalert2'; // 🔥 Adicione esta importação

function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [aba, setAba] = useState('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cores = {
    fundo: '#f5f1e8',
    card: '#ffffff',
    marrom: '#9b6b43',
    marromEscuro: '#7a4f2d',
    bege: '#efe3d3',
    texto: '#2d3748',
    cinza: '#718096',
    borda: '#e8dccb',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, senha);
      
      // 🔥 SweetAlert de sucesso no login
      Swal.fire({
        icon: 'success',
        title: 'Bem-vindo!',
        text: 'Login realizado com sucesso!',
        timer: 2000,
        showConfirmButton: false,
        background: '#ffffff',
        iconColor: '#9b6b43',
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
      
      // 🔥 SweetAlert de erro no login
      Swal.fire({
        icon: 'error',
        title: 'Erro ao entrar',
        text: err.message || 'Email ou senha inválidos. Tente novamente.',
        confirmButtonColor: '#9b6b43',
        confirmButtonText: 'Tentar novamente',
        background: '#ffffff',
        iconColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!nome.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo obrigatório',
        text: 'Por favor, digite seu nome',
        confirmButtonColor: '#9b6b43',
        confirmButtonText: 'OK',
        background: '#ffffff',
        iconColor: '#d97706',
      });
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Senha muito curta',
        text: 'A senha deve ter pelo menos 6 caracteres',
        confirmButtonColor: '#9b6b43',
        confirmButtonText: 'OK',
        background: '#ffffff',
        iconColor: '#d97706',
      });
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, senha, nome);

      if (result?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.user.id)
          .single();

        if (profileError || !profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: result.user.id,
                email: email,
                name: nome,
                role: 'membro',
                created_at: new Date().toISOString(),
              },
            ]);

          if (insertError) {
            console.error('Erro ao criar perfil manualmente:', insertError);
          }
        }

        // 🔥 SweetAlert de sucesso no cadastro (SUBSTITUI O alert())
        Swal.fire({
          icon: 'success',
          title: '✅ Cadastro realizado!',
          text: 'Bem-vindo ao Bom Samaritano!',
          timer: 2500,
          showConfirmButton: true,
          confirmButtonColor: '#9b6b43',
          confirmButtonText: 'Continuar',
          background: '#ffffff',
          iconColor: '#22c55e',
        });

        navigate('/');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      
      let mensagemErro = 'Erro ao realizar cadastro. Tente novamente.';
      
      if (err.message.includes('already registered')) {
        mensagemErro = 'Este email já está cadastrado. Faça login ou use outro email.';
      } else if (err.message.includes('password')) {
        mensagemErro = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.message.includes('invalid')) {
        mensagemErro = 'Email inválido. Verifique se está correto.';
      } else if (err.message.includes('not confirmed')) {
        mensagemErro = 'Email não confirmado. Verifique sua caixa de entrada e spam.';
      }

      setError(mensagemErro);

      // 🔥 SweetAlert de erro no cadastro
      Swal.fire({
        icon: 'error',
        title: '❌ Erro no cadastro',
        text: mensagemErro,
        confirmButtonColor: '#9b6b43',
        confirmButtonText: 'Tentar novamente',
        background: '#ffffff',
        iconColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: cores.fundo,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          background: cores.card,
          borderRadius: '24px',
          padding: '40px',
          border: `1px solid ${cores.borda}`,
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '75px',
              height: '75px',
              background: cores.marrom,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: 'white',
              fontSize: '34px',
            }}
          >
            ✝️
          </div>

          <h1
            style={{
              fontSize: '30px',
              color: cores.texto,
              marginBottom: '8px',
            }}
          >
            O Bom Samaritano
          </h1>

          <p
            style={{
              color: cores.cinza,
              fontSize: '14px',
            }}
          >
            Conectando pessoas pela fé
          </p>
        </div>

        {/* ABAS */}
        <div
          style={{
            display: 'flex',
            background: cores.bege,
            borderRadius: '14px',
            padding: '6px',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={() => setAba('entrar')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: '0.2s',
              background: aba === 'entrar' ? cores.marrom : 'transparent',
              color: aba === 'entrar' ? 'white' : cores.texto,
            }}
          >
            Entrar
          </button>

          <button
            onClick={() => setAba('cadastro')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: '0.2s',
              background: aba === 'cadastro' ? cores.marrom : 'transparent',
              color: aba === 'cadastro' ? 'white' : cores.texto,
            }}
          >
            Cadastro
          </button>
        </div>

        {/* ERRO */}
        {error && (
          <div
            style={{
              background: '#fde8e8',
              color: '#c53030',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* LOGIN */}
        {aba === 'entrar' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: cores.texto,
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${cores.borda}`,
                  background: '#faf7f2',
                  fontSize: '14px',
                  outline: 'none',
                  color: cores.texto,
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: cores.texto,
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${cores.borda}`,
                  background: '#faf7f2',
                  fontSize: '14px',
                  outline: 'none',
                  color: cores.texto,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: 'none',
                borderRadius: '14px',
                background: cores.marrom,
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: '0.2s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastro}>
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: cores.texto,
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Nome
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${cores.borda}`,
                  background: '#faf7f2',
                  color: '#000000',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: cores.texto,
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${cores.borda}`,
                  background: '#faf7f2',
                  color: '#000000',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: cores.texto,
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Senha (mínimo 6 caracteres)
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${cores.borda}`,
                  background: '#faf7f2',
                  color: '#000000',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: 'none',
                borderRadius: '14px',
                background: cores.marrom,
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;