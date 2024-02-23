import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Routes, Route, useNavigate } from 'react-router-dom';



// Ant Design
import { ConfigProvider, Card, Space } from 'antd';
const { Meta } = Card;
import pt_BR from "antd/locale/pt_BR";

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Importacoes from './pages/Importacoes';

// Imgem
import logo from './assets/img/logo_login.jpg';

function App() {
  // Definindo tokens de design personalizados
  const theme = {
    components: {
      Button: {
        colorPrimary: '#ff735c',
        colorPrimaryHover: '#de6350',
        colorPrimaryActive: '#ff6048',
        colorPrimaryFocus: '#935302',

      },
      Typography: {
        colorTextHeading: '#1a2e35',
        colorText: '#1a2e35',
      }
    },
  };

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Função para verificar se há um usuário armazenado no sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    // set in sessionStorage
    console.log(decoded);
    sessionStorage.setItem('user', JSON.stringify(decoded));
  };

  const handleLogout = () => {
    setUser(null); // Limpa os dados do usuário ao fazer logout
    // remove from sessionStorage
    sessionStorage.removeItem('user');
    // Navigate to home page after logout
    navigate('/');
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };


  return (
    <ConfigProvider theme={theme} locale={pt_BR}>
      <div className={user ? 'color-bg-light' : 'color-bg-gradient'} style={{ width: '100vw', minHeight: '100vh' }}>
        {!user ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Card
              hoverable
              bordered={false}
              style={{ width: '300px', marginTop: '80px' }}
              cover={
                <img
                  alt="sistema de geração de arquivos de remessa bancária"
                  src={logo}
                />
              }
            >
              <Meta
                title="Gerador de Arquivos de Remessa"
                description="Sistema para geração e controle de arquivos de remessa bancária."
                style={{ margin: '10px 0' }}
              />
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
              />
            </Card>
          </div>
        ) : (
          <div>
            <Header handleLogout={handleLogout} user={user} />
            <div style={{width: '80%', margin: '20px auto'}}>
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/importacoes" element={<Importacoes />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
