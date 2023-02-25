/*!
 * directory-as-set.js
 * Copyright(c) 2023 Thanhntmany
 */

'use strict';

const process = require('process');
const path = require('path');
const fs = require('fs');


/**
 * File system IO Handler (helper)
 */
var _join = path.join;
var _relative = path.relative;
var _dirname = path.dirname;
var _resolve = path.resolve;
var _mkdirSync = fs.mkdirSync;
var _rmdirSync = fs.rmdirSync;
var _readdirSync = fs.readdirSync;
var _readFileSync = fs.readFileSync;
var _writeFileSync = fs.writeFileSync;
var _existsSync = fs.existsSync;
function _tree(dirPath) {
  var out = [];

  var curPath;
  _readdirSync(dirPath, { withFileTypes: true })
    .forEach(function (dirent) {

      curPath = _join(dirPath, dirent.name)
      out.push(curPath);

      if (dirent.isDirectory()) out = out.concat(_tree(curPath))
    });

  return out;
};

const FSHandler = {
  tree: function (dirPath) {
    return _existsSync(dirPath) ? _tree(dirPath) : [];
  },

  massJoin: function (fromPath, toPaths) {
    return toPaths.map(function (filePath) {
      return _join(fromPath, filePath);
    });
  },

  massRelative: function (fromPath, toPaths) {
    return toPaths.map(function (filePath) {
      return _relative(fromPath, filePath);
    });
  },

  treeDir: function (dirPath, relativePath) {
    return this.massRelative(dirPath, this.tree(_join(dirPath, relativePath || ".")))
  },

  getIntersectionOf2Dir: function (baseDir, partnerDir, relativePath) {
    return RPSet.fromArray(this.treeDir(baseDir, relativePath))
      .inter(RPSet.fromArray(this.treeDir(partnerDir, relativePath)));
  },

  findFileInAncestor: function (findPath, dirPath) {
    if (dirPath === undefined) dirPath = process.cwd();
    dirPath = _resolve(dirPath);
    var p, _dirPath;

    do {
      p = _join(dirPath, findPath);
      if (_existsSync(p)) return dirPath;

      _dirPath = dirPath;
      dirPath = _dirname(dirPath);
    }
    while (dirPath !== _dirPath)

    return null;
  },

  ifDirContains: function (dir, toPath) {
    const relative = path.relative(dir, toPath);
    return relative === "" || relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  }

};


/**
 * Arrary as set Helper
 */
const ArrayAsSetHelper = {
  select: function () {
    var arr = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
      if (!arr.includes(arguments[i])) arr.push(arguments[i])
    };
    return arr;
  },

  deselect: function () {
    var arr = arguments[0], idx;
    for (var i = 1, l = arguments.length; i < l; i++)
      if ((idx = list.indexOf(arguments[i])) >= 0) arr.splice(idx, 1);
    return arr;
  },

  join: function () {
    var arr = arguments[0], l = arguments.length;
    if (l < 2) return (arr || []).slice();

    for (var i = 1; i < l; i++)
      arr = arr.concat(
        Array.from(arguments[i]).filter(function (el) {
          return !arr.includes(el);
        }));
    return arr
  },

  filterOut: function (arr1, arr2) {
    return arr1.filter(function (el) {
      return arr2.includes(el)
    })
  },

  inter: function (arr1, arr2) {
    return arr1.filter(function (el) {
      arr2.includes(el)
    })
  },

};
const ArrASet = ArrayAsSetHelper;

/**
 * Relative Path Set
 */
// function RPSet(data) {
//   this.list = Array.isArray(data)
//     ? data
//     : data instanceof this.constructor
//       ? data.list
//       : [];
// };
// const RPSet_proto = RPSet.prototype;

// RPSet_proto.toJSON = function () {
//   return this.list;
// };
// RPSet_proto.toString = function () {
//   return this.list.join("\n")
// };


// RPSet_proto.toArray = function () {
//   return this.set;
// };

// RPSet_proto.clone = function () {
//   return new this.constructor(this.list.slice());
// };

