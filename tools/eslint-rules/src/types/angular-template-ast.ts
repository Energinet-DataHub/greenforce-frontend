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

/**
 * Type definitions for Angular template AST nodes.
 *
 * The Angular ESLint template parser doesn't export strongly typed AST nodes,
 * so we define our own interfaces based on the runtime structure.
 * These types represent the actual structure we receive from the parser.
 */

/**
 * Represents the location information for an AST node
 */
export interface TemplateNodeLocation {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

/**
 * Represents an HTML element node in an Angular template AST
 */
export interface TemplateElementNode {
  /** The tag name of the element (e.g., 'div', 'watt-field-error') */
  name: string;
  /** Location information for the element in the source code */
  loc?: TemplateNodeLocation;
  /** Other properties exist but are not typed here */
  [key: string]: unknown;
}
