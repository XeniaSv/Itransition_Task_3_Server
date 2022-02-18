const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('name').isString(),
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    userController.registration);
router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 1, max: 32}),
    userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

router.get('/users', authMiddleware, userController.getUsers);
router.post('/users/block',
    body('id'),
    authMiddleware,
    userController.blockUser);
router.post('/users/unblock',
    body('id'),
    authMiddleware,
    userController.unblockUser);
router.post('/users/delete',
    body('id'),
    authMiddleware,
    userController.deleteUser);

module.exports = router