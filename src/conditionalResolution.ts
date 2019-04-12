import {Conditional, Conditions, ConditionsRelationship, Data, Operation} from './types';

function invertOperation(operation: Operation): Operation {
    switch (operation) {
        case Operation.EqualsTo:
            return Operation.DifferentThan;
        case Operation.LessThan:
            return Operation.GreaterThanOrEqualTo;
        case Operation.LessThanOrEqualTo:
            return Operation.GreaterThan;
        case Operation.GreaterThan:
            return Operation.LessThanOrEqualTo;
        case Operation.GreaterThanOrEqualTo:
            return Operation.LessThan;
        case Operation.DifferentThan:
            return Operation.EqualsTo;
        case Operation.MatchesRegex:
            return Operation.DoesNotMatchesReges;
        case Operation.DoesNotMatchesReges:
            return Operation.MatchesRegex;
    }
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
            return RegExp(over).test(value);
        case Operation.DoesNotMatchesReges:
            return !RegExp(over).test(value);
    }
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
            const currentResult = filterConditional(data, conditional);
            result = result.concat(currentResult);
            const oppositeConditional = {
                ...conditional,
                operation: invertOperation(conditional.operation)
            };
            data = filterConditional(data, oppositeConditional);
        } else {
            result = result.concat(resolveConditions(data, condition, namedConditionals));
        }
    }

    return result;
}

export function resolveConditions(data: Data, conditions: Conditions, namedConditionals: Conditional[]): Data {
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
