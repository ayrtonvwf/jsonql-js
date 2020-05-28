import { Operation } from "./Operation";
import { PropertyLocator } from "./PropertyLocator";

export declare type Conditional = {
    name: string,
    operation: Operation,
    value: PropertyLocator,
    over: any
}
