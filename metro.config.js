const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports to prevent 'import.meta' resolution issues in some libraries (like Zustand v5 on web)
config.resolver.unstable_enablePackageExports = false;

// If a library explicitly throws import.meta errors and the above doesn't fix it, we can block it:
// config.resolver.blockList = [
//   /node_modules\/bad-library\/.*\.js/
// ];

module.exports = config;
