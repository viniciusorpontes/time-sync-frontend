import React, { useState, useEffect } from 'react';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Button } from 'primereact/button';
import './style.css';
import { useNavigate } from 'react-router-dom';

interface Empresa {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
}

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  useEffect(() => {
    // Dados mocados das empresas com nome, endereço e telefone
    const empresasMock: Empresa[] = [
      { id: '1', nome: 'Empresa A', endereco: 'Rua A, 123', telefone: '(11) 1111-1111' },
      { id: '2', nome: 'Empresa B', endereco: 'Rua B, 456', telefone: '(22) 2222-2222' },
      { id: '3', nome: 'Empresa C', endereco: 'Rua C, 789', telefone: '(33) 3333-3333' },
      { id: '4', nome: 'Empresa D', endereco: 'Rua D, 101', telefone: '(44) 4444-4444' },
      { id: '5', nome: 'Empresa E', endereco: 'Rua E, 202', telefone: '(55) 5555-5555' },
      { id: '6', nome: 'Empresa F', endereco: 'Rua F, 303', telefone: '(66) 6666-6666' },
      { id: '7', nome: 'Empresa G', endereco: 'Rua G, 404', telefone: '(77) 7777-7777' },
      { id: '8', nome: 'Empresa H', endereco: 'Rua H, 505', telefone: '(88) 8888-8888' },
      { id: '9', nome: 'Empresa I', endereco: 'Rua I, 606', telefone: '(99) 9999-9999' }
    ];
    setEmpresas(empresasMock);
  }, []);

  const empresaTemplate = (empresa: Empresa) => {
    return (
      <div className="empresa-card">
        <h4 className="nome-empresa mb-2">{empresa.nome}</h4>
        <h4 className="endereco-empresa">Endereço: {empresa.endereco}</h4>
        <h4 className="telefone-empresa">Telefone: {empresa.telefone}</h4>
        <Button
          label="Agendar agora"
          onClick={() => navigate('/login')} // Redireciona para a tela de login
          className="botao-agendar mt-3"
        />
      </div>
    );
  };


  return (
    <div className='container'>
      <main>
        <section className='box-titulo'>
          <h1>Empresas Parceiras</h1>
          <p>A plataforma mais completa para você gerir seu tempo!</p>
          <Carousel
            value={empresas}
            numVisible={3}
            numScroll={3}
            responsiveOptions={responsiveOptions}
            className="custom-carousel"
            circular
            autoplayInterval={3000}
            itemTemplate={empresaTemplate}
          />
        </section>
        <section className='box-requisitos'>
          <h2>Não perca mais tempo!</h2>
          <p>Faça uma cotação com período de teste!</p>
          <header className='banner'>
            <h1>As melhores soluções para o gerenciamento de seus agendamentos e negócios!</h1>
            <button className='cta-button'>Experimente Agora</button>
          </header>
          <div className='box-cards'>
            <div className='card'>
              <h3>Otimização de Tempo!</h3>
              <p>Controle total da sua agenda de serviços para melhor gestão dos negócios</p>
            </div>
            <div className='card'>
              <h3>Fluxo de Caixa!</h3>
              <p>Controle total do seu caixa para organizar seu financeiro</p>
            </div>
            <div className='card'>
              <h3>Relatórios Personalizados!</h3>
              <p>Tenha uma melhor visibilidade dos seus resultados</p>
            </div>
          </div>
        </section>
        <section className='testemunhos'>
          <h2>O que nossos clientes dizem</h2>
          <div className='depoimento'>
            <p>“O TimeSync ajudou a minha empresa a dobrar a eficiência na gestão de tempo.”</p>
            <p>- Nome, Cargo, Empresa</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;
