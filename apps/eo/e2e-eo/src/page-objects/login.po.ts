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
export class LoginPo {
  private thomas = '[value="Thomas Tesla"]';
  private charlotte = '[value="Charlotte CSR"]';
  private ivan = '[value="Ivan Iværksætter"]';
  private peter = '[value="Peter Producent"]';

  // Interaction
  clickIvanLogin = () => cy.get(this.ivan, { timeout: 10000 }).click();
  clickCharlotteLogin = () => cy.get(this.charlotte, { timeout: 10000 }).click();
  clickThomasLogin = () => cy.get(this.thomas, { timeout: 10000 }).click();
  clickPeterLogin = () => cy.get(this.peter, { timeout: 10000 }).click();

  termsIsVisible = () => true; // cy.get('h2', { timeout: 20000 }).should('contain', 'What is Lorem Ipsum?'); // Terms header text

  checkAcceptingTerms = () => true; // cy.get('watt-checkbox > label', { timeout: 10000 }).click();
  acceptTerms = () => true; // cy.get('button').contains('Accept', { timeout: 10000 }).click();

  visit = () => cy.visit('/en/login');
}
