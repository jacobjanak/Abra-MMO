const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {expressjwt: exjwt} = require('express-jwt');
const db = require('../models');

const secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';

const isAuthenticated = exjwt({
    secret: secret,
    algorithms: ['HS256'],
});

router.post('/api/login', (req, res) => {
    const idType = req.body.id.includes('@') ? 'email' : 'username';

    db.User.findOne(idType, req.body.id, true)
        .then(user => {
            db.User.verifyPassword(user, req.body.password, (err, isMatch) => {
                if (err || !isMatch) {
                    res.status(401).json({success: false, message: 'Authentication failed. Wrong password.'})
                    return;
                }

                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    username: user.username,
                }, secret, {
                    expiresIn: 60 * 60 * 24 * 365
                });

                res.json({
                    success: true,
                    message: 'Token issued',
                    token: token,
                    user: user
                })
            })
        })
        .catch(() => res.status(404).json({success: false, message: 'User not found.'}))
})

router.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (username.length < 3) {
        res.status(400).send({
            field: "username",
            message: "Username cannot be less than 3 characters long"
        })
    } else if (username.length > 20) {
        res.status(400).send({
            field: "username",
            message: "Username cannot be more than 20 characters long"
        })
    } else if (email && email.length > 50) {
        res.status(400).send({
            field: "email",
            message: "Email cannot be more than 50 characters long"
        })
    } else if (password.length < 6) {
        res.status(400).send({
            field: "password",
            message: "Password cannot be less than 6 characters long"
        })
    } else if (password.length > 50) {
        res.status(400).send({
            field: "password",
            message: "Password cannot be more than 50 characters long"
        })
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
        res.status(400).send({
            field: "password",
            message: "Password must contain at least 1 letter, number, and symbol"
        })
    } else {
        db.User.create(req.body)
            .then(user => res.json(user))
            .catch(err => res.status(400).send({message: err}))
    }
})

router.get('/api/user/:id', isAuthenticated, (req, res) => {
    db.User.findById(req.params.id)
        .then(data => {
            if (data) {
                res.json(data)
            } else {
                res.status(404).send({success: false, message: 'No user found'})
            }
        })
        .catch(() => res.status(404).send('No user found'))
})

router.get('/user/', isAuthenticated, (req, res) => {
    db.User.findById(req.auth.id)
        .then(data => res.json(data))
        .catch(() => res.status(404).send('No user found'))
})

router.get('/user/game', isAuthenticated, (req, res) => {
    db.User.findById(req.auth.id)
        .then(user => {
            if (!user.lastGame)
                return Promise.reject();

            return db.Game.findById(user.lastGame)
        })
        .then(game => {
            res.json(game.winner ? null : game);
        })
        .catch(() => res.json(null))
})

router.get('/user/:username', (req, res) => {
    db.User.findOne('username', req.params.username)
        .then(data => res.json(data))
        .catch(() => res.status(404).send('No user found'))
})

router.get('/users/rankings/:page', (req, res) => {
    // Ignoring page for now, just show top 20
    // const page = Math.max(parseInt(req.params.page), 1);
    db.User.getRankings(1, 20)
        .then(data => res.json(data))
        .catch(() => res.json(null))
})

module.exports = router;
