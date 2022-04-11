let users = [];

const { nanoid } = require('nanoid');
const { Usuario } = require('../user.js');
const fs = require('fs');

function lerUsuarios(){
    fs.readFile('./src/data/users.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            users = JSON.parse(data);
        }
    });
}

function salvarUsuario(novousuario){
    fs.readFile('./src/data/users.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            users.push({
                id: nanoid(8),
                ...novousuario
            });
            json = JSON.stringify(users); 
            fs.writeFile('./src/data/users.json', json, 'utf8', function(){});
        }
    });
}

class UsersController {

    async geraTelaLogin(req, res){
        if(req.session.user != undefined){
            res.redirect('/cds/');
        }
        console.log("mostra login");
        return res.render('login');
    }

    

    async geraTelaCadastroUsuario(req, res){
        console.log("mostra cadastro de usuario");
        return res.render('cadastrar-usuario');
    }

    async cadastrar(req, res) {
        console.log('UsersController/cadastrar');

        const user = req.body;
        salvarUsuario(user);
        console.log({ users });
        res.redirect('/');
    }

    async login(req, res) {
        lerUsuarios();
        console.log("chamada funcao login");
        const { email, senha } = req.body;
        console.log(req.body)
        const usuarioEcontrado = users.find(u => u.email == email);
        console.log('todos users: ');
        console.log(users);

        if (!usuarioEcontrado){
            console.log('usuario nao encontrado');
            return res.render('falha-login');
        }

        if (usuarioEcontrado.senha == senha) {
            console.log('usuario encontrado');
            req.session.user = usuarioEcontrado;
            return res.redirect('/cds/');
        } else {
            console.log('senha errada');
            return res.render('falha-login');
        }
        
    }

    async falhaAoLogar(req, res) {
        res.render('falha-login');
    }

}

module.exports = UsersController;