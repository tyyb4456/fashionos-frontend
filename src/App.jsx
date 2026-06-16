import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Runs from './pages/Runs'
import RunDetail from './pages/RunDetail'
import Approvals from './pages/Approvals'
import Content from './pages/Content'
import Returns from './pages/Returns'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />

        {/* Protected app shell */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="runs" element={<Runs />} />
          <Route path="runs/:runId" element={<RunDetail />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="content" element={<Content />} />
          <Route path="returns" element={<Returns />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}