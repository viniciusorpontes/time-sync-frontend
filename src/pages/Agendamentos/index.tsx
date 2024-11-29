import {Scheduler} from "@aldabil/react-scheduler";
import {Fragment, useEffect, useRef, useState} from "react";
import {AgendamentoService} from "./AgendamentoService";
import {ProcessedEvent, SchedulerRef} from "@aldabil/react-scheduler/types";
import {UsuarioAgendamento} from "../../types";
import Agendamento from "../../components/Agendamento";
import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";
import {EmpresaService} from "../Empresas/EmpresaService";
import {useParams} from "react-router-dom";

interface Empresa {
    name: string;
    code: string;
}

const Agendamentos: React.FC = () => {

    const {empresaId} = useParams();

    const agendamentoService = new AgendamentoService();
    const empresaService = new EmpresaService();

    const calendarRef = useRef<SchedulerRef>(null);

    const [agendamentos, setAgendamentos] = useState<ProcessedEvent[]>([]);
    const [clientes, setClientes] = useState<UsuarioAgendamento[]>([]);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [schedulerReady, setSchedulerReady] = useState(false);

    const buscarEmpresasPorUsuarioId = async () => {
        const _empresas = await empresaService
            .buscarEmpresasPorUsuarioId(0)
            .then((response) =>
                response.data.map((empresa: any) => ({
                    code: empresa.id,
                    name: empresa.nome,
                }))
            )
            .catch((error) => console.error(error));
        setEmpresas(_empresas);

        if (_empresas.length === 1) {
            const empresaSelecionada = _empresas[0];
            await buscarProdutivosPorEmpresaId(empresaSelecionada.code);
            await buscarAgendamentos(empresaSelecionada.code);
            setEmpresa(empresaSelecionada);
            setSchedulerReady(true); // Configuração inicial concluída
        }
    };

    useEffect(() => {
        if (empresaId !== "0") {
            setEmpresaCarregada(Number(empresaId));
        } else {
            buscarEmpresasPorUsuarioId();
        }
    }, []);

    useEffect(() => {
        if (empresa && calendarRef.current) {
            setSchedulerReady(true); // Marca o Scheduler como pronto
        }
    }, [empresa]);

    const setEmpresaCarregada = async (empresaId: number) => {
        await buscarProdutivosPorEmpresaId(Number(empresaId));
        await buscarAgendamentos(Number(empresaId));
        const empresaSelecionada = {code: empresaId.toString(), name: ""}
        setEmpresa(empresaSelecionada);
        setSchedulerReady(true);
    }

    const buscarProdutivosPorEmpresaId = async (id: number) => {
        await empresaService
            .buscarUsuariosPorEmpresa(id)
            .then((response) => {
                const clientes = response.data.map((usuario: any) => {
                    return {
                        admin_id: usuario.usuarioId,
                        title: usuario.nome,
                        mobile: usuario.telefone,
                        avatar: "https://picsum.photos/200/300",
                        color: "#007bff",
                    };
                });
                setClientes(clientes);
            })
            .catch((error) => console.error(error));
    };

    const empresaChange = async (e: DropdownChangeEvent) => {
        const _empresa = e.value;
        setSchedulerReady(false); // Interrompe a renderização durante a mudança
        await buscarProdutivosPorEmpresaId(_empresa.code);
        await buscarAgendamentos(_empresa.code);
        setEmpresa(_empresa);
        setSchedulerReady(true); // Marca como pronto novamente
    };

    const buscarAgendamentos = async (empresaId?: number) => {
        if (!empresaId) {
            empresaId = Number(empresa?.code);
        }
        await agendamentoService
            .buscarAgendamentosPorEmpresaId(empresaId)
            .then((response) => {
                const _agendamentos = response.data.map((agendamento: any) => {
                    return {
                        event_id: agendamento.id,
                        title: agendamento.servicos
                            .map((servico: any) => servico.nome)
                            .join(" / "),
                        start: new Date(agendamento.dataInicio),
                        end: new Date(agendamento.dataFim),
                        admin_id: agendamento.responsavelId,
                    };
                });
                setAgendamentos(_agendamentos);
            })
            .catch((error) => console.error(error));
    };

    const handleDelete = async (deletedId: string): Promise<string> => {
        agendamentoService.deletar(deletedId);
        return deletedId;
    };

    const handleEventDrop = async (
        event: any,
        droppedOn: any,
        updatedEvent: any,
        originalEvent: any
    ) => {
        await agendamentoService.alterarDataEUsuarioAgendamento(
            originalEvent.event_id,
            droppedOn,
            updatedEvent.admin_id
        );
        buscarAgendamentos();
    };

    return (
        <div style={{paddingTop: "14px"}}>
            {empresaId === "0" &&
                <div className="empresas-select">
                    <Dropdown
                        style={{padding: "10px"}}
                        value={empresa}
                        onChange={empresaChange}
                        options={empresas}
                        optionLabel="name"
                        placeholder="Selecione a empresa"
                    />
                </div>
            }
            {empresa && schedulerReady && ( // Só renderiza o Scheduler quando estiver pronto
                <div key={empresa.code} style={{padding: "0 10px"}}>
                    <Fragment>
                        {clientes.length > 0 && (
                            <Scheduler
                                ref={calendarRef}
                                resourceViewMode="tabs" // Visualização inicial configurada
                                customEditor={(scheduler) => (
                                    <Agendamento
                                        scheduler={scheduler}
                                        buscarAgendamento={buscarAgendamentos}
                                        empresaId={Number(empresa.code)}
                                    />
                                )}
                                events={agendamentos}
                                resources={clientes}
                                resourceFields={{
                                    idField: "admin_id",
                                    textField: "title",
                                    subTextField: "mobile",
                                    avatarField: "title",
                                    colorField: "color",
                                }}
                                week={{
                                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                                    weekStartOn: 0,
                                    startHour: 8,
                                    endHour: 18,
                                    step: 60,
                                }}
                                onDelete={handleDelete}
                                onEventDrop={handleEventDrop}
                            />
                        )}
                    </Fragment>
                </div>
            )}
        </div>
    );
};

export default Agendamentos;
