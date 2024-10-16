import { SalvarOuAlterarAgendamentoDTO } from './../../types'
import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class AgendamentoService {

    buscarAgendamentoPorId(agendamentoId: number) {
        return httpGet(`/agendamentos/${agendamentoId}`);
    }

    buscarAgendamentosPorUsuariosIds(usuariosIds: number[]) {
        return httpGet(`/agendamentos/buscarAgendamentosPorUsuariosIds?usuariosIds=${usuariosIds}`);
    }

    salvar(salvarOuAlterarAgendamentoDTO: SalvarOuAlterarAgendamentoDTO) {
        return httpPost('/agendamentos', salvarOuAlterarAgendamentoDTO);
    }

    alterar(id: number | string, salvarOuAlterarAgendamentoDTO: SalvarOuAlterarAgendamentoDTO) {
        return httpPut(`/agendamentos/${id}`, salvarOuAlterarAgendamentoDTO)
    }

    alterarDataAgendamento(id: number | string, dataInicio: Date) {
        dataInicio.setHours(dataInicio.getHours() - 3);
        const alterarAgendamentoDTO = { dataChegada: dataInicio.toISOString()}
        return httpPut(`/agendamentos/alterarDataAgendamento/${id}`, alterarAgendamentoDTO)
    }

    deletar(id: number | string) {
        return httpDelete(`/agendamentos/${id}`);
    }

}