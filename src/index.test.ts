import { expect, assert } from 'chai';
import {
  data,
  Bank,
  covertByKey,
} from './index';

describe('Bank List Library Unit Testing', () => {
  it('Should array correct fields', () => {
    for (let index = 0; index < data.length; index += 1) {
      expect(data[index]).to.have.all.keys([
        Bank.Fields.Code,
        Bank.Fields.FullName,
        Bank.Fields.Ispb,
        Bank.Fields.MainAccess,
        Bank.Fields.Name,
        Bank.Fields.ParticipateOfCompe,
        Bank.Fields.StartOfOperation,
      ]);
    }
  });

  it('Should covertByKey return number by key ispb', () => {
    const value = covertByKey('123', Bank.Fields.Ispb);
    assert.isNumber(value);
  });

  it('Should covertByKey return number by key code', () => {
    const value = covertByKey('123', Bank.Fields.Code);
    assert.isNumber(value);
  });

  it('Should covertByKey return string by key name', () => {
    const value = covertByKey('123', Bank.Fields.Name);
    assert.isString(value);
  });

  it('Should covertByKey return string by key full_name', () => {
    const value = covertByKey('123', Bank.Fields.FullName);
    assert.isString(value);
  });

  it('Should covertByKey return string by key main_access', () => {
    const value = covertByKey('123', Bank.Fields.MainAccess);
    assert.isString(value);
  });

  it('Should covertByKey return string by key start_of_operation', () => {
    const value = covertByKey('123', Bank.Fields.StartOfOperation);
    assert.isString(value);
  });

  it('Should covertByKey throw TypeError by key participate_of_compe', () => {
    const isAnError = () => { covertByKey('123', Bank.Fields.ParticipateOfCompe); };

    expect(isAnError).to.throw(TypeError);
  });
});
