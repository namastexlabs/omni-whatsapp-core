'use strict';

module.exports = {
  'no-console-in-production': require('./rules/no-console-in-production'),
  'no-direct-process-env': require('./rules/no-direct-process-env'),
  'no-hardcoded-credentials': require('./rules/no-hardcoded-credentials'),
  'consistent-error-handling': require('./rules/consistent-error-handling'),
};
