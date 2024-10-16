import { Scheduler } from "@aldabil/react-scheduler";
import { Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { AgendamentoService } from "./AgendamentoService";
import { ProcessedEvent, SchedulerRef } from "@aldabil/react-scheduler/types";
import { UsuarioService } from "../Usuarios/UsuarioService";
import { UsuarioAgendamento } from "../../types";
import Agendamento from "../../components/Agendamento";

const Agendamentos: React.FC = () => {

    const [mode, setMode] = useState<"default" | "tabs">("tabs");
    const calendarRef = useRef<SchedulerRef>(null);

    const [agendamentos, setAgendamentos] = useState<ProcessedEvent[]>([]);

    const agendamentoService = new AgendamentoService();
    const usuarioService = new UsuarioService();

    const [clientes, setClientes] = useState<UsuarioAgendamento[]>([]);

    useEffect(() => {
        buscarClientes();
    }, []);

    useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.scheduler?.handleState("tabs", "resourceViewMode");
        }
        if (clientes.length > 0) {
            buscarAgendamentos();
        }
    }, [clientes]);

    const buscarClientes = async () => {
        usuarioService.buscarClientes()
            .then(response => {
                const clientes = response.data.map((usuario: any) => {
                    return {
                        admin_id: usuario.id,
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

    const buscarAgendamentos = () => {
        const clientesIds = clientes.map(cliente => cliente.admin_id);
        agendamentoService.buscarAgendamentosPorUsuariosIds(clientesIds)
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

        await agendamentoService.alterarDataAgendamento(originalEvent.event_id, droppedOn);

        buscarAgendamentos()

    }

    return (
        <div>
            <Fragment>
                {clientes.length > 0 && (
                    <Scheduler
                        customEditor={(scheduler) => <Agendamento scheduler={scheduler} buscarAgendamento={buscarAgendamentos} />}
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
    );
};

export default Agendamentos;
