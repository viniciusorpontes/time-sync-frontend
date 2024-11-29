
import './style.css';

import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { DashboardService } from './DashboardService';
import { EmpresaService } from '../Empresas/EmpresaService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Empresa {
    name: string;
    code: string;
}

interface Funcionario {
    name: string;
    code: string;
}

export default function Dashboard() {

    const dashboardService: DashboardService = new DashboardService();
    const empresaService = new EmpresaService();

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [chartDataPizza, setChartDataPizza] = useState({});
    const [chartOptionsPizza, setChartOptionsPizza] = useState({});

    const [chartDataLinha, setChartDataLinha] = useState({});
    const [chartOptionsLinha, setChartOptionsLinha] = useState({});

    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([])

    const [funcionarioEmpresa, setFuncionarioEmpresa] = useState<Funcionario | null>(null);
    const [funcionariosEmpresas, setFuncionariosEmpresas] = useState<Funcionario[]>([]);

    const empresaChange = async (e: DropdownChangeEvent) => {
        const _empresa = e.value;
        await buscarFuncionarioPorEmpresaId(_empresa.code);
        await buscarQuantidadeDeAgendamentosPorMes(_empresa.code);
        await buscarServicosMaisRealizados(_empresa.code);
        await buscarFaturamentoSemestreal(_empresa.code);
        setEmpresa(_empresa)
    }

    const funcionarioChange = async (e: DropdownChangeEvent) => {
        const _funcionario = e.value;
        await buscarQuantidadeDeAgendamentosPorMes(Number(empresa?.code), _funcionario.code);
        await buscarServicosMaisRealizados(Number(empresa?.code), _funcionario.code);
        await buscarFaturamentoSemestreal(Number(empresa?.code), _funcionario.code);
        setFuncionarioEmpresa(_funcionario)
    }

    const buscarEmpresasPorUsuarioId = async () => {
        const _empresas = await empresaService.buscarEmpresasPorUsuarioId(0)
            .then(response => {
                return response.data.map((empresa: any) => ({
                    code: empresa.id,
                    name: empresa.nome,
                }));
            })
            .catch(error => console.error(error));
        setEmpresas(_empresas)

        if (_empresas.length == 1) {
            const empresaSelecionada = _empresas[0];
            await buscarFuncionarioPorEmpresaId(empresaSelecionada.code)
            await buscarQuantidadeDeAgendamentosPorMes(empresaSelecionada.code);
            await buscarServicosMaisRealizados(empresaSelecionada.code);
            await buscarFaturamentoSemestreal(empresaSelecionada.code)
            setEmpresa(empresaSelecionada);
        }
    };

    useEffect(() => {

        buscarEmpresasPorUsuarioId();

        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
        setChartOptions(options);

        const optionsPizza = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };
        setChartOptionsPizza(optionsPizza);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const optionsLinha = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
        setChartOptionsLinha(optionsLinha);

    }, []);

    const buscarFuncionarioPorEmpresaId = async (empresaId: number) => {
        const _usuariosEmpresa = await empresaService.buscarUsuariosPorEmpresa(empresaId)
            .then(response => {
                return response.data.map((usuario: any) => ({
                    code: usuario.usuarioId,
                    name: usuario.nome,
                }));
            })
            .catch(error => console.error(error));
        setFuncionariosEmpresas(_usuariosEmpresa);
    }

    const buscarQuantidadeDeAgendamentosPorMes = async (empresaId: number, funcionarioId: number = 0) => {
        await dashboardService.buscarQuantidadeDeAgendamentosPorMes(empresaId, funcionarioId)
            .then(response => {
                const data = {
                    labels: ["Agosto", "Setembro", "Outubro", "Novembro"],
                    datasets: [
                        {
                            label: 'Número de agendamentos',
                            data: Object.values(response.data),
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 159, 64)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)'
                            ],
                            borderWidth: 1
                        }
                    ]
                };
                setChartData(data);
            })
            .catch(error => console.error(error));
    };

    const buscarServicosMaisRealizados = async (empresaId: number, funcionarioId: number = 0) => {
        await dashboardService.buscarServicosMaisRealizados(empresaId, funcionarioId)
            .then(response => {
                const documentStyle = getComputedStyle(document.documentElement);
                const dataPizza = {
                    labels: Object.keys(response.data),
                    datasets: [
                        {
                            data: Object.values(response.data),
                            backgroundColor: [
                                documentStyle.getPropertyValue('--blue-500'),
                                documentStyle.getPropertyValue('--yellow-500'),
                                documentStyle.getPropertyValue('--green-500'),
                                documentStyle.getPropertyValue('--red-500')  // Nova cor adicionada aqui
                            ],
                            hoverBackgroundColor: [
                                documentStyle.getPropertyValue('--blue-400'),
                                documentStyle.getPropertyValue('--yellow-400'),
                                documentStyle.getPropertyValue('--green-400'),
                                documentStyle.getPropertyValue('--red-400')  // Nova cor de hover
                            ]
                        }
                    ]
                }
                setChartDataPizza(dataPizza);
            })
            .catch(error => console.error(error));
    };

    const buscarFaturamentoSemestreal = async (empresaId: number, funcionarioId: number = 0) => {
        await dashboardService.buscarFaturamentoSemestreal(empresaId, funcionarioId)
            .then(response => {
                const documentStyle = getComputedStyle(document.documentElement);
                const dataLinha = {
                    labels: Object.keys(response.data),
                    datasets: [
                        {
                            label: 'Faturamento Semestral',
                            data: Object.values(response.data),
                            fill: false,
                            borderColor: documentStyle.getPropertyValue('--blue-500'),
                            tension: 0.4
                        }
                    ]
                };
                setChartDataLinha(dataLinha);
            })
            .catch(error => console.error(error));
    };

    return (
        <div style={{paddingTop: "14px"}}>
            <div className='empresas-select'>
                <Dropdown value={empresa} onChange={empresaChange} options={empresas} optionLabel="name"
                    placeholder="Selecione a empresa" />
                <Dropdown style={{ marginLeft: "10px" }} value={funcionarioEmpresa} onChange={funcionarioChange} options={funcionariosEmpresas} optionLabel="name" placeholder="Selecione o funcionario" />
            </div>
            <div className='graficos'>
                <div className='grafico'>
                    <Card title="Numero de Agendamentos nos últimos 4 meses">
                        <Chart type="bar" width="1400px" height="300px" data={chartData} options={chartOptions} />
                    </Card>
                </div>
                <div className="grafico">
                    <Card title="Serviços mais Realizados">
                        <Chart type="pie" width="300px" height="300px" data={chartDataPizza} options={chartOptionsPizza} />
                    </Card>
                </div>
                <div className="grafico">
                    <Card title="Faturamento Semestral">
                        <Chart type="line" width="1775px" height="300px" data={chartDataLinha} options={chartOptionsLinha} />
                    </Card>
                </div>
            </div>
        </div>

    )
}
