import Datetime from "./Datetime";

/**
 * available data types:
 * - string
 * - date
 * - float
 * - integer
 * - boolean
 * - undefined
 */
class DTypes {
  static get UNDEFINED() {
    return "undefined";
  }
  static get BOOLEAN() {
    return "boolean";
  }
  static get INTEGER() {
    return "integer";
  }
  static get FLOAT() {
    return "float";
  }
  static get DATE() {
    return "date";
  }
  static get STRING() {
    return "string";
  }
  static get NUMBER() {
    return "number";
  }

  static evalValue(string) {
    string = string.trim();
    if (string == "" || string == "NaN" || string == "undefined") {
      return NaN;
    } else if (!isNaN(string)) {
      return +string;
    } else {
      if (isNaN(Date.parse(string))) {
        return string.toLowerCase() === "true"
          ? true
          : string.toLowerCase() === "false"
          ? false
          : string;
      }
      return Datetime.formatDate(string);
    }
  }

  static dtype(value) {
    if (typeof value != DTypes.NUMBER) {
      if (typeof value == DTypes.STRING) {
        if (!isNaN(Date.parse(value))) {
          return DTypes.DATE;
        }
        return DTypes.STRING;
      }
      if (value instanceof Date) {
        return DTypes.DATE;
      }
      return typeof value;
    }
    if (isNaN(value)) {
      return DTypes.UNDEFINED;
    }
    if (value % 1 === 0) {
      return DTypes.INTEGER;
    }
    return DTypes.FLOAT;
  }

  static checkArrayDtype(arr) {
    var final_type = DTypes.UNDEFINED;
    var elem_type;
    arr.forEach((elem) => {
      elem_type = DTypes.dtype(elem);
      final_type = _max(final_type, elem_type);
    });
    return final_type;
  }
}

const _max = function (type1, type2) {
  const ref = [
    DTypes.UNDEFINED,
    DTypes.BOOLEAN,
    DTypes.INTEGER,
    DTypes.FLOAT,
    DTypes.DATE,
    DTypes.STRING,
  ];
  var idx1 = ref.indexOf(type1);
  var idx2 = ref.indexOf(type2);
  if (
    (idx1 == 4 && 0 < idx2 && idx2 < 4) ||
    (idx2 == 4 && 0 < idx1 && idx1 < 4)
  ) {
    return DTypes.STRING;
  }
  return ref[Math.max(0, Math.max(idx1, idx2))];
};

export default DTypes;
