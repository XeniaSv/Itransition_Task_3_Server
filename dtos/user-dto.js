module.exports = class UserDto {
    name;
    email;
    id;
    isActivated;
    isBlocked;
    registrationDate;
    lastLoginDate;

    constructor(model) {
        this.name = model.name;
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isBlocked = model.isBlocked;
        this.registrationDate = model.registrationDate;
        this.lastLoginDate = model.lastLoginDate;
    }
}