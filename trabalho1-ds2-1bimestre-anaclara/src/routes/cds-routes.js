const { Router } = require('express');

const { CdsController } = require('../controllers/cds-controller');

const routes = Router();

const cdsController = new CdsController();

routes.get('/cadastrar', cdsController.mostraCadastro);

routes.get('/alterar-cd/:id', cdsController.mostraAlteracao);

routes.get('/deletar/:id', cdsController.deletar);

routes.get('/', cdsController.listar);

routes.get('/bem-vindo', cdsController.bemVindo);

routes.get('/negado', cdsController.geraTelaNegado);

routes.get('/:id', cdsController.detalhar);

routes.post('/', cdsController.cadastrar);

routes.post('/alterar/:id', cdsController.alterar);



module.exports = routes;