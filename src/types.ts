export enum Operation {
    EqualsTo = "=",
    LessThan = "<",
    LessThanOrEqualTo = "<=",
    GreaterThan = ">",
    GreaterThanOrEqualTo = ">=",
    DifferentThan = "!=",
    MatchesRegex = "reg",
    DoesNotMatchesReges = "!reg"
}

export enum ConditionsRelationship {
    And = "and",
    Or = "or",
    Xor = "xor"
}

export declare type PropertyLocator = string[]

export declare type DataObject = {
    [key: string]: any
}

export declare type Data = DataObject[]

export declare type Conditional = {
    name: string,
    operation: Operation,
    value: PropertyLocator,
    over: any
}

export declare type Conditions = {
    relationship: ConditionsRelationship,
    conditions: (string|Conditions)[]
}

export declare type Field = {
    name: PropertyLocator,
    value: PropertyLocator
}

export declare type Query = {
    limit: number,
    offset: number,
    resultRoot: PropertyLocator,
    root: PropertyLocator,
    fields: Field[],
    cond: Conditions,
    named: Conditional[]
}