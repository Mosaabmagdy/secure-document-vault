const db = require('../config/db');

exports.getUsers = (req, res) => {

    db.query(
        'SELECT id,name,email,role FROM users',

        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};

exports.changeRole = (req, res) => {

    const { role } = req.body;
    const userId = req.params.id;

    db.query(
        'UPDATE users SET role=? WHERE id=?',
        [role, userId],

        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Role updated'
            });
        }
    );
};