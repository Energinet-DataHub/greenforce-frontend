/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
export { WattModule } from './lib/ui-watt.module';

export { WattAutocompleteComponent } from './lib/components/autocomplete/autocomplete.component';
export { WattAutocompleteModule } from './lib/components/autocomplete/autocomplete.module';

export { WattColorHelperService } from './lib/foundations/color/color-helper.service';
export { WattColor } from './lib/foundations/color/colors';

export { WattButtonType } from './lib/components/button/watt-button-type';
export { WattButtonSize } from './lib/components/button/watt-button-size';
export { WattButtonComponent } from './lib/components/button/watt-button.component';
export { WattButtonModule } from './lib/components/button/watt-button.module';

export { WattShellComponent } from './lib/components/shell/shell.component';
export { WattShellModule } from './lib/components/shell/shell.module';

export { WattFormFieldModule } from './lib/components/form-field/form-field.module';
export { WattInputModule } from './lib/components/input/input.module';

export * from './lib/foundations/breakpoints';
