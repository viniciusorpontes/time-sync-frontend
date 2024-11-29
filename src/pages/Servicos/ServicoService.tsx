import { Servico } from './../../types'
import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class ServicoService {

    buscarServicosPorUsuarioId(usuarioId: number) {

        if (usuarioId === 0) {
            usuarioId = Number(localStorage.getItem('usuarioId'));
        }

        return httpGet(`/servicos/buscarServicosPorUsarioId?usuarioId=${usuarioId}`)
    }

    buscarServicosPorEmpresaIdEUsuarioId(empresaId:number, usuarioId: number) {
        return httpGet(`/servicos/buscarServicosPorEmpresaIdEUsuarioId?empresaId=${empresaId}&usuarioId=${usuarioId}`)
    }

    buscarServicosPorEmpresaId(empresaId: number) {

        return httpGet(`/servicos/buscarServicosPorEmpresaId?empresaId=${empresaId}`)
    }

    salvar(servico: Servico) {

        const request = {
            empresaId: servico.empresaId,
            nome: servico.nome,
            tempo: servico.tempo,
            valor: servico.valor,
            idsUsuarios: servico?.usuarios?.map(usuario => usuario.code)
        }

        return httpPost('/servicos', request)
    }

    alterar(servico: Servico) {

        const request = {
            empresaId: servico.empresaId,
            nome: servico.nome,
            tempo: servico.tempo,
            valor: servico.valor,
            idsUsuarios: servico?.usuarios?.map(usuario => usuario.code)
        }

        return httpPut(`/servicos/${servico.id}`, request)
    }

    deletar(servico: Servico) {
        return httpDelete(`/servicos/${servico.id}`)
    }

}