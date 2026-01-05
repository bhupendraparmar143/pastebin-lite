/**
 * Get current time, considering test mode
 * @param {Object} req - Express request object (optional)
 * @returns {Date} Current time
 */
const getCurrentTime = (req = null) => {
  // Check if in test mode and header is provided
  if (process.env.TEST_MODE === '1' && req && req.headers['x-test-now-ms']) {
    const testTimeMs = parseInt(req.headers['x-test-now-ms']);
    if (!isNaN(testTimeMs)) {
      return new Date(testTimeMs);
    }
  }

  // Default to real current time
  return new Date();
};

module.exports = {
  getCurrentTime
};
