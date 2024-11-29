import React, { useState, useEffect } from 'react';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { Button } from 'primereact/button';
import './style.css';
import { useNavigate } from 'react-router-dom';
import {EmpresaService} from "../Empresas/EmpresaService";
import {Empresa} from "../../types";

const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const empresaService = new EmpresaService();
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
    buscarEmpresas();
  }, []);

  const buscarEmpresas = () => {
    empresaService.buscarEmpresas()
        .then(response => {
          const empresas = response.data;
          setEmpresas(empresas)
        })
        .catch(error => console.error(error))
  }

  const acessarAgendamentos = (empresaId: number | undefined) => {
    if (localStorage.getItem("usuarioId") && localStorage.getItem("usuarioId")) {
      navigate('/agendamentos/' + empresaId);
    } else {
      navigate('/login/agendamentos/' + empresaId);
    }
  }

  const empresaTemplate = (empresa: Empresa) => {
    return (
      <div className="empresa-card">
        <h4 className="nome-empresa mb-2">{empresa.nome}</h4>
        <h4 className="endereco-empresa">{empresa.endereco}</h4>
        <h4 className="telefone-empresa">{empresa.telefone}</h4>
        <Button
          label="Agendar agora"
          onClick={() => acessarAgendamentos(empresa.id)} // Redireciona para a tela de login
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
