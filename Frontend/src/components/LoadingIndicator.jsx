import React from 'react'

const LoadingIndicator = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      flexDirection: 'column'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '6px solid #ddd',
        borderTop: '6px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
        Loading, please wait...
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default LoadingIndicator