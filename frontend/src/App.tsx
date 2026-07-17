
import { Route, Routes } from 'react-router'
import DashBoard from './pages/admin/dashboard'
import Login from './pages/admin/login'
import ProtectedRoute from './components/ProtectedRoute' ;
import StoryContent from './pages/admin/storyContent';
import AdminStories from './pages/admin/stories';
import './App.css' 
import Categories from './pages/admin/categories';
import CategoryPage from './pages/public/CategoryPage';
import StoryDetails from './pages/public/StoryDetails';
import About from './pages/public/About';
import Home from './pages/public/Home';


function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/category/:url'  element={<CategoryPage />} />
      <Route  path='/storydetails/:url/:id' element={<StoryDetails />}/>
      <Route path='/about' element={<About />} />
      {/*admin */}
      <Route path='/admin/login' element={<Login />} />
        
      <Route element={<ProtectedRoute />} >
        <Route path='/admin' element={<DashBoard />} />
        <Route path='/admin/story/:id'  element={<StoryContent />}/>
        <Route path='/admin/categories' element={<Categories />} />
        <Route path='/admin/stories' element={<AdminStories />} />
      </Route>
    </Routes>
  )
}

export default App
