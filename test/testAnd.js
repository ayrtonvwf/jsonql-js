import chai from 'chai';
import {describe} from "mocha";
chai.should();

import JsonQL from '../dist/JsonQL.js';
const data = require('./data/customers');

describe('And Condition', () => {
    const query = {
        limit: 0,
        offset: 0,
        named: [
            {
                name: 'customerOfIdGreaterThanOne',
                operation: '>',
                value: ['id'],
                over: 1
            }, {
                name: 'customerOfIdLessThanOrEqualToThree',
                operation: '<=',
                value: ['id'],
                over: 3
            }
        ],
        cond: {
            conditions: [
                'customerOfIdGreaterThanOne',
                'customerOfIdLessThanOrEqualToThree'
            ]
        }
    };

    const jsonql = new JsonQL();
    const result = jsonql.run(data, query);

    it('should have two results', (done) => {
        result.should.have.lengthOf(2);
        done();
    });

    it('should have the first result equals to the second object', (done) => {
        result[0].should.equal(data[1]);
        done();
    });

    it('should have the second result equals to the third object', (done) => {
        result[1].should.equal(data[2]);
        done();
    });
});
