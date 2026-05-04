import { isObjectType, isScalarType, isNonNullType, isListType, } from 'graphql';
const SCALAR_TYPES = new Set(['Date', 'DateTime', 'DateRange']);
/** Unwrap NonNull and List wrappers to get the named type. */
function unwrapType(type) {
    if (isNonNullType(type) || isListType(type))
        return unwrapType(type.ofType);
    return type;
}
const plugin = (schema) => {
    const result = Object.fromEntries(Object.values(schema.getTypeMap())
        .filter(isObjectType)
        .filter((type) => !type.name.startsWith('__'))
        .flatMap((type) => {
        const fields = Object.values(type.getFields());
        const entries = fields.flatMap((field) => {
            const innerType = unwrapType(field.type);
            return isScalarType(innerType) && SCALAR_TYPES.has(innerType.name)
                ? [[field.name, innerType.name]]
                : [];
        });
        return entries.length ? [[type.name, Object.fromEntries(entries)]] : [];
    }));
    return `export const scalarFieldMap: Record<string, Record<string, string>> = ${JSON.stringify(result, null, 2)};\n`;
};
export { plugin };
