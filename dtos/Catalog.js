class Catalog {
  name;
  dateStart;
  dateEnd;
  dateStartTmp;
  dateEndTmp;
  link;
  linkPdf;

  constructor(name, dateStart, dateEnd, dateStartTmp, dateEndTmp, link, linkPdf) {
    this.name = name;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.dateStartTmp = dateStartTmp;
    this.dateEndTmp = dateEndTmp;
    this.link = link;
    this.linkPdf = linkPdf;
  }
}

module.exports = Catalog;