// RPSet_proto.has = function (rPath) {
//   return this.list.includes(rPath);
// };

// RPSet_proto.selectOne = function (inputString) {
//   if (!_list.includes(inputString)) _list.push(inputString);
// };

// RPSet_proto.select = function () {
//   for (var i = 0, l = arguments.length; i < l; i++)
//     this.selectOne(arguments[i]);
//   return this;
// };

// RPSet_proto.deselectOne = function (inputString) {
//   var idx = this.list.indexOf(inputString);
//   if (idx >= 0) this.list.splice(idx, 1);
// };

// RPSet_proto.deselect = function (rpSet) {
//   for (var i = 0, l = arguments.length; i < l; i++)
//     this.deselectOne(arguments[i]);
//   return this;
// };

// RPSet_proto.join = function (rpSet) {
//   if (rpSet instanceof this.constructor) rpSet = rpSet.list;
//   var _list = this.list;

//   return new this.constructor(
//     _list.concat(rpSet.filter(function (p) { return !_list.includes(p) }, this)));
// };

// RPSet_proto.inter = function (rpSet) {
//   var bList = this.list,
//     pList = rpSet instanceof this.constructor ? rpSet.list : rpSet;
//   return new this.constructor(
//     pList.filter(function (p) { return bList.includes(p) })
//   );
// };

// RPSet_proto.filter = function (rpSet) {
//   var bList = this.list,
//     pList = rpSet instanceof this.constructor ? rpSet.list : rpSet;
//   return new this.constructor(
//     bList.filter(function (p) { return bList.includes(p) })
//   );
// };

// RPSet_proto.filterMatchRegex = function (pattern, flags) {
//   if (!flags) flags = 'g';
//   var regex = new RegExp(pattern, flags);
//   for (var rPath in this.set) {
//     if (!rPath.match(regex)) this.deselectOne(rPath);
//   };
//   return this;
// };

// RPSet_proto.filterNotMatchRegex = function (pattern, flags) {
//   if (!flags) flags = 'g';
//   var regex = new RegExp(pattern, flags);
//   for (var rPath in this.set) {
//     if (rPath.match(regex)) this.deselectOne(rPath);
//   };
//   return this;
// };

// RPSet_proto.filterInRPath = function (relativePath) {
//   for (var rPath in this.set) {
//     if (!FSHandler.ifDirContains(relativePath, rPath)) this.deselectOne(rPath);
//   };
//   return this;
// };

// RPSet_proto.clear = function () {
//   this.set = {};
//   return this;
// };

// RPSet.fromArray = function (arr) {
//   return new this(arr);
// }


/**
 * DASdirectory
 */
function DASdirectory(uriToDirectory) {
  if (!uriToDirectory) uriToDirectory = process.cwd();
  // #TODO:
  uriToDirectory = _resolve(uriToDirectory);
  this.uri = uriToDirectory;
  this.type = 'directory-as-set';
  this.path = path.resolve(uriToDirectory);
};
const DASdirectory_proto = DASdirectory.prototype;
DASdirectory_proto.toJSON = function () {
  return this.uri;
};
DASdirectory_proto.toString = function () {
  return this.path;
};

DASdirectory_proto.ls = function (relativePath) {
  return RPSet.fromArray(_readdirSync(_join(this.path, relativePath || ".")));
};

DASdirectory_proto.treeDir = function (relativePath) {
  return RPSet.fromArray(FSHandler.treeDir(this.path, relativePath));
};

DASdirectory_proto.inter = function (partnerPath, relativePath) {
  return FSHandler.getIntersectionOf2Dir(this.path, partnerPath, relativePath || ".");
};


/**
 * DASApp
 */
function DASApp(data) {
  if (data === undefined) data = {};

  this.isDryrun = data.isDryrun || false;
  this.anchorDir = data.anchorDir || null;

  this.selectedSet = new RPSet(data.selectedSet);
  this.stashSet = {};
  if (data.stashSet) {
    for (var key in data.stashSet)
      data.stashSet[key] = new RPSet(data.stashSet[key]);
    this.stashSet = data.stashSet;
  };

  this.alias = data.alias || {};
  this.setBase(data.base); // this.base = new DASdirectory(data.base);
  this.setPartner(data.partner); // this.partner = new DASdirectory(data.partner);

  this.relativePath = null;
};
const DASApp_proto = DASApp.prototype;

