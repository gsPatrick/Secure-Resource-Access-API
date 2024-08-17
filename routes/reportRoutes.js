const express = require ('express');
const {
    newReport,
    allReports,
    reportById,
    updateReport,
    deleteReport,
} = require ('../service/reportService')
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_secret = 'senhalegal'

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

router.post('/newReport', authenticateToken, async (req,res) => {
    try {
        const report = await newReport(req.body, req.headers['authorization'].split(' ')[1]);
         res.status(201).json(report)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get ('/all',authenticateToken, async (req,res) => {
    try {
        const reports = await allReports(req.headers['authorization'].split(' ')[1]); 
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get ('/:id',authenticateToken, async (req,res) => {
    try{
        const report = await reportById(req.headers['authorization'].split(' ')[1], req.params.id);
        res.status(200).json(report);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
})

router.put('/update/:id',authenticateToken, async (req,res)=> {
    try {
        const updatedReport = await updateReport(req.params.id, req.body, req.headers['authorization'].split(' ')[1]); 
        res.status(200).json(updatedReport); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:id',authenticateToken, async (req,res) => {
    try {
        await deleteReport(req.params.id, req.headers['authorization'].split(' ')[1]); 
        res.status(200).json({ message: 'Relatório deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;