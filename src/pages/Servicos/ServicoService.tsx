import { Servico } from './../../types'
import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class ServicoService {

    buscarServicosPorUsuarioId(usuarioId: number) {

        if (usuarioId === 0) {
            usuarioId = Number(localStorage.getItem('usuarioId'));
        }

        return httpGet(`/servicos/buscarServicosPorUsarioId?usuarioId=${usuarioId}`)
    }

    salvar(servico: Servico) {

        const request = {
            nome: servico.nome,
            tempo: servico.tempo,
            valor: servico.valor,
            idsUsuarios: servico?.usuarios?.map(usuario => usuario.code)
        }

        return httpPost('/servicos', request)
    }

    alterar(servico: Servico) {

        const request = {
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