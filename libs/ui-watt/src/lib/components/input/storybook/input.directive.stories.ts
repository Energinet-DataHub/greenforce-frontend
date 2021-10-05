import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { InputComponent } from './input.component';
import { InputStoriesModule } from './input.stories.module';

export default {
  title: 'Components/Input',
  component: InputComponent,
  decorators: [
    moduleMetadata({
      imports: [InputStoriesModule],
    })
  ]
} as Meta<InputComponent>;

const Template: Story<InputComponent> = (args) => ({
  props: args,
});

export const Input = Template.bind({});
Input.args = {
  hasPrefix: true,
  hasSuffix: true,
  hasHint: true
};

export const disabled = Template.bind({});
disabled.args = {
  disabled: true
};
disabled.parameters = {
  docs: {
    source: {
      code: `// HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
</watt-form-field>

// TypeScript (should be done via ReactiveForms and not by attribute):
exampleFormControl = new FormControl({value: '', disabled: true});`
    }
  }
};

export const sizeLarge = Template.bind({});
sizeLarge.args = {
  size: 'large'
};
sizeLarge.parameters = {
  docs: {
    source: {
      code: `<watt-form-field size="large">
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
</watt-form-field>`
    }
  }
};

export const withPrefix = Template.bind({});
withPrefix.args = {
  hasPrefix: true
};
withPrefix.parameters = {
  docs: {
    source: {
      code: `<watt-form-field>
  <watt-label>label</watt-label>
  <button wattPrefix aria-label="some meaningful description">
    icon
  </button>
  <input wattInput />
</watt-form-field>`
    }
  }
};

export const withSuffix = Template.bind({});
withSuffix.args = {
  hasSuffix: true
};
withSuffix.parameters = {
  docs: {
    source: {
      code: `<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput />
  <button wattSuffix aria-label="some meaningful description">
    icon
  </button>
</watt-form-field>`
    }
  }
};

export const withHints = Template.bind({});
withHints.args = {
  hasHint: true
};
withHints.parameters = {
  docs: {
    source: {
      code: `HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
  <watt-hint>Some hint</watt-hint>
  <watt-hint align="end">{{exampleFormControl.value.length}} / 256</watt-hint>
</watt-form-field>

TypeScript:
exampleFormControl = new FormControl('');
`
    }
  }
};

export const withError = Template.bind({});
withError.args = {
  hasError: true
};
withError.parameters = {
  docs: {
    source: {
      code: `HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
  <watt-error *ngIf="exampleFormControl.hasError('required')">
    This field is required
  </watt-error>
</watt-form-field>

TypeScript:
exampleFormControl = new FormControl('', [
  Validators.required
]);
`
    }
  }
};


