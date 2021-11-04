//My version #2

import moment from 'moment';
const REQUIRED = 'REQUIRED';                          
const EMAIL = 'EMAIL';
const OPTIONAL_MINLENGTH = 'OPTIONAL_MINLENGTH';
const OPTIONAL_HOURS = 'OPTIONAL_HOURS';
const OPTIONAL_DATE = 'OPTIONAL_DATE';
const MIN_LENGTH = 'MIN_LENGTH';
const MAX_LENGTH = 'MAX_LENGTH';
const MIN = 'MIN';
const MAX = 'MAX';
const DATE = 'DATE';
 
 
export const VALIDATOR_REQUIRE   =  () => ({ type: REQUIRED });
export const VALIDATOR_EMAIL      =  () => ({ type: EMAIL });
export const VALIDATOR_MINLENGTH  =  value => ({ type: MIN_LENGTH, value });
export const VALIDATOR_MAXLENGTH  =  value => ({ type: MAX_LENGTH, value });
export const VALIDATOR_MIN        =  value => ({ type: MIN, value });
export const VALIDATOR_MAX        =  value => ({ type: MAX, value });
export const VALIDATOR_OPTIONAL_MINLENGTH = value => ({
  type: OPTIONAL_MINLENGTH,
  value
});
export const VALIDATOR_OPTIONAL_HOURS =  () => ({ type: OPTIONAL_HOURS });
export const VALIDATOR_OPTIONAL_DATE =  () => ({type: OPTIONAL_DATE});
export const VALIDATOR_DATE =  () => ({type: OPTIONAL_DATE});

export const validate = (input, validators) => {
 
  const inputLength = input.trim().length;
  const emailPattern = /^\S+@\S+\.\S+$/.test(input);
  const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/.test(input);
  const validDate = (moment(input).isAfter() || moment(input).isSame(moment(), 'day'));
  const hours = input.match(/^(0|2[1-3]|1?[1-9])$/);
 
  return validators.every(({ type, value }) =>
 
    ( type === REQUIRED     &&   inputLength > 0      )  ||
    ( type === MIN_LENGTH   &&   inputLength >= value )  ||
    ( type === EMAIL        &&   emailPattern         )  ||
    ( type === MAX_LENGTH   &&   inputLength <= value )  ||
    ( type === MIN          &&   +input >= value      )  ||
    ( type === MAX          &&   +input <= value      )  ||
    ( type === OPTIONAL_MINLENGTH && (inputLength === 0  || inputLength >= value)) ||
    ( type === OPTIONAL_HOURS && (inputLength === 0  || hours)) ||
    ( type === OPTIONAL_DATE && (inputLength === 0  || (datePattern && validDate))) ||
    ( type === DATE         &&   datePattern && validDate)
 
  );
 
}



//My version #1
/*
import moment from 'moment';
const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_OPTIONAL_MINLENGTH = 'OPTIONAL_MINLENGTH';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';
const VALIDATOR_TYPE_OPTIONAL_HOURS = 'OPTIONAL_HOURS';
const VALIDATOR_TYPE_OPTIONAL_DATE = 'OPTIONAL_DATE';
const VALIDATOR_TYPE_DATE = 'DATE';


export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val
});
export const VALIDATOR_MAXLENGTH = val => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val
});
export const VALIDATOR_MIN = val => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = val => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_OPTIONAL_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_OPTIONAL_MINLENGTH,
  val: val
});
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_DATE = () => ({type: VALIDATOR_TYPE_DATE});
export const VALIDATOR_OPTIONAL_HOURS = () => ({ type: VALIDATOR_TYPE_OPTIONAL_HOURS });
export const VALIDATOR_OPTIONAL_DATE = () => ({type: VALIDATOR_TYPE_OPTIONAL_DATE});


export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_OPTIONAL_MINLENGTH) {
      isValid = isValid && (value.trim().length === 0 || value.trim().length >= validator.val);
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_OPTIONAL_HOURS) {
      isValid = isValid && (value.trim().length === 0 || value.match(/^(0|2[1-3]|1?[1-9])$/));
    }
    if(validator.type === VALIDATOR_TYPE_OPTIONAL_DATE){
      isValid = isValid && (value.trim().length === 0 || (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/.test(value) && (moment(value).isAfter() ||
      moment(value).isSame(moment(), 'day'))));
    }
    if(validator.type === VALIDATOR_TYPE_DATE){
      isValid = isValid && /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/.test(value) && (moment(value).isAfter() ||
      moment(value).isSame(moment(), 'day'));
    }
  }
  return isValid;
}; 

*/

