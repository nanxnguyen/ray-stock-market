import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import FooterBar from './FooterBar'
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; toggleDark: () => void }

export default function Layout({ th, toggleDark }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Inter', system-ui, sans-serif", color: th.text,
      overflow: 'hidden', background: th.appBg,
    }}>
      <TopBar th={th} toggleDark={toggleDark} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
      <FooterBar />
    </div>
  )
}
