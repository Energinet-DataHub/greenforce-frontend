import { render } from '@testing-library/angular';

import { WattIcon } from './icons';
import { WattIconComponent, WattIconSize, WattIconState } from './index';

describe(WattIconComponent, () => {
  it('has default `size`', async () => {
    const view = await render(WattIconComponent, {
      componentProperties: {
        name: 'search',
      },
    });

    const component = view.fixture.componentInstance;
    const expected: WattIconSize = 'm';

    expect(component.size).toBe(expected);
  });

  it('has default `state`', async () => {
    const view = await render(WattIconComponent, {
      componentProperties: {
        name: 'search',
      },
    });

    const component = view.fixture.componentInstance;
    const expected: WattIconState = 'default';

    expect(component.state).toBe(expected);
  });

  describe('host classes', () => {
    describe('`size` class', () => {
      it('has default value', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
          },
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-size-m');
      });

      it('can be set', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
            size: 'l',
          },
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-size-l');
      });
    });

    describe('`state` class', () => {
      it('has default value', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
          },
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-state-default');
      });

      it('can be set', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
            state: 'success',
          },
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-state-success');
      });
    });
  });

  describe.each([
    ['success', 'success', 'icon-state-success'],
    ['danger', 'danger', 'icon-state-danger'],
    ['warning', 'warning', 'icon-state-warning'],
    ['info', 'info', 'icon-state-info'],
  ])('%s icon', (icon, ownDefaultState, ownStateClass) => {
    it('has own default state', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
        },
      });

      const component = view.fixture.componentInstance;

      expect(component.state).toBe(ownDefaultState);
    });

    it('has own default state class', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
        },
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).toContain(ownStateClass);
    });

    it('cat be set to a different state', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
          state: 'default',
        },
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).not.toContain(ownStateClass);
    });
  });
});
