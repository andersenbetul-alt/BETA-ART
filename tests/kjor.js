/* Testkjører: starter en lokal statisk server, kjører enhetstester og
   nettlesertester, og avslutter med riktig exit-kode.

   Bruk:
     node tests/kjor.js                 alle tester
     node tests/kjor.js --bare-enhet    hopp over nettlesertestene */

var http = require('http');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var ROT = path.join(__dirname, '..');
var START_PORT = Number(process.env.PP_PORT || 8765);
var MAKS_PORTFORSOK = 10;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8'
};

function lagServer() {
  return http.createServer(function (req, res) {
    var relativ = decodeURIComponent(req.url.split('?')[0]);
    if (relativ === '/') relativ = '/index.html';

    var fil = path.join(ROT, path.normalize(relativ));
    if (fil.indexOf(ROT) !== 0) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    fs.readFile(fil, function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fil)] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

/* Er porten opptatt, prøv de neste. En glemt server fra en tidligere kjøring
   skal ikke stoppe testene. */
function start(port, forsokIgjen) {
  return new Promise(function (resolve, reject) {
    var server = lagServer();
    server.once('error', function (err) {
      if (err.code === 'EADDRINUSE' && forsokIgjen > 0) {
        resolve(start(port + 1, forsokIgjen - 1));
      } else {
        reject(err);
      }
    });
    server.listen(port, function () { resolve(server); });
  });
}

function kjor(fil, port) {
  return new Promise(function (resolve) {
    var p = spawn(process.execPath, [path.join(__dirname, fil)], {
      stdio: 'inherit',
      env: Object.assign({}, process.env, { PP_BASE: 'http://localhost:' + port + '/' })
    });
    p.on('close', function (kode) { resolve(kode || 0); });
  });
}

(function () {
  var bareEnhet = process.argv.indexOf('--bare-enhet') !== -1;
  var server = null;
  var kodeEnhet = 0;
  var kodeE2E = 0;

  kjor('enhet.test.js', START_PORT)
    .then(function (kode) {
      kodeEnhet = kode;
      if (bareEnhet) return null;
      return start(START_PORT, MAKS_PORTFORSOK);
    })
    .then(function (s) {
      if (!s) return 0;
      server = s;
      var port = server.address().port;
      console.log('\nLokal server på http://localhost:' + port + '\n');
      return kjor('e2e.test.js', port);
    })
    .then(function (kode) {
      kodeE2E = kode;
    })
    .catch(function (e) {
      console.error('\nTestkjøringen stoppet: ' + e.message);
      kodeE2E = 1;
    })
    .then(function () {
      if (server) server.close();
      var kode = kodeEnhet || kodeE2E;
      console.log('\n' + (kode === 0 ? 'Alle tester bestått.' : 'Testkjøringen feilet.'));
      process.exit(kode);
    });
})();
