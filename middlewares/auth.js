// Modelos
import Usuario from '../models/usuario.js';
import Funcionario from '../models/funcionario.js';

const auth = async (req, res, next) => {
    const mensagem = 'Token não fornecido ou mal formatado';
    if(!req.headers.authorization){
        return res.status(401).json({ mensagem });
    }
    const authHeader = req.headers.authorization;

    if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({ mensagem });
    }

    const token = authHeader.split(' '[1]);
}