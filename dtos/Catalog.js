class Catalog {
  name;
  dateStart;
  dateEnd;
  link;

  constructor(name, dateStart, dateEnd, link) {
    this.name = name;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.link = link;
  }
}

module.exports = Catalog;
