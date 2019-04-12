import { Data, Query} from './types';
import { resolveConditions } from './conditionalResolution';
import { formatResult } from "./resultFormater";

export default function run(data: Data, query: Query): Data {
    if (query.cond) {
        data = resolveConditions(data, query.cond, query.named);
    }
    return formatResult(data, query.limit, query.offset, query.resultRoot);
}
