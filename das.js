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
  this.queue = [];
  this.state = new DASAppState();
};
const DASApp_cmd = DASApp.prototype;

DASApp_cmd.run = function () {

};

/* DASApp command */

//#TODO:
DASApp_cmd.init = function () {

};

//#TODO:
DASApp_cmd.state = function () {

};

DASApp_cmd.stateful = function () {
  this.state.isStateful = true;
};

DASApp_cmd.stateless = function () {
  this.state.isStateful = false;
};

//#TODO:
DASApp_cmd.clearCache = function () {
  return this;
};

//#TODO:
DASApp_cmd.clean = function () {
};

//#TODO:
DASApp_cmd.clean = function () {
};

DASApp_cmd.base = function (inputString) {
  this.state.setBase(inputString)
};

//#TODO:
DASApp_cmd.basePwd = function (inputString) {
};

DASApp_cmd.partner = function (inputString) {
  this.state.setPartner(inputString)
};

DASApp_cmd.alias = function (inputString) {
  this.state.alias(inputString, this.state.partner.uri)
};

DASApp_cmd.aliasClear = function () {
  this.state.aliasClear();
};

//#TODO:
DASApp_cmd.partnerPwd = function (inputString) {
};

DASApp_cmd.select = function () {
  var _set = this.state.set;
  _set.select.apply(_set, arguments);
};

//#TODO:
DASApp_cmd.selectBase = function () {
};

//#TODO:
DASApp_cmd.selectInter = function () {
};

//#TODO:
DASApp_cmd.selectInterOlder = function () {
};

//#TODO:
DASApp_cmd.selectInterNewer = function () {
};

//#TODO:
DASApp_cmd.selectPartner = function () {
};

//#TODO:
DASApp_cmd.selectRegex = function () {
};

DASApp_cmd.deselect = function () {
  var _set = this.state.set;
  _set.deselect.apply(_set, arguments);
};

//#TODO:
DASApp_cmd.deselectBase = function () {
};

//#TODO:
DASApp_cmd.deselectInter = function () {
};

//#TODO:
DASApp_cmd.deselectInterOlder = function () {
};

//#TODO:
DASApp_cmd.deselectInterNewer = function () {
};

//#TODO:
DASApp_cmd.deselectPartner = function () {
};

//#TODO:
DASApp_cmd.deselectRegex = function () {
};

//#TODO:
DASApp_cmd.setClear = function () {
  this.state.set.clear();
};

DASApp_cmd.setStash = function (key) {
  this.state.stashSet[key] = this.this.state.set;
};

DASApp_cmd.setUnstash = function (key) {
  this.this.state.set = this.state.stashSet[key];
  delete this.state.stashSet[key];
};

//#TODO:
DASApp_cmd.copyFrom = function (key) {
};

//#TODO:
DASApp_cmd.copyTo = function (key) {
};

//#TODO:
DASApp_cmd.moveFrom = function (key) {
};

//#TODO:
DASApp_cmd.moveTo = function (key) {
};

//#TODO:
DASApp_cmd.remove = function (key) {
};

//#TODO:
DASApp_cmd.removeAt = function (key) {
};

//#TODO:
DASApp_cmd.touch = function (key) {
};

//#TODO:
DASApp_cmd.touchAt = function (key) {
};

/* DASApp command alias */
DASApp_cmd.i = DASApp_cmd.init;
DASApp_cmd.b = DASApp_cmd.base;
DASApp_cmd.p = DASApp_cmd.partner;
DASApp_cmd.a = DASApp_cmd.alias;


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
// Check if this module is being run directly or being run by raw script.
if (require.main === module || require.main === undefined) {
  const baseApp = createApp();
  console.dir(baseApp.state, { depth: null })

  process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });

  console.dir(process.argv, { depth: null })

};
