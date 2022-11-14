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
export class Footer {
  private logo = 'img[alt="Energinet"].logo';
  private privacyPolicy = 'a[aria-label="privacypolicy"]';
  private accessibility = 'a[aria-label="accessibility"]';
  private phone = 'a[aria-label="phone"]';
  private email = 'a[aria-label="email"]';
  private footer = () => cy.get('eo-footer');

  // Visibility
  isVisible = () => this.footer().should('be.visible');
  hasLogo = () => this.footer().get(this.logo).should('be.visible');
  hasPrivacyPolicyLink = () =>
    this.footer().get(this.privacyPolicy).should('be.visible');
  hasAccessibilityLink = () =>
    this.footer().get(this.accessibility).should('be.visible');
  hasPhoneLink = () => this.footer().get(this.phone).should('be.visible');
  hasEmailLink = () => this.footer().get(this.email).should('be.visible');
}
