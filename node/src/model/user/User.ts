/**
 * User Class
 */

import { logD } from '../../commons/util/logger';
const p = logD(__filename);

export class User {
  private name: string;
  private email: string;
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
