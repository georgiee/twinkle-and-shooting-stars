import { TwinkleStarData } from './data';
declare type TwinkleStarsConfig = {
    root: HTMLElement;
    starlist: TwinkleStarData[];
    debug: boolean;
};
export declare function twinkleStars({ root, starlist, debug }: TwinkleStarsConfig): void;
export {};
