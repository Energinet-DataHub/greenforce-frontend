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
import { Component } from '@angular/core';
import { render, screen, RenderResult } from '@testing-library/angular';
import '@testing-library/jest-dom';

import { DhReleaseToggleDirective, ToggleExpression } from './dh-release-toggle.directive';
import { DhReleaseToggleService } from './dh-release-toggle.service';

// Test constants to avoid duplication
const TEST_IDS = {
  SINGLE_TOGGLE: 'single-toggle',
  MULTIPLE_TOGGLES: 'multiple-toggles',
  INVERSE_TOGGLE: 'inverse-toggle',
  DISABLED_TOGGLE: 'disabled-toggle',
  EMPTY_EXPRESSION: 'empty-expression',
  TEST_ELEMENT: 'test-element',
} as const;

const TOGGLE_NAMES = {
  TOGGLE1: 'toggle1',
  TOGGLE2: 'toggle2',
  TOGGLE3: 'toggle3',
  DISABLED_TOGGLE: 'disabled-toggle',
  INVERSE_TOGGLE3: '!toggle3',
} as const;

const CONTENT_TEXT = {
  SINGLE_TOGGLE: 'Single Toggle Content',
  MULTIPLE_TOGGLES: 'Multiple Toggles Content',
  INVERSE_TOGGLE: 'Inverse Toggle Content',
  DISABLED_TOGGLE: 'Disabled Toggle Content',
  EMPTY_EXPRESSION: 'Empty Expression Content',
  TEST_CONTENT: 'Test Content',
} as const;

const SERVICE_METHODS = {
  IS_ENABLED: 'isEnabled',
  HAS_ALL_ENABLED: 'hasAllEnabled',
  REFETCH: 'refetch',
} as const;

// Test component to host the directive
@Component({
  template: `
    <div [attr.data-testid]="testIds.SINGLE_TOGGLE" *dhReleaseToggle="singleToggle">${CONTENT_TEXT.SINGLE_TOGGLE}</div>
    <div [attr.data-testid]="testIds.MULTIPLE_TOGGLES" *dhReleaseToggle="multipleToggles">${CONTENT_TEXT.MULTIPLE_TOGGLES}</div>
    <div [attr.data-testid]="testIds.INVERSE_TOGGLE" *dhReleaseToggle="inverseToggle">${CONTENT_TEXT.INVERSE_TOGGLE}</div>
    <div [attr.data-testid]="testIds.DISABLED_TOGGLE" *dhReleaseToggle="disabledToggle">${CONTENT_TEXT.DISABLED_TOGGLE}</div>
    <div [attr.data-testid]="testIds.EMPTY_EXPRESSION" *dhReleaseToggle="emptyExpression">${CONTENT_TEXT.EMPTY_EXPRESSION}</div>
  `,
  standalone: true,
  imports: [DhReleaseToggleDirective]
})
class TestHostComponent {
  testIds = TEST_IDS;
  singleToggle: ToggleExpression = TOGGLE_NAMES.TOGGLE1;
  multipleToggles: ToggleExpression = [TOGGLE_NAMES.TOGGLE1, TOGGLE_NAMES.TOGGLE2];
  inverseToggle: ToggleExpression = TOGGLE_NAMES.INVERSE_TOGGLE3;
  disabledToggle: ToggleExpression = TOGGLE_NAMES.DISABLED_TOGGLE;
  emptyExpression: ToggleExpression = '';
}

// Simple test component for isolated testing
@Component({
  template: `<div [attr.data-testid]="testId" *dhReleaseToggle="expression">${CONTENT_TEXT.TEST_CONTENT}</div>`,
  standalone: true,
  imports: [DhReleaseToggleDirective]
})
class SimpleTestComponent {
  testId = TEST_IDS.TEST_ELEMENT;
  expression: ToggleExpression = '';
}

// Mock service with proper typing
const mockReleaseToggleService = {
  [SERVICE_METHODS.IS_ENABLED]: jest.fn(),
  [SERVICE_METHODS.HAS_ALL_ENABLED]: jest.fn(),
  [SERVICE_METHODS.REFETCH]: jest.fn(),
} as jest.Mocked<Pick<DhReleaseToggleService, 'isEnabled' | 'hasAllEnabled' | 'refetch'>>;

