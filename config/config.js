var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'webserv'
    },
    port: 3001,
    db: 'mongodb://localhost/webserv-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'webserv'
    },
    port: 3000,
    db: 'mongodb://localhost/webserv-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'webserv'
    },
    port: 3000,
    db: 'mongodb://localhost/webserv-production'
  }
};

module.exports = config[env];
