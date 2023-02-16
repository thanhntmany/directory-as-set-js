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
DASApp_cmd.clearCache = DASApp_cmd["clear-cache"] = function () {
    return this;
};

//#TODO:
DASApp_cmd.clean = function () {
};

DASApp_cmd.base = function (inputString) {
    this.state.setBase(inputString)
};

DASApp_cmd.partner = function (inputString) {
    this.state.setPartner(inputString)
};

DASApp_cmd.alias = function (inputString) {
    this.state.alias(inputString, this.state.partner.uri)
};

DASApp_cmd.aliasClear = DASApp_cmd["alias-clear"] = function () {
    this.state.aliasClear();
};

//#TODO:
DASApp_cmd.partnerPwd = DASApp_cmd["partner-pwd"] = function (inputString) {
};

//#TODO:
DASApp_cmd.clean = function () {
};

DASApp_cmd.select = function () {
    var _set = this.state.set;
    _set.select.apply(_set, arguments);
};

//#TODO:
DASApp_cmd.selectBase = DASApp_cmd["select-base"] = function () {
};

//#TODO:
DASApp_cmd.selectInter = DASApp_cmd["select-inter"] = function () {
};

//#TODO:
DASApp_cmd.selectRegex = DASApp_cmd["select-regex"] = function () {
};

DASApp_cmd.deselect = function () {
    var _set = this.state.set;
    _set.deselect.apply(_set, arguments);
};

//#TODO:
DASApp_cmd.deselectBase = DASApp_cmd["deselect-base"] = function () {
};

//#TODO:
DASApp_cmd.deselectInter = DASApp_cmd["deselect-inter"] = function () {
};

//#TODO:
DASApp_cmd.deselectRegex = DASApp_cmd["deselect-regex"] = function () {
};

//#TODO:
DASApp_cmd.setClear = DASApp_cmd["set-clear"] = function () {
    this.state.set.clear();
};

DASApp_cmd.setStash = DASApp_cmd["set-stash"] = function (key) {
    this.state.stashSet[key] = this.this.state.set;
};

DASApp_cmd.setUnstash = DASApp_cmd["set-unstash"] = function (key) {
    this.this.state.set = this.state.stashSet[key];
    delete this.state.stashSet[key];
};

//#TODO:
DASApp_cmd.copyFrom = DASApp_cmd["copy-from"] = DASApp_cmd["cpf"] = DASApp_cmd["pull"] = function (key) {
};

//#TODO:
DASApp_cmd.copyTo = DASApp_cmd["copy-to"] = DASApp_cmd["cpt"] = DASApp_cmd["push"] = function (key) {
};

//#TODO:
DASApp_cmd.moveFrom = DASApp_cmd["move-from"] = DASApp_cmd["mvf"] = DASApp_cmd["take"] = function (key) {
};

//#TODO:
DASApp_cmd.moveTo = DASApp_cmd["move-to"] = DASApp_cmd["mvt"] = DASApp_cmd["give"] = function (key) {
};

//#TODO:
DASApp_cmd.remove = DASApp_cmd["rmf"] = function (key) {
};

//#TODO:
DASApp_cmd.removeAt = DASApp_cmd["rmt"] = function (key) {
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
// Check if this module is being run directly.
if (require.main === module) {
    const baseApp = createApp();
    console.dir(baseApp, { depth: null })


};
