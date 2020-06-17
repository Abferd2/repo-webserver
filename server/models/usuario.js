const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROL', 'USER_ROL'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    edad: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        useCreateIndex: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROL',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let UserObject = user.toObject();
    delete UserObject.password;
    return UserObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema);