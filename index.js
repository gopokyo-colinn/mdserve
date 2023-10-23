#! /usr/bin/env node

require('babel-register')({
  ignore: false,
  only: /mdserve\/lib/
});
require('babel-polyfill');

const path = require('path');
const express = require('express');
const commandLineArgs = require('command-line-args')

const init = require('./lib/init');

const optionDefinitions = [
  { name: 'directory', alias: 'd', type: String },
  { name: 'port', alias: 'p', type: Number }
];

const {
  port,
  directory
} = commandLineArgs(optionDefinitions);

init(port || 3789, path.resolve(process.cwd(), directory));
