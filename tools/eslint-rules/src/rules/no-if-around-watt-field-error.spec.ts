import { RuleTester } from 'eslint';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import rule from './no-if-around-watt-field-error';

// Create a custom rule tester that simulates Angular template parsing
class AngularTemplateTester extends RuleTester {
  constructor(config?: any) {
    super({
      ...config,
      parser: require.resolve('@angular-eslint/template-parser'),
    });
  }
}

const ruleTester = new AngularTemplateTester({
  parserOptions: {
    ecmaVersion: 2020,
  },
});

describe('no-if-around-watt-field-error', () => {
  ruleTester.run('no-if-around-watt-field-error', rule, {
    valid: [
      // Valid: watt-field-error without @if
      {
        code: `
          <watt-field-error>
            This is an error message
          </watt-field-error>
        `,
        filename: 'test.component.html',
      },
      // Valid: @if inside watt-field-error
      {
        code: `
          <watt-field-error>
            @if (hasError) {
              This is an error message
            }
          </watt-field-error>
        `,
        filename: 'test.component.html',
      },
      // Valid: Multiple watt-field-error without @if
      {
        code: `
          <div>
            <watt-field-error>Error 1</watt-field-error>
            <watt-field-error>Error 2</watt-field-error>
          </div>
        `,
        filename: 'test.component.html',
      },
      // Valid: @if around other elements, not watt-field-error
      {
        code: `
          @if (condition) {
            <div>Some content</div>
          }
          <watt-field-error>Error message</watt-field-error>
        `,
        filename: 'test.component.html',
      },
    ],

    invalid: [
      // Invalid: Basic @if around watt-field-error
      {
        code: `
          @if (hasError) {
            <watt-field-error>
              This is an error message
            </watt-field-error>
          }
        `,
        filename: 'test.component.html',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
      // Invalid: @if with complex condition
      {
        code: `
          @if (form.get('email')?.hasError('required')) {
            <watt-field-error>
              Email is required
            </watt-field-error>
          }
        `,
        filename: 'test.component.html',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
      // Invalid: Nested @if blocks
      {
        code: `
          <div>
            @if (showErrors) {
              <watt-field-error>
                Error message
              </watt-field-error>
            }
          </div>
        `,
        filename: 'test.component.html',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
      // Invalid: Multiple @if blocks with watt-field-error
      {
        code: `
          @if (error1) {
            <watt-field-error>Error 1</watt-field-error>
          }

          @if (error2) {
            <watt-field-error>Error 2</watt-field-error>
          }
        `,
        filename: 'test.component.html',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
      // Invalid: @if with inline template (simulating inline template)
      {
        code: `
          <div>
            @if (hasValidationError) {
              <watt-field-error>
                Validation failed
              </watt-field-error>
            }
          </div>
        `,
        filename: 'test.component.ts',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
      // Invalid: ng-container with @if around watt-field-error (spacing issue)
      {
        code: `
          <ng-container>
            @if (hasError) {
              <watt-field-error>
                This is an error message
              </watt-field-error>
            }
          </ng-container>
        `,
        filename: 'test.component.html',
        errors: [
          {
            messageId: 'noIfAroundWattFieldError',
            type: 'Element',
          },
        ],
      },
    ],
  });
});

// Additional unit tests for edge cases
describe('no-if-around-watt-field-error edge cases', () => {
  const mockReport = vi.fn();
  const context: any = {
    getSourceCode: () => ({
      text: '',
      getText: () => '',
    }),
    report: mockReport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle nodes without location info gracefully', () => {
    const node = {
      type: 'Element',
      name: 'watt-field-error',
      loc: null,
    };

    const visitor = rule.create(context) as any;
    visitor.Element(node);

    expect(mockReport).not.toHaveBeenCalled();
  });

  it('should handle errors in rule execution gracefully', () => {
    const node = {
      type: 'Element',
      name: 'watt-field-error',
      loc: { start: { line: 1 } },
    };

    const errorContext = {
      getSourceCode: () => {
        throw new Error('Source code error');
      },
      report: vi.fn(),
    } as any;

    const visitor = rule.create(errorContext) as any;

    // Should not throw
    expect(() => visitor.Element(node)).not.toThrow();
  });

  it('should not report on elements that are not watt-field-error', () => {
    const node = {
      type: 'Element',
      name: 'div',
      loc: { start: { line: 1 } },
    };

    const visitor = rule.create(context) as any;
    visitor.Element(node);

    expect(mockReport).not.toHaveBeenCalled();
  });
});
