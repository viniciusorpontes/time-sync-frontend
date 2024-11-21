import { Scheduler } from "@aldabil/react-scheduler";
import { Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { AgendamentoService } from "./AgendamentoService";
import { ProcessedEvent, SchedulerRef } from "@aldabil/react-scheduler/types";
import { UsuarioAgendamento } from "../../types";
import Agendamento from "../../components/Agendamento";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { EmpresaService } from "../Empresas/EmpresaService";

interface Empresa {
    name: string;
    code: string;
}

const Agendamentos: React.FC = () => {

    const agendamentoService = new AgendamentoService();
    const empresaService = new EmpresaService();

    const calendarRef = useRef<SchedulerRef>(null);

    const [agendamentos, setAgendamentos] = useState<ProcessedEvent[]>([]);

    const [clientes, setClientes] = useState<UsuarioAgendamento[]>([]);

    const [empresa, setEmpresa] = useState<Empresa | null>(null);

    const [empresas, setEmpresas] = useState<Empresa[]>([])

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
            await buscarProdutivosPorEmpresaId(empresaSelecionada.code)
            await buscarAgendamentos(empresaSelecionada.code)
            setEmpresa(empresaSelecionada);
        }
    };

    useEffect(() => {
        buscarEmpresasPorUsuarioId();
    }, []);

    const buscarProdutivosPorEmpresaId = async (id: number) => {
        await empresaService.buscarUsuariosPorEmpresa(id)
            .then(response => {
                const clientes = response.data.map((usuario: any) => {
                    return {
                        admin_id: usuario.usuarioId,
                        title: usuario.nome,
                        mobile: usuario.telefone,
                        avatar: "https://picsum.photos/200/300",
                        color: "#ab2d2d"
                    }
                })
                setClientes(clientes);
            })
            .catch(error => console.error(error))
    }

    const empresaChange = async (e: DropdownChangeEvent) => {
        const _empresa = e.value;
        await buscarProdutivosPorEmpresaId(_empresa.code);
        await buscarAgendamentos(_empresa.code);
        setEmpresa(_empresa)
    }

    const buscarAgendamentos = async (empresaId?: number) => {
        if (!empresaId) {
            empresaId = Number(empresa?.code);
        }
        await agendamentoService.buscarAgendamentosPorEmpresaId(empresaId)
            .then(response => {
                const _agendamentos = response.data.map((agendamento: any) => {
                    return {
                        event_id: agendamento.id,
                        title: agendamento.servicos.map((servico: any) => servico.nome).join(' / '),
                        start: new Date(agendamento.dataInicio),
                        end: new Date(agendamento.dataFim),
                        admin_id: agendamento.responsavelId
                    };
                });
                setAgendamentos(_agendamentos);
            })
            .catch(error => console.error(error));
    };

    const handleDelete = async (deletedId: string): Promise<string> => {
        agendamentoService.deletar(deletedId);
        return deletedId;
    };

    const handleEventDrop = async (event: any, droppedOn: any, updatedEvent: any, originalEvent: any) => {
        await agendamentoService.alterarDataEUsuarioAgendamento(originalEvent.event_id, droppedOn, updatedEvent.admin_id);
        buscarAgendamentos()
    }

    return (
        <div>
            <div className='empresas-select'>
                <Dropdown style={{ padding: "10px" }} value={empresa} onChange={empresaChange} options={empresas} optionLabel="name"
                    placeholder="Selecione a empresa" />
            </div>
            {
                empresa &&
                <div key={empresa.code} style={{ padding: "0 10px" }} >
                    <Fragment >
                        {clientes.length > 0 && (
                            <Scheduler
                                customEditor={(scheduler) => <Agendamento scheduler={scheduler} buscarAgendamento={buscarAgendamentos} empresaId={Number(empresa.code)}/>}
                                ref={calendarRef}
                                events={agendamentos}
                                resources={clientes}
                                resourceFields={{
                                    idField: "admin_id",
                                    textField: "title",
                                    subTextField: "mobile",
                                    avatarField: "title",
                                    colorField: "color"
                                }}
                                week={
                                    {
                                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                                        weekStartOn: 0,
                                        startHour: 8,
                                        endHour: 18,
                                        step: 60,
                                    }
                                }
                                onDelete={handleDelete}
                                onEventDrop={handleEventDrop}
                            />
                        )}

                    </Fragment>
                </div>
            }

        </div>
    );
};

export default Agendamentos;
