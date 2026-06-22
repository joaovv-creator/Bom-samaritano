import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useAuth } from '../contexts/AuthContext'

function LeaderDashboard() {
  const { supabase } = useSupabase()
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    members: 0,
    posts: 0,
    pendingRequests: 0,
    events: 0
  })
  const [recentMembers, setRecentMembers] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchLeaderData()
  }, [])

  async function fetchLeaderData() {
    // Buscar membros recentes
    const { data: members } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Buscar posts
    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    // Buscar solicitações pendentes
    const { data: pending } = await supabase
      .from('group_requests')
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .eq('status', 'pending')
      .limit(5)

    setStats({
      members: members?.length || 0,
      posts: postsCount || 0,
      pendingRequests: pending?.length || 0,
      events: 3
    })
    setRecentMembers(members || [])
    setPendingApprovals(pending || [])
    setLoading(false)
  }

  async function approveRequest(requestId) {
    const { error } = await supabase
      .from('group_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)

    if (error) {
      alert('Erro ao aprovar solicitação')
    } else {
      alert('Solicitação aprovada!')
      fetchLeaderData()
    }
  }

  async function rejectRequest(requestId) {
    const { error } = await supabase
      .from('group_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)

    if (error) {
      alert('Erro ao rejeitar solicitação')
    } else {
      alert('Solicitação rejeitada')
      fetchLeaderData()
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #3498db', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header com gradiente */}
      <div style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '32px' }}>👑</span>
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>Dashboard do Líder</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Bem-vindo, {profile?.name?.split(' ')[0] || 'Líder'}!
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔔 Notificações
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Cards de Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Membros</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{stats.members}</p>
              </div>
              <span style={{ fontSize: '28px' }}>👥</span>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Posts</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{stats.posts}</p>
              </div>
              <span style={{ fontSize: '28px' }}>💬</span>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Eventos</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{stats.events}</p>
              </div>
              <span style={{ fontSize: '28px' }}>📅</span>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>Pendentes</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingRequests}</p>
              </div>
              <span style={{ fontSize: '28px' }}>📊</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 16px',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'overview' ? '#3498db' : '#6b7280',
              borderBottom: activeTab === 'overview' ? '2px solid #3498db' : 'none'
            }}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={{
              padding: '8px 16px',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'members' ? '#3498db' : '#6b7280',
              borderBottom: activeTab === 'members' ? '2px solid #3498db' : 'none'
            }}
          >
            Membros
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '8px 16px',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'requests' ? '#3498db' : '#6b7280',
              borderBottom: activeTab === 'requests' ? '2px solid #3498db' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Solicitações
            {stats.pendingRequests > 0 && (
              <span style={{ background: '#ef4444', color: 'white', fontSize: '11px', borderRadius: '12px', padding: '2px 8px' }}>
                {stats.pendingRequests}
              </span>
            )}
          </button>
        </div>

        {/* Conteúdo dos Tabs */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Membros Recentes */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👥 Membros Recentes
                </h2>
                <button style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Ver todos →</button>
              </div>
              <div>
                {recentMembers.map((member) => (
                  <div key={member.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#e8f4fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#3498db', fontWeight: 'bold' }}>{member.name?.[0]?.toUpperCase() || 'U'}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: '500', color: '#1f2937' }}>{member.name || 'Usuário'}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>{new Date(member.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#f3f4f6', padding: '4px 8px', borderRadius: '12px', color: '#6b7280' }}>
                      {member.role || 'membro'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atividade Recente */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ❤️ Atividade da Comunidade
                </h2>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#6b7280' }}>Engajamento esta semana</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>+24%</span>
                </div>
                <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', background: '#3498db', height: '100%', borderRadius: '10px' }}></div>
                </div>
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#6b7280' }}>Posts</span>
                    <span style={{ fontWeight: '500' }}>156</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#6b7280' }}>Comentários</span>
                    <span style={{ fontWeight: '500' }}>432</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#6b7280' }}>Curtidas</span>
                    <span style={{ fontWeight: '500' }}>1.2k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontWeight: '600', color: '#1f2937' }}>Lista de Membros</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Membro</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Email</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Entrada</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                  {recentMembers.map((member) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', background: '#e8f4fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#3498db', fontSize: '14px', fontWeight: 'bold' }}>{member.name?.[0]?.toUpperCase() || 'U'}</span>
                          </div>
                          <span style={{ fontWeight: '500' }}>{member.name || 'Usuário'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', color: '#6b7280' }}>{member.email || '-'}</td>
                      <td style={{ padding: '12px 20px', color: '#6b7280', fontSize: '13px' }}>{new Date(member.created_at).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '12px' }}>Ativo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontWeight: '600', color: '#1f2937' }}>Solicitações Pendentes</h2>
            </div>
            <div>
              {pendingApprovals.map((request) => (
                <div key={request.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{request.profiles?.name || 'Usuário'}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{request.profiles?.email}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Solicitação para: {request.group_name || 'Grupo de Estudo'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => approveRequest(request.id)}
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <span style={{ fontSize: '48px' }}>🏆</span>
                  <p style={{ color: '#6b7280', marginTop: '12px' }}>Nenhuma solicitação pendente</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderDashboard;