import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import config from '../../config/config';
import User from '../models/user.model';

function loginRequest(req, res, next) {
  User.findOne({ username: req.body.username }, (errFind, result) => {
    if (errFind) {
      return res.json({
        code: -1,
        Message: errFind.message,
        login: false
      })
    } else if (result === null) {
      return res.json({
        code: -2,
        Message: 'User or password not found',
        login: false
      })
    } else {
      const password = req.body.password;
      result.comparePassword(password, (errCompare, isMatch) => {
        if (errCompare) {
          return res.json({
            code: -3,
            Message: errCompare.message
          })
        } else if (isMatch) {
          const expiredAfter = config.expiredAfter
          let token = jwt.sign({
            userId: result._id,
            username: result.username,
            expiredAt: new Date().getTime() + expiredAfter,
          }, config.jwtSecret);
          return res.json({
            token,
            username: result.username,
            login: true,
            TFA: result.isTwoFA
          });
        } else {
          return res.json({
            code: -4,
            login: false,
            Message: 'User or password not found'
          });
        }
      });
    }
  });
}

function verifyTFA(req, res, next) {
  User.findOne({ tokenLogin: req.body.token }, (errFind, result) => {
    if (errFind) {
      return res.json({
        code: -1,
        Message: errFind.message
      })
    } else if (result === null) {
      return res.json({
        code: -2,
        Message: 'Login request not found'
      })
    } else {
      const verified = speakeasy.totp.verify({
        secret: result.secret,
        encoding: 'base32',
        token: req.body.code
      });
      if (verified) {
        result.tokenLogin = null;
        result.save()
          .then()
          .catch(e => next(e));
      }
      return res.json({
        confirmTFA: verified
      });
    }
  });
}


export default { loginRequest, verifyTFA };