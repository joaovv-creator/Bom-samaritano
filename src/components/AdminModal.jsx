// src/components/AdminModal.jsx
import { useState } from 'react'
import { X } from 'lucide-react'

export function AdminModal({ isOpen, onClose, onSave, title, fields, initialData = {} }) {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

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
      if (e.target === e.currentTarget) onClose()
    }}
    >
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
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
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <X size={22} />
        </button>

        <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '20px' }}>
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '6px',
                fontSize: '14px',
              }}>
                {field.label} {field.required && '*'}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={field.rows || 4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d6d3d1',
                    fontSize: '15px',
                    outline: 'none',
                    color: '#000',
                    fontFamily: 'inherit',
                    background: '#ffffff',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d6d3d1'}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d6d3d1',
                    fontSize: '15px',
                    outline: 'none',
                    color: '#000',
                    background: '#ffffff',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d6d3d1'}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  step={field.step || '0.01'}
                  min={field.min || 0}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d6d3d1',
                    fontSize: '15px',
                    outline: 'none',
                    color: '#000',
                    background: '#ffffff',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d6d3d1'}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d6d3d1',
                    fontSize: '15px',
                    outline: 'none',
                    color: '#000',
                    background: '#ffffff',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5e3c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d6d3d1'}
                />
              )}
            </div>
          ))}

          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #d6d3d1',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#64748b',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#8b5e3c',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#6b3f2a'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#8b5e3c'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}