import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './style.css';

function CadastroClientes() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('');
    const navigate = useNavigate();

    const tipos = [
        { label: 'Proprietário', value: 'proprietario' },
        { label: 'Cliente', value: 'cliente' }
    ];

    const cadastrar = async () => {
        try {
            const request = { nome, email, telefone, senha, tipo };
            navigate('/inicio'); // Redireciona para a tela de início após o cadastro
        } catch (error) {
            console.error("Erro ao fazer cadastro:", error);
            alert("Falha ao fazer cadastro. Verifique os dados.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Cadastro de Cliente</h2>

                <div className="input-group">
                    <label htmlFor="nome">Nome</label>
                    <InputText
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome Completo" />
                </div>

                <div className="input-group">
                    <label htmlFor="email">E-Mail</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Endereço de E-Mail" />
                </div>

                <div className="input-group">
                    <label htmlFor="telefone">Telefone</label>
                    <InputText
                        id="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Telefone" />
                </div>

                <div className="input-group">
                    <label htmlFor="senha">Senha</label>
                    <Password
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        toggleMask
                        placeholder="Senha"
                        feedback={false} />
                </div>

                <div className="input-group">
                    <label htmlFor="tipo">Tipo</label>
                    <Dropdown
                        id="tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.value)}
                        options={tipos}
                        placeholder="Selecione o Tipo" />
                </div>

                <Button label="Cadastrar" onClick={cadastrar} className="login-btn" />
            </div>
        </div>
    );
}

export default CadastroClientes;
