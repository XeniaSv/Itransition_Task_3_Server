const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},
    activationLink: {type: String},
    registrationDate: {type: Date},
    lastLoginDate: {type: Date, default: 0}
})

module.exports = model('User', UserSchema);