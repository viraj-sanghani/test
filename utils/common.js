const hideMobileNumber = (number) => {
  if (number.length < 4) {
    return number;
  } else {
    const hiddenDigits = "*".repeat(number.length - 4);
    return number.slice(0, 2) + hiddenDigits + number.slice(-2);
  }
};

const hideEmailAddress = (email) => {
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");
  if (atIndex > 0 && dotIndex > 0) {
    const hiddenPart = email.slice(atIndex + 1, dotIndex);
    const hiddenString = "*".repeat(hiddenPart.length);
    const visibleEmail =
      "*".repeat(atIndex) + "@" + hiddenString + email.slice(dotIndex);
    return visibleEmail;
  } else return "";
};

const convertValidStr = (val) => {
  return typeof val === "string" ? val.replace(/'/g, "\\'") : val;
};

const formatNumber = (num) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + " Cr";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + " L";
  } else {
    return num.toString();
  }
};

module.exports = {
  hideMobileNumber,
  hideEmailAddress,
  convertValidStr,
  formatNumber,
};
