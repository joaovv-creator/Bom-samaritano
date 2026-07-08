// src/pages/Comunidade.jsx
import { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/communityService';
import CriarComunidadeModal from '../components/CriarComunidadeModal';
import Swal from 'sweetalert2';
import {
  Globe,
  Lock,
  Users,
  Music,
  Church,
  Heart,
  Search,
  Shield,
  CheckCircle,
  Plus,
  Group,
  Activity,
  Loader2,
  AlertCircle,
  PlusCircle,
  Trash2,
  BookOpen,
  Sparkles,
  Star,
  MessageCircle,
  Coffee
} from 'lucide-react';

// Mapeamento de ícones
const iconMap = {
  Globe: Globe,
  Users: Users,
  Music: Music,
  Church: Church,
  Heart: Heart,
  Shield: Shield,
  Group: Group,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
  Star: Star,
  MessageCircle: MessageCircle,
  Coffee: Coffee,
};

export default function Comunidade() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [comunidadesGlobais, setComunidadesGlobais] = useState([]);
  const [comunidadesPrivadas, setComunidadesPrivadas] = useState([]);
  const [comunidadesUsuario, setComunidadesUsuario] = useState([]);
  const [totalMembros, setTotalMembros] = useState(0);
  const [totalComunidades, setTotalComunidades] = useState(0);
  const [activeTab, setActiveTab] = useState("globais");
  const [searchTerm, setSearchTerm] = useState("");
  const [participando, setParticipando] = useState({});
  const [modalCriarOpen, setModalCriarOpen] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const [globais, privadas] = await Promise.all([
        communityService.getComunidadesGlobais(),
        communityService.getComunidadesPrivadas()
      ]);

      setComunidadesGlobais(globais || []);
      setComunidadesPrivadas(privadas || []);

      if (user) {
        const participadas = await communityService.getComunidadesDoUsuario(user.id);
        const ids = participadas.map(item => item.comunidade_id || item.id);
        setComunidadesUsuario(ids);
      }

      const todas = [...(globais || []), ...(privadas || [])];
      setTotalComunidades(todas.length);
      
      const total = todas.reduce((acc, c) => acc + (c.membros || 0), 0);
      setTotalMembros(total);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = async (comunidade) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Faça login!',
        text: 'Você precisa estar logado para participar das comunidades.',
        confirmButtonColor: '#8b5e3c',
      });
      return;
    }

    const isParticipando = comunidadesUsuario.includes(comunidade.id);

    try {
      setParticipando(prev => ({ ...prev, [comunidade.id]: true }));

      if (isParticipando) {
        await communityService.sair(comunidade.id, user.id);
        setComunidadesUsuario(prev => prev.filter(id => id !== comunidade.id));
        
        Swal.fire({
          icon: 'info',
          title: 'Você saiu!',
          text: `Você saiu da comunidade ${comunidade.nome}`,
          timer: 2000,
          showConfirmButton: true,
          confirmButtonColor: '#8b5e3c',
        });
      } else {
        await communityService.participar(comunidade.id, user.id);
        setComunidadesUsuario(prev => [...prev, comunidade.id]);
        
        if (comunidade.whatsapp) {
          window.open(comunidade.whatsapp, "_blank");
        }

        Swal.fire({
          icon: 'success',
          title: 'Bem-vindo!',
          text: `Você agora faz parte da comunidade ${comunidade.nome}`,
          timer: 2000,
          showConfirmButton: true,
          confirmButtonColor: '#8b5e3c',
        });
      }

      await carregarDados();

    } catch (error) {
      console.error('Erro ao participar/sair:', error);
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: error.message || 'Erro ao processar sua solicitação.',
        confirmButtonColor: '#8b5e3c',
      });
    } finally {
      setParticipando(prev => ({ ...prev, [comunidade.id]: false }));
    }
  };

  const handleCommunityCreated = (novaComunidade) => {
    if (novaComunidade.tipo === 'global') {
      setComunidadesGlobais(prev => [novaComunidade, ...prev]);
    } else {
      setComunidadesPrivadas(prev => [novaComunidade, ...prev]);
    }
    setTotalComunidades(prev => prev + 1);
    setTotalMembros(prev => prev + 1);
    
    if (user) {
      setComunidadesUsuario(prev => [...prev, novaComunidade.id]);
    }
  };

  const handleDeletarComunidade = async (comunidade) => {
    if (!user) return;

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a deletar a comunidade "${comunidade.nome}". Esta ação não pode ser desfeita!`,
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
      await communityService.deletarComunidade(comunidade.id, user.id);
      
      if (comunidade.tipo === 'global') {
        setComunidadesGlobais(prev => prev.filter(c => c.id !== comunidade.id));
      } else {
        setComunidadesPrivadas(prev => prev.filter(c => c.id !== comunidade.id));
      }
      setTotalComunidades(prev => prev - 1);
      setTotalMembros(prev => prev - (comunidade.membros || 0));

      Swal.fire({
        icon: 'success',
        title: 'Deletada!',
        text: `A comunidade "${comunidade.nome}" foi removida.`,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#8b5e3c',
      });

    } catch (error) {
      console.error('Erro ao deletar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.message,
        confirmButtonColor: '#8b5e3c',
      });
    }
  };

  const comunidadesAtuais = activeTab === "globais" ? comunidadesGlobais : comunidadesPrivadas;
  
  const comunidadesFiltradas = comunidadesAtuais.filter(com =>
    com?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    com?.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f2ea' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#8b5e3c' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f2ea', minHeight: 'calc(100vh - 70px)', padding: '24px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* BANNER - COMUNIDADES */}
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
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
                  <Church size={18} style={{ opacity: 0.9 }} />
                  <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', opacity: 0.9 }}>
                    Comunidades de Fé
                  </span>
                </div>

                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.2,
                }}>
                  Comunidades
                </h1>

                <p style={{
                  fontSize: '17px',
                  opacity: 0.95,
                  margin: '0 0 4px 0',
                  fontWeight: '400',
                  lineHeight: 1.6,
                }}>
                  Conecte-se com irmãos em comunidades globais ou privadas
                </p>
              </div>

              {user && (
                <button
                  onClick={() => setModalCriarOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '14px',
                    padding: '12px 20px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <PlusCircle size={20} />
                  Criar Comunidade
                </button>
              )}
            </div>

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
                "Porque, assim como o corpo é um e tem muitos membros, e todos os membros, sendo muitos, são um só corpo, assim é Cristo também"
              </p>
              <p style={{
                fontSize: '13px',
                margin: '4px 0 0 0',
                opacity: 0.7,
                fontWeight: '300',
              }}>
                — 1 Coríntios 12:12
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '28px',
              marginTop: '18px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{totalMembros} membros</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Group size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{totalComunidades} comunidades</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '14px', opacity: 0.85 }}>{comunidadesUsuario.length} participando</span>
              </div>
            </div>
          </div>
        </div>

        {/* ABAS - Responsivo */}
        <div style={{
          display: 'flex',
          gap: '20px',
          borderBottom: '1px solid #d6d3d1',
          marginBottom: '30px',
          background: 'white',
          padding: '0 16px',
          borderRadius: '18px 18px 0 0',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab("globais")}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0 14px 0',
              cursor: 'pointer',
              color: activeTab === "globais" ? '#7c4a2d' : '#64748b',
              fontWeight: '600',
              borderBottom: activeTab === "globais" ? '3px solid #7c4a2d' : '3px solid transparent',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <Globe size={16} />
            Globais ({comunidadesGlobais.length})
          </button>

          <button
            onClick={() => setActiveTab("privadas")}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0 14px 0',
              cursor: 'pointer',
              color: activeTab === "privadas" ? '#7c4a2d' : '#64748b',
              fontWeight: '600',
              borderBottom: activeTab === "privadas" ? '3px solid #7c4a2d' : '3px solid transparent',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <Lock size={16} />
            Privadas ({comunidadesPrivadas.length})
          </button>
        </div>

        {/* BUSCA - Responsivo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '35px',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }} />
            <input
              type="text"
              placeholder="Buscar comunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 44px',
                borderRadius: '12px',
                border: '1px solid #d6d3d1',
                fontSize: '15px',
                background: '#fff',
                outline: 'none',
                transition: 'all 0.3s',
                color: '#000',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c4a2d';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(124, 74, 45, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d6d3d1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* CARDS - Grid Responsivo com ALINHAMENTO PERFEITO */}
        {comunidadesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '18px' }}>
            <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
            <p style={{ color: '#64748b', fontSize: '18px' }}>
              {searchTerm ? 'Nenhuma comunidade encontrada com esse termo' : 'Nenhuma comunidade disponível'}
            </p>
            {user && (
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
                Criar primeira comunidade
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch', // 🔥 FORÇA TODOS OS CARDS TEREM A MESMA ALTURA
          }}>
            {comunidadesFiltradas.map((com) => {
              const isParticipando = comunidadesUsuario.includes(com.id);
              const IconComponent = iconMap[com.icone] || Globe;
              const isCriador = user && com.criado_por === user.id;

              return (
                <div
                  key={com.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid #e7e5e4',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column', // 🔥 COLUNA PARA O CONTEÚDO
                    height: '100%', // 🔥 ALTURA 100% DO CARD
                    minHeight: '320px', // 🔥 ALTURA MÍNIMA
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isCriador && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#8b5e3c',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 2,
                    }}>
                      👑 Criador
                    </div>
                  )}

                  {/* ÍCONE - CENTRALIZADO E ALINHADO */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: com.cor || '#8b5e3c',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginBottom: '16px',
                    flexShrink: 0, // 🔥 NÃO ENCOLHE
                  }}>
                    <IconComponent size={26} />
                  </div>

                  {/* NOME */}
                  <h2 style={{
                    fontSize: '20px',
                    color: '#0f172a',
                    marginBottom: '6px',
                    fontWeight: '700',
                    lineHeight: 1.3,
                  }}>
                    {com.nome}
                  </h2>

                  {/* INFO - MEMBROS E WHATSAPP */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#64748b',
                    marginBottom: '12px',
                    fontSize: '13px',
                    flexWrap: 'wrap',
                  }}>
                    <Users size={14} />
                    <span>{com.membros || 0} membros</span>
                    {com.whatsapp && (
                      <>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span style={{ color: '#25D366' }}>💬 WhatsApp</span>
                      </>
                    )}
                  </div>

                  {/* DESCRIÇÃO - CRESCE PARA OCUPAR ESPAÇO */}
                  <p style={{
                    color: '#475569',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    fontSize: '14px',
                    flex: 1, // 🔥 OCUPA O ESPAÇO DISPONÍVEL
                  }}>
                    {com.descricao}
                  </p>

                  {/* BOTÃO - SEMPRE NO FINAL */}
                  <button
                    onClick={() => handleParticipar(com)}
                    disabled={participando[com.id]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: isParticipando ? '#16a34a' : '#7c4a2d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: participando[com.id] ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s',
                      opacity: participando[com.id] ? 0.7 : 1,
                      marginTop: 'auto', // 🔥 EMPURRA O BOTÃO PARA O FINAL
                      flexShrink: 0, // 🔥 NÃO ENCOLHE
                    }}
                  >
                    {participando[com.id] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isParticipando ? (
                      <>
                        <CheckCircle size={16} />
                        Participando
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Participar
                      </>
                    )}
                  </button>

                  {/* BOTÃO DELETAR - APENAS CRIADOR */}
                  {isCriador && (
                    <button
                      onClick={() => handleDeletarComunidade(com)}
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        zIndex: 2,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Deletar comunidade"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CriarComunidadeModal
        isOpen={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onCommunityCreated={handleCommunityCreated}
        user={user}
      />
    </div>
  );
}