const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { json } = require('body-parser');
const saltRounds = 10;

app.post('/login', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        email: body.email
    });
    let pass = body.password


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'usuario o contraseña incorrectas'
            })
        }

        if (!bcrypt.compareSync(pass, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'usuario .o contraseña incorrectas'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.NODE_SEED, { expiresIn: process.env.TIMETOKEN });

        return res.json({
            ok: true,
            user: usuarioDB,
            token: token
        })
    })


})

module.exports = app;