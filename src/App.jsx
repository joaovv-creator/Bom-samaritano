import { supabase } from './lib/SupabaseClient'
console.log('APP CARREGOU')
console.log(supabase)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { CartProvider } from './contexts/CartContext';
import Header from './pages/Header';
import Footer from './components/common/Footer';
import FeedGlobal from './pages/FeedGlobal';
import Login from './pages/Login';
import Comunidade from './pages/Comunidade';
import KidsArea from './pages/KidsArea'
import Marketplace from './pages/Marketplace';
import Cursos from './pages/Cursos';
import DevocionalAI from './pages/DevocionalAI';
import Perfil from './pages/Perfil';
import Checkout from './pages/Checkout';
import CadastroCurso from './pages/CadastroCurso';
import TesteConexao from './components/TesteConexao';

function App() {
 
  return (
    <Router>
      <SupabaseProvider>
        <AuthProvider>
          <CartProvider>
            <Header />
            
            <Routes>
              <Route path="/" element={<FeedGlobal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/comunidade" element={<Comunidade />} />
              <Route path="/kids" element={<KidsArea />} />
              <Route path="/loja" element={<Marketplace />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/devocional" element={<DevocionalAI />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cadastro-curso" element={<CadastroCurso />} />
            </Routes>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </SupabaseProvider>
    </Router>
  );
}

export default App;