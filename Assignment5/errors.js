class CarCrashError extends Error {
    constructor(message) {
      super(message);
      this.name = 'CarCrashError';
    }
  }
  
  class SpeedingError extends Error {
    constructor(message) {
      super(message);
      this.name = 'SpeedingError';
    }
  }
  
  class EngineFailureError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EngineFailureError';
    }
  }
  
  class FlatTireError extends Error {
    constructor(message) {
      super(message);
      this.name = 'FlatTireError';
    }
  }
  
  module.exports = { CarCrashError, SpeedingError, EngineFailureError, FlatTireError };
  