const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(name, email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} have already existed`)
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({
            name: name,
            email: email,
            password: hashPassword,
            activationLink: activationLink,
            lastLoginDate: Date.now(),
            registrationDate: Date.now()
        });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest('Wrong activation link')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('User with such email not found')
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            throw ApiError.BadRequest('Wrong password')
        }
        if (user.isBlocked) {
            throw ApiError.UserBlocked('User was blocked')
        }

        user.lastLoginDate = Date.now();
        user.save();

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        if (!user) {
            throw ApiError.BadRequest('User with such email not found')
        }
        if (user.isBlocked) {
            throw ApiError.UserBlocked('User was blocked')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async blockUser(id) {
        const user = await UserModel.findOne({_id: id});
        if (!user) {
            throw ApiError.BadRequest('User with such email not found')
        }

        user.isBlocked = true;
        user.save();
        return `User with email ${user.email} blocked`;
    }

    async unblockUser(id) {
        const user = await UserModel.findOne({_id: id});
        if (!user) {
            throw ApiError.BadRequest('User with such email not found')
        }
        user.isBlocked = false;
        user.save();
        return `User with email ${user.email} unblocked`;
    }

    async deleteUser(id) {
        const user = await UserModel.findOne({_id: id});
        if (!user) {
            throw ApiError.BadRequest('User with such email not found')
        }

        await tokenService.removeTokenByUserId(user._id);
        await UserModel.deleteOne({_id: id});
        return `User with email ${user.email} deleted`;
    }

    async checkIsBlocked(email) {
        const user = await UserModel.findOne({email});
        return user.isBlocked;
    }

    async checkIsDeleted(email) {
        const user = await UserModel.findOne({email});
        return user == null;
    }
}

module.exports = new UserService();