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
};

export type Agendamento = {
    event_id?: number;
    title?: string;
    start?: Date;
    end?: Date;          
}

export type SalvarOuAlterarAgendamentoDTO = {
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