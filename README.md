# Information
PDF files are saved in the ```pdfs``` directory (which already exists in the repository), JSON files are saved in the ```jsons``` directory (which already exists in the repository).

A JSON file has the following format:
```
{
    "name": "value",
    "linkCatalog": "value",
    "link": "value",
    "dateStart": "value",
    "dateStartTimestamp": value,
    "dateEnd": "value",
    "dateEndTimestamp": value
}
```
, where:
* ```dateStart```, ```dateEnd``` represents the date as a string
* ```dateStartTimestamp```, ```dateEndTimestamp``` represents the date as a timestamp
* ```link``` represents a URL to the catalog in PDF
* ```linkCatalog``` represents a URL to the catalog on the website

If its necessary to change the names of the directories for saving files or the launch options for ```Puppeteer```, it can be done in ```.env``` file.

# Running
```bash
npm i
npm start
```
