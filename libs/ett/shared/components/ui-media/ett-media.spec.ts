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
import { render, screen } from '@testing-library/angular';

import { Ett_MEDIA } from './ett-media.component';

describe('Energy Track and Trace Media atom', () => {
  const findMedia = () => screen.findByTestId('media');
  const findMediaBox = () => screen.findByTestId('media-box');
  const findMediaBody = () => screen.findByTestId('media-body-box');
  const findMediaImage = () => screen.findByTestId('media-image-box');
  const itemOrderEnd = Number.MAX_SAFE_INTEGER;
  const itemOrderStart = Number.MIN_SAFE_INTEGER;

  it(`
  Given a gap is specified
  Then the gap size between the media body and media image is set`, async () => {
    // Arrange
    await render(
      `
      <ett-media [ettMediaGapPixels]="40"><!-- 👈 -->
        <img
          ettMediaImage
          alt="Example image"
        />

        <h1>Example title</h1>

        <p>
          Example copy
        </p>
      </ett-media>
    `,
      {
        imports: [Ett_MEDIA],
      }
    );

    // Act

    // Assert
    expect(await findMediaBox()).toHaveStyle({
      gap: '40px',
    });
  });

  describe(`
  Given a media max width is specified
    And a media image max width is specified
  `, () => {
    it(`

    Then the size ratio between the media body and the media image is set`, async () => {
      // Arrange
      await render(
        `
        <ett-media [ettMediaMaxWidthPixels]="1000"><!-- 👈 -->
          <img ettMediaImage [ettMediaImageMaxWidthPixels]="600" /><!-- 👈 -->

          <h1>Example title</h1>

          <p>
            Example copy
          </p>
        </ett-media>
      `,
        {
          imports: [Ett_MEDIA],
        }
      );

      // Act

      // Assert
      expect(await findMediaImage()).toHaveStyle({
        flexBasis: '600px',
      });
      expect(await findMediaBody()).toHaveStyle({
        flexBasis: '400px',
      });
    });

    it(`

    Then the max width of the media box is set`, async () => {
      // Arrange
      await render(
        `
        <ett-media [ettMediaMaxWidthPixels]="1000"><!-- 👈 -->
          <img ettMediaImage alt="Example image" />

          <h1>Example title</h1>

          <p>
            Example copy
          </p>
        </ett-media>
      `,
        {
          imports: [Ett_MEDIA],
        }
      );

      // Act

      // Assert
      expect(await findMedia()).toHaveStyle({
        maxWidth: '1000px',
      });
    });
  });

  it(`
  Given no media image alignment is specified
  Then the media image is aligned to the start of the media box`, async () => {
    await render(
      `
      <ett-media>
        <img ettMediaImage [ettMediaImageAlign]="null" /><!-- 👈 -->
        <!-- or: <img ettMediaImage /> -->

        <h1>Example title</h1>

        <p>
          Example copy
        </p>
      </ett-media>
    `,
      {
        imports: [Ett_MEDIA],
      }
    );

    // Act

    // Assert
    expect(await findMediaImage()).toHaveStyle({
      order: itemOrderStart,
    });
  });

  it(`
  Given start alignment of the media image is specified
  Then the media image is aligned to the start of the media box`, async () => {
    // Arrange
    await render(
      `
      <ett-media>
        <img ettMediaImage ettMediaImageAlign="start" /><!-- 👈 -->

        <h1>Example title</h1>

        <p>
          Example copy
        </p>
      </ett-media>
    `,
      {
        imports: [Ett_MEDIA],
      }
    );

    // Act

    // Assert
    expect(await findMediaImage()).toHaveStyle({
      order: itemOrderStart,
    });
  });

  it(`
  Given end alignment of the media image is specified
  Then the media image is aligned to the end of the media box`, async () => {
    // Arrange
    await render(
      `
      <ett-media>
        <img ettMediaImage ettMediaImageAlign="end" /><!-- 👈 -->

        <h1>Example title</h1>

        <p>
          Example copy
        </p>
      </ett-media>
    `,
      {
        imports: [Ett_MEDIA],
      }
    );

    // Act

    // Assert
    expect(await findMediaImage()).toHaveStyle({
      order: itemOrderEnd,
    });
  });
});
