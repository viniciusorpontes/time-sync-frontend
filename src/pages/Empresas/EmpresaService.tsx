import { AlterarUsuarioEmpresaDTO, ConvidarUsuarioDTO, Empresa, RemoverProdutivoDTO } from './../../types'
import { httpGet, httpPost, httpPut, httpDelete } from '../../api/apiClient';

export class EmpresaService {

    buscarEmpresasPorUsuarioId(usuarioId: number) {

        if (usuarioId == 0) {
            usuarioId = Number(localStorage.getItem('usuarioId'));
        }

        return httpGet(`/empresas/buscarEmpresasPorUsuarioId?usuarioId=${usuarioId}`)
    }

    buscarUsuariosPorEmpresa(empresaId: number) {
        return httpGet(`/empresas/buscarUsuariosPorEmpresa?empresaId=${empresaId}`)
    }

    salvar(empresa: Empresa) {

        const request = {
            nome: empresa.nome,
            usuarioResponsavelId: Number(localStorage.getItem('usuarioId'))
        }

        return httpPost('/empresas', request)
    }

    alterar(empresa: Empresa) {

        const request = {
            nome: empresa.nome
        }

        return httpPut(`/empresas/${empresa.id}`, request)
    }

    deletar(empresa: Empresa) {
        return httpDelete(`/empresas/${empresa.id}`)
    }

    convidarProdutivo(convidarUsuarioDTO: ConvidarUsuarioDTO) {
        return httpPost('/empresas/convidarProdutivo', convidarUsuarioDTO)
    }

    alterarProdutivo(alterarUsuarioEmpresaDTO: AlterarUsuarioEmpresaDTO) {
        return httpPut('/empresas/alterarProdutivo', alterarUsuarioEmpresaDTO)
    }

    removerProdutivo(empresaId: number | undefined, email: string | undefined) {
        return httpDelete(`/empresas/removerProdutivo/${empresaId}/${email}`);
    }

}