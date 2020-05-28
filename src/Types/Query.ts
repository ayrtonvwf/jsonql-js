import { PropertyLocator } from "./PropertyLocator";
import { Field } from "./Field";
import { Conditions } from "./Conditions";
import { Conditional } from "./Conditional";

export declare type Query = {
    limit: number,
    offset: number,
    resultRoot: PropertyLocator,
    root: PropertyLocator,
    fields: Field[],
    cond: Conditions,
    named: Conditional[]
}
