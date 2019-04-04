import chai from 'chai';
import {describe} from "mocha";
chai.should();

import jsonql from '../dist/index.js';
const data = require('./data/customers');

describe('Simple Condition', () => {
    const query = {
        named: [
            {
                name: 'customerOfId1',
                operation: '=',
                value: ['id'],
                over: 2
            }
        ],
        cond: {
            conditions: ['customerOfId1']
        }
    };

    const result = jsonql(data, query);

    it('should have one result', (done) => {
        result.should.have.lengthOf(1);
        done();
    });

    it('should be the second item', (done) => {
        result[0].should.equal(data[1]);
        done();
    });
});