import { ConditionsRelationship } from "./ConditionsRelationship";

export declare type Conditions = {
    relationship: ConditionsRelationship,
    conditions: (string|Conditions)[]
}
