import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config';

const { jwtSecret } = config;

const authenticate = (req, res, next) => {
    const token = req.headers.authorization || '';
    jsonwebtoken.verify(token, jwtSecret, (error, decoded) => {
        if (error) {
            console.log('token varified failed')
            next({
                code: 401,
                message: 'Unauthorized'
            });
        } else {
            const { expiredAt } = decoded;
            if (expiredAt > new Date().getTime()) {
                next();
            } else {
                next({
                    code: 401,
                    message: 'Unauthorized'
                });
            }
        }
    });
};

const authError = (err, req, res, next) => {
    const result = {
        code: err.code,
        message: err.message
    }
    res.json(result);
};
export { authenticate, authError };