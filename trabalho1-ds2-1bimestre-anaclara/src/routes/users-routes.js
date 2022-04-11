const { Router } = require('express');
const UsersController = require('../controllers/users-controller');

const routes = Router();

const usersController = new UsersController();

routes.post('/cadastrar', usersController.cadastrar);

routes.get('/tela-login', usersController.geraTelaLogin);

routes.get('/tela-cadastro', usersController.geraTelaCadastroUsuario);

routes.post('/login', usersController.login);

routes.post('/falha-login', usersController.falhaAoLogar);

module.exports = routes;