DASApp_proto.toJSON = function () {
  return {
    isDryrun: this.isDryrun,
    anchorDir: this.anchorDir,

    selectedSet: this.selectedSet.toJSON(),
    stashSet: Object.fromEntries(Object.entries(this.stashSet)
      .map(function (s) { return [s[0], s[1].toJSON()] })
    ),

    alias: this.alias,
    base: this.base.toJSON(),
    partner: this.partner.toJSON(),
  };
};

DASApp_proto.toString = function () {
  return JSON.stringify(this, null, 4);
};

// State handling
DASApp_proto.ANCHOR = ".das";
DASApp_proto.STATEFILE = "state.json";

DASApp_proto.findAnchor = function (dirPath) {
  return this.anchorDir = FSHandler.findFileInAncestor(this.ANCHOR, dirPath || process.cwd()) || process.cwd();
};

DASApp_proto.getStateFilePath = function (anchorDir) {
  return _join(anchorDir || this.anchorDir, this.ANCHOR, this.STATEFILE);
};

DASApp_proto.init = function () {
  this.anchorDir = process.cwd();
  var stateFile = this.getStateFilePath(this.anchorDir);
  _mkdirSync(_dirname(stateFile), { recursive: true });
  return this;
};

DASApp_proto.clean = function () {
  var stateFile = this.getStateFilePath(this.anchorDir);
  _rmdirSync(_dirname(stateFile), { force: true, recursive: true });
  return this;
};

DASApp_proto.loadState = function (anchorDir) {
  if (!anchorDir) anchorDir = this.findAnchor();
  if (!_existsSync(anchorDir)) return process.cwd();

  var stateFile = this.getStateFilePath(anchorDir);
  if (!_existsSync(stateFile)) return;

  var data = JSON.parse(_readFileSync(stateFile, 'utf8'));

  data.alias = Object.fromEntries(Object.entries(data.alias).map(function (alia) {
    alia[1] = _join(anchorDir, alia[1]);
    return alia;
  }));

  data.anchorDir = anchorDir;
  data.base = _join(anchorDir, data.base);
  data.partner = _join(anchorDir, data.partner);

  var cwd = process.cwd();
  if (!FSHandler.ifDirContains(data.base, cwd)) {

    var curBasePath = Object.values(data.alias)
      .find(function (dirPath) { return FSHandler.ifDirContains(dirPath, cwd) });

    if (curBasePath) {
      if (curBasePath == data.partner) data.partner = data.base;
      data.base = curBasePath;
    };

  };

  this.constructor.call(this, data);

  this.relativePath = _relative(this.base.path, process.cwd());
};

DASApp_proto.xxx = function () {
  console.log("base:", this.base.path);
  console.log("relativePath:", this.relativePath);
  return this;
};

DASApp_proto.saveState = function (anchorDir) {
  if (anchorDir !== undefined) this.anchorDir = anchorDir;
  if (!this.anchorDir) return;

  var stateFile = this.getStateFilePath(anchorDir);

  var data = this.toJSON();
  data.base = _relative(data.anchorDir, data.base);
  data.partner = _relative(data.anchorDir, data.partner);

  for (var ali in data.alias) {
    data.alias[ali] = _relative(data.anchorDir, data.alias[ali]);
  };

  delete data.anchorDir;
  if (_existsSync(_dirname(stateFile))) _writeFileSync(stateFile, JSON.stringify(data, null, 4));
};

