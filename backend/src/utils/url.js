const config = require("../config/config");

/**
 * Get base URL for the application
 * Used to generate full URLs for assets like images
 */
const getBaseUrl = () => {
    return process.env.APP_URL || `http://localhost:${config.port}`;
};

module.exports = {
    getBaseUrl,
};
