const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const userService = require('../service/user-service')

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader){
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken){
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData){
            return next(ApiError.UnauthorizedError());
        }

        const isDeleted = await userService.checkIsDeleted(userData.email)
        if (isDeleted) {
            return next(ApiError.UserDeleted('You have been deleted'));
        }

        const isBlocked = await userService.checkIsBlocked(userData.email);
        if (isBlocked) {
            return next(ApiError.UserBlocked('You have been blocked'));
        }

        req.user = userData;
        next();
    }
    catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}