describe('DhReleaseToggleDirective', () => {
  let renderResult: RenderResult<TestHostComponent>;

  const renderComponent = async (componentProperties?: Partial<TestHostComponent>) => {
    renderResult = await render(TestHostComponent, {
      imports: [DhReleaseToggleDirective],
      providers: [
        { provide: DhReleaseToggleService, useValue: mockReleaseToggleService },
      ],
      componentProperties,
    });
    return renderResult;
  };

  afterEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations to default
    mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReset();
    mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReset();
    mockReleaseToggleService[SERVICE_METHODS.REFETCH].mockReset();
  });

  describe('Single Toggle Expression', () => {
    it('should show content when single toggle is enabled', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent();

      // Assert
      const element = screen.getByTestId(TEST_IDS.SINGLE_TOGGLE);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(CONTENT_TEXT.SINGLE_TOGGLE);
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.TOGGLE1);
    });

    it('should hide content when single toggle is disabled', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent();

      // Assert
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.TOGGLE1);
    });

    it('should update visibility when toggle state changes', async () => {
      // Arrange - Initially disabled
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);

      const { rerender } = await renderComponent();
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();

      // Act - Enable toggle and force component to re-evaluate
      const updatedToggleName = `${TOGGLE_NAMES.TOGGLE1}-updated`;
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      rerender({ componentProperties: { singleToggle: updatedToggleName } });

      // Assert - Should now be visible
      const element = screen.getByTestId(TEST_IDS.SINGLE_TOGGLE);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(CONTENT_TEXT.SINGLE_TOGGLE);
    });
  });

  describe('Multiple Toggles Expression', () => {
    it('should show content when all toggles are enabled', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent();

      // Assert
      const element = screen.getByTestId(TEST_IDS.MULTIPLE_TOGGLES);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(CONTENT_TEXT.MULTIPLE_TOGGLES);
      expect(mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED]).toHaveBeenCalledWith([TOGGLE_NAMES.TOGGLE1, TOGGLE_NAMES.TOGGLE2]);
    });

    it('should hide content when not all toggles are enabled', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent();

      // Assert
      expect(screen.queryByTestId(TEST_IDS.MULTIPLE_TOGGLES)).not.toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED]).toHaveBeenCalledWith([TOGGLE_NAMES.TOGGLE1, TOGGLE_NAMES.TOGGLE2]);
    });
  });

  describe('Inverse Toggle Expression', () => {
    it('should show content when inverse toggle is disabled', async () => {
      // Arrange - toggle3 is disabled, so !toggle3 should be true
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent();

      // Assert
      const element = screen.getByTestId(TEST_IDS.INVERSE_TOGGLE);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(CONTENT_TEXT.INVERSE_TOGGLE);
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.TOGGLE3);
    });

    it('should hide content when inverse toggle is enabled', async () => {
      // Arrange - toggle3 is enabled, so !toggle3 should be false
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent();

      // Assert
      expect(screen.queryByTestId(TEST_IDS.INVERSE_TOGGLE)).not.toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.TOGGLE3);
    });
  });

  describe('Edge Cases', () => {
    it('should hide content for empty expression', async () => {
      // Arrange - Use simple component with just empty expression
      await render(SimpleTestComponent, {
        imports: [DhReleaseToggleDirective],
        providers: [
          { provide: DhReleaseToggleService, useValue: mockReleaseToggleService },
        ],
        componentProperties: { expression: '' },
      });

      // Assert
      expect(screen.queryByTestId(TEST_IDS.TEST_ELEMENT)).not.toBeInTheDocument();
      // Service methods should not be called for empty expression
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).not.toHaveBeenCalled();
      expect(mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED]).not.toHaveBeenCalled();
    });

    it('should handle disabled toggle correctly', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent();

      // Assert
      expect(screen.queryByTestId(TEST_IDS.DISABLED_TOGGLE)).not.toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.DISABLED_TOGGLE);
    });
  });

  describe('Dynamic Expression Changes', () => {
    it('should update when expression changes from string to array', async () => {
      // Arrange - Start with single toggle enabled
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      const { rerender } = await renderComponent();

      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();

      // Act - Change to multiple toggles (disabled)
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);
      rerender({ componentProperties: { singleToggle: [TOGGLE_NAMES.TOGGLE1, TOGGLE_NAMES.TOGGLE2] } });

      // Assert - Should now be hidden
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED]).toHaveBeenCalledWith([TOGGLE_NAMES.TOGGLE1, TOGGLE_NAMES.TOGGLE2]);
    });

    it('should update when expression changes to inverse toggle', async () => {
      // Arrange - Start with regular toggle enabled
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      const { rerender } = await renderComponent();

      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();

      // Act - Change to inverse toggle
      const inverseToggle1 = `!${TOGGLE_NAMES.TOGGLE1}`;
      rerender({ componentProperties: { singleToggle: inverseToggle1 } });

      // Assert - Should now be hidden (since toggle1 is enabled, !toggle1 is false)
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();
    });

    it('should update when expression changes to empty', async () => {
      // Arrange - Start with toggle enabled
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      const { rerender } = await renderComponent();

      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();

      // Act - Change to empty expression
      rerender({ componentProperties: { singleToggle: '' } });

      // Assert - Should now be hidden
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();
    });
  });

  describe('View Management', () => {
    it('should properly clean up and recreate views', async () => {
      // Arrange - Start with toggle disabled
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);

      const { rerender } = await renderComponent();
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();

      // Act 1 - Enable toggle
      const enabledToggleName = `${TOGGLE_NAMES.TOGGLE1}-enabled`;
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      rerender({ componentProperties: { singleToggle: enabledToggleName } });
      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();

      // Act 2 - Disable toggle again
      const disabledToggleName = `${TOGGLE_NAMES.TOGGLE1}-disabled`;
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);
      rerender({ componentProperties: { singleToggle: disabledToggleName } });
      expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();

      // Act 3 - Enable toggle again
      const enabledAgainToggleName = `${TOGGLE_NAMES.TOGGLE1}-enabled-again`;
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      rerender({ componentProperties: { singleToggle: enabledAgainToggleName } });
      const element = screen.getByTestId(TEST_IDS.SINGLE_TOGGLE);
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent(CONTENT_TEXT.SINGLE_TOGGLE);
    });
  });

  describe('Complex Toggle Names', () => {
    it('should handle toggle names with special characters', async () => {
      // Arrange
      const complexToggleName = 'feature-with-dashes_and_underscores.and.dots';
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent({ singleToggle: complexToggleName });

      // Assert
      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(complexToggleName);
    });

    it('should handle inverse toggle with complex names', async () => {
      // Arrange
      const complexToggleName = 'complex-toggle_name.with.dots';
      const complexInverseToggle = `!${complexToggleName}`;
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent({ inverseToggle: complexInverseToggle });

      // Assert
      expect(screen.getByTestId(TEST_IDS.INVERSE_TOGGLE)).toBeInTheDocument();
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(complexToggleName);
    });
  });

  describe('Multiple Directive Instances', () => {
    it('should handle multiple directive instances independently', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockImplementation((toggleName: string) => {
        return toggleName === TOGGLE_NAMES.TOGGLE1; // Only toggle1 is enabled
      });
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);

      // Act
      await renderComponent();

      // Assert
      expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument(); // toggle1 is enabled
      expect(screen.queryByTestId(TEST_IDS.MULTIPLE_TOGGLES)).not.toBeInTheDocument(); // hasAllEnabled returns false
      expect(screen.getByTestId(TEST_IDS.INVERSE_TOGGLE)).toBeInTheDocument(); // !toggle3 where toggle3 is disabled
      expect(screen.queryByTestId(TEST_IDS.DISABLED_TOGGLE)).not.toBeInTheDocument(); // disabled-toggle is disabled
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should maintain proper DOM structure when content is shown', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent();

      // Assert
      const singleToggle = screen.getByTestId(TEST_IDS.SINGLE_TOGGLE);
      const multipleToggles = screen.getByTestId(TEST_IDS.MULTIPLE_TOGGLES);

      expect(singleToggle).toBeVisible();
      expect(multipleToggles).toBeVisible();
      expect(singleToggle.tagName).toBe('DIV');
      expect(multipleToggles.tagName).toBe('DIV');
    });

    it('should handle rapid toggle state changes gracefully', async () => {
      // Arrange
      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(false);
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(false);

      const { rerender } = await renderComponent();

      // Act - Rapidly toggle between states
      for (let i = 0; i < 5; i++) {
        const isEnabled = i % 2 === 0;
        mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(isEnabled);
        // Use different toggle names to force re-evaluation
        const dynamicToggleName = `${TOGGLE_NAMES.TOGGLE1}-${i}`;
        rerender({ componentProperties: { singleToggle: dynamicToggleName } });

        if (isEnabled) {
          expect(screen.getByTestId(TEST_IDS.SINGLE_TOGGLE)).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId(TEST_IDS.SINGLE_TOGGLE)).not.toBeInTheDocument();
        }
      }
    });
  });

  describe('Integration with Service', () => {
    it('should call service methods with correct parameters for different expression types', async () => {
      // Arrange
      const testToggleName = 'test-toggle';
      const toggleArray = ['toggle-a', 'toggle-b', 'toggle-c'];
      const inverseTestToggle = 'inverse-test';
      const inverseToggleExpression = `!${inverseTestToggle}`;

      mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED].mockReturnValue(true);
      mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED].mockReturnValue(true);

      // Act
      await renderComponent({
        singleToggle: testToggleName,
        multipleToggles: toggleArray,
        inverseToggle: inverseToggleExpression,
      });

      // Assert
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(testToggleName);
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(inverseTestToggle);
      expect(mockReleaseToggleService[SERVICE_METHODS.IS_ENABLED]).toHaveBeenCalledWith(TOGGLE_NAMES.DISABLED_TOGGLE);
      expect(mockReleaseToggleService[SERVICE_METHODS.HAS_ALL_ENABLED]).toHaveBeenCalledWith(toggleArray);
    });
  });
});
