/*
App version — single source of truth is package.json.
Bump with: npm run release:patch | release:minor | release:major
*/

import pkg from '../../package.json';

export const version = pkg.version;
