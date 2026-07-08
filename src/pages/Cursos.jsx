import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { AdminModal } from '../components/AdminModal';
import Swal from 'sweetalert2';
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
  Award,
  Loader2,
  PlusCircle,
  X,
  Trash2,
  CheckCircle
} from "lucide-react";

// Mapeamento de ícones
const iconMap = {
  Music: Music,
  Hand: Hand,
  Mic: Mic,
  BookOpen: BookOpen,
  Users: Users,
  Clock3: Clock3,
  Church: Church,
  Activity: Activity,
  Sparkles: Sparkles,
  GraduationCap: GraduationCap,
  Award: Award
};

export default function Cursos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [deletando, setDeletando] = useState({});
  const [carregandoAdmin, setCarregandoAdmin] = useState(true);
  // 🔥 Estado para armazenar os IDs dos cursos que o usuário está inscrito
  const [cursosInscritos, setCursosInscritos] = useState([]);

  useEffect(() => {
    carregarCursos();
    verificarAdmin();
    carregarMatriculasUsuario();
  }, []);

  const verificarAdmin = async () => {
    try {
      setCarregandoAdmin(true);
      if (user) {
        const admin = await adminService.isAdmin(user.id);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      setIsAdmin(false);
    } finally {
      setCarregandoAdmin(false);
    }
  };

  // 🔥 FUNÇÃO PARA CARREGAR MATRÍCULAS DO USUÁRIO
  const carregarMatriculasUsuario = async () => {
    if (!user) {
      setCursosInscritos([]);
      return;
    }

    try {
      const matriculas = await adminService.getMatriculasByUser(user.id);
      // Extrair apenas os IDs dos cursos
      const idsInscritos = matriculas.map(m => m.curso_id);
      setCursosInscritos(idsInscritos);
      console.log('📚 Cursos inscritos:', idsInscritos);
    } catch (error) {
      console.error('Erro ao carregar matrículas:', error);
      setCursosInscritos([]);
    }
  };

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const dados = await adminService.getCursos();
      console.log('📚 Cursos carregados:', dados);
      setCursos(dados || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar os cursos.',
        confirmButtonColor: '#8b5e3c',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriarCurso = async (dados) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem criar cursos.',
        confirmButtonColor: '#8b5e3c',
      });
      return;
    }

    try {
      const topicosArray = dados.topicos ? dados.topicos.split(',').map(t => t.trim()) : [];
      
      const novoCurso = await adminService.criarCurso({
        titulo: dados.titulo,
        professor: dados.professor,
        duracao: dados.duracao,
        preco: dados.preco,
        nivel: dados.nivel,
        topicos: topicosArray,
        cor: dados.cor,
        icone: dados.icone
      });
      
      setCursos(prev => [...prev, novoCurso]);
      
      Swal.fire({
        icon: 'success',
        title: 'Curso criado!',
        text: `"${novoCurso.titulo}" foi adicionado com sucesso.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível criar o curso.',
        confirmButtonColor: '#8b5e3c',
      });
      throw error;
    }
  };

  const handleDeletarCurso = async (id, titulo) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado!',
        text: 'Apenas administradores podem deletar cursos.',
        confirmButtonColor: '#8b5e3c',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a deletar "${titulo}". Esta ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletando(prev => ({ ...prev, [id]: true }));
      await adminService.deletarCurso(id);
      setCursos(prev => prev.filter(c => c.id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deletado!',
        text: `"${titulo}" foi removido.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message || 'Não foi possível deletar o curso.',
        confirmButtonColor: '#8b5e3c',
      });
    } finally {
      setDeletando(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleInscrever = (curso) => {
    const { icone, ...cursoSemIcone } = curso;
    navigate("/cadastro-curso", { state: { curso: cursoSemIcone } });
  };

  const totalAlunos = cursos.reduce((acc, curso) => acc + (curso.alunos || 0), 0);
  const totalCursos = cursos.length;

  const camposCurso = [
    { name: 'titulo', label: 'Título do Curso', type: 'text', placeholder: 'Ex: Curso de Música para Louvor', required: true },
    { name: 'professor', label: 'Professor', type: 'text', placeholder: 'Ex: Carlos Mendes', required: true },
    { name: 'duracao', label: 'Duração', type: 'text', placeholder: 'Ex: 8 semanas', required: true },
    { name: 'preco', label: 'Preço (R$)', type: 'number', placeholder: '197', required: true, min: 0 },
    { name: 'nivel', label: 'Nível', type: 'text', placeholder: 'Ex: Iniciante ao Avançado', required: true },
    { name: 'topicos', label: 'Tópicos (separados por vírgula)', type: 'text', placeholder: 'Teoria Musical, Técnica Vocal, Liderança de Louvor', required: true },
    { name: 'cor', label: 'Cor do Gradiente', type: 'text', placeholder: 'linear-gradient(135deg, #9b6b4f 0%, #8b5e3c 100%)', required: true },
    { name: 'icone', label: 'Ícone', type: 'select', options: [
      { value: 'Music', label: 'Música' },
      { value: 'Hand', label: 'Mão' },
      { value: 'Mic', label: 'Microfone' },
      { value: 'BookOpen', label: 'Livro' },
      { value: 'Users', label: 'Usuários' },
      { value: 'GraduationCap', label: 'Graduação' },
      { value: 'Award', label: 'Prêmio' },
      { value: 'Church', label: 'Igreja' },
      { value: 'Sparkles', label: 'Brilho' },
    ], required: true },
  ];

  if (loading || carregandoAdmin) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f2ea' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f2ea", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        
        {/* BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5e3c, #b57a4b)',
          borderRadius: '20px',
          padding: '40px 36px',
          color: 'white',
          marginBottom: '16px',
          boxShadow: '0 12px 40px rgba(139, 94, 60, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}>
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

            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              Cursos Cristãos
            </h1>

            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              margin: '0 0 4px 0',
              fontWeight: '400',
              lineHeight: 1.6,
            }}>
              Aprenda e desenvolva seus talentos para servir ao Reino
            </p>

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

            <div style={{
              display: 'flex',
              gap: '28px',
              marginTop: '18px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{totalCursos} cursos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{totalAlunos} alunos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>Certificado reconhecido</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTÃO ADMIN */}
        {isAdmin && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px',
          }}>
            <button
              onClick={() => setModalCriarOpen(true)}
              style={{
                background: '#8b5e3c',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(139, 94, 60, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6b3f2a'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#8b5e3c'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <PlusCircle size={18} />
              Adicionar Curso
            </button>
          </div>
        )}

        {/* GRID DE CURSOS */}
        {cursos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '18px' }}>
            <GraduationCap size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
            <p style={{ color: '#64748b', fontSize: '18px' }}>
              Nenhum curso disponível ainda.
            </p>
            {isAdmin && (
              <button
                onClick={() => setModalCriarOpen(true)}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: '#8b5e3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#6b3f2a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#8b5e3c'}
              >
                <PlusCircle size={18} style={{ marginRight: '8px' }} />
                Criar primeiro curso
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {cursos.map((curso) => {
              const IconComponent = iconMap[curso.icone] || Music;
              // 🔥 VERIFICA SE O USUÁRIO ESTÁ INSCRITO NESTE CURSO
              const estaInscrito = user && cursosInscritos.includes(curso.id);

              return (
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
                    position: 'relative',
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
                  {/* 🔥 BOTÃO DELETAR - APENAS ADMIN */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletarCurso(curso.id, curso.titulo);
                      }}
                      disabled={deletando[curso.id]}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(220, 38, 38, 0.9)',
                        border: 'none',
                        color: 'white',
                        cursor: deletando[curso.id] ? 'not-allowed' : 'pointer',
                        padding: '6px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        zIndex: 10,
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: deletando[curso.id] ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      {deletando[curso.id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  )}

                  {/* 🔥 BADGE "INSCRITO" */}
                  {estaInscrito && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#16a34a',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 10,
                    }}>
                      <CheckCircle size={12} />
                      Inscrito
                    </div>
                  )}

                  <div style={{
                    background: curso.cor || 'linear-gradient(135deg, #9b6b4f 0%, #8b5e3c 100%)',
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <IconComponent size={30} color="white" />
                  </div>

                  <div style={{
                    padding: "18px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <div>
                      <h2 style={{
                        fontSize: "18px",
                        color: "#0f172a",
                        marginBottom: "6px",
                        fontWeight: "700",
                        lineHeight: "1.3",
                      }}>
                        {curso.titulo}
                      </h2>

                      <p style={{
                        color: "#64748b",
                        fontSize: "13px",
                        marginBottom: "18px",
                      }}>
                        Professor {curso.professor}
                      </p>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        marginBottom: '18px',
                        textAlign: 'center',
                      }}>
                        <div>
                          <Users size={18} color="#94a3b8" style={{ marginBottom: '5px' }} />
                          <p style={{ fontSize: '12px', color: '#475569' }}>{curso.alunos || 0} alunos</p>
                        </div>
                        <div>
                          <Clock3 size={18} color="#94a3b8" style={{ marginBottom: '5px' }} />
                          <p style={{ fontSize: '12px', color: '#475569' }}>{curso.duracao}</p>
                        </div>
                        <div>
                          <BookOpen size={18} color="#94a3b8" style={{ marginBottom: '5px' }} />
                          <p style={{ fontSize: '12px', color: '#475569' }}>{curso.nivel}</p>
                        </div>
                      </div>

                      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />

                      <h4 style={{ marginBottom: '10px', color: '#0f172a', fontSize: '14px' }}>
                        O que você vai aprender:
                      </h4>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '18px',
                      }}>
                        {curso.topicos?.map((topico, idx) => (
                          <span key={idx} style={{
                            background: "#f1e6d5",
                            padding: "5px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            color: "#8b5e3c",
                          }}>
                            {topico}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                      <div>
                        <p style={{ color: "#64748b", fontSize: "11px" }}>A partir de</p>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "#8b5e3c" }}>
                          R$ {curso.preco}.00
                        </p>
                      </div>

                      {/* 🔥 BOTÃO - MUDA DE ACORDO COM A INSCRIÇÃO */}
                      {estaInscrito ? (
                        <button
                          style={{
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'default',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <CheckCircle size={16} />
                          Inscrito
                        </button>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BENEFÍCIOS */}
        <div style={{
          marginTop: "45px",
          background: "#9b6b4f",
          borderRadius: "16px",
          padding: "32px",
          color: "white",
        }}>
          <h3 style={{ fontSize: "28px", marginBottom: "22px", fontWeight: "700" }}>
            Por que fazer nossos cursos?
          </h3>

          <ul style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            fontSize: "16px",
            paddingLeft: "22px",
          }}>
            <li>Aprenda com profissionais experientes no ministério</li>
            <li>Certificado reconhecido ao concluir o curso</li>
            <li>Estude no seu próprio ritmo, quando e onde quiser</li>
            <li>Comunidade de alunos para networking e troca de experiências</li>
          </ul>
        </div>
      </div>

      {/* MODAL PARA CRIAR CURSO */}
      {isAdmin && (
        <AdminModal
          isOpen={modalCriarOpen}
          onClose={() => setModalCriarOpen(false)}
          onSave={handleCriarCurso}
          title="Novo Curso"
          fields={camposCurso}
          initialData={{
            titulo: '',
            professor: '',
            duracao: '',
            preco: '',
            nivel: '',
            topicos: '',
            cor: 'linear-gradient(135deg, #9b6b4f 0%, #8b5e3c 100%)',
            icone: 'Music'
          }}
        />
      )}

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}