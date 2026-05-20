import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="ml-60 flex-1 min-h-screen">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
