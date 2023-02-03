import { Operation } from "./Types/Operation";
import { Data } from "./Types/Data";
import { Conditional } from "./Types/Conditional";
import { Conditions } from "./Types/Conditions";
import { ConditionsRelationship } from "./Types/ConditionsRelationship";

export default class ConditionalResolver {
    private invertOperation(operation: Operation): Operation {
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

    private resolveOperation(value: any, operation: Operation, over: any): boolean {
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
    /**
     * in the first call, data is an array of objects, but in the recursive calls, data is an object
     */
    private filterConditional(data: Data, conditional: Conditional): Data {
        if (conditional.value.length === 1) {
            return data.filter((object: { [key: string]: any }) =>
                this.resolveOperation(object[conditional.value[0]], conditional.operation, conditional.over)
            )
        }

        const [currentProperty] = conditional.value;
        const newConditional = {
            ...conditional,
            value: conditional.value.slice(1),
        };

        if (currentProperty === undefined) {
            throw new Error("No properties left to filter");
        }

        /**
         * this looks wrong, because the first time this function is called, the data is an array of objects, but in the recursive calls, data is an object therefore their indexes arent numbers
         */
        // @ts-ignore
        data[currentProperty] = data[currentProperty].map(partialData =>
            this.filterConditional(partialData, newConditional)
        );

        return data;
    }

    private resolveAndConditionals(data: Data, conditions: (string|Conditions)[], namedConditionals: Conditional[]): Data {
        for (const condition of conditions) {
            if (typeof condition === 'string') {
                const conditional = namedConditionals.find(namedConditional => namedConditional.name === condition);
                if (conditional === undefined) {
                    throw new Error("Unknown named conditional");
                }
                data = this.filterConditional(data, conditional);
            } else {
                data = this.resolveConditions(data, condition, namedConditionals)
            }
        }
    
        return data
    }

    private resolveOrConditionals(data: Data, conditions: (string|Conditions)[], namedConditionals: Conditional[]): Data {
        let result: Data = [];

        for (const condition of conditions) {
            if (typeof condition === 'string') {
                const conditional = namedConditionals.find(namedConditional => namedConditional.name === condition);
                if (conditional === undefined) {
                    throw new Error("Unknown named conditional");
                }
                const currentResult = this.filterConditional(data, conditional);
                result = result.concat(currentResult);
                const oppositeConditional = {
                    ...conditional,
                    operation: this.invertOperation(conditional.operation)
                };
                data = this.filterConditional(data, oppositeConditional);
            } else {
                result = result.concat(this.resolveConditions(data, condition, namedConditionals));
            }
        }

        return result;
    }

    public resolveConditions(data: Data, conditions: Conditions, namedConditionals: Conditional[]): Data {
        switch (conditions.relationship) {
            case undefined:
            case ConditionsRelationship.And:
                return this.resolveAndConditionals(data, conditions.conditions, namedConditionals);
            case ConditionsRelationship.Or:
                return this.resolveOrConditionals(data, conditions.conditions, namedConditionals);
            case ConditionsRelationship.Xor:
                return data;
        }
    }
}