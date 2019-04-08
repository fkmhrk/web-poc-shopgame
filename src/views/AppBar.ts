import Ractive from "../ractive";
import { mdcMenu } from "../decorators/mdc";
import { MDCMenu } from "@material/menu";

export default class AppBar implements IAppBar {
    private ractive: Ractive;
    private menu!: MDCMenu;
    private menuCallback: ((item: IMenu) => void) | null = null;

    constructor() {
        this.ractive = new Ractive({
            el: "#appbar",
            template: `
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      {{#if hasBack}}<i class="material-icons mdc-top-app-bar__navigation-icon" on-click="back">arrow_back</i>{{/if}}
      <span class="mdc-top-app-bar__title">{{title}}</span>
    </section>

    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end " role="toolbar">
      {{#if menuItems.length > 0}}
      <span class="material-icons mdc-top-app-bar__action-item" aria-label="Menu" alt="Menu" on-click="openMenu">more_vert</span>
      {{/if}}
    </section>
  </div>
</header>
<div style="position:fixed; top:56px; right: 0;" class="mdc-menu-surface--anchor">
  <div class="mdc-menu mdc-menu-surface" tabindex="-1">
    <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical">
    {{#menuItems}}
      <li class="mdc-list-item" role="menuitem" on-click="['menuClicked',.]">
        <span class="mdc-list-item__text">{{.label}}</span>
      </li>
    {{/}}
    </ul>
  </div>
</div>`,
            data: {
                title: "The shop",
                menuItems: [],
            },
            on: {
                complete: () => {
                    this.menu = new MDCMenu(
                        document.querySelector(".mdc-menu")!
                    );
                },
                back: () => {
                    window.history.back();
                },
                openMenu: () => {
                    this.menu.open = !this.menu.open;
                },
                menuClicked: (e: any, item: IMenu) => {
                    if (this.menuCallback != null) {
                        this.menuCallback(item);
                    }
                },
            },
        });
    }

    setTitle(title: string): void {
        this.ractive.set("title", title);
    }

    setHasBack(have: boolean): void {
        if (have) {
            this.ractive.set({
                hasDrawer: false,
                hasBack: true,
            });
        } else {
            this.ractive.set({
                hasBack: false,
            });
        }
    }

    setHasDrawer(have: boolean) {
        if (have) {
            this.ractive.set({
                hasDrawer: true,
                hasBack: false,
            });
        } else {
            this.ractive.set({
                hasDrawer: false,
            });
        }
    }

    setMenuItems(items: IMenu[], callback: (item: IMenu) => void): void {
        this.ractive.set("menuItems", items);
        this.menuCallback = callback;
    }
    clearMenuItems(): void {
        this.ractive.set("menuItems", []);
        this.menuCallback = null;
    }
}
