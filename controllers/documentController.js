const fs = require('fs');

const path = require('path');

const multer = require('multer');

const crypto = require('crypto');

const db = require('../config/db');


// ================= Allowed Types =================

const allowedTypes = [

    'application/pdf',

    'image/png',

    'image/jpeg',

    'text/plain'
];

const maxSize =
5 * 1024 * 1024;


// ================= Multer =================

const storage =
multer.memoryStorage();

const upload =
multer({ storage });

exports.uploadMiddleware =
upload.single('document');


// ================= RSA Keys =================

const {

    publicKey,

    privateKey

} = crypto.generateKeyPairSync(

    'rsa',

    {
        modulusLength: 2048
    }
);


// ================= AES Encryption =================

const algorithm =
'aes-256-cbc';

const key =
crypto.randomBytes(32);

const iv =
crypto.randomBytes(16);


// ================= Upload Document =================

exports.uploadDocument = (

    req,

    res

) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: 'No File Uploaded'
            });
        }

        if (

            !allowedTypes.includes(
                req.file.mimetype
            )
        ) {

            return res.status(400).json({

                message:
                'Invalid File Type'
            });
        }

        if (
            req.file.size > maxSize
        ) {

            return res.status(400).json({

                message:
                'File Too Large'
            });
        }

        const fileBuffer =
        req.file.buffer;


        // ================= SHA-256 =================

        const hash =
        crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');


        // ================= Digital Signature =================

        const signature =
        crypto.sign(

            'sha256',

            Buffer.from(hash),

            privateKey

        ).toString('hex');


        // ================= AES Encryption =================

        const cipher =
        crypto.createCipheriv(

            algorithm,

            key,

            iv
        );

        const encrypted =
        Buffer.concat([

            cipher.update(fileBuffer),

            cipher.final()
        ]);


        // ================= Save File =================

        const filename =

            Date.now() +

            '-' +

            req.file.originalname;


        const savePath =
        path.join(

            __dirname,

            '../uploads/',

            filename
        );


        fs.writeFileSync(

            savePath,

            encrypted
        );


        // ================= Store In DB =================

        db.query(

            `INSERT INTO documents
            (
                user_id,
                filename,
                encrypted_path,
                hash,
                signature,
                file_size
            )

            VALUES(?,?,?,?,?,?)`,

            [

                req.user.id,

                filename,

                savePath,

                hash,

                signature,

                req.file.size
            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json(err);
                }

                res.json({

                    message:
                    'Document Uploaded Securely',

                    hash,

                    signature
                });
            }
        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Upload Error'
        });
    }
};


// ================= Get Documents =================

exports.getDocuments = (

    req,

    res

) => {

    db.query(

        `SELECT
        id,
        filename,
        uploaded_at,
        file_size
        FROM documents
        WHERE user_id=?`,

        [req.user.id],

        (err, result) => {

            if (err) {

                return res
                .status(500)
                .json(err);
            }

            res.json(result);
        }
    );
};


// ================= Download =================

exports.downloadDocument = (

    req,

    res

) => {

    const id =
    req.params.id;

    db.query(

        'SELECT * FROM documents WHERE id=?',

        [id],

        (err, result) => {

            if (

                !result ||

                result.length === 0
            ) {

                return res.status(404).json({

                    message:
                    'File Not Found'
                });
            }

            try {

                const doc =
                result[0];

                const encrypted =
                fs.readFileSync(
                    doc.encrypted_path
                );

                const decipher =
                crypto.createDecipheriv(

                    algorithm,

                    key,

                    iv
                );

                const decrypted =
                Buffer.concat([

                    decipher.update(
                        encrypted
                    ),

                    decipher.final()
                ]);

                res.setHeader(

                    'Content-Disposition',

                    `attachment; filename=${doc.filename}`
                );

                res.send(decrypted);

            } catch (error) {

                console.log(
                    'Decrypt Error:',
                    error
                );

                res.status(500).json({

                    message:
                    'Failed To Decrypt File'
                });
            }
        }
    );
};


// ================= Delete =================

exports.deleteDocument = (

    req,

    res

) => {

    const id =
    req.params.id;

    db.query(

        'SELECT * FROM documents WHERE id=?',

        [id],

        (err, result) => {

            if (

                !result ||

                result.length === 0
            ) {

                return res.status(404).json({

                    message:
                    'File Not Found'
                });
            }

            const doc =
            result[0];

            fs.unlinkSync(
                doc.encrypted_path
            );

            db.query(

                'DELETE FROM documents WHERE id=?',

                [id],

                () => {

                    res.json({

                        message:
                        'Document Deleted'
                    });
                }
            );
        }
    );
};


// ================= Verify Integrity =================

exports.verifyIntegrity = (

    req,

    res

) => {

    const id =
    req.params.id;

    db.query(

        'SELECT * FROM documents WHERE id=?',

        [id],

        (err, result) => {

            try {

                const doc =
                result[0];

                const encrypted =
                fs.readFileSync(
                    doc.encrypted_path
                );

                const decipher =
                crypto.createDecipheriv(

                    algorithm,

                    key,

                    iv
                );

                const decrypted =
                Buffer.concat([

                    decipher.update(
                        encrypted
                    ),

                    decipher.final()
                ]);

                const currentHash =
                crypto
                .createHash('sha256')
                .update(decrypted)
                .digest('hex');


                const valid =
                currentHash === doc.hash;


                res.json({

                    valid,

                    originalHash:
                    doc.hash,

                    currentHash
                });

            } catch (error) {

                console.log(
                    'Verify Error:',
                    error
                );

                res.status(500).json({

                    message:
                    'File Verification Failed'
                });
            }
        }
    );
};