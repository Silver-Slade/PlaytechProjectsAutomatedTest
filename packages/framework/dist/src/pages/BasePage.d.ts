import { Page } from '@playwright/test';
export declare class BasePage {
    protected page: Page;
    constructor(page: Page);
    goto(url: string): Promise<void>;
    expectUrlContains(partial: string): Promise<void>;
}
