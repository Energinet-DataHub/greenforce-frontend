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
export class LandingPagePO {
  private path = '/';
  private loginButton = '[data-testid="login-button"]';
  private pageHeaderText = 'Trace Energy to Its Origin.Truthfully.';
  private privateNotAllowed = 'errorCode=601';

  // Visibility
  headerIsVisible = () => cy.get('h1').should('contain.text', this.pageHeaderText);
  loginButtonsVisible = (amount: number) => cy.get(this.loginButton).should('have.length', amount);
  urlShowsPrivateUserNotAllowed = () => cy.url().should('contain', this.privateNotAllowed);

  // Interaction
  navigateTo = () => cy.visit(this.path);
  clickLoginButton = () => cy.get(this.loginButton, {timeout: 10000}).click();
}
