import { render } from '@testing-library/angular';

import {
  WattNavListItemComponent,
  WattNavListItemScam,
} from './watt-nav-list-item.component';

describe(WattNavListItemComponent.name, () => {
  it('`link` input property is `null` by default', async () => {
    const view = await render(WattNavListItemComponent, {
      imports: [WattNavListItemScam],
    });

    const component = view.fixture.componentInstance;

    expect(component.link).toBeNull();
  });
});
