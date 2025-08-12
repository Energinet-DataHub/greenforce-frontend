
import { render, screen, waitFor } from '@testing-library/angular';
import { Component } from '@angular/core';
import userEvent from '@testing-library/user-event';
import { timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { WattDrawerComponent, WATT_DRAWER } from './watt-drawer.component';
import { WattButtonComponent } from '../button';
import { WATT_CARD } from '../card';

// Test content component to simulate the storybook content
@Component({
  selector: 'watt-test-drawer-content',
  standalone: true,
  imports: [AsyncPipe, WATT_CARD],
  template: `
    <p>Drawer has been opened for: {{ timer$ | async }}s</p>
  `
})
class TestDrawerContentComponent {
  timer$ = timer(0, 1000);
}

describe(WattDrawerComponent.name, () => {
  // Queries
  const getOpenDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: /^open drawer/i,
    });
  const getExternalCloseDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: /^close drawer from outside of the drawer/i,
    });
  const getInternalCloseDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: 'close',
    });
  const getDrawerTopBarContent: () => HTMLSpanElement | null = () => screen.queryByText(/top bar/i);
  const getDrawerActions: () => HTMLButtonElement | null = () =>
    screen.queryByText(/Primary action/i);
  const getDrawerContent: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/drawer has been opened for/i);
  const getInitialTimer: () => HTMLParagraphElement | null = () => screen.queryByText(/0s/i);
  const getStartedTimer: () => HTMLParagraphElement | null = () => screen.queryByText(/1s/i);

  // Fakes
  let closedOutput = vi.fn();

  // Setup
  async function setup(template: string, componentProps: any = {}) {
    @Component({
      standalone: true,
      imports: [WATT_DRAWER, WattButtonComponent, TestDrawerContentComponent],
      template,
    })
    class TestComponent {
      loading = false;
      size: 'small' | 'normal' | 'large' = 'normal';
      onClosed = closedOutput;
      
      constructor() {
        Object.assign(this, componentProps);
      }
    }

    const result = await render(TestComponent);
    return result;
  }

  afterEach(() => {
    closedOutput = vi.fn();
  });

  const defaultTemplate = `
    <watt-drawer #drawer [size]="size" [loading]="loading" (closed)="onClosed()">
      <watt-drawer-topbar>
        <span>Top bar</span>
      </watt-drawer-topbar>

      <watt-drawer-actions>
        <watt-button variant="secondary">Secondary action</watt-button>
        <watt-button>Primary action</watt-button>
      </watt-drawer-actions>

      @if (drawer.isOpen()) {
        <watt-drawer-content>
          <watt-test-drawer-content></watt-test-drawer-content>
        </watt-drawer-content>
      }
    </watt-drawer>

    <watt-button (click)="drawer.open()">Open drawer</watt-button>
    <watt-button (click)="drawer.close()">Close drawer from outside of the drawer</watt-button>
  `;

  it('should open drawer', async () => {
    await setup(defaultTemplate);

    expect(getDrawerContent()).not.toBeInTheDocument();

    userEvent.click(getOpenDrawerButton());

    expect(getDrawerTopBarContent()).toBeInTheDocument();
    expect(getDrawerActions()).toBeInTheDocument();
    expect(getDrawerContent()).toBeInTheDocument();
  });

  it('should not add content more than once, when "open" is called multiple times', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getOpenDrawerButton());

    expect(getDrawerTopBarContent()).toBeInTheDocument();
    expect(getDrawerActions()).toBeInTheDocument();
    expect(getDrawerContent()).toBeInTheDocument();
  });

  it('should not load content, before the drawer is opened', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());

    await waitFor(() => {
      expect(getInitialTimer()).toBeInTheDocument();
    });
  });

  it('should close drawer, triggered externally outside of the drawer', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getExternalCloseDrawerButton());

    expect(getDrawerContent()).not.toBeInTheDocument();
  });

  it('should close drawer, triggered internally inside of the drawer', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getInternalCloseDrawerButton());

    expect(getDrawerContent()).not.toBeInTheDocument();
  });

  // Note: Skipped because the test does not really assert
  // that the content is destroyed when the the component is destroyed.
  // It's actually testing that the content is destroyed because there's an `ngIf` applied to it.
  // This is a feature of the framework, not of the component.
  // Applying `ngIf` to the content is not required, thus easy to forget.
  it.skip('should destroy content when closing', async () => {
    vi.useFakeTimers();
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(
      () => {
        expect(getStartedTimer()).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    userEvent.click(getInternalCloseDrawerButton());
    userEvent.click(getOpenDrawerButton());

    await waitFor(() => {
      expect(getStartedTimer()).not.toBeInTheDocument();
      expect(getInitialTimer()).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it('should output `closed` when drawer is closed', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(() => expect(getDrawerContent()).toBeInTheDocument());
    
    userEvent.click(getInternalCloseDrawerButton());

    await waitFor(() => expect(closedOutput).toHaveBeenCalled());
  });

  it('should output `closed` when drawer is closed, from outside the drawer', async () => {
    await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(() => expect(getDrawerContent()).toBeInTheDocument());
    
    userEvent.click(getExternalCloseDrawerButton());

    await waitFor(() => expect(closedOutput).toHaveBeenCalled());
  });

  it('closes on global Escape', async () => {
    const { container } = await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(() => expect(getDrawerContent()).toBeInTheDocument());
    
    // Find the drawer element and dispatch escape key event on it
    const drawer = container.querySelector('watt-drawer');
    if (drawer) {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      drawer.dispatchEvent(event);
    }

    await waitFor(() => expect(closedOutput).toHaveBeenCalled());
  });

  it('closes on Escape when focus is in the drawer', async () => {
    const { container } = await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(() => expect(getDrawerContent()).toBeInTheDocument());

    // Focus on drawer content and dispatch escape key
    const drawer = container.querySelector('watt-drawer');
    if (drawer) {
      getDrawerTopBarContent()?.focus();
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      drawer.dispatchEvent(event);
    }

    await waitFor(() => expect(closedOutput).toHaveBeenCalled());
  });

  it.skip('calls "closed" only once when Escape is pressed multiple times', async () => {
    const { container } = await setup(defaultTemplate);

    userEvent.click(getOpenDrawerButton());
    await waitFor(() => expect(getDrawerContent()).toBeInTheDocument());
    
    // Reset the spy
    closedOutput.mockClear();
    
    // Dispatch first escape key event
    const drawer = container.querySelector('watt-drawer');
    if (drawer) {
      const event1 = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      drawer.dispatchEvent(event1);
    }

    // Wait for closed to be called
    await waitFor(() => expect(closedOutput).toHaveBeenCalled());
    
    // Now dispatch second escape key event
    if (drawer) {
      const event2 = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      drawer.dispatchEvent(event2);
    }
    
    // Give it a moment to see if it gets called again
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should only be called once
    expect(closedOutput).toHaveBeenCalledTimes(1);
  });

  it('does not call "closed" on Escape when drawer is closed', async () => {
    await setup(defaultTemplate);

    userEvent.keyboard('{Escape}');

    expect(closedOutput).not.toHaveBeenCalled();
  });

  const multipleTemplate = `
    <watt-drawer #first (closed)="onClosed()">
      @if (first.isOpen()) {
        <watt-drawer-content>
          First drawer
        </watt-drawer-content>
      }
    </watt-drawer>

    <watt-drawer #second (closed)="onClosed()">
      @if (second.isOpen()) {
        <watt-drawer-content>
          Second drawer
        </watt-drawer-content>
      }
    </watt-drawer>

    <watt-button (click)="first.open()">Open first</watt-button>
    <watt-button (click)="second.open()">Open second</watt-button>
  `;

  it('closes drawer when another drawer is opened', async () => {
    await setup(multipleTemplate);
    const firstButton = screen.getByRole('button', { name: /^open first/i });
    const secondButton = screen.getByRole('button', { name: /^open second/i });

    userEvent.click(firstButton);
    await waitFor(() => expect(screen.queryByText(/first drawer/i)).toBeInTheDocument());
    
    userEvent.click(secondButton);

    await waitFor(() => {
      expect(closedOutput).toHaveBeenCalled();
      expect(screen.queryByText(/first drawer/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/second drawer/i)).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    await setup(defaultTemplate, { loading: true });

    userEvent.click(getOpenDrawerButton());

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // Note: Skipped because the test is flaky.
  // It passes when executed individually but fails as part of the complete test suite.
  it.skip('closes drawer when clicking outside', async () => {
    await setup(multipleTemplate);

    userEvent.click(screen.getByRole('button', { name: /^open first/i }));

    // This is an implementation detail, but it is the only way to test
    // this behavior - otherwise the second click is happening in
    // the same event loop as the button click (synchronous).
    await new Promise((res) => setTimeout(res, 0));

    userEvent.click(document.body);

    expect(closedOutput).toHaveBeenCalled();
    expect(getDrawerTopBarContent()).not.toBeInTheDocument();
  });

  it('does not call "closed" when click outside triggers an open', async () => {
    await setup(multipleTemplate);

    userEvent.click(screen.getByRole('button', { name: /^open first/i }));
    userEvent.click(screen.getByRole('button', { name: /^open second/i }));

    expect(closedOutput).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText(/second drawer/i)).toBeInTheDocument());
  });
});
