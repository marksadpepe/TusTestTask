require("dotenv").config();
const fs = require("fs");
const pp = require("puppeteer");
const path = require("path");
const CatalogService = require("./services/Catalog.js");
const FileService = require("./services/File.js");

/* TODO
 * [x] - find name
 * [x] - find date
 * [x] - find URL
 * [x] - download PDF and save it to dir
 * [x] - save to JSON (file?)
 * [x] - error handling
 * [x] - refactoring
*/

const pdfDir = process.env.PDF_DIRNAME;
const jsonDir = process.env.JSON_DIRNAME;
const mainUrl = process.env.MAIN_URL;
const width = Number(process.env.VIEW_WIDTH);
const height = Number(process.env.VIEW_HEIGHT);
const headless = false;

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir);
}

(async () => {
  const browser = await pp.launch({headless});
  const page = await browser.newPage();

  await page.goto(mainUrl);
  await page.setViewport({width, height});

  const catalogSection = await page.waitForSelector(".main > #s2");
  const lis = await catalogSection.$$("li");
  const promises = lis.map(async (el) => {
    const catalogCard = await el.$("div");
    const pdfLink = await catalogCard.$eval(".hover .zoom figcaption a:last-child", e => e.getAttribute("href"));

    const catalog = await CatalogService.getCatalog(catalogCard);
    const catalogPdfPath = path.resolve(pdfDir, `${catalog.name}.pdf`);
    const catalogJsonPath = path.resolve(jsonDir, `${catalog.name}.json`);

    try {
      await FileService.saveCatalogToPdf(pdfLink, catalogPdfPath);
      console.log(`Successfully saved catalog ${catalog.name} to PDF: ${catalogPdfPath}`);
    } catch (err) {
      console.error(`Failed to save catalog ${catalog.name} to PDF: ${err.message}`);
    }

    try {
      FileService.saveCatalogToJson(catalog, catalogJsonPath);
      console.log(`Successfully saved catalog ${catalog.name} to JSON: ${catalogJsonPath}`);
    } catch (err) {
      console.error(`Failed to save catalog ${catalog.name} to JSON: ${err.message}`);
    }
  });

  await Promise.all(promises);

  await browser.close();
})();
