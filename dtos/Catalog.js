class Catalog {
  name;
  dateStart;
  dateEnd;
  dateStartTmp;
  dateEndTmp;
  link;

  constructor(name, dateStart, dateEnd, dateStartTmp, dateEndTmp, link) {
    this.name = name;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.dateStartTmp = dateStartTmp;
    this.dateEndTmp = dateEndTmp;
    this.link = link;
  }
}

module.exports = Catalog;
