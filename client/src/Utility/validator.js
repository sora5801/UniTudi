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