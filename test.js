const path = require('path');

const CWD = process.cwd();

const publicDirBackwardSlash = 'libs\\dh\\shared\\data-access-msw\\src\\assets';
const publicDirForwardSlash = 'libs/dh/shared/data-access-msw/src/assets';

const absolutePublicDirBackwardSlash = path.resolve(
  CWD,
  publicDirBackwardSlash
);
const relativePublicDirBackwardSlash = path.relative(
  CWD,
  absolutePublicDirBackwardSlash
);

console.log(relativePublicDirBackwardSlash);

console.log('---------');

const absolutePublicDirForwardSlash = path.resolve(CWD, publicDirForwardSlash);
const relativePublicDirForwardSlash = path.relative(
  CWD,
  absolutePublicDirForwardSlash
);

console.log(relativePublicDirForwardSlash);
