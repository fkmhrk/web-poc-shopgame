/// <reference path="./IRouter.ts" />
/// <reference path="./services/IServices.ts" />

interface IApplication {
    services: IServices;
    strings: any;

    start(router: IRouter): void;

    fetchTemplate(name: string): Promise<string>;

    navigate(path: string): void;

    redirect(path: string): void;
}