DASApp_proto.showState = function () {
  var out = '';

  out += "Anchor Directory : " + this.anchorDir + path.sep + "\n";

  out += "Alias :\n";
  var pad = Math.max.apply(null, Object.keys(this.alias).map(function (a) { return a.length }));
  for (var alia in this.alias) {
    out += "  (" + alia.padEnd(pad, " ") + ") " + _relative(this.anchorDir, this.alias[alia]) + path.sep + "\n";
  };
  out += "\n";

  out += "Base      : (" + this.getAliasOf(this.base.path) + ") " + _relative(this.anchorDir, this.base.path) + path.sep + "\n";
  out += "⑅ Partner : (" + this.getAliasOf(this.partner.path) + ") " + _relative(this.anchorDir, this.partner.path) + path.sep + "\n";
  out += "\n";

  if (this.relativePath === null) return out;
  var selectedArray = this.selectedSet.toArray();
  var cwd = _join(this.base.path, this.relativePath);

  var selectedInCurDirArray = selectedArray
    .map(function (rPath) { return _join(this.base.path, rPath) }, this)
    .filter(function (rPath) { return FSHandler.ifDirContains(cwd, rPath) });

  out += "Selected  : " + selectedArray.length + "\n";
  out += "[ " + (selectedArray.length - selectedInCurDirArray.length) + " ] : ...\n";
  out += "[ " + selectedInCurDirArray.length + " ] : " + this.relativePath + path.sep + "\n";

  out += selectedInCurDirArray
    .map(function (rPath) { return _relative(cwd, rPath) })
    .map(function (p) { return "  - " + p })
    .join("\n");

  var baseOwnSection = this.getBaseOwnSection(this.relativePath);
  var partnerOwnSection = this.getPartnerOwnSection(this.relativePath);
  var lsSet = new RPSet(this.selectedSet).filterInRPath(this.relativePath)
    .join(baseOwnSection)
    .join(partnerOwnSection);

  console.log(lsSet);

  return out;
};

// Base
DASApp_proto.setBase = function (inputString) {
  this.base = new DASdirectory(this.realia(inputString));
  return this.base;
};

DASApp_proto.getBase = function (inputString) {
  return this.base;
};

// Partner
DASApp_proto.setPartner = function (inputString) {
  this.partner = new DASdirectory(this.realia(inputString));
  return this.partner;
};

DASApp_proto.getPartner = function (inputString) {
  return this.partner;
};

// Partner Alias
DASApp_proto.setAlias = function (inputString) {
  return this.alias[inputString] = this.partner.uri;
};

DASApp_proto.realia = function (inputString) {
  return this.alias.hasOwnProperty(inputString)
    ? this.alias[inputString]
    : inputString;
};

DASApp_proto.getAliasOf = function (targetPath) {
  if (targetPath === undefined) targetPath = process.cwd();

  for (var alia in this.alias)
    if (FSHandler.ifDirContains(this.alias[alia], targetPath)) return alia;

  return "";
};

DASApp_proto.clearAlias = function () {
  this.alias = {};
};


// Intersection Sections operations 
DASApp_proto.getBaseOwnSection = function (relativePath) {
  return this.base.treeDir(relativePath || this.relativePath);
};

DASApp_proto.getPartnerOwnSection = function (relativePath) {
  return this.partner.treeDir(relativePath || this.relativePath);
};

DASApp_proto.getBaseSection = function (relativePath) {
  return this.base.treeDir(relativePath || this.relativePath)
    .filter(this.partner.treeDir(relativePath || this.relativePath));
};

DASApp_proto.getInterSection = function (relativePath) {
  return this.base
    .inter(this.partner.path, relativePath || this.relativePath);
};

DASApp_proto.getPartnerSection = function (relativePath) {
  return this.partner.treeDir(relativePath || this.relativePath)
    .filter(this.base.treeDir(relativePath || this.relativePath));
};

// Selection
DASApp_proto.select = function () {
  var rPaths = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    rPaths.push(_join(this.relativePath, arguments[i]))
  };

  var _set = this.selectedSet;
  return _set.select.apply(_set, rPaths);
};
DASApp_proto.select.expectedLength = -1;

DASApp_proto.selectSet = function (rpSet) {
  return this.selectedSet.join(rpSet)
};

DASApp_proto.selectBase = function () {
  return this.selectSet(this.getBaseSection());
};

