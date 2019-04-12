import chai from 'chai';
import {describe} from "mocha";
chai.should();

import jsonql from '../dist/index.js';
const data = require('./data/customers');

describe('Nested Condition', () => {
    describe('Simple', () => {
        const query = {
            limit: 0,
            offset: 0,
            named: [
                {
                    name: 'customerOfIdOne',
                    operation: '=',
                    value: ['id'],
                    over: 1
                }, {
                    name: 'customerOfIdGreaterThanTwo',
                    operation: '>',
                    value: ['id'],
                    over: 2
                }, {
                    name: 'customerOfIdLessThanOrEqualToFour',
                    operation: '<=',
                    value: ['id'],
                    over: 4
                }
            ],
            cond: {
                relationship: 'or',
                conditions: [
                    'customerOfIdOne',
                    {
                        conditions: [
                            'customerOfIdGreaterThanTwo',
                            'customerOfIdLessThanOrEqualToFour'
                        ]
                    }
                ]
            }
        };

        const result = jsonql(data, query);

        it('should have three results', (done) => {
            result.should.have.lengthOf(3);
            done();
        });

        it('should have the first result equals to the first object', (done) => {
            result[0].should.equal(data[0]);
            done();
        });

        it('should have the second result equals to the third object', (done) => {
            result[1].should.equal(data[2]);
            done();
        });

        it('should have the third result equals to the fourth object', (done) => {
            result[2].should.equal(data[3]);
            done();
        });
    });
});
