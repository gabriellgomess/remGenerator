import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
const { Text, Title } = Typography;


const Header = ({ handleLogout, user }) => {
    return (
        <header className='color-bg-secondary' style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
            <nav style={{ display: 'flex', gap: '25px' }}>
                <Link to="/">
                    <Title level={3}>Home</Title>
                </Link>
                <Link to="/importacoes">
                    <Title level={3}>Importações</Title>
                </Link>
                <Link to="/dashboard">
                    <Title level={3}>Dashboard</Title>
                </Link>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img width={60} style={{ borderRadius: '50%' }} src={user.picture} alt="" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{user.name}</Text>
                    <Text>{user.email}</Text>
                </div>
                <Button className='color-text-light' type='text' onClick={() => handleLogout()}>Sair</Button>                
            </div>
        </header>
    );
}

export default Header;