import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined, FileTextOutlined, FileExcelOutlined, CloudDownloadOutlined, FileSyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Typography, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const { Title, Text } = Typography;

import Baixar from '../assets/icon/baixar.png';
import Criar from '../assets/icon/criar.png';
import Excel from '../assets/icon/excel.png';
import Deletar from '../assets/icon/deletar.png';

const Importacoes = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableData, setTableData] = useState([]);
    const searchInput = useRef(null);
    useEffect(() => {
        axios.get('https://rem.nexustech.net.br/api/importacoes_listar.php')
            .then(response => {
                setTableData(response.data);
            })
            .catch(error => {
                console.error('Erro ao obter dados da API:', error);
            });
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '60px',
            align: 'center',
        },
        {
            title: 'Usuário',
            dataIndex: 'usuario',
            key: 'usuario',
            width: '300px',
            ...getColumnSearchProps('usuario'),
        },
        {
            title: 'Parceiro',
            dataIndex: 'parceiro',
            key: 'parceiro',
            width: '300px',
            ...getColumnSearchProps('parceiro'),
        },
        {
            title: 'Banco',
            dataIndex: 'banco',
            key: 'banco',
            width: '120px',
            ...getColumnSearchProps('banco'),
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>{text}</div>
        },
        {
            title: 'Quant. de Registros',
            dataIndex: 'qtd_registros',
            key: 'qtd_registros',
            width: '150px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>{text}</div>
        },
        {
            title: 'Valor Total',
            dataIndex: 'valor_total',
            key: 'valor_total',
            width: '120px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(text)}</div>,
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            width: '190px',
            render: (text) => {
                return <Text style={{ fontSize: '12px' }} type='secondary' >{text.split(' ')[0].split('-').reverse().join('/') + " " + text.split(' ')[1]}</Text>;
            },
        },
        {
            title: 'Download Remessa',
            dataIndex: 'arquivo_rem',
            key: 'arquivo_rem',
            width: '120px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><a href={text} target='_blank' rel='noreferrer'><Tooltip title="Baixar arquivo remessa">
                <img width="25px" src={Baixar} alt="" />
            </Tooltip></a></div>,

        },
        {
            title: 'Arquivo Excel',
            dataIndex: 'arquivo_excel',
            key: 'arquivo_excel',
            width: '120px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><a href={text} target='_blank' rel='noreferrer'><Tooltip title="Baixar arquivo excel">
                <img width="25px" src={Excel} alt="" />
            </Tooltip></a></div>,

        },
        {
            title: 'Gerar Remessa',
            dataIndex: null,
            key: null,
            width: '120px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><a href={text} target='_blank' rel='noreferrer'><Tooltip title="Gerar arquivo remessa">
                <img width="25px" src={Criar} alt="" />
            </Tooltip></a></div>,

        },        
        {
            title: 'Apagar Importação',
            dataIndex: null,
            key: null,
            width: '120px',
            render: (text) => <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><a href={text} target='_blank' rel='noreferrer'><Tooltip title="Apagar importação">
                <img width="20px" src={Deletar} alt="" />
            </Tooltip></a></div>

        },
    ];
    return (
        <>
            <Title level={2}>Lista de importações</Title>
            <Text>Lista de importações de arquivos de remessa.</Text>
            <Table style={{ marginTop: '20px' }} columns={columns} dataSource={tableData} />

        </>

    )
};
export default Importacoes;