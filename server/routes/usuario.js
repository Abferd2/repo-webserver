const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');
const _ = require('underscore');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Usuario.find({ estado: true }, 'nombre email img')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
        })
})
app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'mongodb error',
                err: err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            data: usuarioDB
        })
    })

})
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //delete body.password;
    //delete body.google;


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'mongodb error update',
                err: err
            });
        }
        let response = {
            ok: true,
            usuario: UsuarioDB
        }
        res.json(response)
    })
})

app.delete('/admin_usuario/:id', (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'mongodb error delete',
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
})
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let data = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, data, { new: true, runValidators: true }, (err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'mongodb error update',
                err: err
            });
        }
        let response = {
            ok: true,
            usuario: UsuarioDB
        }
        res.json(response)
    })
})

module.exports = app;