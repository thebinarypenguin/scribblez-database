'use strict';

const config = {
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'scribblez',
    password : 'scribblez',
    database : 'scribblez',
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seed_data',
  },
};

module.exports = config;
