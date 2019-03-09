/**
 * log module
 */
import debug from 'debug';

// take it to stdout
const log = debug('app:log');
log.log = console.log.bind(console);

// default : stderr
const logE = debug('app:error');

// initialize with __filename
const logD = filename => debug('debug:' + filename.slice('/').pop());

export { log, logE, logD };
