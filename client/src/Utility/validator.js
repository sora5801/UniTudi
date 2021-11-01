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



