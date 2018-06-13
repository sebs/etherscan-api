
prpl = require('prpl-server');
express = require('express');

const app = express();

app.get('/api/launch', (req, res, next) => res.send('boom'));

app.get('/*', prpl.makeHandler('./build/', {
  builds: [
    {name: 'modern', browserCapabilities: ['es2015', 'push']},
    {name: 'fallback'},
  ],
}));

app.listen(8080);