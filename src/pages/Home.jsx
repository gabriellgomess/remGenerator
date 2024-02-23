import React, { useState } from 'react';
import { Typography, message, Upload, Modal } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios'; // Importe o axios
const { Title, Text } = Typography;
const { Dragger } = Upload;

const Home = ({ user }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [importData, setImportData] = useState(null);

    const customRequest = async (options) => {
        const { file } = options;
        const formData = new FormData();
        formData.append('excelFile', file);
        formData.append('user', user.name);
        formData.append('parceiro', user.email);

        try {
            const response = await axios.post('https://rem.nexustech.net.br/api/importacao_processa_excel.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImportData(response.data);
            setModalVisible(true);
            options.onSuccess(response.data, file);
        } catch (error) {
            console.error('Erro ao enviar solicitação para o servidor:', error);
            options.onError(error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setImportData(null);
        // Limpar o fileList do Dragger
        document.querySelector('.ant-upload-list').innerHTML = '';
        
    };

    return (
        <div>
            <Title level={2}>Importador de arquivo de remessa</Title>
            <Text>Seja bem-vindo ao importador de arquivo de remessa.</Text>
            <Dragger
                style={{marginTop: '20px'}}
                name='excelFile'
                multiple
                accept='.xlsx, .xls, .csv'
                customRequest={customRequest}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Clique ou arraste o arquivo para esta área para enviar</p>
                <p className="ant-upload-hint">
                    Suporte para envio único ou em massa. Estritamente proibido enviar dados da empresa ou outros
                    arquivos proibidos.
                </p>
            </Dragger>

            <Modal
                title="Resposta do Servidor"
                visible={modalVisible}
                onCancel={closeModal}
                footer={null}
            >
                {importData && (
                    <div>
                        <p>{importData.message}</p>
                        <p>Registros inseridos: {importData.registros_inseridos}</p>
                        <p>Valor total: {importData.valor_total}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Home;
