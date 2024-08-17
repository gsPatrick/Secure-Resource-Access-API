const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = 'senhalegal'
const User = require ('../models/User');

const newUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password,15);
        const newUser = await User.create ({
            username: userData.username,
            email : userData.email,
            password: hashedPassword,
            acessLevel : 'user'
        });
        return newUser;
    } catch (error) {
        console.log(userData)
        console.log(error)
        throw new Error("Não foi possível criar a sua conta");  
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne ({where: {email}});
        if (!user) {
            throw new Error("Usuário ou senha incorreto");
        }
    
        const isPasswordValid = await bcrypt.compare (password, user.password);
        if (!isPasswordValid) {
            throw new Error("Usuário ou senha incorreto");
        }

        const token = jwt.sign (
            {userId: user.id, username: user.username, email: user.email, acessLevel: user.acessLevel},
            jwt_secret,
            {expiresIn: 3600}
        );
        return {user,token};
    } catch (error) {
    throw new Error("Erro ao gerar token");
    }
};

const allUsers = async (token) => {
    try {
        const decoded = jwt.verify(token, jwt_secret);
        if (decoded.acessLevel === 'superAdmin') {
            throw new Error("Acesso negado");
        } 
        const allUsers = await User.findAll({
            attributes: ['id', 'username', 'email', 'acessLevel'],
        });
        return allUsers
    } catch (erro) {
        throw new Error("Não foi possível listar os usuários");
    }
};

const userProfile = async (token) => {
    try{
        const decoded = jwt.verify (token, jwt_secret);
        const user = await User.findOne ({
            where: {id: decoded.userId},
            attributes: ['id', 'username', 'email', 'acessLevel'],
        });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    } catch (error) {
        throw new Error("Token inválido ou expirado");  
    }
};

const updateAcessLevel = async (token, userId, newAcessLevel) => {
    try{
        const decoded = jwt.verify (token, jwt_secret);

        if(decoded.acessLevel !=='superAdmin') {
            throw new Error("Acesso Negado");
        }
        const targetUser = await User.findOne({ where: { id: userId } });
        if (!targetUser) {
            throw new Error("Usuário não encotrado");
        }
        targetUser.acessLevel = newAcessLevel;
        await targetUser.save();
        return { message: "Nível de acesso atualizado com sucesso", targetUser };
    } catch (error) {
        throw new Error("Não foi possível atualizar o nível de acesso: " + error.message);
    }
};

module.exports = {
    newUser,
    loginUser,
    allUsers,
    userProfile,
    updateAcessLevel,
}