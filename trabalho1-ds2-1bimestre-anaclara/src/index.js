const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/view');

app.use(express.urlencoded({
    extended: true
}));

const session = require('express-session');
app.use(session({
    secret: 'chave secreta de criptografia',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(express.json());

app.use(express.static('public'));


app.use('*', (req, res, next) => {
    console.log(`Request recebido para ${req.baseUrl} as ${new Date()}`);
    next();
})

app.get('/', (req, res) => {
    res.redirect('/cds/bem-vindo');
});

const cdsRoutes = require('./routes/cds-routes');
app.use('/cds', cdsRoutes);

const usersRoutes = require('./routes/users-routes');
app.use('/users', usersRoutes);

app.use('*', (req, res) => {
    return res.status(404).send(`
        <h1>Sorry, not found!!!</h1>
        <a href="/cds">VOLTAR</a>
    `);
})

app.listen(3000, () => console.log('Server iniciado na porta 3000'));