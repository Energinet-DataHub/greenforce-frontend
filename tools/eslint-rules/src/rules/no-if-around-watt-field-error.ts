import { Rule } from 'eslint';

interface IfStatementInfo {
  found: boolean;
  lineNumber: number;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow @if control flow around watt-field-error components',
      recommended: true,
    },
    messages: {
      noIfAroundWattFieldError:
        'Do not wrap <watt-field-error> in an @if statement. This causes layout shifts when errors appear/disappear. Place the condition inside the component instead.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
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

    function checkWattFieldError(node: any): void {
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
          node,
          messageId: 'noIfAroundWattFieldError',
        });
      }
    }

    return {
      Element(node: any): void {
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
};

export default rule;
