class Datetime {
  static formatDate(string) {
    var date = new Date(string + " 00:00:00");
    if (isNaN(date)) {
      date = new Date(string);
    }
    if (isNaN(date)) {
      throw new Error(`invalid date ${string}`);
    }
    const year = ("000" + date.getFullYear()).slice(-4);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const min = ("0" + date.getMinutes()).slice(-2);
    const sec = ("0" + date.getSeconds()).slice(-2);
    const ms = ("00000" + date.getMilliseconds()).slice(-6);
    return `${year}-${month}-${day} ${hour}:${min}:${sec}.${ms}`;
  }
}

export default Datetime;
