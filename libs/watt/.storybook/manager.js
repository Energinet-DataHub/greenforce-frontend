import { addons } from '@storybook/addons';
import wattTheme from './theme';

addons.setConfig({
  theme: wattTheme,
});

const link = document.createElement('link');
link.setAttribute('rel', 'icon');
link.setAttribute('type', 'image/svg+xml');
link.setAttribute('href', '/assets/watt/watt-icon.svg');
document.head.appendChild(link);
