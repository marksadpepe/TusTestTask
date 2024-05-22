const pp = require("puppeteer");
const CatalogDto = require("./dtos/Catalog.js");

/* TODO
 * [x] - find name
 * [x] - find date
 * [x] - find URL
 * [] - download PDF and save it to dir
 * [] - save to JSON (file?)
 * [] - error handling
 * [] - refactoring
*/

(async () => {
  const browser = await pp.launch({headless: false});
  const page = await browser.newPage();

  await page.goto("https://www.tus.si");
  await page.setViewport({
    width: 1080,
    height: 1024
  });

  const catalogSection = await page.waitForSelector(".main > #s2");
  const lis = await catalogSection.$$("li");
  const promises = lis.map(async (el) => {
    const catalogCard = await el.$("div");

    const catalogLinkEl = await catalogCard.$(".hover h3 a");
    const catalogName = await catalogLinkEl.evaluate(e => e.textContent);
    const catalogLink = await catalogLinkEl.evaluate(e => e.getAttribute("href"));

    const dates = await catalogCard.$$("p time");
    const dateStartString = await dates[0].evaluate(e => e.getAttribute("datetime"));
    const dateEndString = await dates[1].evaluate(e => e.getAttribute("datetime"));

    const catalog = new CatalogDto(catalogName, dateStartString, dateEndString, catalogLink);
    console.log(catalog.name, catalog.link, catalog.dateStart, catalog.dateEnd);
  });

  await Promise.all(promises);

  await browser.close();
})();
