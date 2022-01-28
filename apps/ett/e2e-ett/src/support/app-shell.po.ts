export const findDrawer = () => cy.get('mat-sidenav:not(.ng-animating)');
export const findLogOutMenuItem = () =>
  cy.findByRole('link', { name: /Log out/i });
export const findMenu = () =>
  cy.findByLabelText(/Menu/i, {
    selector: 'mat-sidenav:not(.ng-animating) [role="navigation"]',
  });
