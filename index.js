require("dotenv").config();
const fs = require("fs");
const pp = require("puppeteer");
const https = require("https");
const path = require("path");
const CatalogDto = require("./dtos/Catalog.js");

/* TODO
 * [x] - find name
 * [x] - find date
 * [x] - find URL
 * [x] - download PDF and save it to dir
 * [x] - save to JSON (file?)
 * [] - error handling
 * [] - refactoring
*/

const pdfDir = process.env.PDF_DIRNAME;
const jsonDir = process.env.JSON_DIRNAME;

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir);
}

const downloadFile = (url, dst) => {
  const dirname = path.dirname(dst);
  if (!fs.existsSync(dirname)) {
    throw new Error(`Specified directory does not exists ${dirname}`);
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dst);
    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`File successfully downloaded at: ${dst}`);
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dst);
      reject(err);
    });
  });
};

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
    const pdfLink = await catalogCard.$eval(".hover .zoom figcaption a:last-child", e => e.getAttribute("href"));

    const catalogLinkEl = await catalogCard.$(".hover h3 a");
    const catalogName = await catalogLinkEl.evaluate(e => e.textContent);
    const catalogLink = await catalogLinkEl.evaluate(e => e.getAttribute("href"));

    const dates = await catalogCard.$$("p time");
    const dateStartString = await dates[0].evaluate(e => e.getAttribute("datetime"));
    const dateEndString = await dates[1].evaluate(e => e.getAttribute("datetime"));

    const pdfPath = path.resolve(pdfDir, `${catalogName}.pdf`);
    const jsonPath = path.resolve(jsonDir, `${catalogName}.json`);

    try {
      await downloadFile(pdfLink, pdfPath);
    } catch (err) {
      console.error(`Failed to download catalog ${catalogName}: ${err.message}`);
    }
    const catalog = new CatalogDto(catalogName, dateStartString, dateEndString, catalogLink);
    const data = {
      name: catalog.name,
      dateStart: catalog.dateStart,
      dateEnd: catalog.dateEnd,
      link: catalog.link
    };

    try {
      fs.writeFile(jsonPath, JSON.stringify(data), "utf-8", (err) => {
        if (err) {
          console.error(`Failed to save catalog ${catalogName} to JSON: ${err.message}`);
          return;
        }
      });

      console.log(`Catalog ${catalogName} successfully saved to ${jsonPath} JSON file`);
    } catch (err) {
      console.error(`Failed to save catalog ${catalogName} to JSON: ${err.message}`);
    }
  });

  await Promise.all(promises);

  await browser.close();
})();
