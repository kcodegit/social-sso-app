import express from 'express';
import { googleUrl, getUserInfoFromCode } from '../drivers/google/googleApi';
const router = express.Router();
const p = console.log;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login', googleUrl: googleUrl() });
});

/**
 * this is for the google sso button ajax data
 */
router.post('/tokensignin', function(req, res, next) {
  const token = req.body.idtoken;
  if (token) {
    p('token', token);
    res.send('token passed!!');
  } else {
    res.send('no token');
  }
});

/**
 * this is for the google sso callback
 */
router.get('/google-callback', function(req, res, next) {
  if (req.query.code) {
    try {
      getUserInfoFromCode(req.query.code).then(info => res.json(info));
    } catch (e) {
      p(e);
    }
  } else {
    res.send('no code returned');
  }
});

module.exports = router;
