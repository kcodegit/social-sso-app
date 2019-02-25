/**
 * Goolgle APIs Auth Module
 * reference: https://googleapis.github.io/google-auth-library-nodejs/
 * github: https://github.com/googleapis/google-auth-library-nodejs

 */
import { OAuth2Client } from 'google-auth-library';
import config from 'config';
const p = console.log;
/** APIs Explorer for OAuth2 v1: https://developers.google.com/apis-explorer/#p/oauth2/v1/ **/
const infoUrl = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=JSON';

/**
 * information scope needed
 * reference: https://developers.google.com/identity/protocols/googlescopes
 * check: Google OAuth2 API, v2
 */
const scope = ['https://www.googleapis.com/auth/userinfo.email'];

/** PRIVATE **/
/**
 * this establishes the connection
 * @return { OAuth2Client }
 */
function getOAuth2Client() {
  return new OAuth2Client(config.google.CLIENT_ID, config.google.CLIENT_SECRET, config.google.REDIRECT);
}

/**
 * get the url for sso link
 * @param { OAuth2Client } client
 * @return { string }
 */
function getConnectionUrl(client) {
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scope
  });
}

/** PUBLIC **/
/**
 * sso url
 * @return { string }
 */
function googleUrl() {
  return getConnectionUrl(getOAuth2Client());
}

/**
 * get selected fields of userinfo
 * @param { string } code
 * @return { object }
 */
async function getUserInfoFromCode(code) {
  const client = getOAuth2Client();
  const data = await client.getToken(code);
  client.setCredentials(data.tokens);
  const userinfo = await client.request({ url: infoUrl });
  p('userinfo', JSON.stringify(userinfo, null, 2));

  return {
    uuid: userinfo.data.id,
    email: userinfo.data.email,
    access_token: data.tokens.access_token
  };
}

export default { googleUrl, getUserInfoFromCode };
