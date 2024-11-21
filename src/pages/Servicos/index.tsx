import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import type { Servico } from './../../types';
import { ServicoService } from './ServicoService'
import { UsuarioService } from './../Usuarios/UsuarioService'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { EmpresaService } from '../Empresas/EmpresaService';
import './style.css';

interface Empresa {
    name: string;
    code: string;
}

const ServicoPage = () => {

    let servicoVazio: Servico = {
        id: 0,
        nome: '',
        tempo: '',
        valor: '',
        usuarios: [],
        empresaId: 0
    };

    const [servicos, setServicos] = useState(null);
    const [servicoDialog, setServicoDialog] = useState(false);
    const [deleteServicoDialog, setDeleteServicoDialog] = useState(false);
    const [deleteServicosDialog, setDeleteServicosDialog] = useState(false);
    const [servico, setServico] = useState<Servico>(servicoVazio);
    const [selectedServicos, setSelectedServicos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [usuarios, setUsuarios] = useState([]);

    const servicoService = new ServicoService();
    const empresaService = new EmpresaService();

    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([])

    const onUsuariosChange = (e: MultiSelectChangeEvent) => {
        let _servico = { ...servico };
        _servico.usuarios = e.value;
        setServico(_servico);
    };

    const buscarEmpresasPorUsuarioId = async () => {
        const _empresas = await empresaService.buscarEmpresasPorUsuarioId(0)
            .then(response => {
                return response.data.map((empresa: any) => ({
                    code: empresa.id,
                    name: empresa.nome,
                }));
            })
            .catch(error => console.error(error));
        setEmpresas(_empresas)

        if (_empresas.length == 1) {
            const empresaSelecionada = _empresas[0];
            setEmpresa(empresaSelecionada);
            buscarServicosPorEmpresaId(empresaSelecionada.code)
            buscarProdutivoPorEmpresaId(empresaSelecionada.code)
        }
    };


    const buscarServicosPorEmpresaId = (empresaId: number) => {
        servicoService.buscarServicosPorEmpresaId(empresaId)
            .then(response => {
                const servicos = response.data;
                servicos.forEach((servico: any) => {
                    servico.usuarios = servico.usuarios.map((usuario: any) => {
                        return {
                            code: usuario.id,
                            name: usuario.nome
                        }
                    })
                });
                setServicos(servicos)
            })
            .catch(error => console.error(error))
    }

    const buscarProdutivoPorEmpresaId = (id: number) => {
        empresaService.buscarUsuariosPorEmpresa(id)
            .then(response => {
                const usuariosMultiSelect = response.data.map((usuario: any) => {
                    return {
                        code: usuario.usuarioId,
                        name: usuario.nome
                    }
                })
                setUsuarios(usuariosMultiSelect);
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        buscarEmpresasPorUsuarioId()
    }, []);

    const openNew = () => {
        servicoVazio['empresaId'] = Number(empresa?.code);
        setServico(servicoVazio);
        setSubmitted(false);
        setServicoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setServicoDialog(false);
    };

    const hideDeleteServicoDialog = () => {
        setDeleteServicoDialog(false);
    };

    const hideDeleteServicosDialog = () => {
        setDeleteServicosDialog(false);
    };

    const saveServico = () => {

        setSubmitted(true);

        if (servico.id) {
            servicoService.alterar(servico)
                .then(response => {
                    setServicoDialog(false)
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Servico salvo com sucesso',
                        life: 3000
                    })
                    setServico(servicoVazio);
                    buscarServicosPorEmpresaId(Number(empresa?.code));
                })
                .catch(error => {
                    console.error(error)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao salvar serviço - Erro: ' + error.message,
                        life: 3000
                    })
                })
        } else {
            servicoService.salvar(servico)
                .then(response => {
                    setServicoDialog(false)
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Servico salvo com sucesso',
                        life: 3000
                    })
                    setServico(servicoVazio)
                    buscarServicosPorEmpresaId(Number(empresa?.code));
                })
                .catch(error => {
                    console.error(error)
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao salvar serviço - Erro: ' + error.message,
                        life: 3000
                    })
                })
        }

    };

    const editServico = (servico: Servico) => {
        servico.empresaId = Number(empresa?.code);
        setServico({ ...servico });
        setServicoDialog(true);
    };

    const confirmDeleteServico = (servico: Servico) => {
        setServico(servico);
        setDeleteServicoDialog(true);
    };

    const deleteServico = () => {
        const _servico = servico;
        setServico(_servico);

        servicoService.deletar(servico)
            .then(response => {
                setDeleteServicoDialog(false)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Servico excluído com sucesso',
                    life: 3000
                })
                setServico(servicoVazio)
                buscarEmpresasPorUsuarioId()
            })
            .catch(error => {
                console.error(error)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir serviço - Erro: ' + error.message,
                    life: 3000
                })
            })
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteServicosDialog(true);
    };

    const deleteSelectedServicos = () => {
        Promise.all(selectedServicos.map(async (_servico: Servico) => {
            //_servico.ativo = false;
            await servicoService.deletar(_servico);
        })).then((response) => {
            buscarEmpresasPorUsuarioId()
            setSelectedServicos([])
            setDeleteServicosDialog(false)
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Serviços deletados',
                life: 3000
            })
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletar serviços',
                life: 3000
            });
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _servico = { ...servico };
        (_servico as any)[name] = val;
        setServico(_servico);
    };

    const empresaChange = (e: DropdownChangeEvent) => {
        const _empresa = e.value;
        setEmpresa(_empresa);
        buscarServicosPorEmpresaId(_empresa.code)
        buscarProdutivoPorEmpresaId(_empresa.code)
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServicos || !(selectedServicos as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Servico) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Servico) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const tempoBodyTemplate = (rowData: Servico) => {
        return (
            <>
                <span className="p-column-title">Tempo</span>
                {rowData.tempo}
            </>
        );
    };

    const valorBodyTemplate = (rowData: Servico) => {
        return (
            <>
                <span className="p-column-title">Valor</span>
                {rowData.valor}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Servico) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editServico(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteServico(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Serviços</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const servicoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveServico} />
        </>
    );
    const deleteServicoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteServicoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteServico} />
        </>
    );
    const deleteServicosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteServicosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedServicos} />
        </>
    );

    return (
        <div>
            <div className='empresas-select'>
                <Dropdown value={empresa} onChange={empresaChange} options={empresas} optionLabel="name"
                    placeholder="Selecione a empresa" />
            </div>
            {
                empresa &&
                <div style={{ padding: "0 10px" }}>
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                        <DataTable
                            ref={dt}
                            value={servicos}
                            selection={selectedServicos}
                            onSelectionChange={(e) => setSelectedServicos(e.value as any)}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Serviços"
                            globalFilter={globalFilter}
                            emptyMessage="Nenhum serviço encontrado"
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                            <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="tempo" header="Tempo" sortable body={tempoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="valor" header="Valor" sortable body={valorBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={servicoDialog} style={{ width: '450px' }} header="Detalhes do Serviço" modal className="p-fluid" footer={servicoDialogFooter} onHide={hideDialog}>

                            <div className="field">
                                <label htmlFor="nome">Nome</label>
                                <InputText
                                    id="nome"
                                    value={servico.nome}
                                    onChange={(e) => onInputChange(e, 'nome')}
                                    required
                                    className={classNames({
                                        'p-invalid': submitted && !servico.nome
                                    })}
                                />
                                {submitted && !servico.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="tempo">Tempo</label>
                                <InputText
                                    id="tempo"
                                    value={servico.tempo}
                                    onChange={(e) => onInputChange(e, 'tempo')}
                                    required
                                    className={classNames({
                                        'p-invalid': submitted && !servico.tempo
                                    })}
                                />
                                {submitted && !servico.tempo && <small className="p-invalid">Tempo é obrigatório.</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="valor">Valor</label>
                                <InputText
                                    id="valor"
                                    value={servico.valor}
                                    onChange={(e) => onInputChange(e, 'valor')}
                                    required
                                    className={classNames({
                                        'p-invalid': submitted && !servico.valor
                                    })}
                                />
                                {submitted && !servico.valor && <small className="p-invalid">Valor é obrigatório.</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="usuarioId">Usuário</label>


                                <MultiSelect
                                    value={servico.usuarios}
                                    onChange={onUsuariosChange}
                                    options={usuarios}
                                    optionLabel="name"
                                    filter
                                    placeholder="Selecione os usuários"
                                    maxSelectedLabels={3}
                                    className="w-full md:w-20rem"
                                />
                                {submitted && !servico.usuarios && <small className="p-invalid">Usuário é obrigatório.</small>}
                            </div>


                        </Dialog>

                        <Dialog visible={deleteServicoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteServicoDialogFooter} onHide={hideDeleteServicoDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {servico && (
                                    <span>
                                        Você realmente deseja excluir o serviço <b>{servico.nome}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog visible={deleteServicosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicosDialogFooter} onHide={hideDeleteServicosDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {servico && <span>Você realmente deseja excluir os serviços selecionados?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            }

        </div>
    );
};

export default ServicoPage;