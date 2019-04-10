import chai from 'chai';
import {describe} from "mocha";
chai.should();

import jsonql from '../dist/index.js';
const data = require('./data/customers');

describe('Or Condition', () => {
    describe('Simple', () => {
        const query = {
            named: [
                {
                    name: 'customerOfIdOne',
                    operation: '=',
                    value: ['id'],
                    over: 1
                }, {
                    name: 'customerOfIdThree',
                    operation: '=',
                    value: ['id'],
                    over: 3
                }
            ],
            cond: {
                relationship: 'or',
                conditions: [
                    'customerOfIdOne',
                    'customerOfIdThree'
                ]
            }
        };

        const result = jsonql(data, query);

        it('should have two results', (done) => {
            result.should.have.lengthOf(2);
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
    });

    describe('Overlapping', () => {
        const query = {
            named: [
                {
                    name: 'customerOfIdOne',
                    operation: '=',
                    value: ['id'],
                    over: 1
                }, {
                    name: 'customerOfIdOneAndTwo',
                    operation: '<',
                    value: ['id'],
                    over: 3
                }
            ],
            cond: {
                relationship: 'or',
                conditions: [
                    'customerOfIdOne',
                    'customerOfIdOneAndTwo'
                ]
            }
        };

        const result = jsonql(data, query);

        it('should have two results', (done) => {
            result.should.have.lengthOf(2);
            done();
        });

        it('should have the first result equals to the first object', (done) => {
            result[0].should.equal(data[0]);
            done();
        });

        it('should have the second result equals to the second object', (done) => {
            result[1].should.equal(data[1]);
            done();
        });
    });
});