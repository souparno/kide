const fs = require("fs");

const nginx = require('./nginx');

module.exports = [{
  method: "GET",
  path: "/{path*}",
  config: {
    handler: {
      directory: {
        path: __dirname + "/../dist/kide"
      }
    }
  }
}, {
  method: "GET",
  path: "/settings",
  handler: (request, reply) => {
    fs.readFile(__dirname + '/settings.json', (err, data) => {
      if (err) return reply({
        port: null,
        remeberPort: false
      });
      return reply(JSON.parse(data))
    });
  }
}, {
  method: "POST",
  path: "/settings",
  handler: (request, reply) => {
    fs.writeFile(__dirname + '/settings.json', JSON.stringify(request.payload), err => {
      if (err) return reply(err);
      nginx.setPort(request.payload.port, err => {
        reply({
          status: 'saved'
        });
      });
    });
  }
}];
