import { Project, InterfaceDeclaration, VariableDeclarationKind, SyntaxKind, TypeLiteralNode, PropertySignature } from 'ts-morph';
import { format } from 'prettier';

import { GenerateTranslationKeysExecutorSchema } from './schema';

export default async function runExecutor(options: GenerateTranslationKeysExecutorSchema) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(options.path);

  const interfaceDeclaration = sourceFile.getInterface('TranslationKeys');
  if (!interfaceDeclaration) throw new Error('Interface TranslationKeys not found');

  const constObject = interfaceToConst(interfaceDeclaration);

  const outputSourceFile = project.createSourceFile(options.dest, '', { overwrite: true });
  outputSourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [{
      name: 'translations',
      initializer: writer => writer.write(constObject)
    }]
  });
  outputSourceFile.insertText(0, '// !!!!! This file is auto-generated. Do not edit. !!!!! \n');

  const code = outputSourceFile.print();
  const formatted = format(code, { parser: 'typescript' });
  outputSourceFile.replaceWithText(await formatted);

  await project.save();

  return {
    success: true,
  };
}

function interfaceToConst(node: InterfaceDeclaration | TypeLiteralNode, path: string = ''): string {
  let result = '{\n';

  const properties = node.getMembers() as PropertySignature[];
  for (const prop of properties) {
    const name = prop.getName();
    const fullPath = path ? `${path}.${name}` : name;
    if (prop.getTypeNode()?.getKind() === SyntaxKind.TypeLiteral) {
      const typeLiteralNode = prop.getTypeNode() as TypeLiteralNode;
      result += `  ${name}: ${interfaceToConst(typeLiteralNode, fullPath)},\n`;
    } else {
      result += `  ${name}: '${fullPath}' as const,\n`;
    }
  }

  result += '} as const';

  return result;
}
