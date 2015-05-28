/**
 * fis.baidu.com
 */

var pth = require('path');

function getServerInfo() {
  var conf = pth.join(fis.project.getTempPath('server'), 'conf.json');
  if (fis.util.isFile(conf)) {
    return fis.util.readJSON(conf);
  }
  return {};
}

var serverRoot = (function() {
  var key = 'FIS_SERVER_DOCUMENT_ROOT';
  var serverInfo = getServerInfo();
  if (process.env && process.env[key]) {
    var path = process.env[key];
    if (fis.util.exists(path) && !fis.util.isDir(path)) {
      fis.log.error('invalid environment variable [' + key + '] of document root [' + path + ']');
    }
    return path;
  } else if (serverInfo['root'] && fis.util.is(serverInfo['root'], 'String')) {
    return serverInfo['root'];
  } else {
    return fis.project.getTempPath('www');
  }
})();

var cwd = fis.processCWD || process.cwd();

function normalizePath(to, root) {
  if (to[0] === '.') {
    to = fis.util(cwd + '/' + to);
  } else if (/^output\b/.test(to)) {
    to = fis.util(root + '/' + to);
  } else if (to === 'preview') {
    to = serverRoot;
  } else {
    to = fis.util(to);
  }
  return to;
}

function deliver(output, release, content, file) {
  if (!release) {
    fis.log.error('unable to get release path of file[' + file.realpath + ']: Maybe this file is neither in current project or releasable');
  }
  if (fis.util.exists(output) && !fis.util.isDir(output)) {
    fis.log.error('unable to deliver file[' + file.realpath + '] to dir[' + output + ']: invalid output dir.');
  }
  var target;
  target = fis.util(output, release);
  fis.util.write(target, content);
  fis.log.debug(
    'release ' +
    file.subpath.replace(/^\//, '') +
    ' >> '.yellow.bold +
    target
  );
}

module.exports = function(options, modified, total, next) {
  var to = normalizePath(options.to || options.dest || 'preview', fis.project.getProjectPath());

  modified.forEach(function(file) {
    deliver(to, file.getHashRelease(), file.getContent(), file);
  });

  next();
};
