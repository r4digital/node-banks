export const data: Bank.Data[] = Object.freeze(require('./data.json'));
export const size = data.length;

export namespace Bank {
  export interface Data {
    ispb: number;
    name: string;
    code: number;
    participate_of_compe: boolean;
    main_access: string;
    full_name: string;
    start_of_operation: string;
  }

  export enum Fields {
    Ispb = 'ispb',
    Name = 'name',
    Code = 'code',
    ParticipateOfCompe = 'participate_of_compe',
    MainAccess = 'main_access',
    FullName = 'full_name',
    StartOfOperation = 'start_of_operation',
  }
}

export const covertByKey = (value: any, key: Bank.Fields): string | number => {
  switch (key) {
    case Bank.Fields.Ispb:
    case Bank.Fields.Code:
      return parseInt(value, 10);
    case Bank.Fields.ParticipateOfCompe:
      throw new TypeError('key participate_of_compe is not supported');
    default:
      return `${value}`.trim();
  }
}

export const findByKey = (param: number | string, key: Bank.Fields = Bank.Fields.Code): Bank.Data | null => {
  const value = covertByKey(param, key);

  for (let index = 0; index < size; index += 1) {
    if (data[index][key] === value) {
      return data[index];
    }

  }

  return null;
}
