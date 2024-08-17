const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = 'senhalegal'

const Report = require('../models/Report');
const User = require ('../models/User');

const newReport = async(reportData, token) => {
    try{
        const decoded = jwt.verify(token, jwt_secret);
        if(decoded.acessLevel !=='superAdmin') {
            throw new Error("Acesso negado");
        }
        const newReport = await Report.create({
            title: reportData.title,
            description: reportData.description,
            dueDate: reportData.dueDate,
        })
        return newReport
    } catch (error) {
        throw new Error("Não foi possível criar o relatorio");
    }
};
const allReports = async (token) => {
    try {
        const decoded = jwt.verify(token, jwt_secret);

        // Verifica se o usuário tem permissão
        if (decoded.acessLevel === 'user') {
            throw new Error("Acesso negado: Usuário não autorizado a visualizar relatórios.");
        }

        // Busca todos os relatórios no banco de dados com todos os atributos
        const reports = await Report.findAll({
            attributes: ['id', 'title', 'description', 'dueDate', 'createdAt', 'updatedAt'] // Coloque todos os atributos que você deseja aqui
        });

        return reports;
    } catch (error) {
        throw new Error("Não foi possível listar os relatórios: " + error.message);
    }
};


const reportById = async (token, id) => {
    try {
        const decoded = jwt.verify (token, jwt_secret);

        if(decoded.acessLevel === 'user') {
            throw new Error("Acesso negado");
        }
        const report = await Report.findOne({
            where: {id: id},
            attributes: ['id', 'title', 'description', 'dueDate', 'createdAt', 'updatedAt'],
        });
        if(!report) {
            throw new Error("Relátorio não encontrado");
        }
        return report;

        } catch (error) {
            throw new Error("Não foi possível buscar o relatório: " + error.message);
        }
    }

const updateReport = async (id, updatedData, token) => {
    try {
        const decoded = jwt.verify (token, jwt_secret);
        if(decoded.acessLevel !=='superAdmin') {
            throw new Error("Acesso negado");
        }
        await Report.update(updatedData, {
            where: {id: id}
        });
        const updatedReport = await Report.findByPk(id);
        return updatedReport;
    } catch (error) {
        throw new Error("Não foi possível atualizar o relatorio");
    }
}

const deleteReport = async (id, token) => {
    try {
        const decoded = jwt.verify (token, jwt_secret);
        if(decoded.acessLevel !=='superAdmin') {
            throw new Error("Acesso negado");
        }
        const targetReport = await Report.findByPk(id);
        if (!targetReport) {
            throw new Error("Relatório não encontrado");
        }

        await Report.destroy({
            where: { id: id }
        });

        return { message: "Relatório deletado com sucesso" };    } catch (error) {
        throw new Error("Não foi possível apagar o relatorio");
    }
};


module.exports = {
    newReport,
    allReports,
    reportById,
    updateReport,
    deleteReport,
}