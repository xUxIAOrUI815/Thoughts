import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PreInternship from './pages/PreInternship'
import DuringInternship from './pages/DuringInternship'
import PostInternship from './pages/PostInternship'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pre" element={<PreInternship />} />
        <Route path="during" element={<DuringInternship />} />
        <Route path="post" element={<PostInternship />} />
      </Route>
    </Routes>
  )
}