DASApp_proto.selectInter = function () {
  return this.selectSet(this.getInterSection());
};

DASApp_proto.selectPartner = function () {
  return this.selectSet(this.getPartnerSection());
};

DASApp_proto.selectRegex = function (pattern, flags) {
  console.log("pattern:", pattern);
  return this.selectedSet.filterMatchRegex(pattern, flags);
};

DASApp_proto.deselect = function () {
  var rPaths = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    rPaths.push(_join(this.relativePath, arguments[i]))
  };

  var _set = this.selectedSet;
  return _set.deselect.apply(_set, rPaths);
};
DASApp_proto.deselect.expectedLength = -1;

DASApp_proto.deselectSet = function (rpSet) {
  return this.selectedSet.filter(rpSet)
};

DASApp_proto.deselectBase = function () {
  return this.deselectSet(this.getBaseSection());
};

DASApp_proto.deselectInter = function () {
  return this.deselectSet(this.getInterSection());
};

DASApp_proto.deselectPartner = function () {
  return this.deselectSet(this.getPartnerSection());
};

DASApp_proto.deselectRegex = function (pattern, flags) {
  return this.selectedSet.filterNotMatchRegex(pattern, flags);
};

DASApp_proto.getSelectedSet = function () {
  return this.selectedSet;
};

DASApp_proto.clearSelectedSet = function () {
  return this.selectedSet.clear();
};

DASApp_proto.stashSelectedSet = function (key) {
  if (key === undefined) key = Object.keys(this.stashSet).length;
  this.stashSet[key] = Object.assign({}, this.selectedSet);
  return key
};

DASApp_proto.unstashSelectedSet = function (key) {
  this.selectedSet = this.stashSet[key];
  delete this.stashSet[key];
};

DASApp_proto.clearStashSet = function () {
  this.stashSet = {};
};

// Operating with selected set of relative-path
//#TODO:
DASApp_proto.copyFrom = function (key) {

};

//#TODO:
DASApp_proto.copyTo = function (key) {
};

//#TODO:
DASApp_proto.moveFrom = function (key) {
};

//#TODO:
DASApp_proto.moveTo = function (key) {
};

//#TODO:
DASApp_proto.remove = function (key) {
};

//#TODO:
DASApp_proto.removeAt = function (key) {
};

//#TODO:
DASApp_proto.touch = function (key) {
};

//#TODO:
DASApp_proto.touchAt = function (key) {
};

DASApp_proto.nop = function (key) {
  // Do nothing
};

DASApp_proto.setDryrunMode = function (isDryrun) {
  this.isDryrun = (isDryrun.toLowerCase() === "on");
};

//#TODO:
DASApp_proto.complete = function () {
};


/**
 * DASCmdRunner - Executing commandline 
 */

DASApp_proto.cmd = function (args) {
  return new DASCmdRunner(this, args);
};

DASApp_proto.exec = function (args) {
  return this.cmd(args).exec();
};

function DASCmdRunner(app, args) {
  this.app = app;
  this.restArgs = args;
  this.curCmdName = null;
  this.queue = [];
  this.lastOutput = null;
};
const DASCmdRunner_proto = DASCmdRunner.prototype;

