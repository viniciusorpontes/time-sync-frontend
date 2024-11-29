import {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {useNavigate, useParams} from 'react-router-dom'; // Importa o hook de navegação
import './style.css';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate(); // Inicializa o hook de navegação
    const {urlDirecionada, id} = useParams();

    const logar = async () => {
        const request = {email, senha};
        axiosInstance.post('/login', request).then(response => {
            const responseBody = response.data;

            localStorage.setItem('token', responseBody.token);
            localStorage.setItem('usuarioId', responseBody.usuario.id);

            if (id === "0") {
                navigate('/' + urlDirecionada);
            } else {
                navigate('/' + urlDirecionada + "/" + id);
            }
        }).catch(erro => {
            console.error("Erro ao fazer login:", erro);
            alert("Falha ao fazer login. Verifique suas credenciais.");
        })
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

                <Button label="Entrar" onClick={logar} className="login-btn"/>
            </div>
        </div>
    );
};

export default Login;
