import moment from 'moment';
import { any } from 'prop-types';

export const stripLeadingZerosDate = (dateStr: string) => {
  return dateStr.split('-').reduce(function (date, datePart) {
    return date += parseInt(datePart) + '-'
  }, '').slice(0, -1);
}

export const checkIfNumberKeyPressed = (date: string) => {
  const regex = /^\-?\d+\d*$|^\-?[\d]*$/;
  return regex.test(date);
}


export const validateDate = (day: number, month: number, year: number) => {
  const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  let isValid = true;
  if (!day || !month || !year) {
    isValid = false;
  } else if (!moment(moment(new Date(date)).format("YYYY-MM-DD"), "YYYY-MM-DD", true)
    .isValid()) {
    isValid = false;
  } else if (year.toString().length < 4) {
    isValid = false
  } else if (new Date(date) > new Date()) {
    isValid = false
  }

  return isValid;
}

export const objToQueryString = (obj: { [x: string]: string | number | boolean | any; }) => {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj[key]) {
      if(typeof obj[key] === "object") {
        keyValuePairs.push(key + '=' + JSON.stringify(obj[key]));        
      } else {
        var partsOfStr = String(obj[key]).split(',')
        keyValuePairs.push(encodeURIComponent(key) + '=' + partsOfStr);
      }
    }
  }
  return keyValuePairs.join('&');
}