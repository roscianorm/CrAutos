import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './auth/useAuth'
import HomePage from './pages/Home/HomePage'
import CarDetailPage from './pages/CarDetail/CarDetailPage'
import PublishPage from './pages/Publish/PublishPage'
import ProfilePage from './pages/Profile/ProfilePage'

export default function App() {
  // const { requiresProfile } = useAuth()

  // if (requiresProfile) {
  //   return <ProfilePage />
  // }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
      <Route path="/publish" element={<PublishPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}