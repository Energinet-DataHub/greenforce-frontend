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
