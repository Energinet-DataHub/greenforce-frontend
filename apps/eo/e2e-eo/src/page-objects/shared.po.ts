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
export class SharedPO {
  private navListItem = 'watt-nav-list-item';
  private topbarActions = '.watt-toolbar button';

  // Interaction
  clickLogoutMenuItem = () => {
    cy.get('eo-account-menu').click();
    cy.get('watt-button').contains('Logout').click({ force: true });
  };

  clickTransfersMenuItem() {
    cy.window().then((win) => {
      if (win.innerWidth < 1280) {
        cy.get('mat-toolbar').find('watt-button[variant="icon"][icon="menu"]').first().click();

        // Wait for drawer
        cy.get('mat-sidenav').should('have.class', 'mat-drawer-opened');
      }

      cy.get('watt-nav-list-item').contains('Transfers').should('be.visible').click();
    });
  }
  clickConnectionsMenuItem = () =>
    cy.get(this.navListItem, { timeout: 10000 }).contains('Connections').click();
}
