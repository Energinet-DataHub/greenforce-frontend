export class SharedUtilities {
  static scrollToAnchor(element: string): void {
    document.getElementById(element)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
