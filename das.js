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
function _tree(dirPath) {
  var out = [];

  var ls = fs.readdirSync(dirPath, { withFileTypes: true });
  var curPath;
  ls.forEach(function (dirent) {
    curPath = _join(dirPath, dirent.name)
    if (dirent.isDirectory()) {
      out.push(curPath);
      out = out.concat(_tree(curPath))
    }
    else out.push(curPath);
  });

  return out;
};

const FSHandler = {
  tree: _tree,
  massRelative: function (fromPath, toPaths) {
    return toPaths.map(function (filePath) {
      return _relative(fromPath, filePath);
    });
  },
  treeDir: function (dirPath) {
    console.log("dirPath:", dirPath)
    return this.massRelative(dirPath, this.tree(dirPath))
  }
};


/**
 * Relative Path Set
 */
function RPSet() {
  this.set = {};
};
const RPSet_proto = RPSet.prototype;

RPSet_proto.selectOne = function (inputString) {
  this.set[inputString] = "smt";
};

RPSet_proto.deselectOne = function (inputString) {
  delete this.set[inputString];
};

RPSet_proto.select = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    this.selectOne(arguments[i]);
  };

};

RPSet_proto.deselect = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    this.deselectOne(arguments[i]);
  };
};

RPSet_proto.clear = function () {
  this.set = {};
};


/**
 * DASdirectory
 */
function DASdirectory(uriToDirectory) {
  if (!uriToDirectory) uriToDirectory = process.cwd();
  this.type = 'directory-as-set';
  // #TODO:
  this.path = path.resolve(uriToDirectory);
};


/**
 * DASAppState
 */
function DASAppState(data) {
  if (!data) data = {};

  this.isStateful = true;
  this.isDryrun = false;
  this.anchorDir = null;

  this.set = new RPSet();
  this.stashSet = {};

  this.alias = {};
  this.setBase(data.base); // this.base = new DASdirectory(data.base);
  this.setPartner(data.partner); // this.partner = new DASdirectory(data.partner);
};
const DASAppState_proto = DASAppState.prototype;

DASAppState_proto.setAlias = function (key, value) {
  this.alias[key] = value;
};

DASAppState_proto.aliasClear = function () {
  this.alias = {};
};

DASAppState_proto.setBase = function (inputString) {
  if (inputString in this.alias) inputString = this.alias[inputString];
  this.base = new DASdirectory(inputString);
};

DASAppState_proto.setPartner = function (inputString) {
  if (inputString in this.alias) inputString = this.alias[inputString];
  this.partner = new DASdirectory(inputString);
};


/**
 * DASApp
 */
function DASApp() {
  this._state = new DASAppState();
};
const DASApp_proto = DASApp.prototype;

//#TODO:
DASApp_proto.init = function () {

};

//#TODO:
DASApp_proto.state = function () {
  console.dir(this._state, { depth: null })
  console.log(FSHandler.treeDir(this._state.base.path));
};

DASApp_proto.stateful = function () {
  this._state.isStateful = true;
};

DASApp_proto.stateless = function () {
  this._state.isStateful = false;
};

//#TODO:
DASApp_proto.clearCache = function () {
  return this;
};

//#TODO:
DASApp_proto.clean = function () {
};

//#TODO:
DASApp_proto.clean = function () {
};

//#TODO:
DASApp_proto.tree = function () {
  // treeDir
};

DASApp_proto.base = function (inputString) {
  this._state.setBase(inputString)
};

//#TODO:
DASApp_proto.basePwd = function (inputString) {
};

DASApp_proto.partner = function (inputString) {
  this._state.setPartner(inputString)
};

DASApp_proto.alias = function (inputString) {
  this._state.alias(inputString, this._state.partner.uri)
};

DASApp_proto.aliasClear = function () {
  this._state.aliasClear();
};

//#TODO:
DASApp_proto.partnerPwd = function (inputString) {
};