//Anna's version
/*
import moment from 'moment';

const VALIDATOR_TYPE_REQUIRE = 0;
const VALIDATOR_TYPE_OPTIONAL_MINLENGTH = 1;
const VALIDATOR_TYPE_MINLENGTH = 2;
const VALIDATOR_TYPE_MAXLENGTH = 3;
const VALIDATOR_TYPE_MIN = 4;
const VALIDATOR_TYPE_MAX = 5;
const VALIDATOR_TYPE_EMAIL = 6;
const VALIDATOR_TYPE_FILE = 7;
const VALIDATOR_TYPE_OPTIONAL_HOURS = 8;
const VALIDATOR_TYPE_OPTIONAL_DATE = 9;
const VALIDATOR_TYPE_DATE = 10;
const VALIDATOR_TYPE_COUNT = 11; // Not currently used but could be helpful in the future

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_OPTIONAL_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_OPTIONAL_MINLENGTH,
  val: val
});
export const VALIDATOR_MINLENGTH = val => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val
});
export const VALIDATOR_MAXLENGTH = val => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val
});
export const VALIDATOR_MIN = val => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = val => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
export const VALIDATOR_OPTIONAL_HOURS = () => ({ type: VALIDATOR_TYPE_OPTIONAL_HOURS });
export const VALIDATOR_OPTIONAL_DATE = () => ({type: VALIDATOR_TYPE_OPTIONAL_DATE});
export const VALIDATOR_DATE = () => ({type: VALIDATOR_TYPE_DATE});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    switch (validator.type) {
      case VALIDATOR_TYPE_REQUIRE:
        isValid = value.trim().length > 0;
        break;
      case VALIDATOR_TYPE_OPTIONAL_MINLENGTH:
        isValid = (value.trim().length === 0 || value.trim().length >= validator.val);
        break;
      case VALIDATOR_TYPE_MINLENGTH:
        isValid = value.trim().length >= validator.val;
        break;
      case VALIDATOR_TYPE_MAXLENGTH:
        isValid = value.trim().length <= validator.val;
        break;
      case VALIDATOR_TYPE_MIN:
        isValid = +value >= validator.val;
        break;
      case VALIDATOR_TYPE_MAX:
        isValid = +value <= validator.val;
        break;
      case VALIDATOR_TYPE_EMAIL:
        isValid = /^\S+@\S+\.\S+$/.test(value);
        break;
      case VALIDATOR_TYPE_OPTIONAL_HOURS:
        isValid = (value.trim().length === 0 || value.match(/^(0|2[1-3]|1?[1-9])$/));
        break;
      case VALIDATOR_TYPE_OPTIONAL_DATE:
        isValid = (
          value.trim().length === 0 ||
          (
            /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/.test(value) &&
            (
              moment(value).isAfter() ||
              moment(value).isSame(moment(), 'day')
            )
          )
        );
        break;
      case VALIDATOR_TYPE_DATE:
        isValid = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/.test(value) &&
                  (moment(value).isAfter() || moment(value).isSame(moment(), 'day'));
        break;
      case VALIDATOR_TYPE_COUNT:
      default:
        isValid = false;
        break;
    }
    if (!isValid) break;
  }
  return isValid;
};

*/
