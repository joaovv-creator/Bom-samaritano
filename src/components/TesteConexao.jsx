import { useState, useEffect } from 'react';

export default function TesteConexao() {
  const [status, setStatus] = useState('🔄 Verificando...');
  const [detalhes, setDetalhes] = useState('');

  useEffect(() => {
    testar();
  }, []);

  const testar = () => {
    console.log('🧪 Teste do componente...');
    console.log('🔍 window.supabase:', window.supabase);

    if (!window.supabase) {
      setStatus('❌ Supabase NÃO disponível!');
      setDetalhes('window.supabase é undefined');
      return;
    }

    setStatus('✅ Supabase disponível! Testando consulta...');
    
    window.supabase
      .from('profiles')
      .select('count')
      .then(({ data, error }) => {
        if (error) {
          setStatus('❌ Erro na consulta');
          setDetalhes(error.message);
          console.error('Erro:', error);
        } else {
          setStatus('✅ CONECTADO!');
          setDetalhes(`Total de perfis: ${data[0]?.count || 0}`);
          console.log('Dados:', data);
        }
      })
      .catch(err => {
        setStatus('❌ Erro inesperado');
        setDetalhes(err.message);
        console.error('Erro:', err);
      });
  };

  return (
    <div style={{
      background: '#f5f2ea',
      padding: '24px',
      borderRadius: '16px',
      maxWidth: '500px',
      margin: '20px auto',
      border: '1px solid #e7dfd4'
    }}>
      <h3 style={{ color: '#8b5e3c' }}>🛠️ Status da Conexão</h3>
      
      <div style={{
        background: status.includes('✅') ? '#dcfce7' : 
                   status.includes('❌') ? '#fee2e2' : '#fef3c7',
        padding: '16px',
        borderRadius: '8px',
        margin: '16px 0',
        fontWeight: 'bold'
      }}>
        {status}
      </div>
      
      {detalhes && (
        <div style={{
          background: '#f8f5ef',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#334155'
        }}>
          {detalhes}
        </div>
      )}
      
      <button
        onClick={testar}
        style={{
          marginTop: '16px',
          background: '#8b5e3c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        🔄 Testar Novamente
      </button>
    </div>
  );
}