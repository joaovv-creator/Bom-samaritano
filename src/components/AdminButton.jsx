// src/components/AdminButton.jsx
import { Plus, Trash2, Shield, X } from 'lucide-react'

export function AdminButton({ onClick, type = 'add', className = '' }) {
  const styles = {
    add: {
      background: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    delete: {
      background: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: '600',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    admin: {
      background: '#8b5e3c',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontWeight: '600',
      fontSize: '12px',
      cursor: 'default',
    }
  }

  const Icon = type === 'add' ? Plus : type === 'delete' ? Trash2 : Shield

  return (
    <button
      onClick={onClick}
      style={styles[type] || styles.add}
      className={className}
      onMouseEnter={(e) => {
        if (type === 'add') e.currentTarget.style.background = '#15803d'
        else if (type === 'delete') e.currentTarget.style.background = '#b91c1c'
      }}
      onMouseLeave={(e) => {
        if (type === 'add') e.currentTarget.style.background = '#16a34a'
        else if (type === 'delete') e.currentTarget.style.background = '#dc2626'
      }}
    >
      <Icon size={type === 'delete' ? 14 : 18} />
      {type === 'add' ? 'Adicionar' : type === 'delete' ? 'Remover' : 'Admin'}
    </button>
  )
}