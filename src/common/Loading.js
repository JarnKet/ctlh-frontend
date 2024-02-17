import React from 'react'

export default function Loading() {
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }}>
        <img src='/assets/image/loading-animation.gif' alt='login' />
    </div>
  )
}
