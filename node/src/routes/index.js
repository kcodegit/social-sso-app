import express from 'express';
import config from 'config';
import { googleUrl, getUserInfoFromCode, verifyIdToken } from '../drivers/google/googleApi';
import { User } from '../model/user/User';
const router = express.Router();
const p = console.log;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { clientIdUrl: config.google.clientId, title: 'Login', googleUrl: googleUrl() });
});

/**
 * this is for the google sso button ajax data
 */
router.post('/tokensignin', async (req, res, next) => {
  try {
    const idToken = req.body.idtoken;
    if (idToken) {
      const id = await verifyIdToken(idToken);
      // do something
      if (id) {
        res.send('verified!!');
      } else {
        res.send('invalid token');
      }
    } else {
      res.send('no token');
    }
  } catch (e) {
    next(e);
  }
});

/**
 * this is for the google sso callback
 */
router.get('/google-callback', async (req, res, next) => {
  try {
    const code = req.query.code;
    if (code) {
      const userinfo = await getUserInfoFromCode(req.query.code);
      // do something
      res.send('success');
    } else {
      res.send('no code returned');
    }
  } catch (e) {
    p(e);
    next(e);
  }
});

module.exports = router;
