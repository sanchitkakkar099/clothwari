export const alphaNumericPattern = (value) => {
    var alphaExp = /^[A-Za-z0-9 ]+$/;
    if (!alphaExp.test(value)) {
      return `Input should be alphanumeric`;
    }
    return true;
  };