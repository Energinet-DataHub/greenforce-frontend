import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShellComponent } from './shell.component';
import { ShellModule } from './shell.module';

export default {
  title: 'Components/Shell',
  component: ShellComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, ShellModule],
    }),
  ],
} as Meta<ShellComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<ShellComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const shell = Template.bind({});
shell.storyName = 'Empty';

const withContentTemplate = `
<watt-shell>
  <ng-container sidenav>
    Sidenav
  </ng-container>

  <ng-container toolbar>
    Toolbar
  </ng-container>

  Main content
</watt-shell>
`;

export const withContent = () => ({
  template: withContentTemplate,
});
withContent.storyName = 'With content';
withContent.parameters = {
  docs: {
    source: {
      code: withContentTemplate,
    },
  },
};
