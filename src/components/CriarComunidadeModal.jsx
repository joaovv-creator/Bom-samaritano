
import { useState } from 'react';
import { X, Loader2, Globe, Lock, Users, Music, Church, Heart, Shield, Group, BookOpen, Sparkles, Star, MessageCircle, Coffee } from 'lucide-react';
import { communityService } from '../services/communityService';

// Mapeamento de ícones para exibição
const ICONES = [
  { value: 'Globe', icon: Globe, label: 'Globo' },
  { value: 'Users', icon: Users, label: 'Usuários' },
  { value: 'Music', icon: Music, label: 'Música' },
  { value: 'Church', icon: Church, label: 'Igreja' },
  { value: 'Heart', icon: Heart, label: 'Coração' },
  { value: 'Shield', icon: Shield, label: 'Escudo' },
  { value: 'Group', icon: Group, label: 'Grupo' },
  { value: 'BookOpen', icon: BookOpen, label: 'Bíblia' },
  { value: 'Sparkles', icon: Sparkles, label: 'Brilho' },
  { value: 'Star', icon: Star, label: 'Estrela' },
  { value: 'MessageCircle', icon: MessageCircle, label: 'Mensagem' },
  { value: 'Coffee', icon: Coffee, label: 'Café' },
];

const CORES = [
  { value: '#8b5e3c', label: 'Marrom' },
  { value: '#2563eb', label: 'Azul' },
  { value: '#7c3aed', label: 'Roxo' },
  { value: '#dc2626', label: 'Vermelho' },
  { value: '#059669', label: 'Verde' },
  { value: '#d97706', label: 'Âmbar' },
  { value: '#db2777', label: 'Rosa' },
  { value: '#6b7280', label: 'Cinza' },
  { value: '#0d9488', label: 'Teal' },
  { value: '#4f46e5', label: 'Índigo' },
];

export default function CriarComunidadeModal({ isOpen, onClose, onCommunityCreated, user }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'global',
    whatsapp: '',
    cor: '#8b5e3c',
    icone: 'Globe'
  });

  const [erros, setErros] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.descricao.trim()) {
      novosErros.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length < 10) {
      novosErros.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    // Validar WhatsApp - pode ser vazio ou um link válido
    if (formData.whatsapp && formData.whatsapp.trim()) {
      const whatsapp = formData.whatsapp.trim();
      // Se não começar com http, adicionar https://
      if (!whatsapp.startsWith('http://') && !whatsapp.startsWith('https://')) {
        // Se for um código de convite (ex: ABC123), transformar em link
        if (!whatsapp.includes('whatsapp.com')) {
          // Pode ser apenas o código do grupo
          if (whatsapp.length > 0) {
            // Não validamos mais, apenas ajustamos depois
          }
        }
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Você precisa estar logado para criar uma comunidade');
      return;
    }

    if (!validarFormulario()) return;

    try {
      setLoading(true);
      
      // Preparar dados para envio
      const dados = {
        ...formData,
        whatsapp: formData.whatsapp?.trim() || null
      };

      // Se o WhatsApp não for um link completo, tentar ajustar
      if (dados.whatsapp && !dados.whatsapp.startsWith('http')) {
        if (dados.whatsapp.includes('whatsapp.com')) {
          dados.whatsapp = 'https://' + dados.whatsapp;
        } else {
          // Assume que é um código de convite
          dados.whatsapp = `https://chat.whatsapp.com/${dados.whatsapp}`;
        }
      }

      const novaComunidade = await communityService.criarComunidade(dados, user.id);

      onClose();
      
      setFormData({
        nome: '',
        descricao: '',
        tipo: 'global',
        whatsapp: '',
        cor: '#8b5e3c',
        icone: 'Globe'
      });

      if (onCommunityCreated) {
        onCommunityCreated(novaComunidade);
      }

    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      padding: '20px',
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '36px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <X size={24} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '28px',
            color: '#0f172a',
            marginBottom: '4px',
          }}>
            🌟 Criar Comunidade
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '15px',
          }}>
            Crie um novo espaço para sua comunidade de fé
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Nome da Comunidade *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Jovens de Fé"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `1px solid ${erros.nome ? '#dc2626' : '#d6d3d1'}`,
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s',
                color: '#000',
                background: '#fff',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
              onBlur={(e) => e.currentTarget.style.borderColor = erros.nome ? '#dc2626' : '#d6d3d1'}
            />
            {erros.nome && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                {erros.nome}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Descrição *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o propósito da comunidade..."
              rows="3"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `1px solid ${erros.descricao ? '#dc2626' : '#d6d3d1'}`,
                fontSize: '15px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.3s',
                color: '#000',
                fontFamily: 'inherit',
                background: '#fff',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
              onBlur={(e) => e.currentTarget.style.borderColor = erros.descricao ? '#dc2626' : '#d6d3d1'}
            />
            {erros.descricao && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                {erros.descricao}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Tipo
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'global' }))}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: formData.tipo === 'global' ? '2px solid #8b5e3c' : '1px solid #d6d3d1',
                  background: formData.tipo === 'global' ? '#f5f2ea' : 'white',
                  cursor: 'pointer',
                  fontWeight: formData.tipo === 'global' ? '600' : '400',
                  color: formData.tipo === 'global' ? '#8b5e3c' : '#64748b',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Globe size={18} />
                Global
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipo: 'privada' }))}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: formData.tipo === 'privada' ? '2px solid #8b5e3c' : '1px solid #d6d3d1',
                  background: formData.tipo === 'privada' ? '#f5f2ea' : 'white',
                  cursor: 'pointer',
                  fontWeight: formData.tipo === 'privada' ? '600' : '400',
                  color: formData.tipo === 'privada' ? '#8b5e3c' : '#64748b',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Lock size={18} />
                Privada
              </button>
            </div>
          </div>

          {/* Link do WhatsApp */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Link do WhatsApp (opcional)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: `1px solid ${erros.whatsapp ? '#dc2626' : '#d6d3d1'}`,
              transition: 'border-color 0.3s',
              overflow: 'hidden',
            }}>
              <span style={{
                padding: '12px 12px 12px 16px',
                color: '#94a3b8',
                fontSize: '14px',
                background: '#f1f5f9',
                borderRight: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
              }}>
                💬
              </span>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="Código do grupo ou link completo"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  fontSize: '15px',
                  outline: 'none',
                  color: '#000',
                  background: 'transparent',
                }}
              />
            </div>
            <p style={{
              fontSize: '13px',
              color: '#94a3b8',
              marginTop: '6px',
            }}>
              Cole o código do convite (ex: ABC123) ou o link completo
            </p>
            {erros.whatsapp && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                {erros.whatsapp}
              </p>
            )}
          </div>

          {/* Ícone */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Ícone
            </label>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              {ICONES.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icone: value }))}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: formData.icone === value ? '2px solid #8b5e3c' : '1px solid #d6d3d1',
                    background: formData.icone === value ? '#f5f2ea' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: formData.icone === value ? '#8b5e3c' : '#64748b',
                    transition: 'all 0.2s',
                  }}
                  title={label}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '6px',
              fontSize: '14px',
            }}>
              Cor
            </label>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {CORES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cor: value }))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: value,
                    border: formData.cor === value ? '3px solid #0f172a' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: formData.cor === value ? '0 0 0 3px rgba(139, 94, 60, 0.3)' : 'none',
                  }}
                  title={label}
                />
              ))}
            </div>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #d6d3d1',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#64748b',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: '#8b5e3c',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#6b3f2a';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#8b5e3c';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Comunidade'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}