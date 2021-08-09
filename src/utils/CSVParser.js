import DTypes from "./DataTypes";

class CSVParser {
  static readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  static csvToArray(text, delimiter = ",") {
    text = text.trim();
    var row = [],
      table = [],
      c;
    var temp = "",
      double_start = false,
      single_start = false;
    for (var i = 0; i < text.length; i++) {
      c = text[i];
      switch (c) {
        case '"':
          if (single_start) {
            temp += c;
          } else {
            if (!double_start) {
              double_start = true;
            } else {
              double_start = false;
            }
          }
          break;
        case "'":
          if (double_start) {
            temp += c;
          } else {
            if (!single_start) {
              single_start = true;
            } else {
              single_start = false;
            }
          }
          break;
        case delimiter:
          if (double_start || single_start) {
            temp += c;
          } else {
            if (table.length == 0) {
              row.push(temp);
            } else {
              row.push(DTypes.evalValue(temp));
            }
            temp = "";
          }
          break;
        case "\n":
        case "\r":
          if (text[i - 1] != "\n" && text[i - 1] != "\r") {
            if (double_start || single_start) {
              temp += c;
            } else {
              if (table.length == 0) {
                row.push(temp);
              } else {
                row.push(DTypes.evalValue(temp));
              }
              table.push(row);
              temp = "";
              row = [];
            }
          }
          break;
        default:
          temp += c;
      }
    }
    if (table.length == 0) {
      row.push(temp);
    } else {
      row.push(DTypes.evalValue(temp));
    }
    table.push(row);
    return table;
  }
}

export default CSVParser;
