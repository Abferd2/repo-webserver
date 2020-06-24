const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { json } = require('body-parser');
const saltRounds = 10;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLI);

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


});
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLI, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    //console.log(token);

    let googleUser = await verify(token).catch(error => {
        return res.status(403).json({
            ok: false,
            error
        })
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(403).json({
                ok: false,
                err
            })
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: 'usuario ya registrado, usar autentificacion normal'
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.NODE_SEED, { expiresIn: process.env.TIMETOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //usuario nuevo
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;;
            usuario.google = true;
            usuario.password = 'none:)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    })
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.NODE_SEED, { expiresIn: process.env.TIMETOKEN });
                return res.status(200).json({
                    ok: true,
                    user: usuarioDB,
                    token: token
                })
            })
        }
    });
})

module.exports = app;