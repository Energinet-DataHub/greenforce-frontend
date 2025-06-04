import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';

import { DhReleaseToggleDirective, ToggleExpression } from './dh-release-toggle.directive';
import { DhReleaseToggleService } from './dh-release-toggle.service';

// Test constants
const CONTENT_TEXT = {
  FEATURE: 'Feature content',
  MULTI_FEATURE: 'Multi-feature content',
  LEGACY_FALLBACK: 'Legacy fallback content',
  DYNAMIC: 'Dynamic content',
  GENERIC: 'Content',
  DASHBOARD: 'Dashboard',
  SETTINGS: 'Settings',
  BETA_FEATURE: 'Beta Feature',
  COMBINED_FEATURES: 'Combined Features',
  COMBINED_DESCRIPTION: 'This content requires both features to be enabled',
  SYSTEM_OPERATIONAL: 'System is operational',
} as const;

const TOGGLE_NAMES = {
  RELEASE_TOGGLE: 'release-toggle',
  TOGGLE_A: 'toggle-a',
  TOGGLE_B: 'toggle-b',
  NEW_RELEASE: 'new-release',
  NAVIGATION_V2: 'navigation-v2',
  BETA_RELEASES: 'beta-releases',
  RELEASE_A: 'release-a',
  RELEASE_B: 'release-b',
  MAINTENANCE_MODE: 'maintenance-mode',
  INITIAL_TOGGLE: 'initial-toggle',
  TOGGLE_1: 'toggle-1',
  TOGGLE_2: 'toggle-2',
  DISABLED_RELEASE: 'disabled-release',
} as const;

// Mock service
const mockReleaseToggleService = {
  isEnabled: jest.fn(),
  areAllEnabled: jest.fn(),
  refetch: jest.fn(),
} as jest.Mocked<Pick<DhReleaseToggleService, 'isEnabled' | 'areAllEnabled' | 'refetch'>>;

