import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  HostListener
} from "@angular/core";
import { config } from "./config";
@Directive({
  selector: "[onlyForScreen]"
})
export class OnlyForScreenDirective {
  @Input("onlyForScreen") onlyForScreen: string;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {
    renderer.listen("window", "resize", () => this.onResize());
  }

  ngOnInit() {
    this.onResize();
  }

  @HostListener("window:resize") onResize() {
    const width = window.innerWidth;
    let show = false;
    if (width < config.mobile) {
      show = this.onlyForScreen === "mobile";
    } else if (width < config.tablet) {
      show = this.onlyForScreen === "tablet";
    } else {
      show = this.onlyForScreen === "desktop";
    }
    if (show && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!show && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
