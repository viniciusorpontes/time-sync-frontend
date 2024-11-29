import { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import { Button, DialogActions, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { AgendamentoService } from "../../pages/Agendamentos/AgendamentoService";
import { Servico } from "../../types";
import { ServicoService } from "../../pages/Servicos/ServicoService";
import { UsuarioService } from "../../pages/Usuarios/UsuarioService";

const Agendamento = (props: { scheduler: SchedulerHelpers; buscarAgendamento: () => void; empresaId: number}) => {

    const { scheduler, buscarAgendamento, empresaId } = props;

    const agendamentoService = new AgendamentoService();
    const servicoService = new ServicoService();
    const usuarioService = new UsuarioService;

    const [servicos, setServicos] = useState<Servico[]>();

    const buscarServicosPorEmpresaIdEUsuarioId = (empresaId: number, usuarioId: any) => {
        servicoService.buscarServicosPorEmpresaIdEUsuarioId(empresaId, usuarioId)
            .then(response => {
                const _servicos = response.data;
                setServicos(_servicos)
            })
            .catch(error => console.error(error))
    }

    const buscarResponsavel = (usuarioId: any) => {
        usuarioService.buscarUsuarioPorId(usuarioId)
            .then(response => {
                const usuario = response.data;
                handleChange(usuario.nome, "responsavelNome")
            })
            .catch(error => console.error(error))
    }

    const buscarAgendamentoPorId = (agendamentoId: any) => {
        agendamentoService.buscarAgendamentoPorId(agendamentoId)
            .then(response => {
                const agendamento = response.data;
                const _form = {
                    dataChegada: form.dataChegada,
                    servicos: agendamento.servicos.map((servico: Servico) => servico.nome),
                    responsavelId: agendamento.responsavelId,
                    responsavelNome: agendamento.responsavelNome,
                    idConsumidor: agendamento.consumidorId
                }
                setForm(_form);
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        const usuarioId = scheduler.admin_id;
        buscarServicosPorEmpresaIdEUsuarioId(empresaId, usuarioId);
        buscarResponsavel(usuarioId);
        if (scheduler.edited) {
            buscarAgendamentoPorId(scheduler.edited.event_id)
        }
    }, []);

    const getHorario = () => {
        const data = scheduler.state.start.value;

        const dataObj = new Date(data);

        // Ajusta a data para o fuso horário GMT-3 (Brasília)
        dataObj.setHours(dataObj.getHours() - dataObj.getTimezoneOffset() / 60);

        // Converte para o formato ISO e remove a parte de milissegundos e 'Z' (UTC)
        const dataFormatada = dataObj.toISOString().slice(0, 19);

        return dataFormatada;
    }


    const agendamento = scheduler.edited;

    const [form, setForm] = useState({
        dataChegada: agendamento?.dataChegada || getHorario(),
        servicos: agendamento?.servicos || [],
        responsavelId: scheduler.admin_id,
        responsavelNome: '',
        idConsumidor: 0
    });

    const handleChange = (value: any, name: string) => {
        setForm((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSubmit = async () => {
        try {

            scheduler.loading(true);

            const consumidorId = localStorage.getItem('usuarioId');

            const servicosFiltrados = servicos?.filter(servico => form.servicos.includes(servico.nome)).map(servico => servico.id);

            const salvarOuAlterarAgendamentoDTO = {
                empresaId: empresaId,
                dataChegada: form.dataChegada,
                idsServicos: servicosFiltrados,
                clienteId: Number(form.responsavelId),
                consumidorId: Number(consumidorId)
            }

            let response;

            if (scheduler.edited) {
                response = await agendamentoService.alterar(scheduler.edited.event_id, salvarOuAlterarAgendamentoDTO);
            } else {
                response = await agendamentoService.salvar(salvarOuAlterarAgendamentoDTO);
            }

            const agendamentoDTO = response.data;

            const agendamentoSalvoOuAlterado = {
                event_id: agendamentoDTO.id,
                title: agendamentoDTO.titulo,
                start: new Date(agendamentoDTO.dataInicio),
                end: new Date(agendamentoDTO.dataFim),
                description: agendamentoDTO.descricao
            }

            scheduler.onConfirm(agendamentoSalvoOuAlterado, agendamento ? "edit" : "create");
            scheduler.close();
            buscarAgendamento();
        } finally {
            scheduler.loading(false);
        }
    };

    return (
        <div>
            <div style={{ padding: "1rem", width: "30rem" }}>
                <h2>Dados do Agendamento</h2>

                <InputLabel>Produtivo</InputLabel>
                <TextField
                    value={form.responsavelNome}
                    fullWidth
                    disabled
                />

                <InputLabel>Data Chegada</InputLabel>
                <TextField
                    type="datetime-local"
                    value={form.dataChegada}
                    onChange={(e) => handleChange(e.target.value, "dataChegada")}
                    fullWidth
                />

                <InputLabel>Serviços</InputLabel>
                <Select
                    multiple
                    value={form.servicos}
                    onChange={(e) => handleChange(e.target.value, "servicos")}
                    renderValue={(selected) => selected.join(', ')}
                    fullWidth
                >
                    {servicos?.map((servico) => (
                        <MenuItem key={servico.nome} value={servico.nome}>
                            {servico.nome}
                        </MenuItem>
                    ))}
                </Select>

            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancelar</Button>
                <Button onClick={handleSubmit}>Confirmar</Button>
            </DialogActions>
        </div>
    );
};

export default Agendamento;
