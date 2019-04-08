/// <reference path="./IApplication.ts" />
/// <reference path="./services/IServices.ts" />
/// <reference path="./clients/HTTPClient.ts" />

import { getBody, isStatus200 } from "./clients/Functions";
import AppBar from "./views/AppBar";

export default class Application implements IApplication {
    private templateClient: HTTPClient;
    private router: IRouter;
    appBar: IAppBar;
    services: IServices;
    strings: any;

    constructor(
        templateClient: HTTPClient,
        services: IServices,
        routerFactory: (app: IApplication) => IRouter
    ) {
        this.templateClient = templateClient;
        this.services = services;
        this.router = routerFactory(this);
        this.appBar = new AppBar();
    }

    start() {
        this.loadStrings().then(() => {
            this.router.start();
        });
    }

    fetchTemplate(name: string): Promise<string> {
        const url = `/web-poc-shopgame/pages/${name}`;
        return this.templateClient
            .send(Method.GET, url, {}, null)
            .then(isStatus200)
            .then(getBody);
    }

    navigate(path: string): void {
        this.router.navigate(path);
    }

    redirect(path: string): void {
        this.router.redirect(path);
    }

    private loadStrings(): Promise<void> {
        let lang = window.navigator.language.split("-")[0];
        if (lang == "ja") {
            this.strings = jaStrings;
        } else {
            this.strings = enStrings;
        }
        return Promise.resolve();
    }
}

const jaStrings = {
    money: "所持金",
    storeSize: "お店の大きさ",
    storeFee: "お店の維持費",
    "no-storage": "倉庫はありません",
    "item-in-storage": "在庫",
};

const enStrings = {
    money: "money",
    storeSize: "Store size",
    storeFee: "Store fee",
    "no-storage": "No Storage",
    "item-in-storage": "Item in Storage",
};
