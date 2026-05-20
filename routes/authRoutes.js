const express = require('express');

const router = express.Router();

const authController =
require('../controllers/authController');

const passport =
require('passport');

const authMiddleware =
require('../middleware/authMiddleware');


// ================= Register =================

router.post(

    '/register',

    authController.register
);


// ================= Login =================

router.post(

    '/login',

    authController.login
);


// ================= Google OAuth =================

router.get(

    '/google',

    passport.authenticate(

        'google',

        {
            scope: ['profile', 'email']
        }
    )
);


router.get(

    '/google/callback',

    passport.authenticate(

        'google',

        {
            session: false,

            failureRedirect:
            'https://localhost:5500/login.html'
        }
    ),

    (req, res) => {

        const jwt =
        require('jsonwebtoken');

        const token =
        jwt.sign(

            {

                id: req.user.id,

                role:
                req.user.role || 'user'
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '1d'
            }
        );

 res.redirect(
`http://127.0.0.1:5500/frontend/dashboard.html?token=${token}`
);
    }
);


// ================= 2FA =================

router.get(

    '/generate-2fa',

    authMiddleware,

    authController.generate2FA
);


router.post(

    '/verify-2fa',

    authMiddleware,

    authController.verify2FA
);


module.exports = router;