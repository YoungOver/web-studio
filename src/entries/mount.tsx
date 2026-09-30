import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'

export function mount(App: ComponentType, theme: 'dark' | 'light') {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
