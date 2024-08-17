const express = require ('express');
const {
    newUser,
    loginUser,
    allUsers,
    userProfile,
    updateAcessLevel,
} = require('../service/userService');
const jwt = require('jsonwebtoken');
const jwt_secret = 'senhalegal'
const router = express.Router();

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers ['authorization'];
    const token = authHeader && authHeader.split (' ') [1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post ('/register', async (req,res) =>{
    try{
        const user = await newUser(req.body);
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/login', async (req, res) =>{
    try{
        const {user, token} = await loginUser (req.body.email, req.body.password);
        res.status(200).json({ user,token});
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await userProfile(req.headers['authorization'].split(' ')[1]);
        res.status(200).json(user);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});

router.get('/all', authenticateToken, async (req,res) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];
        const users = await allUsers(token);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put ('/newAcessLevel/:id', authenticateToken, async(req,res) => {
    try {
        const token = req.headers.authorization.split (' ') [1];
        const userId = req.params.id;
        const{newAcessLevel} = req.body;
        const updatedUser = await updateAcessLevel(token, userId, newAcessLevel);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
})

module.exports = router;
