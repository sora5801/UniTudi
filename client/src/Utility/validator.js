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
