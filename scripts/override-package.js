/**
 * post-build
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2020 Jonas Tomanga
 * All rights reserved
 */

'use strict';

const fs = require('fs');

const pkg = require(__dirname + '/../package.json');
const override = require(__dirname + '/../templates/package-override.json');

console.log('writing package file to dist.');
fs.writeFileSync(
    __dirname + '/../dist/package.json',
    JSON.stringify({ ...pkg, ...override }, null, 2)
);
console.log('copy read me');

fs.copyFileSync(__dirname + '/../README.md', __dirname + '/../dist/README.md');