/* DASApp command alias */
DASCmdRunner_proto.cmdAlias = {
  "constructor": "nop",
  "cmd": "nop",
  "cmdAlias": "nop",
  "getCmd": "nop",
  "exec": "nop",

  "a": "setAlias",
  "ra": "realia",
  "cas": "clearAlias",

  "b": "setBase",
  "base": "setBase",
  "gb": "getBase",
  "p": "setPartner",
  "partner": "setPartner",
  "gp": "getPartner",

  "s": "select",
  "s-": "select",
  "sb": "selectBase",
  "si": "selectInter",
  "sio": "selectInterOlder",
  "sin": "selectInterNewer",
  "sp": "selectPartner",
  "sr": "selectRegex",

  "d": "deselect",
  "d-": "deselect",
  "db": "deselectBase",
  "di": "deselectInter",
  "dio": "deselectInterOlder",
  "din": "deselectInterNewer",
  "dp": "deselectPartner",
  "dr": "deselectRegex",

  "ls": "getSelectedSet",
  "cls": "clearSelectedSet",

  "cpf": "copyFrom",
  "cpt": "copyTo",
  "mvf": "moveFrom",
  "mvr": "moveTo",
  "rmf": "remove",
  "rmt": "removeAt",
  "tof": "touch",
  "tot": "touchAt",

  "older": "selectInterOlder",
  "newer": "selectInterNewer",

  "state": "showState",
  "status": "showState",

  "pull": "copyFrom",
  "push": "copyTo",
  "take": "moveFrom",
  "give": "moveTo",
  "dryrun": "setDryrunMode",

  "stash": "stashSelectedSet",
  "unstash": "unstashSelectedSet",
  "clearstash": "clearStashSet",
  "clss": "clearStashSet",
};

DASCmdRunner_proto.cmdParsersMap = {

};

// Helper
function camelize(str) {
  return str.toLowerCase().replace(/(\-\w)/g, function () {
    return arguments[arguments.length - 3].replace("-", "").toUpperCase();
  });
};

DASCmdRunner_proto.normalizeCmd = function (cmd) {
  cmd = camelize(cmd);
  if (cmd.toLowerCase() in this.cmdAlias) cmd = this.cmdAlias[cmd.toLowerCase()];
  if (cmd in this.app && this.app[cmd] instanceof Function) return cmd;

  // #TODO: Adress undefined command here
  return "nop";
};

DASCmdRunner_proto.nextArg = function () {
  return this.restArgs.shift();
};

DASCmdRunner_proto.giveBackArg = function () {
  var _ = this.restArgs;
  return _.unshift.apply(_, arguments);
};

DASCmdRunner_proto.getCmdMaxNoParams = function (cmd) {
  var fn = this.app[cmd]
  if (typeof fn === 'function') {
    return fn.expectedLength !== undefined
      ? fn.expectedLength
      : fn.length;
  };

  return 0;
};

DASCmdRunner_proto.parseNext = function (maxNoParams) {

  var args = [], arg;
  if (maxNoParams < 0) {
    while ((arg = this.nextArg()) !== undefined && arg !== "--")
      args.push(arg);
  }
  else if (maxNoParams > 0) {
    while (args.length < maxNoParams && (arg = this.nextArg()) !== undefined && arg !== "--")
      args.push(arg);
  };

  this.queue.push({
    cmd: this.curCmdName,
    args: args,
  });

};

DASCmdRunner_proto.parse = function () {
  var cmdName, parseType;
  while ((cmdName = this.nextArg()) !== undefined) {
    if (cmdName === "--") continue;

    this.curCmdName = this.normalizeCmd(cmdName);
    this.parseNext(this.getCmdMaxNoParams(this.curCmdName));
  };

};

DASCmdRunner_proto.exec = function () {
  this.parse();

  var app = this.app, queue = this.queue, curCmd;
  while ((curCmd = queue.shift()) !== undefined) {
    this.lastOutput = app[curCmd.cmd].apply(app, curCmd.args)
  };

  return this.lastOutput;
};

/**
 * Expose `createApp()` + Core classes
 */
function createApp() {
  return new DASApp();
};

exports = module.exports = DASApp;
exports.createApp = createApp;
exports.DASApp = DASApp;
exports.DASdirectory = DASdirectory;
exports.FSHandler = FSHandler;


/**
 * Run module as an independent application.
 */
// Check if this module is being run directly or without entry script.
if (require.main === module || require.main === undefined || require.main.id === '.') {
  var args = process.argv.slice(2);

  const app = createApp();
  app.loadState();

  if (args.length === 0) args.push("status");
  var out = app.cmd(args).exec();
  console.log(
    out
      ? (
        out.toString
          ? out.toString()
          : out.toJSON
            ? out.toJSON()
            : out
      )
      : out
  );

  if (app.anchorDir) app.saveState();
};
