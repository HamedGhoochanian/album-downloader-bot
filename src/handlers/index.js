const audioHandler = require('./audioHandler');
const doneHandler = require('./doneHandler');
const startHandler = require('./startHandler');
const textHandler = require('./textHandler');

module.exports = {
  commands: {
    startHandler,
    doneHandler,
  },
  types: {
    audioHandler,
    textHandler,
  },
};
