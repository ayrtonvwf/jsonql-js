import chai from 'chai';
import {describe} from "mocha";
chai.should();

import jsonql from '../dist/index.js';
const data = require('./data/customers');

describe('Simple Condition', () => {
    const query = {
        limit: 0,
        offset: 0,
        resultRoot: ['cars']
    };

    const result = jsonql(data, query);

    it('should have four results', (done) => {
        result.should.have.lengthOf(4);
        done();
    });

    it('should have the first item equal to the first car', (done) => {
        result[0].should.equal(data[0].cars[0]);
        done();
    });

    it('should have the second item equal to the second car', (done) => {
        result[0].should.equal(data[1].cars[0]);
        done();
    });

    it('should have the third item equal to the third car', (done) => {
        result[0].should.equal(data[1].cars[1]);
        done();
    });

    it('should have the fourth item equal to the fourth car', (done) => {
        result[0].should.equal(data[2].cars[0]);
        done();
    });
});