describe('DhReleaseToggleDirective', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('String toggle expressions', () => {
    @Component({
      template: `<p *dhReleaseToggle="toggleName">${CONTENT_TEXT.FEATURE}</p>`,
      imports: [DhReleaseToggleDirective]
    })
    class SingleToggleComponent {
      toggleName: string = TOGGLE_NAMES.RELEASE_TOGGLE;
    }

    it('should show content when toggle is enabled', async () => {
      mockReleaseToggleService.isEnabled.mockReturnValue(true);

      await render(SingleToggleComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.getByText(CONTENT_TEXT.FEATURE)).toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(TOGGLE_NAMES.RELEASE_TOGGLE);
    });

    it('should hide content when toggle is disabled', async () => {
      mockReleaseToggleService.isEnabled.mockReturnValue(false);

      await render(SingleToggleComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.queryByText(CONTENT_TEXT.FEATURE)).not.toBeInTheDocument();
    });

    it('should re-evaluate when toggle name changes', async () => {
      // Test with toggle disabled
      mockReleaseToggleService.isEnabled.mockReturnValue(false);

      const { rerender } = await render(SingleToggleComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.queryByText(CONTENT_TEXT.FEATURE)).not.toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(TOGGLE_NAMES.RELEASE_TOGGLE);

      jest.clearAllMocks();

      // Test with toggle enabled and different toggle name to force re-evaluation
      mockReleaseToggleService.isEnabled.mockReturnValue(true);

      rerender({ componentProperties: { toggleName: TOGGLE_NAMES.BETA_RELEASES } });

      expect(screen.getByText(CONTENT_TEXT.FEATURE)).toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(TOGGLE_NAMES.BETA_RELEASES);
    });
  });

  describe('Array toggle expressions', () => {
    @Component({
      template: `<section *dhReleaseToggle="toggles">${CONTENT_TEXT.MULTI_FEATURE}</section>`,
      imports: [DhReleaseToggleDirective]
    })
    class MultipleTogglesComponent {
      toggles = [TOGGLE_NAMES.TOGGLE_A, TOGGLE_NAMES.TOGGLE_B];
    }

    it('should show content when all toggles are enabled', async () => {
      mockReleaseToggleService.areAllEnabled.mockReturnValue(true);

      await render(MultipleTogglesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.getByText(CONTENT_TEXT.MULTI_FEATURE)).toBeInTheDocument();
      expect(mockReleaseToggleService.areAllEnabled).toHaveBeenCalledWith([TOGGLE_NAMES.TOGGLE_A, TOGGLE_NAMES.TOGGLE_B]);
    });

    it('should hide content when not all toggles are enabled', async () => {
      mockReleaseToggleService.areAllEnabled.mockReturnValue(false);

      await render(MultipleTogglesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.queryByText(CONTENT_TEXT.MULTI_FEATURE)).not.toBeInTheDocument();
    });
  });

  describe('Negated toggle expressions', () => {
    @Component({
      template: `<div *dhReleaseToggle="inverseToggle">${CONTENT_TEXT.LEGACY_FALLBACK}</div>`,
      imports: [DhReleaseToggleDirective]
    })
    class InverseToggleComponent {
      inverseToggle = `!${TOGGLE_NAMES.NEW_RELEASE}`;
    }

    it('should show content when negated toggle condition is met', async () => {
      // new-release is disabled, so !new-release should be true
      mockReleaseToggleService.isEnabled.mockReturnValue(false);

      await render(InverseToggleComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.getByText(CONTENT_TEXT.LEGACY_FALLBACK)).toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(TOGGLE_NAMES.NEW_RELEASE);
    });

    it('should hide content when negated toggle condition is not met', async () => {
      // new-release is enabled, so !new-release should be false
      mockReleaseToggleService.isEnabled.mockReturnValue(true);

      await render(InverseToggleComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.queryByText(CONTENT_TEXT.LEGACY_FALLBACK)).not.toBeInTheDocument();
    });
  });

  describe('Multiple directive instances', () => {
    @Component({
      template: `
        <nav *dhReleaseToggle="'${TOGGLE_NAMES.NAVIGATION_V2}'">
          <a href="/dashboard">${CONTENT_TEXT.DASHBOARD}</a>
          <a href="/settings">${CONTENT_TEXT.SETTINGS}</a>
        </nav>

        <button *dhReleaseToggle="'${TOGGLE_NAMES.BETA_RELEASES}'" class="beta-btn">
          ${CONTENT_TEXT.BETA_FEATURE}
        </button>

        <ng-container *dhReleaseToggle="['${TOGGLE_NAMES.RELEASE_A}', '${TOGGLE_NAMES.RELEASE_B}']">
          <h2>${CONTENT_TEXT.COMBINED_FEATURES}</h2>
          <p>${CONTENT_TEXT.COMBINED_DESCRIPTION}</p>
        </ng-container>

        <div *dhReleaseToggle="'!${TOGGLE_NAMES.MAINTENANCE_MODE}'" class="alert alert-info" role="alert">
          ${CONTENT_TEXT.SYSTEM_OPERATIONAL}
        </div>
      `,
      imports: [DhReleaseToggleDirective]
    })
    class MultipleDirectivesComponent {}

    it('should handle navigation element with string toggle', async () => {
      mockReleaseToggleService.isEnabled.mockImplementation((toggle) => toggle === TOGGLE_NAMES.NAVIGATION_V2);

      await render(MultipleDirectivesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText(CONTENT_TEXT.DASHBOARD)).toBeInTheDocument();
    });

    it('should handle button element with string toggle', async () => {
      mockReleaseToggleService.isEnabled.mockImplementation((toggle) => toggle === TOGGLE_NAMES.BETA_RELEASES);

      await render(MultipleDirectivesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      const betaButton = screen.getByRole('button', { name: CONTENT_TEXT.BETA_FEATURE });
      expect(betaButton).toBeInTheDocument();
      expect(betaButton).toHaveClass('beta-btn');
    });

    it('should handle ng-container with array toggles', async () => {
      mockReleaseToggleService.areAllEnabled.mockImplementation((toggles) =>
        JSON.stringify(toggles) === JSON.stringify([TOGGLE_NAMES.RELEASE_A, TOGGLE_NAMES.RELEASE_B])
      );

      await render(MultipleDirectivesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.getByText(CONTENT_TEXT.COMBINED_FEATURES)).toBeInTheDocument();
      expect(screen.getByText(CONTENT_TEXT.COMBINED_DESCRIPTION)).toBeInTheDocument();
    });

    it('should handle alert div with negated toggle', async () => {
      mockReleaseToggleService.isEnabled.mockImplementation((toggle) => toggle !== TOGGLE_NAMES.MAINTENANCE_MODE);

      await render(MultipleDirectivesComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      const alertDiv = screen.getByRole('alert');
      expect(alertDiv).toBeInTheDocument();
      expect(alertDiv).toHaveTextContent(CONTENT_TEXT.SYSTEM_OPERATIONAL);
      expect(alertDiv).toHaveClass('alert', 'alert-info');
    });
  });

  describe('Service state changes', () => {
    @Component({
      template: `<div *dhReleaseToggle="currentToggle">${CONTENT_TEXT.DYNAMIC}</div>`,
      imports: [DhReleaseToggleDirective]
    })
    class ToggleStateComponent {
      currentToggle: ToggleExpression = TOGGLE_NAMES.RELEASE_TOGGLE;

      refreshToggleState(newToggleName: string) {
        this.currentToggle = newToggleName;
      }
    }

    it('should reflect current service state on re-evaluation', async () => {
      // First render - toggle disabled
      mockReleaseToggleService.isEnabled.mockReturnValue(false);

      const { fixture } = await render(ToggleStateComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      expect(screen.queryByText(CONTENT_TEXT.DYNAMIC)).not.toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(TOGGLE_NAMES.RELEASE_TOGGLE);

      // Simulate toggle being enabled and component being updated
      mockReleaseToggleService.isEnabled.mockReturnValue(true);

      const component = fixture.componentInstance as ToggleStateComponent;
      component.refreshToggleState(`${TOGGLE_NAMES.RELEASE_TOGGLE}-refreshed`);
      fixture.detectChanges();

      expect(screen.getByText(CONTENT_TEXT.DYNAMIC)).toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(`${TOGGLE_NAMES.RELEASE_TOGGLE}-refreshed`);
    });

    it('should handle rapid service state changes', async () => {
      const states = [false, true, false, true];

      mockReleaseToggleService.isEnabled.mockReturnValue(states[0]);

      const { fixture } = await render(ToggleStateComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }]
      });

      const component = fixture.componentInstance as ToggleStateComponent;

      for (let i = 0; i < states.length; i++) {
        mockReleaseToggleService.isEnabled.mockReturnValue(states[i]);

        component.refreshToggleState(`${TOGGLE_NAMES.RELEASE_TOGGLE}-state-${i}`);
        fixture.detectChanges();

        if (states[i]) {
          expect(screen.getByText(CONTENT_TEXT.DYNAMIC)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(CONTENT_TEXT.DYNAMIC)).not.toBeInTheDocument();
        }
      }
    });
  });

  describe('Expression type switching', () => {
    @Component({
      template: `<span *dhReleaseToggle="expression">${CONTENT_TEXT.DYNAMIC}</span>`,
      imports: [DhReleaseToggleDirective]
    })
    class DynamicExpressionComponent {
      expression: ToggleExpression = '';
    }

    it('should update when expression format changes', async () => {
      mockReleaseToggleService.isEnabled.mockReturnValue(true);
      mockReleaseToggleService.areAllEnabled.mockReturnValue(true);

      const { rerender } = await render(DynamicExpressionComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }],
        componentProperties: { expression: TOGGLE_NAMES.INITIAL_TOGGLE }
      });

      expect(screen.getByText(CONTENT_TEXT.DYNAMIC)).toBeInTheDocument();

      // Change to multiple toggles
      rerender({ componentProperties: { expression: [TOGGLE_NAMES.TOGGLE_1, TOGGLE_NAMES.TOGGLE_2] } });
      expect(screen.getByText(CONTENT_TEXT.DYNAMIC)).toBeInTheDocument();

      // Change to inverse toggle with disabled state
      mockReleaseToggleService.isEnabled.mockReturnValue(false);
      rerender({ componentProperties: { expression: `!${TOGGLE_NAMES.DISABLED_RELEASE}` } });
      expect(screen.getByText(CONTENT_TEXT.DYNAMIC)).toBeInTheDocument();
    });
  });

  describe('Invalid input handling', () => {
    @Component({
      template: `<div *dhReleaseToggle="expression">${CONTENT_TEXT.GENERIC}</div>`,
      imports: [DhReleaseToggleDirective]
    })
    class EdgeCaseComponent {
      expression: ToggleExpression = '';
    }

    it('should hide content for empty expression', async () => {
      await render(EdgeCaseComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }],
        componentProperties: { expression: '' }
      });

      expect(screen.queryByText(CONTENT_TEXT.GENERIC)).not.toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).not.toHaveBeenCalled();
      expect(mockReleaseToggleService.areAllEnabled).not.toHaveBeenCalled();
    });

    it('should handle complex toggle names', async () => {
      const complexToggle = 'release-with-dashes_and_underscores.and.dots';
      mockReleaseToggleService.isEnabled.mockReturnValue(true);

      await render(EdgeCaseComponent, {
        providers: [{ provide: DhReleaseToggleService, useValue: mockReleaseToggleService }],
        componentProperties: { expression: complexToggle }
      });

      expect(screen.getByText(CONTENT_TEXT.GENERIC)).toBeInTheDocument();
      expect(mockReleaseToggleService.isEnabled).toHaveBeenCalledWith(complexToggle);
    });
  });
});
