import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function SupabaseDebug() {
  const [status, setStatus] = useState('Verificando...')
  const [details, setDetails] = useState({})

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // 1. Verificar que el cliente está creado
        console.log('✅ Cliente Supabase creado')
        console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
        console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Falta')

        // 2. Intentar conectar
        const { data, error } = await supabase.auth.getSession()
        
        console.log('📍 Respuesta getSession:', { data, error })

        setDetails({
          url: import.meta.env.VITE_SUPABASE_URL,
          hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          sessionData: data,
          sessionError: error?.message || 'ninguno'
        })

        if (error) {
          setStatus(`❌ Error: ${error.message}`)
        } else if (data?.session) {
          setStatus('✅ Conectado y autenticado')
        } else {
          setStatus('✅ Conectado pero no autenticado')
        }
      } catch (err) {
        console.error('❌ Error crítico:', err)
        setStatus(`❌ Error crítico: ${err.message}`)
        setDetails({ error: err.message })
      }
    }

    checkSupabase()
  }, [])

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      marginBottom: '2rem',
      border: '2px solid #e5e7eb'
    }}>
      <h3>🔍 Debug Supabase</h3>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        {status}
      </p>
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Detalles técnicos</summary>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#111827',
          color: '#10b981',
          borderRadius: '0.25rem',
          overflow: 'auto',
          fontSize: '0.85rem'
        }}>
          {JSON.stringify(details, null, 2)}
        </pre>
      </details>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
        Abre la consola (F12) para ver todos los logs
      </p>
    </div>
  )
}
