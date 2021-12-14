import { screen } from "@testing-library/angular";

export function getByTerm(term: string) {
  const terms = screen.getAllByRole('term');
  let matches = terms.filter((t: HTMLElement) => t.textContent === term);

  if(matches.length === 0) {
    matches = screen.getAllByRole('term', {name: term});
  }

  if(matches.length > 1) {
    throwError(`Multiple terms found with text content or name: ${term}`);
  }

  return matches[0];
}

export function queryByTerm(term: string) {
  const terms = screen.queryAllByRole('term');
  let matches = terms.filter((t: HTMLElement) => t.textContent === term);

  if(matches.length === 0) {
    matches = screen.queryAllByRole('term', {name: term});
  }

  if(matches.length > 1) {
    throwError(`Multiple terms found with text content or name: ${term}`);
  }

  return matches[0] || null;
}

export function getDefinitonByTerm(term: string | HTMLElement) {
  if(typeof term === 'string') {
    term = getByTerm(term);
  }

  const definition = term.nextElementSibling;

  if(!definition) {
    throwError(`No definition found for term: ${term}`);
  } else if(definition.tagName !== 'DD') {
    throwError(`Definition found for term: ${term} is not a definition`);
  }

  return definition;
}

function throwError(msg: string): void {
  screen.debug();
  throw new Error(msg);
}
