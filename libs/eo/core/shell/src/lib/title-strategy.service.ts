import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  #transloco = inject(TranslocoService);

  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.#transloco.selectTranslate(title).subscribe((title: string) => {
        this.title.setTitle(title);
      });
    }
  }
}
