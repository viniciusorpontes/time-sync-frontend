export type Usuario = {
    id?: string;
    cpf?: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: string;
}

export type UsuarioMultiSelect = {
    name: string;
    code: number;
}

export type Servico = {
    id?: number;
    nome?: string;
    tempo: string;
    valor: string;
    usuarios?: UsuarioMultiSelect[];
    empresaId: number;
};

export type Agendamento = {
    event_id?: number;
    title?: string;
    start?: Date;
    end?: Date;          
}

export type SalvarOuAlterarAgendamentoDTO = {
    empresaId: number,
    dataChegada?: string,
    idsServicos?: (number | undefined)[],
    clienteId?: number,
    consumidorId?: number
}

export type UsuarioAgendamento = {
    admin_id: number,
    title?: string,
    mobile?: string,
    avatar?: string,
    color?: string
}

export type EmpresaUsuario = {
    id?: number;
    nome?: string;
    email?: string;
    confirmado?: boolean;
    gestor?: boolean;
}

export type Empresa = {
    id?: number,
    nome?: string;
}

export type ConvidarUsuarioDTO = {
    empresaId: number | undefined,
    email: string,
    gestor: boolean,
}

export type AlterarUsuarioEmpresaDTO = {
    empresaId: number,
    email: string,
    gestor: boolean
}

export type RemoverProdutivoDTO = {
    empresaId: number,
    email: string
}