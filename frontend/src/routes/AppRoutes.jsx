import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Busca from '../pages/Busca'
import Cadastro from '../pages/Cadastro'
import Post from '../pages/Post'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes