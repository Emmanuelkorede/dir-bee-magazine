
import { Route, Routes } from 'react-router'
import DashBoard from './pages/admin/dashboard'
import Login from './pages/admin/login'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css' 



function App() {
  
  return (
    <Routes>
      <Route path='/admin/login' element={<Login />} />
        
      <Route element={<ProtectedRoute />} >
        <Route path='/admin' element={<DashBoard />} />
        <Route path='/admin/story/:id' />
      </Route>
    </Routes>
  )
}

export default App
