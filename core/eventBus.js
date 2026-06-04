const EventEmitter = require('events');

// Bus de eventos centralizado para todo IngenioOS
class IngenioEventBus extends EventEmitter {}

const eventBus = new IngenioEventBus();

module.exports = eventBus;
