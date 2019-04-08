/// <reference path="./IPage.ts" />
import Ractive from "../ractive";
import { mdcRipple } from "../decorators/mdc";
//import mdc from "../decorators/mdc";

interface IPopulation {
    count: number;
    purchaseRate: number;
}

interface IShopState {
    storeItemCount: number;
    storageItemCount: number;
}

export default class MainPage implements IPage {
    private app: IApplication;
    private ractive!: Ractive;

    constructor(app: IApplication) {
        this.app = app;
    }
    async onCreate() {
        const initPopulation = this.makeInitPopulation();
        const t = await this.app.fetchTemplate("main.html");
        this.ractive = new Ractive({
            el: "#container",
            template: t,
            decorators: {
                "mdc-button": mdcRipple,
                //                mdc: mdc
            },
            data: {
                year: 6000,
                month: 1,
                money: 100,
                storeSize: 20,
                storeFee: 3,
                items: 0,
                storageSize: 0,
                purchase: 0,
                extendStore: 0,
                extendStorage: 0,
                population: initPopulation,
                isGameOver: false,
            },
            on: {
                submit: () => this.submit(),
            },
        });
    }

    private makeInitPopulation(): IPopulation[] {
        const p1 = Math.floor(1000 * (Math.random() / 3 + 0.85)) + 1;
        const p2 = Math.floor((p1 * Math.random()) / 3) + 1;
        const p3 = Math.floor((p2 * Math.random()) / 3) + 1;
        return [
            { count: p1, purchaseRate: 1 },
            { count: p2, purchaseRate: 10 },
            { count: p3, purchaseRate: 90 },
        ];
    }

    private submit() {
        let money = this.ractive.get("money");
        let storeSize = this.ractive.get("storeSize");
        let storeFee = this.ractive.get("storeFee");
        let storageItem = this.ractive.get("items");
        let storageSize = this.ractive.get("storageSize");
        const purchase = this.ractive.get("purchase");

        const extendStore = this.ractive.get("extendStore");
        const extendStorage = this.ractive.get("extendStorage");
        const population = this.ractive.get("population");
        let year = this.ractive.get("year");
        let month = this.ractive.get("month");

        let msg = "";

        const shopState: IShopState = {
            storeItemCount: storageItem,
            storageItemCount: 0,
        };
        this.adjustShopState(shopState, storeSize, storageSize);

        // calc item
        shopState.storeItemCount += purchase;
        this.adjustShopState(shopState, storeSize, storageSize);
        money -= purchase * 2;
        msg += `You bought ${purchase} items\n`;
        if (money < 0) {
            return;
        }

        const boughtPeople = this.calcBoughtPeople(population);

        let boughtCount = boughtPeople
            .map((p: IPopulation) => p.count)
            .reduce((a, c) => a + c);
        msg += `${boughtCount} people came to your shop\n`;

        // sell
        let soldCount = this.calcSold(
            shopState,
            boughtCount,
            storeSize,
            storageSize
        );
        money += soldCount * 3;
        msg += `${soldCount} items were sold!\n`;

        money -= storeFee;
        money -= Math.floor(storageSize / 15);

        // extend store
        money -= extendStore * 10;
        storeSize += extendStore;
        storeFee = 1 + Math.floor(storeSize / 10);

        // extend storage
        money -= extendStorage * 5;
        storageSize += extendStorage;

        // update population
        const nextPopulation = this.calcNextPopulation(
            population,
            boughtPeople
        );

        const isGameOver = money < 0;

        month++;
        if (month >= 13) {
            month = 1;
            year++;
        }

        this.ractive.set({
            msg: msg,
            year: year,
            month: month,
            money: money,
            purchase: 0,
            extendStore: 0,
            extendStorage: 0,
            items: shopState.storageItemCount,
            storeSize: storeSize,
            storeFee: storeFee,
            storageSize: storageSize,
            population: nextPopulation,
            isGameOver: isGameOver,
        });
    }
    private adjustShopState(
        shopState: IShopState,
        storeSize: number,
        storageSize: number
    ): void {
        if (shopState.storeItemCount > storeSize) {
            shopState.storageItemCount = shopState.storeItemCount - storeSize;
            shopState.storeItemCount = storeSize;
        }
        if (shopState.storageItemCount > storageSize) {
            shopState.storageItemCount = storageSize;
        }
    }

    private calcBoughtPeople(population: IPopulation[]): IPopulation[] {
        return population.map((p: IPopulation) => ({
            count: Math.floor((p.count * p.purchaseRate) / 100),
            purchaseRate: p.purchaseRate,
        }));
    }

    private calcSold(
        state: IShopState,
        boughtCount: number,
        storeSize: number,
        storageSize: number
    ): number {
        if (boughtCount < state.storeItemCount) {
            state.storeItemCount = 0;
            return boughtCount;
        }
        let soldCount = state.storeItemCount;
        state.storeItemCount = state.storageItemCount;
        state.storageItemCount = 0;
        this.adjustShopState(state, storeSize, storageSize);

        if (boughtCount < state.storeItemCount) {
            soldCount += boughtCount;
            state.storeItemCount -= boughtCount;
            state.storageItemCount += state.storeItemCount;
            state.storeItemCount = 0;

            return soldCount;
        }
        soldCount += state.storeItemCount;
        state.storeItemCount = 0;
        return soldCount;
    }

    private calcNextPopulation(
        population: IPopulation[],
        boughtPeople: IPopulation[]
    ): IPopulation[] {
        if (Math.random() * 10 < 7) {
            // increase
            population[0].count += 100;
        } else {
            // decrease
            population[0].count = Math.floor(population[0].count * 0.8);
            population[1].count = Math.floor(population[0].count * 0.8);
        }
        return population;
    }
}
