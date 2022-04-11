let cds = [];

const { nanoid } = require('nanoid');
const { CD } = require('../cd.js');
const fs = require('fs');
const url = require('url');

function lerCDs(){
    fs.readFile('./src/data/cds.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            cds = JSON.parse(data);
        }
    });
}

function salvarCD(novoCD){
    lerCDs();
    fs.readFile('./src/data/cds.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            cds.push({
                id: nanoid(8),
                ...novoCD
            });
            json = JSON.stringify(cds); 
            fs.writeFile('./src/data/cds.json', json, 'utf8', function(){});
        }
    });
}

function salvarExistente(cdsExistentes){
    console.log("cds recebidos como parametro");
    fs.readFile('./src/data/cds.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            json = JSON.stringify(cdsExistentes);
            console.log("tem que escrever");
            console.log(json);
            fs.writeFile('./src/data/cds.json', json, 'utf8', function(){});
        }
    });
}

class CdsController {

    async mostraCadastro(req, res) {
        return res.render('cadastro');
    }

    async mostraAlteracao(req,res){
        const { id }=req.params;
        const cdsFiltrados = cds.filter(f => f.id == id);
        if (cdsFiltrados.length > 0) {
            return res.render('alterar-cd', { cd: cdsFiltrados[0] });
        } else {
            return res.send('CD NAO ENCONTRADO');
        }
        return res.send('Essa deveria detalhar um cd ' + req.params.id);
        //return res.render('alterar-cd',{ cd:  });
    }

    async listar(req, res) {
        console.log("lendo arquivo");
        //console.log(cds);
        await lerCDs();
        //console.log(cds);
        let cdsFiltrados=cds;
        const queryObject = url.parse(req.url, true).query;
        console.log(req.body);
        if(queryObject!=undefined){
            if(queryObject.buscatitulo!=undefined){
                console.log("Entrou no if de titulo");
                cdsFiltrados=cdsFiltrados.filter(f=>f.titulo.toUpperCase().includes(queryObject.buscatitulo.toUpperCase()));
            }
            if(queryObject.buscadatalancamento!=undefined){
                console.log("Entrou no if de data");
                cdsFiltrados=cdsFiltrados.filter(f=>f.datalancamento==queryObject.buscadatalancamento);
            }
        }
        return res.render('listagem', { cds: cdsFiltrados, usuario: req.session.user });
    }

    async bemVindo(req, res) {
        await lerCDs();
        return res.render('bemvindo');
    }

    async deletar(req, res) {
        if(req.session.user == undefined || !req.session.user.eh_admin)
            return res.redirect('/cds/negado');

        await lerCDs();
        const { id } = req.params;
        const cdIdx = cds.findIndex(f => f.id == id);
        cds.splice(cdIdx, 1);
        salvarExistente(cds);
        return res.redirect('/cds');
    }

    async detalhar(req, res) {
        await lerCDs();
        const { id } = req.params;
        const cdsFiltrados = cds.filter(f => f.id == id);
        if (cdsFiltrados.length > 0) {
            return res.render('detalhes', { cd: cdsFiltrados[0] });
        } else {
            return res.send('CD NAO ENCONTRADO');
        }
        return res.send('Essa deveria detalhar um cd ' + req.params.id);
    }

    async cadastrar(req, res) {
        await lerCDs();
        if(req.session.user == undefined || !req.session.user.eh_admin)
            return res.redirect('/cds/negado');
        console.log(`Cadastrando um CD`);
        console.log({ body: req.body });
        salvarCD(req.body);
        console.log(cds)
        return res.redirect('/cds');
    }

    async alterar(req, res){
        const { id } = req.params;
        await lerCDs();
        if(req.session.user == undefined || !req.session.user.eh_admin)
            return res.redirect('/cds/negado');
        console.log("chegou no alterar");
        let cdEscolhido;
        //const { titulo, artista, anolancamento, faixas} = req.body;
        for (let index = 0; index < cds.length; index++) {
            if (cds[index].id == id) {
                cds[index].titulo=req.body.titulo;
                cds[index].artista=req.body.artista;
                cds[index].datalancamento=req.body.datalancamento;
                cds[index].faixas=req.body.faixas;
                cdEscolhido=cds[index];
            }
        }
        console.log(cds);
        salvarExistente(cds);
        return res.render('detalhes',{ cd: cdEscolhido });
        //return res.redirect('/cds/'+id);
    }

    async geraTelaNegado(req, res){
        console.log("Ocorreu um erro ao tentar realizar operacao");
        return res.render('negado');
    }
}

module.exports = { CdsController }