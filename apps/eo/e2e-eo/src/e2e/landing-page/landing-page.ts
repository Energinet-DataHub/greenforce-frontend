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
import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { FooterPO, LandingPagePO } from '../../page-objects';

const landingPage = new LandingPagePO();
const footer = new FooterPO();

Given('I am on the landing page', () => {
  landingPage.navigateTo();
  landingPage.headerIsVisible();
});

Then('I can see 1 login button', () => landingPage.loginButtonsVisible(1));

Then('I can see a footer with content in it', () => {
  footer.isVisible();
  footer.hasLogo();
  footer.hasPrivacyPolicyLink();
  footer.hasAccessibilityLink();
  footer.hasPhoneLink();
  footer.hasEmailLink();
});
