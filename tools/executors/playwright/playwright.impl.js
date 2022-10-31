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
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
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
      while (_)
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
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === 'function' ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb('next'),
        verb('throw'),
        verb('return'),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __await =
  (this && this.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  };
var __asyncGenerator =
  (this && this.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb('next'),
      verb('throw'),
      verb('return'),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume('next', value);
    }
    function reject(value) {
      resume('throw', value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
exports.__esModule = true;
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
require('dotenv/config');
var path_1 = require('path');
var devkit_1 = require('@nrwl/devkit');
var run_commands_impl_1 = require('nx/src/executors/run-commands/run-commands.impl');
function playwrightExecutor(options, context) {
  var e_1, _a;
  return __awaiter(this, void 0, void 0, function () {
    var success, _b, _c, baseUrl, e_2, e_1_1;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          options = normalizeOptions(options, context);
          _d.label = 1;
        case 1:
          _d.trys.push([1, 9, 10, 15]);
          _b = __asyncValues(startDevServer(options, context));
          _d.label = 2;
        case 2:
          return [4 /*yield*/, _b.next()];
        case 3:
          if (!((_c = _d.sent()), !_c.done)) return [3 /*break*/, 8];
          baseUrl = _c.value;
          _d.label = 4;
        case 4:
          _d.trys.push([4, 6, , 7]);
          return [4 /*yield*/, runPlaywright(baseUrl, options, context)];
        case 5:
          success = _d.sent();
          if (!options.watch) return [3 /*break*/, 8];
          return [3 /*break*/, 7];
        case 6:
          e_2 = _d.sent();
          devkit_1.logger.error(e_2.message);
          success = false;
          if (!options.watch) return [3 /*break*/, 8];
          return [3 /*break*/, 7];
        case 7:
          return [3 /*break*/, 2];
        case 8:
          return [3 /*break*/, 15];
        case 9:
          e_1_1 = _d.sent();
          e_1 = { error: e_1_1 };
          return [3 /*break*/, 15];
        case 10:
          _d.trys.push([10, , 13, 14]);
          if (!(_c && !_c.done && (_a = _b['return'])))
            return [3 /*break*/, 12];
          return [4 /*yield*/, _a.call(_b)];
        case 11:
          _d.sent();
          _d.label = 12;
        case 12:
          return [3 /*break*/, 14];
        case 13:
          if (e_1) throw e_1.error;
          return [7 /*endfinally*/];
        case 14:
          return [7 /*endfinally*/];
        case 15:
          return [2 /*return*/, { success: success }];
      }
    });
  });
}
exports['default'] = playwrightExecutor;
function normalizeOptions(options, context) {
  options.env = options.env || {};
  if (options.tsConfig) {
    var tsConfigPath = (0, path_1.join)(context.root, options.tsConfig);
    options.env.tsConfig = tsConfigPath;
    process.env.TS_NODE_PROJECT = tsConfigPath;
  }
  return options;
}
function startDevServer(opts, context) {
  return __asyncGenerator(this, arguments, function startDevServer_1() {
    var _a,
      project,
      target,
      configuration,
      devServerTargetOpts,
      targetSupportsWatchOpt,
      _b,
      _c,
      output,
      e_3_1;
    var e_3, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (!(!opts.devServerTarget || opts.skipServe))
            return [3 /*break*/, 4];
          return [4 /*yield*/, __await(opts.baseUrl)];
        case 1:
          return [4 /*yield*/, _e.sent()];
        case 2:
          _e.sent();
          return [4 /*yield*/, __await(void 0)];
        case 3:
          return [2 /*return*/, _e.sent()];
        case 4:
          (_a = (0, devkit_1.parseTargetString)(opts.devServerTarget)),
            (project = _a.project),
            (target = _a.target),
            (configuration = _a.configuration);
          devServerTargetOpts = (0, devkit_1.readTargetOptions)(
            { project: project, target: target, configuration: configuration },
            context
          );
          targetSupportsWatchOpt =
            Object.keys(devServerTargetOpts).includes('watch');
          _e.label = 5;
        case 5:
          _e.trys.push([5, 13, 14, 19]);
          return [
            4 /*yield*/,
            __await(
              (0, devkit_1.runExecutor)(
                {
                  project: project,
                  target: target,
                  configuration: configuration,
                },
                // @NOTE: Do not forward watch option if not supported by the target dev server,
                // this is relevant for running Playwright against dev server target that does not support this option,
                // for instance @nguniversal/builders:ssr-dev-server.
                targetSupportsWatchOpt ? { watch: opts.watch } : {},
                context
              )
            ),
          ];
        case 6:
          _b = __asyncValues.apply(void 0, [_e.sent()]);
          _e.label = 7;
        case 7:
          return [4 /*yield*/, __await(_b.next())];
        case 8:
          if (!((_c = _e.sent()), !_c.done)) return [3 /*break*/, 12];
          output = _c.value;
          if (!output.success && !opts.watch)
            throw new Error('Could not compile application files');
          return [4 /*yield*/, __await(opts.baseUrl || output.baseUrl)];
        case 9:
          return [4 /*yield*/, _e.sent()];
        case 10:
          _e.sent();
          _e.label = 11;
        case 11:
          return [3 /*break*/, 7];
        case 12:
          return [3 /*break*/, 19];
        case 13:
          e_3_1 = _e.sent();
          e_3 = { error: e_3_1 };
          return [3 /*break*/, 19];
        case 14:
          _e.trys.push([14, , 17, 18]);
          if (!(_c && !_c.done && (_d = _b['return'])))
            return [3 /*break*/, 16];
          return [4 /*yield*/, __await(_d.call(_b))];
        case 15:
          _e.sent();
          _e.label = 16;
        case 16:
          return [3 /*break*/, 18];
        case 17:
          if (e_3) throw e_3.error;
          return [7 /*endfinally*/];
        case 18:
          return [7 /*endfinally*/];
        case 19:
          return [2 /*return*/];
      }
    });
  });
}
function runPlaywright(baseUrl, opts, context) {
  return __awaiter(this, void 0, void 0, function () {
    var projectname, sourceRoot, playwrightCommand, success;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          projectname = context.projectName;
          sourceRoot = context.workspace.projects[projectname].sourceRoot;
          playwrightCommand = 'playwright test '
            .concat(sourceRoot, ' --config=')
            .concat(opts.playwrightConfig);
          if (opts.include) {
            playwrightCommand += ' --grep="'.concat(
              escapeRegExp(opts.include),
              '"'
            );
          }
          if (opts.exclude) {
            playwrightCommand += ' --grep-invert="'.concat(
              escapeRegExp(opts.exclude),
              '"'
            );
          }
          if (opts.debug) {
            process.env.PWDEBUG = '1';
            playwrightCommand += ' --workers=1';
          }
          process.env.BASE_URL = baseUrl;
          return [
            4 /*yield*/,
            (0, run_commands_impl_1['default'])(
              {
                commands: [playwrightCommand],
                parallel: true,
                __unparsed__: [],
              },
              context
            ),
          ];
        case 1:
          success = _a.sent().success;
          return [2 /*return*/, success];
      }
    });
  });
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
