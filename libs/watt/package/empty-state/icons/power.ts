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

@Component({
  selector: 'watt-empty-state-power',
  template: `
    <svg viewBox="0 0 96 116" fill="none">
      <path
        fill="currentColor"
        d="M48.9 89.88v25.914c-.606.042-1.213.042-1.818 0v-25.91c-.507-.042-.963-.083-1.422-.117-5.211-.394-9.989-2.067-14.383-4.875-4.834-3.091-8.642-7.183-11.614-12.07a42.881 42.881 0 0 1-5.505-14.54 46.448 46.448 0 0 1-.788-8.755V38.27c-.24 0-.446-.027-.655-.027H0v-1.8h24.536c.01-.268.027-.479.027-.69v-30.8a4.936 4.936 0 0 1 9.87-.145v31.527c.403.125 26.458.152 27.06.032 0-.23.03-.476.03-.72V5.198c-.02-.717.1-1.432.352-2.105a4.944 4.944 0 0 1 9.437.922c.07.427.104.86.098 1.294V36.424c1.204.033 2.363 0 3.522.014 1.16.015 2.335 0 3.5 0h17.51c.058.595.062 1.194.01 1.789h-13.32c-.018.252-.05.459-.05.667 0 3.335-.01 6.67 0 10.005a49.34 49.34 0 0 1-.36 6.683c-1.251 9.34-4.857 17.585-11.488 24.388-4.212 4.32-9.242 7.369-15.123 8.916a30.233 30.233 0 0 1-6.253.95c-.137.004-.267.025-.459.044ZM15.216 47.344c-.018.105-.03.211-.036.317-.044 3.204.08 6.393.626 9.56a42.105 42.105 0 0 0 4.123 12.363c2.538 4.873 5.911 9.058 10.316 12.373 5.013 3.773 10.63 5.876 16.932 6.082a27.722 27.722 0 0 0 9.688-1.421c5.11-1.69 9.443-4.586 13.118-8.494 4.552-4.832 7.55-10.527 9.286-16.905a43.867 43.867 0 0 0 1.334-7.567c.181-2.012.173-4.025.169-6.045a2.075 2.075 0 0 0-.03-.24c-.374-.104-64.866-.133-65.526-.023Zm.035-9.071c-.12.585-.098 6.787.023 7.166.063.014.126.023.19.027H80.46c.07-.002.14-.01.209-.025a.122.122 0 0 0 .04-.027l.039-.04v-7.101H15.252Zm17.37-1.876V5.317a6.539 6.539 0 0 0-.031-.698A2.989 2.989 0 0 0 30.7 2.084a2.956 2.956 0 0 0-3.15.446c-.833.653-1.181 1.543-1.181 2.585v30.592c0 .227.02.454.033.71l6.22-.02Zm36.96.027V4.73a3.127 3.127 0 0 0-6.235.273v31.433c2.105.005 4.148.009 6.24-.002l-.005-.01Z"
      />
    </svg>
  `,
})
export class WattEmptyStatePowerComponent {}
