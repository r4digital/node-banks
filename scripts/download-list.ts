import { Readable, Transform } from 'stream';
import { join } from 'path';
import { writeFileSync } from 'fs';
import axios, { AxiosError, AxiosResponse } from 'axios';
import csv from 'csv-parser';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const BANK_CSV_ENDPOINT = 'https://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv';

interface Bank {
  ispb: number;
  name: string;
  code: number;
  participate_of_compe: boolean;
  main_access: string;
  full_name: string;
  start_of_operation: string;
}

type MapValue = {
  index: number;
  header: string;
  value: string;
};

const headers = [
  'ispb',
  'name',
  'code',
  'participate_of_compe',
  'main_access',
  'full_name',
  'start_of_operation'
];

const getInstance: Promise<AxiosResponse<Readable>> = axios.get(BANK_CSV_ENDPOINT, {
  responseType: 'stream'
});

const mapValues = (data: MapValue) => {
  let string: string = data.value.trim();
  const name = string.toLowerCase();

  if (data.header === 'start_of_operation') {
    return dayjs(string, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }

  if (data.header === 'code') {
    if (name === 'n/a') {
      return null;
    } else {
      return parseInt(string, 10);
    }
  }

  if (data.header === 'ispb') {
    return parseInt(string, 10);
  }

  if (data.header === 'participate_of_compe') {
    return name === 'Sim';
  }

  return string;
};

const transform: Transform = csv({
  headers,
  strict: false,
  separator: ',',
  skipLines: 1,
  mapValues
});

const fetch = () => {
  const list: Bank[] = [];

  return new Promise<Bank[]>((resolve, reject) => {
    getInstance
      .then((response) => {
        const readable = response.data.pipe(transform);
        readable.on('data', (chunk: Bank) => {
          list.push(chunk);
        });

        readable.on('error', (error: Error) => {
          reject(error);
        });

        readable.on('close', () => {
          const data = list.filter((value: any) => JSON.stringify(value) !== '{}');
          resolve(data);
        });
      })
      .catch((error: AxiosError<Readable>) => reject(error));
  });
};

const save = (list: Bank[]) => {
  const target = join(__dirname, '../src', 'data.json');
  const json = JSON.stringify(list, null, '  ');
  writeFileSync(target, json);
};

(async () => {
  try {
    const list = await fetch();
    save(list);
    console.info('done');

    process.exit(0);
  } catch (error) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error('Error request fail');
    } else {
      console.error('Error', error);
    }
    process.exit(1);
  }
})();
