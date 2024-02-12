const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

    username:{
        type: String,
        required:[true,'SVP ajouter votre username '],
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required:[true,'SVP ajouter votre mot de passe '],
        minlength: [6, 'mot de passe doit minimum 6 caractéres '],
    },
    email: String,
    nom: String,
    prenom: String,
    service: String,
    role: String,
    tel: Number,
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],

    fcmToken: {
        type: String,
        required:false,
    },

},
{
    timestamps: true,
});

module.exports = mongoose.model('User',UserSchema);