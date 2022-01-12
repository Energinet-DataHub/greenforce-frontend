export const getNemidLink = () => cy.findByRole('link', { name: /NemID/i });
export const navigateTo = () => cy.visit('/login');
