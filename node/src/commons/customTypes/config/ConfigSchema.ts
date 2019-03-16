export type ConfigSchema = {
  mysql: {
    master: {
      connectionLimit: number;
      host: string;
      user: string;
      password: string;
      database: string;
      port: number;
      ssl: false;
      connectTimeout: number;
    };
  };
  server: {
    baseUri: string;
    port: number;
    key: string;
    cert: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
};
