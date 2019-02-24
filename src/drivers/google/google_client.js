import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import config from "config";
const userinfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";

const CONF = {
  clientId: config.google.client_id,
  clientSecret: config.google.client_secret,
  redirect: config.google.redirect_uri
};

const scope = ["https://www.googleapis.com/auth/plus.me", "https://www.googleapis.com/auth/userinfo.email"];
/** PRIVATE **/

/**
 * returns the OAuth2 Client
 * @return { OAuth2Client }
 */
function getClient() {
  return new OAuth2Client(CONF.clientId, CONF.clientSecret, CONF.redirect);
}

/**
 * returns the auth url
 * @param { OAuth2Client } client
 * @return { string }
 */
function getAuthUrl(client) {
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scope
  });
}

function getGooglePlusApi(client) {
  return google.plus({ version: "v1", client });
}

/** PUBLIC **/

/**
 * returns the auth url
 * @return { string }
 */
function googleUrl() {
  return getAuthUrl(getClient());
}

/**
 * get user data
 * @param { string }
 * @return { Object }
 */
async function getUserInfoFromCode(code) {
  const client = getClient();
  const data = await client.getToken(code);
  client.setCredentials(data.tokens);
  const plus = getGooglePlusApi(client);
  const me = await plus.people.get({ userId: "me" });
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    access_token: data.tokens.access_token,
    id: userGoogleId,
    email: userGoogleEmail
  };
}

export { googleUrl, getUserInfoFromCode };
