const fs = require('fs');
const path = require('path');

// Read the package.json file
const pkgPath = path.resolve(__dirname, 'package.json');
const pkg = require(pkgPath);

// Get the version from package.json
const version = pkg.version;

// Define the new paths based on the version
const mainFile = `dist/packages/index.${version}.cjs.js`;
const moduleFile = `dist/packages/index.${version}.es.js`;
const browserFile = `dist/packages/index.${version}.umd.js`;
const typesFile = 'dist/types/index.d.ts'

// Update the package.json fields
pkg.main = mainFile;
pkg.module = moduleFile;
pkg.browser = browserFile;

pkg.types = typesFile;

// Update the exports field
pkg.exports = {
  ".": {
    "import": `./${moduleFile}`,
    "require": `./${mainFile}`,
    "default": `./${browserFile}`,
    "types": `./${typesFile}`
  },
  "./package.json": "./package.json"
};

// Write the updated package.json back to the file system
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');

console.log('package.json updated successfully');
