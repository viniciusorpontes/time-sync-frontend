import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação
import './style.css';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate(); // Inicializa o hook de navegação

    const logar = async () => {
        try {
            const request = { email, senha };
            const response = await axiosInstance.post('/login', request);
            const responseBody = response.data;

            localStorage.setItem('token', responseBody.token);
            localStorage.setItem('usuarioId', responseBody.usuario.id);

            navigate('/inicio'); // Redireciona para a tela de início após o login
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Falha ao fazer login. Verifique suas credenciais.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">

                <div className="input-group">
                    <label htmlFor="email">E-Mail</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Endereço de E-Mail"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="senha">Senha</label>
                    <Password
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        toggleMask
                        placeholder="Senha"
                        size={40}
                        feedback={false}
                    />
                </div>

                <div className="options">
                    <a href="#" className="forgot-password">Esqueceu a senha?</a>
                </div>

                <Button label="Entrar" onClick={logar} className="login-btn" />
            </div>
        </div>
    );
};

export default Login;
