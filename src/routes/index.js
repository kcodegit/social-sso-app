var express = require("express");
var router = express.Router();
import { googleUrl, getUserInfoFromCode } from "../drivers/google/google_client";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Login", google_url: googleUrl() });
});

/**
 * this is for the google sso button ajax data
 */
router.post("/tokensignin", function(req, res, next) {
  res.send("no code returned");
});

/**
 * this is for the google sso callback
 */
router.get("/google-callback", function(req, res, next) {
  if (req.query.code) {
    getUserInfoFromCode(req.query.code).then(info => res.json(info));
  } else {
    res.send("no code returned");
  }
});

module.exports = router;
