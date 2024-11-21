import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class DashboardService {

    buscarQuantidadeDeAgendamentosPorMes(empresaId: number, funcionarioId: number) {
        return httpGet(`/dashboard/buscarQuantidadeDeAgendamentosPorMes?empresaId=${empresaId}&funcionarioId=${funcionarioId}`);
    }

    buscarServicosMaisRealizados(empresaId: number, funcionarioId: number) {
        return httpGet(`/dashboard/buscarServicosMaisRealizados?empresaId=${empresaId}&funcionarioId=${funcionarioId}`);
    }

    buscarFaturamentoSemestreal(empresaId: number, funcionarioId: number) {
        return httpGet(`/dashboard/buscarFaturamentoSemestral?empresaId=${empresaId}&funcionarioId=${funcionarioId}`);
    }

}