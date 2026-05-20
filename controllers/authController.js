const db = require('../config/db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const speakeasy = require('speakeasy');

const QRCode = require('qrcode');

require('dotenv').config();


// ================= Register =================

exports.register = async (req, res) => {

    try {

        const {

            name,

            email,

            password,

            role

        } = req.body;


        const hashedPassword =
        await bcrypt.hash(password, 10);


        db.query(

            `INSERT INTO users
            (name,email,password,role)
            VALUES(?,?,?,?)`,

            [
                name,

                email,

                hashedPassword,

                role
            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: 'Register Failed'
                    });
                }

                res.json({
                    message:
                    'Registered Successfully'
                });
            }
        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
};


// ================= Login =================
exports.login = (req, res) => {

    const {

        email,

        password,

        otp

    } = req.body;


    db.query(

        'SELECT * FROM users WHERE email=?',

        [email],

        async (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: 'Server Error'
                });
            }

            if (!result || result.length === 0) {

                return res.status(404).json({
                    message: 'User Not Found'
                });
            }

            const user = result[0];


            const match =
            await bcrypt.compare(

                password,

                user.password
            );


            if (!match) {

                return res.status(400).json({
                    message: 'Wrong Password'
                });
            }


            // ================= 2FA =================

            if (user.twofa_secret) {

                if (!otp) {

                    return res.status(401).json({
                        message: 'OTP Required'
                    });
                }

                const verified =
                speakeasy.totp.verify({

                    secret:
                    user.twofa_secret,

                    encoding: 'base32',

                    token: otp
                });


                if (!verified) {

                    return res.status(401).json({
                        message: 'Invalid OTP'
                    });
                }
            }


            // ================= JWT =================

            const token = jwt.sign(

                {

                    id: user.id,

                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: '1d'
                }
            );


            res.json({

                token,

                role: user.role,

                message:
                'Login Success'
            });
        }
    );
};

// ================= Generate 2FA =================

exports.generate2FA = async (req, res) => {

    try {

        console.log(req.user);

        const secret =
        speakeasy.generateSecret({

            name: 'SecureVault'
        });

        db.query(

            'UPDATE users SET twofa_secret=? WHERE id=?',

            [

                secret.base32,

                req.user.id
            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message:
                        'Database Error'
                    });
                }

                QRCode.toDataURL(

                    secret.otpauth_url,

                    (err, data_url) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message:
                                'QR Error'
                            });
                        }

                        res.json({

                            qr: data_url
                        });
                    }
                );
            }
        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Server Error'
        });
    }
};

// ================= Verify 2FA =================

exports.verify2FA = (req, res) => {

    const { token } = req.body;


    db.query(

        'SELECT twofa_secret FROM users WHERE id=?',

        [req.user.id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message:
                    'Database Error'
                });
            }

            if (!result || result.length === 0) {

                return res.status(404).json({
                    message:
                    'User Not Found'
                });
            }


            const verified =
            speakeasy.totp.verify({

                secret:
                result[0].twofa_secret,

                encoding: 'base32',

                token
            });


            if (verified) {

                return res.json({
                    message:
                    '2FA Verified Successfully'
                });
            }


            res.status(400).json({
                message: 'Invalid OTP'
            });
        }
    );
};