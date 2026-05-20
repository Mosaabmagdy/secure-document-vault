const express = require('express');

const router = express.Router();

const authMiddleware =
require('../middleware/authMiddleware');

const roleMiddleware =
require('../middleware/roleMiddleware');

const documentController =
require('../controllers/documentController');


router.post(

    '/upload',

    authMiddleware,

    roleMiddleware(
        'admin',
        'manager',
        'user'
    ),

    documentController.uploadMiddleware,

    documentController.uploadDocument
);
router.get(

    '/',

    authMiddleware,

    documentController.getDocuments
);


router.get(

    '/download/:id',

    authMiddleware,

    documentController.downloadDocument
);


router.delete(

    '/:id',

    authMiddleware,

    documentController.deleteDocument
);


router.get(

    '/verify/:id',

    authMiddleware,

    documentController.verifyIntegrity
);

module.exports = router;