import {Data, PropertyLocator} from './types';

function getRoot(data: Data, root: PropertyLocator): Data {
    const currentProperty = root.shift();

    if (currentProperty === undefined) {
        throw new Error('Wrong Property Locator');
    }

    const nextDepth = data.map((obj: { [key: string]: any }) => obj[currentProperty]);

    if (!root.length) {
        return nextDepth;
    }

    return getRoot(nextDepth, root);
}

export function formatResult(data: Data, limit: number, offset: number, root: PropertyLocator): Data {
    if (root && root.length) {
        data = getRoot(data, root);
    }

    return data.slice(offset, offset + limit);
}
