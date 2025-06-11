// Modelos
import Usuario from '../models/usuario.js';
import Funcionario from '../models/funcionario.js';
import util from '../controllers/util.js';

const publicRoutes = [
    { path: '/usuario', method: 'POST' },
    { path: '/usuario/login', method: 'POST' },
    { path: '/funcionario', method: 'POST' },
    { path: '/funcionario/login', method: 'POST' },
];

const auth = async (req, res, next) => {
    try {

        const models = {
            usuario: Usuario,
            funcionario: Funcionario
        };

        console.log(req.path);

        for (const route of publicRoutes) {
            if(
                (route.path == req.path && route.method == req.method)
                || req.method == 'OPTIONS'
                || (req.method == 'GET' && req.path != '/')){
                return next();
            }
        }

        if (!req.headers.authorization) {
            return res.status(401).json({
                mensagem: `Usuário ou funcionário não autenticado!`
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                mensagem: `Token mal formatado, formato correto: 'Bearer <token>'`,
            });
        }

        const token = authHeader.split(' ')[1];

        const authType = Object.keys(util.tokenLength).find(
            key => util.tokenLength[key] === token.length
        );

        if (!authType) {
            return res.status(401).json({ mensagem: 'Tipo de token não encontrado' });
        }

        if(!models.hasOwnProperty(authType)){
            return res.status(401).json({
                mensagem: `Tipo de autenticação não encontrado`
            });
        }

        const registro = await models[authType].findOne({
            where: { token },
            raw: true
        });

        if(!registro){
            return res.status(401).json({
                mensagem: `Usuário ou funcionário não encontrado com token fornecido`
            });
        }

        if(registro.ativo === false){
            return res.status(401).json({
                mensagem: `Usuário ou funcionário inativo!`
            });
        }

        req.auth = {
            type: authType,
            data: registro
        };

        return next();

    } catch (error) {
        return res.status(500).json({
            mensagem: `Erro interno`,
            error
        });
    }
}

export default { auth };