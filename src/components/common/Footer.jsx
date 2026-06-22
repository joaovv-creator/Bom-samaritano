export default function Footer() {
  return (
    <footer
      style={{
        background: '#f6ead8',
        borderTop: '1px solid #e7d6bf',
        padding: '40px 24px',
        marginTop: '60px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontStyle: 'italic',
            marginBottom: '16px',
            color: '#475569',
            fontSize: '18px',
            lineHeight: '1.8',
          }}
        >
          "Porque onde estiverem dois ou três reunidos em meu
          nome, ali estou no meio deles"
        </p>

        <p
          style={{
            fontSize: '15px',
            color: '#8B5A2B',
            fontWeight: '600',
            marginBottom: '24px',
          }}
        >
          Mateus 18:20
        </p>

        <div
          style={{
            width: '120px',
            height: '2px',
            background: '#d8c1a4',
            margin: '0 auto 24px auto',
          }}
        />

        <p
          style={{
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          © 2025 O Bom Samaritano - Todos os direitos reservados
        </p>
      </div>
    </footer>
  )
}