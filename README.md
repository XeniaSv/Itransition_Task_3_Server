# Itransition_Task_3_Server

## Endpoints
|Запрос  |       Endpoint       |               Body                                |                Response               |
|:------:| ------------------- | ----------------------------------                 | ----------------------------------    |
|    POST| /api/login          | email: "email", password: "password"               | accessToken, refreshToken, `User info` 
|    POST| /api/registration   | name: "Name", email: "email", password: "password" | accessToken, refreshToken, `User info`
|     GET| /api/users          |                                                    | array of `user info`
|    POST| /api/users/block    | id: "userId"                                       | message
|    POST| /api/users/unblock  | id: "userId"                                       | message
|  DELETE| /api/users          | id: "userId"                                       | message

## Response dto's
* `User info`:
```json
"user": {
        "name": "Name",
        "email": "email",
        "id": "id",
        "isActivated": "isActivated",
        "isBlocked": "isBlocked",
        "registrationDate": "registrationDate",
        "lastLoginDate": "lastLoginDate"
}
```
