export enum Operation {
    EqualsTo = "=",
    LessThan = "<",
    LessThanOrEqualTo = "<=",
    GreaterThan = ">",
    GreaterThanOrEqualTo = ">=",
    DifferentThan = "!=",
    MatchesRegex = "reg"
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

function resolveOperation(value: any, operation: Operation, over: any): boolean {
    switch (operation) {
        case Operation.EqualsTo:
            return value === over;
        case Operation.LessThan:
            return value < over;
        case Operation.LessThanOrEqualTo:
            return value <= over;
        case Operation.GreaterThan:
            return value > over;
        case Operation.GreaterThanOrEqualTo:
            return value >= over;
        case Operation.DifferentThan:
            return value != over;
        case Operation.MatchesRegex:
            return RegExp(over).test(value)
    }

    return false;
}

function filterConditional(data: Data, conditional: Conditional): Data {
    if (conditional.value.length === 1) {
        return data.filter((object: { [key: string]: any }) =>
            resolveOperation(object[conditional.value[0]], conditional.operation, conditional.over)
        )
    }

    const newConditional: Conditional = {
        ...conditional
    };
    const currentProperty = conditional.value.shift();

    if (currentProperty === undefined) {
        throw new Error("No properties left to filter");
    }

    // @ts-ignore
    data[currentProperty] = data[currentProperty].map(partialData =>
        filterConditional(partialData, newConditional)
    );

    return data;
}

function resolveAndConditionals(data: Data, conditions: (string|Conditions)[], namedConditionals: Conditional[]): Data {
    for (const condition of conditions) {
        if (typeof condition === 'string') {
            const conditional = namedConditionals.find(namedConditional => namedConditional.name === condition);
            if (conditional === undefined) {
                throw new Error("Unknown named conditional");
            }
            data = filterConditional(data, conditional);
        } else {
            data = resolveConditions(data, condition, namedConditionals)
        }
    }

    return data
}

function resolveOrConditionals(data: Data, conditions: (string|Conditions)[], namedConditionals: Conditional[]): Data {
    let result: Data = [];

    for (const condition of conditions) {
        if (typeof condition === 'string') {
            const conditional = namedConditionals.find(namedConditional => namedConditional.name === condition);
            if (conditional === undefined) {
                throw new Error("Unknown named conditional");
            }
            result = result.concat(filterConditional(data, conditional));
        } else {
            result = result.concat(resolveConditions(data, condition, namedConditionals));
        }
    }

    return result;
}

function resolveConditions(data: Data, conditions: Conditions, namedConditionals: Conditional[]): Data {
    switch (conditions.relationship) {
        case undefined:
        case ConditionsRelationship.And:
            return resolveAndConditionals(data, conditions.conditions, namedConditionals);
        case ConditionsRelationship.Or:
            return resolveOrConditionals(data, conditions.conditions, namedConditionals);
        case ConditionsRelationship.Xor:
            return data;
    }
}

export default function run(data: Data, query: Query): Data {
    return resolveConditions(data, query.cond, query.named);
}