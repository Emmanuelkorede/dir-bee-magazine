
import { Route, Routes } from 'react-router'
import DashBoard from './pages/admin/dashboard'
import Login from './pages/admin/login'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin' element={<DashBoard />} />
    </Routes>
  )
}

export default App
