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
const logD: Function = (filename: string) => debug('debug:' + filename.split('/').pop());

export { log, logE, logD };
