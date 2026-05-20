const express = require('express');

const router = express.Router();

const adminController =
require('../controllers/adminController');

const authMiddleware =
require('../middleware/authMiddleware');

const roleMiddleware =
require('../middleware/roleMiddleware');


router.get(

    '/users',

    authMiddleware,

    roleMiddleware('admin'),

    adminController.getUsers
);


router.put(

    '/role/:id',

    authMiddleware,

    roleMiddleware('admin'),

    adminController.changeRole
);


module.exports = router;