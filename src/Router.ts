/// <reference path="./IRouter.ts" />
/// <reference path="./page.d.ts" />
/// <reference path="./IApplication.ts" />
/// <reference path="./pages/IPage.ts" />

import TopPage from "./pages/TopPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

export default class Router implements IRouter {
    constructor(app: IApplication) {
        const addPage = (path: string, f: any) => {
            page(`/web-poc-shopgame${path}`, f);
        };
        addPage("/", () => this.showPage(new MainPage(app)));
    }

    start(): void {
        page();
    }

    navigate(path: string): void {
        page(path);
    }

    redirect(path: string): void {
        page.redirect(path);
    }

    private showPage(next: IPage) {
        next.onCreate();
    }
}
