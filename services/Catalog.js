const CatalogDto = require("../dtos/Catalog.js");

class Catalog {
  async getCatalog(catalogEl) {
    const name = await this.getName(catalogEl);
    const dates = await this.getDates(catalogEl);
    const links = await this.getLinks(catalogEl);

    return new CatalogDto(name, dates.dateStart, dates.dateEnd, dates.dateStartTmp, dates.dateEndTmp, links.link, links.linkPdf);
  }

  async getName(catalogEl) {
    const name = catalogEl.$eval(".hover h3 a", e => e.textContent);
    return name;
  }

  async getDates(catalogEl) {
    const dates = await catalogEl.$$("p time");
    const dateStart = await dates[0].evaluate(e => e.getAttribute("datetime"));
    const dateEnd = await dates[1].evaluate(e => e.getAttribute("datetime"));
    const dateStartTmp = Math.floor(new Date(dateStart).getTime() / 1000);
    const dateEndTmp = Math.floor(new Date(dateEnd).getTime() / 1000);

    return {dateStart, dateEnd, dateStartTmp, dateEndTmp};
  }

  async getLinks(catalogEl) {
    const link = await catalogEl.$eval(".hover h3 a", e => e.getAttribute("href"));
    const linkPdf = await catalogEl.$eval(".hover .zoom figcaption a:last-child", e => e.getAttribute("href"));
    return {link, linkPdf};
  }
}

module.exports = new Catalog();
