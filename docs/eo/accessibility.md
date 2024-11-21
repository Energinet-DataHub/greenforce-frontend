# Accessibility

Energinet commits to making the website https://energytrackandtrace.dk accessible, in accordance with the "Act on Accessibility of Public Bodies' Websites and Mobile Applications" (Danish: "Lov om tilgængelighed af offentlige organers websteder og mobilapplikationer").

## Developer Responsibilities

### Understanding Compliance Requirements

1. Review and understand the accessibility statement available [here](https://www.was.digst.dk/energytrackandtrace-dk)
2. Ensure all development work maintains compliance with the accessibility statement
3. Report any necessary changes or concerns to the team's business developer
4. For detailed guidance on accessibility statements, visit the [official Danish guidelines](https://digst.dk/digital-inklusion/webtilgaengelighed/vejledning/udfyldelse-af-tilgaengelighedserklaering/)

### Testing Requirements

#### Public Pages
- Use the QualWeb evaluator tool: https://qualweb.di.fc.ul.pt/evaluator/
- Run tests before deploying any significant UI changes
- Document test results and any remediation actions taken

#### Protected Pages (Behind Login)
- Automated testing tools like QualWeb cannot access these pages
- Implement manual accessibility testing
- Consider using tools like:
 - WAVE (Web Accessibility Evaluation Tool)
 - Screen readers (e.g., NVDA, VoiceOver)
 - Keyboard navigation testing

### Technical Implementation Requirements

#### WAS URI Configuration
- Maintain the `/was` URI endpoint
- Ensure proper redirection to https://www.was.digst.dk/energytrackandtrace-dk
- This redirection is mandatory for Danish public sector accessibility compliance

#### Development Best Practices

1. **Semantic HTML**
  - Use appropriate HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
  - Implement proper heading hierarchy (h1-h6)
  - Use semantic lists and tables when appropriate

2. **ARIA Implementation**
  - Add ARIA labels where necessary
  - Use ARIA landmarks appropriately
  - Implement ARIA roles when HTML semantics aren't sufficient
  - Avoid redundant ARIA attributes

3. **Images and Media**
  - Provide meaningful alt text for images
  - Include captions for videos
  - Ensure proper contrast ratios for text and background
  - Provide text alternatives for non-text content

4. **Keyboard Navigation**
  - Ensure all interactive elements are focusable
  - Implement logical tab order
  - Provide visible focus indicators
  - Add skip links for main content

5. **Forms**
  - Associate labels with form controls
  - Provide clear error messages
  - Use fieldset and legend where appropriate
  - Implement proper form validation feedback

### Compliance Monitoring

1. Regular accessibility audits
2. Document any identified issues
3. Maintain an accessibility improvement backlog
4. Track and verify fixes

## Additional Resources

- [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Danish Digital Agency's Accessibility Guidelines](https://digst.dk/digital-inklusion/webtilgaengelighed/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Support and Contact

For questions or concerns regarding accessibility:
- Contact the team's business developer
- Document issues in the project management system
- Include accessibility considerations in code reviews
