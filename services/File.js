const fs = require("fs");
const path = require("path");
const https = require("https");

class File {
  async saveCatalogToPdf(url, dst) {
    const dirname = path.dirname(dst);
    if (!fs.existsSync(dirname)) {
      throw new Error(`Directory ${dirname} does not exists`);
    }

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dst);
      https.get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(dst);
        reject(err);
      });
    });
  }

  saveCatalogToJson(catalog, dst) {
    const data = {
      name: catalog.name,
      url: catalog.link,
      urlPdf: catalog.linkPdf,
      dateStart: catalog.dateStart,
      dateStartTimestamp: catalog.dateStartTmp,
      dateEnd: catalog.dateEnd,
      dateEndTimestamp: catalog.dateEndTmp
    };

    fs.writeFile(dst, JSON.stringify(data), "utf-8", (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }
}

module.exports = new File();
