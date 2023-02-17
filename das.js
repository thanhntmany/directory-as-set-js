/*!
 * directory-as-set.js
 * Copyright(c) 2023 Thanhntmany
 */

'use strict';

const process = require('process');


/**
 * Core Class.
 */

function DAS(uriToDirectory) {
  this.set = {};
};
const DAS_proto = DAS.prototype;

DAS_proto.selectOne = function (inputString) {
  if (!(inputString in this.set)) this.set[inputString] = {};
};

DAS_proto.deselectOne = function (inputString) {
  delete this.set[inputString];
};

DAS_proto.select = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    this.selectOne(arguments[i]);
  };
};

DAS_proto.deselect = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    this.deselectOne(arguments[i]);
  };
};

DAS_proto.clear = function () {
  this.set = {};
};

/**
 * DASdirectory
 */
function DASdirectory(uriToDirectory) {
  this.uri = uriToDirectory;
  this.type = 'directory-as-set';
  this.path = null;
};


/**
 * DASAppState
 */
function DASAppState() {
  this.isStateful = true;
  this.isDryrun = false;
  this.anchorDir = null;
  this.alias = {};
  this.base = new DASdirectory();
  this.partner = new DASdirectory();
  this.set = new DAS();
  this.stashSet = {};
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
  this.state = new DASAppState();
};
const DASApp_proto = DASApp.prototype;

/* DASApp command */

//#TODO:
DASApp_proto.init = function () {

};

//#TODO:
DASApp_proto.state = function () {

};

DASApp_proto.stateful = function () {
  this.state.isStateful = true;
};

DASApp_proto.stateless = function () {
  this.state.isStateful = false;
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

DASApp_proto.base = function (inputString) {
  this.state.setBase(inputString)
};

//#TODO:
DASApp_proto.basePwd = function (inputString) {
};

DASApp_proto.partner = function (inputString) {
  this.state.setPartner(inputString)
};

DASApp_proto.alias = function (inputString) {
  this.state.alias(inputString, this.state.partner.uri)
};

DASApp_proto.aliasClear = function () {
  this.state.aliasClear();
};

//#TODO:
DASApp_proto.partnerPwd = function (inputString) {
};

DASApp_proto.select = function () {
  var _set = this.state.set;
  _set.select.apply(_set, arguments);
};

//#TODO:
DASApp_proto.selectBase = function () {
};

//#TODO:
DASApp_proto.selectInter = function () {
};

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
  var _set = this.state.set;
  _set.deselect.apply(_set, arguments);
};

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
  this.state.set.clear();
};

DASApp_proto.setStash = function (key) {
  this.state.stashSet[key] = this.this.state.set;
};

DASApp_proto.setUnstash = function (key) {
  this.this.state.set = this.state.stashSet[key];
  delete this.state.stashSet[key];
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
  this.state.isDryrun = (type.toLowerCase()==="on");
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
  this.queue = [];
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
  return "nop";
};

DASCmdRunner_proto.nextArg = function () {
  return this.restArgs.shift();
};

DASCmdRunner_proto.giveBackArg = function () {
  var _ = this.restArgs;
  return _.unshift.apply(_, arguments);
};

DASCmdRunner_proto.cmdParseMap = {
  // Default cmd no param
  oneParam: ["base", "partner", "alias", "selectRegex", "deselectRegex", "setStash", "setUnstash"],
  multiParam: ["select", "deselect"]
};

DASCmdRunner_proto.parseCmd = function () {
  var cmdName;
  while ((cmdName = this.nextArg()) !== undefined) {
    cmdName = this.normalizeCmd(cmdName);
    if (cmdName === "nop") continue;

    var paserType = "noParam"
    for (var paserType in this.cmdParseMap) {
      if (cmdName in this.cmdParseMap[paserType]) {
        paserType = paserType
      };
    };

  };

};

DASCmdRunner_proto.exec = function () {

  this.parseCmd();
  console.log(this.restArgs);
  return 123;
};

/**
 * Expose `createApp()` + Core classes
 */
function createApp() {
  return new DASApp();
};

exports = module.exports = createApp;
exports.DASApp = DASApp;
exports.DASAppState = DASAppState;
exports.DASdirectory = DASdirectory;


/**
 * Run module as an independent application.
 */
// Check if this module is being run directly or without entry script.
if (require.main === module || require.main === undefined) {
  const app = createApp();

  var args = process.argv.slice(2);
  // Default run in stateless mode if run without entry script.
  if (require.main === undefined) app.stateless();

  var cmdRunner = app.cmd(args);
  console.dir(cmdRunner, { depth: null })
  cmdRunner.exec();
};
