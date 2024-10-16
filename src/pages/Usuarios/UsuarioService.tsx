import { Servico } from '../../types'
import { httpGet } from '../../api/apiClient';

export class UsuarioService {

    buscarClientes() {

        return httpGet(`/usuarios/buscarClientes`)
    }

    buscarUsuarioPorId(usuarioId: number) {

        return httpGet(`/usuarios/${usuarioId}`)
    }

}