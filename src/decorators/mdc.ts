import { MDCTextField } from "@material/textfield";
import { MDCRipple } from "@material/ripple";
import { MDCMenu } from "@material/menu";

export const mdcText = (node: HTMLElement, ...args: any[]) => {
    new MDCTextField(node);
    return {
        teardown: () => {},
    };
};

export const mdcRipple = (node: HTMLElement, ...args: any[]) => {
    new MDCRipple(node);
    return {
        teardown: () => {},
    };
};

export const mdcMenu = (node: HTMLElement, ...args: any[]) => {
    new MDCMenu(node);
    return {
        teardown: () => {},
    };
};