DASApp_proto.select = function () {
  var _set = this._state.set;
  _set.select.apply(_set, arguments);
  console.log(arguments);
};
DASApp_proto.select.expectedLength = -1;

//#TODO:
DASApp_proto.selectBase = function () {
};

//#TODO:
DASApp_proto.selectInter = function () {
};
``
//#TODO:
DASApp_proto.selectInterOlder = function () {
};

//#TODO:
DASApp_proto.selectInterNewer = function () {
};

//#TODO:
DASApp_proto.selectPartner = function () {
};

//#TODO:
DASApp_proto.selectRegex = function () {
};

DASApp_proto.deselect = function () {
  var _set = this._state.set;
  _set.deselect.apply(_set, arguments);
};
DASApp_proto.deselect.expectedLength = -1;

//#TODO:
DASApp_proto.deselectBase = function () {
};

//#TODO:
DASApp_proto.deselectInter = function () {
};

//#TODO:
DASApp_proto.deselectInterOlder = function () {
};

//#TODO:
DASApp_proto.deselectInterNewer = function () {
};

//#TODO:
DASApp_proto.deselectPartner = function () {
};

//#TODO:
DASApp_proto.deselectRegex = function () {
};

//#TODO:
DASApp_proto.setClear = function () {
  this._state.set.clear();
};

DASApp_proto.setStash = function (key) {
  this._state.stashSet[key] = this.this._state.set;
};

DASApp_proto.setUnstash = function (key) {
  this.this._state.set = this._state.stashSet[key];
  delete this._state.stashSet[key];
};

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

DASApp_proto.dryrun = function (type) {
  this._state.isDryrun = (type.toLowerCase() === "on");
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

  "i": "init",
  "sf": "stateful",
  "sl": "stateless",
  "b": "base",
  "p": "partner",
  "a": "alias",
  "s": "select",
  "sb": "selectBase",
  "si": "selectInter",
  "sio": "selectInterOlder",
  "sin": "selectInterNewer",
  "sp": "selectPartner",
  "sr": "selectRegex",
  "d": "deselect",
  "db": "deselectBase",
  "di": "deselectInter",
  "dio": "deselectInterOlder",
  "din": "deselectInterNewer",
  "dp": "deselectPartner",
  "dr": "deselectRegex",
  "cpf": "copyFrom",
  "cpt": "copyTo",
  "mvf": "moveFrom",
  "mvr": "moveTo",
  "rmf": "remove",
  "rmt": "removeAt",
  "tof": "touch",
  "tot": "touchAt",

  "status": "state",
  "pull": "copyFrom",
  "push": "copyTo",
  "take": "moveFrom",
  "give": "moveTo",
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
  if (cmd in this.cmdAlias) cmd = this.cmdAlias[cmd];
  if (cmd in this.app) return cmd;

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
  if (cmd in this.app) {
    var fn = this.app[cmd]
    return fn.expectedLength !== undefined
      ? fn.expectedLength
      : fn.length;
  };

  return 0;
};

DASCmdRunner_proto.parseNext = function (maxNoParams) {

  var args = [], arg;
  while (
    (maxNoParams <= 0 || args.length < maxNoParams)
    && (arg = this.nextArg()) !== undefined
    && arg !== "--"
  ) args.push(arg);

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
exports.DASAppState = DASAppState;
exports.DASdirectory = DASdirectory;
exports.FSHandler = FSHandler;


/**
 * Run module as an independent application.
 */
// Check if this module is being run directly or without entry script.
if (require.main === module || require.main === undefined || require.main.id === '.') {
  const app = createApp();

  var args = process.argv.slice(2);

  // #TODO: retyping this line to clear meaning
  // Default run in stateless mode if run without entry script.
  if (require.main === undefined) app.stateless();

  if (args.length === 0) args.push("status");

  var cmdRunner = app.cmd(args);
  cmdRunner.exec();
};
