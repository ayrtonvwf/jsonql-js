import { Data, Query} from './types';
import { resolveConditions } from './conditionalResolution';
import { formatResult } from "./resultFormater";

export default function run(data: Data, query: Query): Data {
    const newData = resolveConditions(data, query.cond, query.named);
    return formatResult(newData, query.limit, query.offset, query.resultRoot);
}