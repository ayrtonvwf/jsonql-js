import { resolveConditions } from './conditionalResolution';
import { formatResult } from "./resultFormater";
import { Data } from './Types/Data';
import { Query } from './Types/Query';

export default function run(data: Data, query: Query): Data {
    if (query.cond) {
        data = resolveConditions(data, query.cond, query.named);
    }
    return formatResult(data, query.limit, query.offset, query.resultRoot);
}
