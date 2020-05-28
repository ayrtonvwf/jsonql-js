import ConditionalResolver from './conditionalResolution';
import { Data } from './Types/Data';
import { Query } from './Types/Query';
import ResultFormater from './ResultFormater';

export default class JsonQL {
    private resultFormater = new ResultFormater();
    private conditionalResolver = new ConditionalResolver();

    public run(data: Data, query: Query): Data {
        if (query.cond) {
            data = this.conditionalResolver.resolveConditions(data, query.cond, query.named);
        }

        return this.resultFormater.formatResult(data, query.limit, query.offset, query.resultRoot);
    }
}