import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import FooterBar from './FooterBar'
import type { ThemeTokens } from '../types/priceboard'

type Props = { th: ThemeTokens; toggleDark: () => void }

export default function Layout({ th, toggleDark }: Props) {
  return (
    <div className="flex flex-col h-screen font-sans overflow-hidden bg-app" style={{ color: th.text }}>
      <TopBar th={th} toggleDark={toggleDark} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <FooterBar />
    </div>
  )
}
