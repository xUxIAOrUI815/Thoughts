import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import SyncBar from './SyncBar'

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="ml-60 flex-1 min-h-screen flex flex-col">
        <SyncBar />
        <div className="flex-1 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
