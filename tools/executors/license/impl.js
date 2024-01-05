/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fs = require('fs');
var glob_1 = require('glob');
var path = require('path');
// eslint-disable-next-line @nx/enforce-module-boundaries
var config = require('../../../.licenserc.json');
function addLicenseExecutor(options) {
  return __awaiter(this, void 0, void 0, function () {
    var globs, success, files;
    return __generator(this, function (_a) {
      globs = Object.keys(config).filter(function (glob) {
        return glob !== 'ignore';
      });
      success = true;
      console.info('Adding licenses...');
      files = (0, glob_1.globSync)('{,!(node_modules|dist)/**/*}*{'.concat(globs.join(','), '}'), {
        ignore: config.ignore,
      });
      files.forEach(function (file) {
        try {
          var isDirectory = fs.existsSync(file) && fs.lstatSync(file).isDirectory();
          if (isDirectory) return;
          var data = fs.readFileSync(file, 'utf8');
          var licenseConfig = getLicenseConfig(config, file);
          if (!licenseConfig) {
            console.error('No license config found for: '.concat(file));
            success = false;
            return;
          }
          var licenseTxt = licenseConfig.join('\n');
          var isLicensed = checkForLicense(data, licenseTxt);
          if (!isLicensed) {
            var result = addLicense(file, data, licenseTxt, options);
            if (!result) success = false;
          }
        } catch (err) {
          console.error("Couldn't read file: ".concat(file, ', ').concat(err));
          success = false;
        }
      });
      return [2 /*return*/, { success: success }];
    });
  });
}
exports.default = addLicenseExecutor;
function getLicenseConfig(config, file) {
  var fileExt = path.extname(file).replace('.', '');
  var key = Object.keys(config).find(function (glob) {
    return glob.includes(fileExt);
  });
  return config[key];
}
function addLicense(file, content, license, options) {
  try {
    if (!options.dryRun) {
      fs.writeFileSync(file, license + '\n' + content);
    }
    console.log('Added license to', file);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
function checkForLicense(content, license) {
  if (!license) {
    return false;
  }
  return removeWhitespace(content).startsWith(removeWhitespace(license));
}
function removeWhitespace(str) {
  return str.replace(/\s/g, '');
}
