const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * Prevent Metro from trying to bundle server-side code under /server.
 * This avoids importing Node-only modules (fs, path, etc.) into the React Native bundle.
 */
const existingBlockList = config.resolver.blockList
  ? Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : [config.resolver.blockList]
  : [];

config.resolver.blockList = [...existingBlockList, /server\/.*$/];

// Allow bundling course documents (e.g. .pptx) as static assets.
config.resolver.assetExts = [...config.resolver.assetExts, 'pptx', 'docx', 'pdf'];

module.exports = config;
