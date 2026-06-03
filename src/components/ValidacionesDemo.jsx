import { useState } from 'react'
import { validarResena } from '../utils/validations'

function ValidacionesDemo() {
  const [textoDemo, setTextoDemo] = useState('')
  const [resultado, setResultado] = useState(null)

  const handleChange = (e) => {
    const valor = e.target.value
    setTextoDemo(valor)
    
    const validation = validarResena(valor, 5, 50)
    setResultado(validation)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🧪 Test de Validaciones de Reseña</h2>
        
        <div style={styles.section}>
          <p style={styles.label}>Escribe algo para ver las validaciones en tiempo real:</p>
          <textarea
            value={textoDemo}
            onChange={handleChange}
            placeholder="Escribe aquí tu reseña de prueba..."
            style={styles.textarea}
          />
        </div>

        {resultado && (
          <div style={styles.section}>
            <div style={{
              ...styles.result,
              ...(resultado.isValid ? styles.resultSuccess : styles.resultError)
            }}>
              <strong>
                {resultado.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}
              </strong>
              {resultado.errorMessage && (
                <p style={styles.errorMsg}>{resultado.errorMessage}</p>
              )}
            </div>

            <details style={styles.details}>
              <summary style={styles.summary}>📊 Detalles técnicos</summary>
              <div style={styles.detailsContent}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Dato</th>
                      <th scope="col">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Número de palabras:</strong></td>
                      <td>{resultado.parameters.numPalabras} / {resultado.parameters.minWords}-{resultado.parameters.maxWords}</td>
                    </tr>
                    <tr>
                      <td><strong>¿Palabras inapropiadas?</strong></td>
                      <td>{resultado.parameters.contieneMalaPalabra ? '❌ SÍ' : '✅ NO'}</td>
                    </tr>
                    <tr>
                      <td><strong>¿Contiene enlaces?</strong></td>
                      <td>{resultado.parameters.contieneLink ? '❌ SÍ' : '✅ NO'}</td>
                    </tr>
                    <tr>
                      <td><strong>¿Todo MAYÚSCULAS?</strong></td>
                      <td>{textoDemo && textoDemo === textoDemo.toUpperCase() ? '❌ SÍ' : '✅ NO'}</td>
                    </tr>
                    <tr>
                      <td><strong>Código de error:</strong></td>
                      <td>{resultado.errorCode || 'NINGUNO'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}

        <div style={styles.section}>
          <h3>📋 Casos de prueba</h3>
          <div style={styles.testCases}>
            <TestCase 
              label="❌ Muy corta (1 palabra)"
              texto="Bueno"
            />
            <TestCase 
              label="✅ Válida (5-50 palabras)"
              texto="Este juego es muy divertido y tiene una mecánica increíble que me encantó"
            />
            <TestCase 
              label="❌ Contiene palabra inapropiada"
              texto="Este juego es tonto y no me gustó para nada la experiencia"
            />
            <TestCase 
              label="❌ Contiene URL"
              texto="Visita www.ejemplo.com para más información sobre este juego"
            />
            <TestCase 
              label="❌ Todo en MAYÚSCULAS"
              texto="ESTE JUEGO ES INCREÍBLE Y MUY DIVERTIDO PARA JUGAR"
            />
            <TestCase 
              label="❌ Muy larga (más de 50 palabras)"
              texto="Este es un juego muy bueno porque tiene una historia increíble, una mecánica excelente, gráficos hermosos, música fantástica, y una jugabilidad que es absolutamente adictiva y emocionante para todos los amigos"
            />
          </div>
        </div>

        <div style={styles.info}>
          <strong>💡 Tip:</strong> Estas validaciones se ejecutan en el navegador, sin enviar nada al servidor.
        </div>
      </div>
    </div>
  )
}

function TestCase({ label, texto }) {
  const [expanded, setExpanded] = useState(false)
  const validation = validarResena(texto, 5, 50)

  return (
    <div 
      style={styles.testCase}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={styles.testCaseHeader}>
        <span>{label}</span>
        <span>{validation.isValid ? '✅' : '❌'}</span>
      </div>
      {expanded && (
        <div style={styles.testCaseContent}>
          <p style={styles.testCaseText}>{texto}</p>
          {validation.errorMessage && (
            <p style={styles.testCaseError}>{validation.errorMessage}</p>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '25px'
  },
  label: {
    marginBottom: '10px',
    color: '#555'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  result: {
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  resultSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  resultError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  errorMsg: {
    marginTop: '8px',
    marginBottom: 0
  },
  details: {
    marginTop: '10px'
  },
  summary: {
    cursor: 'pointer',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    userSelect: 'none'
  },
  detailsContent: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fafafa',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    fontSize: '13px',
    borderCollapse: 'collapse'
  },
  testCases: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  testCase: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  testCaseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    fontSize: '14px',
    fontWeight: 500
  },
  testCaseContent: {
    padding: '12px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fafafa'
  },
  testCaseText: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    color: '#555',
    fontStyle: 'italic'
  },
  testCaseError: {
    margin: 0,
    fontSize: '13px',
    color: '#d32f2f',
    fontWeight: 'bold'
  },
  info: {
    padding: '12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '20px'
  }
}

export default ValidacionesDemo
