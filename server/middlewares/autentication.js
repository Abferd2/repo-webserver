const jwt = require('jsonwebtoken');

//==========================
//  verificar token
//==========================
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.NODE_SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token no valido'
            })
        }
        req.usuario = decode.usuario;
        next();
    })

}

//  verificar role admin
//==========================
let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            ok: false,
            message: 'Permisos invalidos'
        })
    }

    next();
}

module.exports = {
    verificaToken,
    verificarAdminRole
}