module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.errors = errors;
        this.status = status;
    }

    static UnauthorizedError(){
        return new ApiError(401, 'User does not authorize')
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

    static UserBlocked(message, errors = []) {
        return new ApiError(410, message, errors)
    }

    static UserDeleted(message, errors = []) {
        return new ApiError(403, message, errors)
    }
}