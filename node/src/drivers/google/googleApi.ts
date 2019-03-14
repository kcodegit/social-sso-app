/**
 * Goolgle APIs Auth Module
 * reference: https://googleapis.github.io/google-auth-library-nodejs/
 * github: https://github.com/googleapis/google-auth-library-nodejs
 */
import { OAuth2Client } from 'google-auth-library';
import { ConfigSchema } from '../../config/ConfigSchema';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
const config: ConfigSchema = require('config');
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
function getOAuth2Client(): OAuth2Client {
  return new OAuth2Client(config.google.clientId, config.google.clientSecret, config.google.redirectUri);
}

/**
 * get the url for sign-in link
 * @param { OAuth2Client } client
 * @return { string }
 */
function getConnectionUrl(client: OAuth2Client): string {
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scope,
  });
}

/** PUBLIC **/
/**
 * @return { string }
 */
function googleUrl(): string {
  return getConnectionUrl(getOAuth2Client());
}

/**
 * get selected fields of userinfo
 * @param { string } code
 * @return { object }
 */
async function getUserInfoFromCode(code: string): Promise<Object> {
  const client = getOAuth2Client();
  const data: GetTokenResponse = await client.getToken(code);
  client.setCredentials(data.tokens);
  const userinfo: GoogleDataResponse = await client.request({ url: infoUrl });
  // p('userinfo', JSON.stringify(userinfo, null, 2));

  return {
    uuid: userinfo.data.id,
    email: userinfo.data.email,
    accessToken: data.tokens.access_token,
  };
}

/**
 * fetch the fresh info with token
 * @param { string } token
 */
async function getUserInfoWithAccessToken(token: string): Promise<Object> {
  const client = getOAuth2Client();
  client.setCredentials({ access_token: token });
  const userinfo: GoogleDataResponse = await client.request({ url: infoUrl });
  // p('userinfo', JSON.stringify(userinfo, null, 2));

  return {
    uuid: userinfo.data.id,
    email: userinfo.data.email,
    accessToken: token,
  };
}

/**
 * fetch the fresh info with token
 * @param { string } token
 */
async function verifyIdToken(token: string): Promise<string | null> {
  let id: string | null = null;
  try {
    const client = getOAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();
    // p('payload', JSON.stringify(payload, null, 2));

    id = payload ? payload.sub : null;
  } catch (e) {
    p(e);
  } finally {
    return id;
  }
}

type GoogleDataResponse = { data: { id: string; email: string } };

export { googleUrl, getUserInfoFromCode, getUserInfoWithAccessToken, verifyIdToken };
