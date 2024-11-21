import { SalvarOuAlterarAgendamentoDTO } from './../../types'
import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class AgendamentoService {

    buscarAgendamentoPorId(agendamentoId: number) {
        return httpGet(`/agendamentos/${agendamentoId}`);
    }

    buscarAgendamentosPorEmpresaId(empresaId: number) {
        return httpGet(`/agendamentos/buscarAgendamentosPorEmpresaId?empresaId=${empresaId}`);
    }

    salvar(salvarOuAlterarAgendamentoDTO: SalvarOuAlterarAgendamentoDTO) {
        return httpPost('/agendamentos', salvarOuAlterarAgendamentoDTO);
    }

    alterar(id: number | string, salvarOuAlterarAgendamentoDTO: SalvarOuAlterarAgendamentoDTO) {
        return httpPut(`/agendamentos/${id}`, salvarOuAlterarAgendamentoDTO)
    }

    alterarDataEUsuarioAgendamento(id: number | string, dataInicio: Date, usuarioId: number) {
        dataInicio.setHours(dataInicio.getHours() - 3);
        const alterarAgendamentoDTO = { 
            usuarioId: usuarioId,
            dataChegada: dataInicio.toISOString()
        }
        return httpPut(`/agendamentos/alterarDataAgendamento/${id}`, alterarAgendamentoDTO)
    }

    deletar(id: number | string) {
        return httpDelete(`/agendamentos/${id}`);
    }

}