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
        this.router.start();
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
}
