export function checkPwdStrength(pass) {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  var mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  if (strongRegex.test(pass)) {
    return "good";
  } else if (mediumRegex.test(pass)) {
    return "not-bad";
  } else {
    return "weak";
  }
}
export function getStrengthError(pass) {
  if (pass.length < 6) {
    return "password should contain\n atleast 6 character";
  } else {
    return "password should contain lower\n and uppercase characters.";
  }
}
