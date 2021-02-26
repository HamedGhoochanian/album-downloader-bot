const audioHandler = require('./audioHandler');
const doneHandler = require('./doneHandler');
const startHandler = require('./startHandler');
const textHandler = require('./textHandler');
const cancelHandler = require('./cancelHandler');

module.exports = {
  commands: {
    startHandler,
    doneHandler,
    cancelHandler,
  },
  types: {
    audioHandler,
    textHandler,
  },
};
