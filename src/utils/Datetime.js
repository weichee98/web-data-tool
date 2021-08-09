Date.prototype.toString = function () {
  return this.toLocaleString();
};

class Datetime {
  static formatDate(string) {
    var date = new Date(string + " 00:00:00");
    if (isNaN(date)) {
      date = new Date(string);
    }
    if (isNaN(date)) {
      throw new Error(`invalid date ${string}`);
    }
    return date;
  }
}

export default Datetime;
