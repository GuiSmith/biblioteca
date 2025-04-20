// Modelos
import Reserva from '../models/reserva.js';
import Livro from '../models/livro.js';
import Usuario from '../models/usuario.js';
import Exemplar from '../models/exemplar.js';

// Controladores
import util from './util.js';

const inserir = async (req, res) => {
    // Filtrando dados
    const requiredColumns = await util.requiredColumns(Reserva.getTableName());
    const permittedColumns = await util.permittedColumns(Reserva.getTableName());

    const data = util.filterObjectKeys(req.body, permittedColumns);

    if(!util.keysMatch(data, requiredColumns)){
        res.status(400).json({
            mensagem: 'Dados obrigatórios não informados',
            obrigatorios: requiredColumns,
            informados: Object.keys(data)
        });
    }

    // Verifica se livro existe
    const livro = await Livro.findByPk(data.id_livro);
    
    if(!livro){
        return res.status(404).json({
            mensagem: `Livro com ID ${data.id_livro} não encontrado!`
        });
    }

    // Verifica se usuário existe
    const usuario = await Usuario.findByPk(data.id_usuario);
    
    if(!usuario){
        return res.status(404).json({
            mensagem: `Usuário com ID ${data.id_usuario} não encontrado!`
        });
    }

    // Verifica se exemplar existe
    const exemplar = await Exemplar.findByPk(data.id_exemplar);
    
    if(!exemplar){
        return res.status(404).json({
            mensagem: `Exemplar com ID ${data.id_exemplar} não encontrado!`
        });
    }

    try {
        const reserva = await Reserva.create(data);
        res.status(201).json(reserva);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao inserir reserva',
            erro: error.message
        });
    }
}

export { inserir };