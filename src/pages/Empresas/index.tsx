import './style.css';
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
import { EmpresaService } from './EmpresaService'
import { ConvidarUsuarioDTO, Empresa, EmpresaUsuario } from '../../types';
import { TabPanel, TabView } from 'primereact/tabview';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

const EmpresaPage = () => {

    let empresaVazia: Empresa = {
        id: 0,
        nome: ''
    };

    const [empresas, setEmpresas] = useState(null);
    const [usuariosEmpresa, setUsuariosEmpresa] = useState<EmpresaUsuario[]>([]);
    const [dialog, setDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteUsuarioEmpresaDialog, setDeleteUsuarioEmpresaDialog] = useState(false);
    const [multiDeleteDialog, setMultiDeleteDialog] = useState(false);
    const [empresa, setEmpresa] = useState<Empresa>(empresaVazia);
    const [selecionados, setSelecionados] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [editandoUsuarioEmpresa, setEditandoUsuarioEmpresa] = useState(false);

    let convidarUsuarioVazio: ConvidarUsuarioDTO = {
        empresaId: 0,
        email: '',
        gestor: false
    }

    const [usuarioEmpresa, setUsuarioEmpresa] = useState<ConvidarUsuarioDTO>(convidarUsuarioVazio)

    const empresaService = new EmpresaService();

    const buscarEmpresasPorUsuarioId = () => {
        empresaService.buscarEmpresasPorUsuarioId(0)
            .then(response => {
                const empresas = response.data;
                setEmpresas(empresas)
            })
            .catch(error => console.error(error))
    }

    const buscarUsuariosPorEmpresa = (empresaId: any) => {
        empresaService.buscarUsuariosPorEmpresa(empresaId)
            .then(response => {
                const usuariosEmpresa = response.data;
                setUsuariosEmpresa(usuariosEmpresa)
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        buscarEmpresasPorUsuarioId()
    }, []);

    const openNew = () => {
        setEmpresa(empresaVazia);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteEmpresaDialog = () => {
        setDeleteDialog(false);
    };

    const hideDeleteUsuarioEmpresaDialog = () => {
        setUsuarioEmpresa(convidarUsuarioVazio);
        setDeleteUsuarioEmpresaDialog(false);
    };

    const hideDeleteEmpresasDialog = () => {
        setMultiDeleteDialog(false);
    };

    const saveEmpresa = () => {

        setSubmitted(true);

        if (empresa.id) {
            empresaService.alterar(empresa)
                .then(response => {
                    setDialog(false)
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Empresa salvo com sucesso',
                        life: 3000
                    })
                    setEmpresa(empresaVazia)
                    buscarEmpresasPorUsuarioId()
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
            empresaService.salvar(empresa)
                .then(response => {
                    setDialog(false)
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Empresa salvo com sucesso',
                        life: 3000
                    })
                    setEmpresa(empresaVazia)
                    buscarEmpresasPorUsuarioId()
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

    const editEmpresa = (empresa: Empresa) => {
        setEmpresa({ ...empresa });
        buscarUsuariosPorEmpresa(empresa.id);
        setDialog(true);
    };

    const confirmDeleteEmpresa = (empresa: Empresa) => {
        setEmpresa(empresa);
        setDeleteDialog(true);
    };

    const deleteEmpresa = () => {
        const _empresa = empresa;
        setEmpresa(_empresa);

        empresaService.deletar(empresa)
            .then(response => {
                setDeleteDialog(false)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Empresa excluída com sucesso',
                    life: 3000
                })
                setEmpresa(empresaVazia)
                buscarEmpresasPorUsuarioId()
            })
            .catch(error => {
                console.error(error)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir empresa - Erro: ' + error.message,
                    life: 3000
                })
            })
    };

    const convidarUsuario = () => {

        const _usuarioEmpresa = usuarioEmpresa;
        _usuarioEmpresa.empresaId = empresa.id;
        setUsuarioEmpresa(_usuarioEmpresa);

        empresaService.convidarProdutivo(usuarioEmpresa)
            .then(response => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário convidado com sucesso!',
                    life: 3000
                })
                const _usuariosEmpresa = usuariosEmpresa;
                _usuariosEmpresa?.push(response.data);
                setUsuariosEmpresa(_usuariosEmpresa);

                setUsuarioEmpresa(convidarUsuarioVazio);
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


    };

    const editUsuarioEmpresa = (empresaUsuario: EmpresaUsuario) => {
        setEditandoUsuarioEmpresa(true)
        const convidarUsuarioDTO: ConvidarUsuarioDTO = {
            empresaId: empresa.id ?? 0,
            email: empresaUsuario.email ?? "",
            gestor: empresaUsuario.gestor ?? false,
        };
        setUsuarioEmpresa(convidarUsuarioDTO);
    };

    const confirmDeleteUsuarioEmpresa = (empresaUsuario: EmpresaUsuario) => {
        const convidarUsuarioDTO: ConvidarUsuarioDTO = {
            empresaId: empresa.id ?? 0,
            email: empresaUsuario.email ?? "",
            gestor: empresaUsuario.gestor ?? false,
        };
        setUsuarioEmpresa(convidarUsuarioDTO)
        setDeleteUsuarioEmpresaDialog(true);
    };

    const deleteUsuarioEmpresa = () => {
        empresaService.removerProdutivo(empresa.id, usuarioEmpresa.email)
            .then(response => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário deletado com sucesso!',
                    life: 3000
                })

                const _usuariosEmpresa = usuariosEmpresa;

                const index = _usuariosEmpresa.findIndex(usuario => usuario.email === usuarioEmpresa.email);
                _usuariosEmpresa.splice(index, 1);

                setUsuariosEmpresa(_usuariosEmpresa);
                setUsuarioEmpresa(convidarUsuarioVazio);
                setDeleteUsuarioEmpresaDialog(false);
            })
            .catch(error => {
                console.error(error)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao deletar usuário - Erro: ' + error.message,
                    life: 3000
                })
            })
    }

    const salvarAlteracaoUsuario = () => {

        const alterarUsuarioEmpresaDTO = {
            empresaId: empresa.id ?? 0,
            email: usuarioEmpresa.email ?? "",
            gestor: usuarioEmpresa.gestor ?? false,
        }

        empresaService.alterarProdutivo(alterarUsuarioEmpresaDTO)
            .then(response => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário alterado com sucesso!',
                    life: 3000
                })

                const _usuarioEmpresa = response.data;
                const _usuariosEmpresa = usuariosEmpresa;

                const index = _usuariosEmpresa.findIndex(usuario => usuario.email === _usuarioEmpresa.email);
                _usuariosEmpresa[index] = _usuarioEmpresa;

                setUsuariosEmpresa(_usuariosEmpresa);
                setUsuarioEmpresa(convidarUsuarioVazio);
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
            .finally(() => setEditandoUsuarioEmpresa(false))
        setEditandoUsuarioEmpresa(false)
    }

    const cancelarAlteracao = () => {
        setEditandoUsuarioEmpresa(false)
    }

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setMultiDeleteDialog(true);
    };

    const deleteSelectedEmpresas = () => {
        Promise.all(selecionados.map(async (_empresa: Empresa) => {
            //_empresa.ativo = false;
            await empresaService.deletar(_empresa);
        })).then((response) => {
            buscarEmpresasPorUsuarioId()
            setSelecionados([])
            setMultiDeleteDialog(false)
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
        let _empresa = { ...empresa };
        (_empresa as any)[name] = val;
        setEmpresa(_empresa);
    };

    const onInputUsuarioEmpresaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuarioEmpresa = { ...usuarioEmpresa };
        (_usuarioEmpresa as any)[name] = val;
        setUsuarioEmpresa(_usuarioEmpresa);
    };

    const onGestorChange = (e: CheckboxChangeEvent) => {
        let _usuarioEmpresa = { ...usuarioEmpresa };
        (_usuarioEmpresa as any)['gestor'] = e.checked;
        setUsuarioEmpresa(_usuarioEmpresa);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selecionados || !(selecionados as any).length} />
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

    const idBodyTemplate = (rowData: Empresa) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Empresa) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Empresa) => {
        return (
            <div className='botoes'>
                <Button icon="pi pi-pencil" rounded severity="success" style={{ margin: "0 10px" }} onClick={() => editEmpresa(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" className="botao-redondo" onClick={() => confirmDeleteEmpresa(rowData)} />
            </div>
        );
    };

    const actionBodyTemplateEmpresaUsuario = (rowData: EmpresaUsuario) => {
        return (
            <>
                <div className='botoes'>
                    <Button icon="pi pi-pencil" rounded severity="success" style={{ margin: "0 10px" }} onClick={() => editUsuarioEmpresa(rowData)} />
                    <Button icon="pi pi-trash" rounded severity="warning" className="botao-redondo" onClick={() => confirmDeleteUsuarioEmpresa(rowData)} />
                </div>
            </>
        );
    };

    const isDsuarioConfirmadoBodyTemplate = (rowData: EmpresaUsuario) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.confirmado, 'text-red-500 pi-times-circle': !rowData.confirmado })}></i>;
    };

    const isGestorBodyTemplate = (rowData: EmpresaUsuario) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.gestor, 'text-red-500 pi-times-circle': !rowData.gestor })}></i>;
    };

    const header = (
        <div>
            <h5 className="m-0">Gerenciamento de Empresas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar" />
            </span>
        </div>
    );

    const deleteDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteEmpresaDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteEmpresa} />
        </>
    );

    const deleteUsuarioEmpresaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioEmpresaDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuarioEmpresa} />
        </>
    );

    const multiDeleteDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteEmpresasDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedEmpresas} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <div>
                        <DataTable
                            ref={dt}
                            value={empresas}
                            selection={selecionados}
                            onSelectionChange={(e) => setSelecionados(e.value as any)}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Serviços"
                            globalFilter={globalFilter}
                            emptyMessage="Nenhuma empresa encontrada"
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                            <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                    </div>

                    <Dialog visible={dialog} style={{ width: '1000px' }} header="Detalhes da Empresa" modal className="p-fluid" onHide={hideDialog}>

                        <TabView>
                            <TabPanel header="Dados da Empresa">
                                <div className="field">
                                    <label htmlFor="nome">Nome</label>
                                    <InputText
                                        id="nome"
                                        value={empresa.nome}
                                        onChange={(e) => onInputChange(e, 'nome')}
                                        required
                                        className={classNames({
                                            'p-invalid': submitted && !empresa.nome
                                        })}
                                    />
                                    {submitted && !empresa.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                                </div>
                                <div className='botoes'>
                                    <Button style={{ width: '200px' }} className="botao" label="Salvar" severity="success" onClick={saveEmpresa} />
                                    <Button style={{ width: '200px' }} className="botao" label="Deletar" severity="danger" onClick={hideDialog} />
                                </div>
                            </TabPanel>
                            <TabPanel header="Produtivos">
                                <div className='formulario-empresa-usuario'>
                                    <div className='email-convidado'>
                                        <label className="labelConvidado" htmlFor="emailConvidado">Convidar Usuário</label>
                                        <InputText
                                            id="emailConvidado"
                                            value={usuarioEmpresa.email}
                                            onChange={e => onInputUsuarioEmpresaChange(e, 'email')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !empresa.nome
                                            })}

                                        />
                                    </div>
                                    <div className='checkbox'>
                                        <Checkbox inputId="gestor" value="Gestor" onChange={onGestorChange} checked={usuarioEmpresa.gestor} />
                                        <label htmlFor="gestor" style={{ paddingLeft: "2%" }}>Gestor</label>
                                    </div>
                                    {
                                        !editandoUsuarioEmpresa &&
                                        <Button style={{ width: '35%', height: '50px' }} severity="info" label="Enviar" onClick={convidarUsuario} />
                                    }
                                    {
                                        editandoUsuarioEmpresa &&
                                        <div style={{ display: "flex", width: "35%" }}>
                                            <Button style={{ width: '50%', marginLeft: '1%', height: '50px' }} severity="success" label="Salvar" onClick={salvarAlteracaoUsuario} />
                                            <Button style={{ width: '50%', marginLeft: '1%', height: '50px' }} severity="danger" label="Cancelar" onClick={cancelarAlteracao} />
                                        </div>
                                    }
                                </div>
                                <br></br>
                                <DataTable
                                    ref={dt}
                                    value={usuariosEmpresa}
                                    dataKey="usuarioId"
                                    className="datatable-responsive"
                                >
                                    <Column field="nome" header="Nome" headerStyle={{ minWidth: '15rem' }}></Column>
                                    <Column field="confirmado" header="Confirmado" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={isDsuarioConfirmadoBodyTemplate} />
                                    <Column field="gestor" header="Gestor" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={isGestorBodyTemplate} />
                                    <Column body={actionBodyTemplateEmpresaUsuario} headerStyle={{ minWidth: '10rem' }}></Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>

                    </Dialog>

                    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteEmpresaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empresa && (
                                <span>
                                    Você realmente deseja excluir a empresa? <b>{empresa.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioEmpresaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioEmpresaDialogFooter} onHide={hideDeleteUsuarioEmpresaDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empresa && (
                                <span>
                                    Você realmente deseja excluir o usuário?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={multiDeleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={multiDeleteDialogFooter} onHide={hideDeleteEmpresasDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empresa && <span>Você realmente deseja excluir as empresas selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default EmpresaPage;