/// <reference path="./IPage.ts" />
import Ractive from "../ractive";
//import mdc from "../decorators/mdc";

export default class MainPage implements IPage {
    private app: IApplication;
    private ractive!: Ractive;

    constructor(app: IApplication) {
        this.app = app;
    }
    async onCreate() {
        const t = await this.app.fetchTemplate("main.html");
        this.ractive = new Ractive({
            el: "#container",
            template: t,
            decorators: {
                //                mdc: mdc
            },
        });
    }
}
