//#region License
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
//#endregion
import { ESLintUtils } from '@typescript-eslint/utils';
import { TemplateElementNode } from '../types/angular-template-ast';

interface IfStatementInfo {
  found: boolean;
  lineNumber: number;
}

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-no-if-around-watt-field-error"
export const RULE_NAME = 'no-if-around-watt-field-error';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow @if control flow around watt-field-error components',
      recommended: 'recommended',
    },
    messages: {
      noIfAroundWattFieldError:
        'Do not wrap <watt-field-error> in an @if statement. This causes layout shifts when errors appear/disappear. Place the condition inside the component instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
        function findIfStatement(lines: string[], elementStartLine: number): IfStatementInfo {
      const startLine = Math.max(0, elementStartLine - 10);
      const endLine = elementStartLine - 2;

      for (let i = endLine; i >= startLine; i--) {
        const line = lines[i];
        if (line?.includes('@if') && line?.includes('(')) {
          return { found: true, lineNumber: i };
        }
      }

      return { found: false, lineNumber: -1 };
    }

    function isIfWrappingElement(
      lines: string[],
      ifLine: number,
      elementStartLine: number
    ): boolean {
      const contextLines = lines.slice(ifLine, elementStartLine + 5).join('\n');

      const hasOpenBrace = contextLines.includes('{');
      const hasWattFieldError = contextLines.includes('<watt-field-error');
      const hasClosingWattFieldError = contextLines.includes('</watt-field-error>');

      if (!hasOpenBrace || !hasWattFieldError || !hasClosingWattFieldError) {
        return false;
      }

      const closingBraceIndex = contextLines.lastIndexOf('}');
      const closingErrorIndex = contextLines.lastIndexOf('</watt-field-error>');

      return closingBraceIndex > closingErrorIndex;
    }

    function checkWattFieldError(node: TemplateElementNode): void {
      if (node.name !== 'watt-field-error' || !node.loc?.start) {
        return;
      }

      const sourceCode = context.sourceCode;
      const lines = sourceCode.text.split('\n');
      const elementStartLine = node.loc.start.line;
      const ifInfo = findIfStatement(lines, elementStartLine);

      if (!ifInfo.found) {
        return;
      }

      if (isIfWrappingElement(lines, ifInfo.lineNumber, elementStartLine)) {
        context.report({
          // ESLint expects ESTree nodes, but we have Angular template nodes
          node: node as any,
          messageId: 'noIfAroundWattFieldError',
        });
      }
    }

    return {
      // Angular ESLint uses 'Element' for HTML elements in templates
      Element(node: TemplateElementNode): void {
        try {
          checkWattFieldError(node);
        } catch (e) {
          // Handle any errors gracefully - don't re-throw
          if (process.env.NODE_ENV !== 'test') {
            console.error('Error in no-if-around-watt-field-error rule:', e);
          }
        }
      },
    };
  },
});
