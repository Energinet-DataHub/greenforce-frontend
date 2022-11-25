import { Injectable, TemplateRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class WattTopBarService {
  template = new BehaviorSubject<TemplateRef<unknown> | null>(null);
}
