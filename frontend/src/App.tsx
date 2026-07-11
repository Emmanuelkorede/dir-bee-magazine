
import { Route, Routes } from 'react-router'
import Login from './pages/admin/login'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  )
}

export default App
