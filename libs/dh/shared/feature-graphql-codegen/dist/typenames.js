"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const plugin = (schema) => ({
    prepend: ['export type Typename ='],
    content: Object.keys(schema.getTypeMap())
        .filter((type) => !type.startsWith('__'))
        .toSorted()
        .map((type) => `  | '${type}'`)
        .join('\n'),
});
exports.plugin = plugin;
