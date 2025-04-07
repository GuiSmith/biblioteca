import livroAutor from "../models/livro_autor.js";
import livro from "../models/livro.js";
import autor from "../models/autor.js";

const tabela = "livro_autor";

const selecionar = async (id) => {
    const registro =  await livroAutor.findByPk(id);
    return registro.dataValues;
}

const inserir = async (id_autor, id_livro) => {
    const registro = await livroAutor.create({id_autor, id_livro});
    return registro.dataValues;
};

const alterar = async (id, id_autor, id_livro) => {
    // Atualiza o livroAutor
    await livroAutor.update({id, id_autor, id_livro}, { where: { id: id } })
        .then(result => result)
        .catch(err => err);
};

const excluir = async (id) => {
    await livroAutor.destroy({ where: { id: id } })
        .then(result => result)
        .catch(err => err);
};

(async () => {
    console.log("Testando listar Livros");
    await listarAutores(1)
        .then(result => console.log(result))
        .catch(err => console.log(err));
    // console.log("Testando listar Autores");
    // await listarAutores(1)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err));
})();

export default { selecionar, inserir, alterar, excluir };