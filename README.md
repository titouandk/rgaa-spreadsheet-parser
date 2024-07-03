# rgaa-spreadsheet-parser

A NodeJS library to parse [official RGAA audit spreadsheets][linkToSpreadsheets] (_.ods_ files).

## Disclaimer

**Do not use this library on untrusted spreadsheets!**

## Supported RGAA versions

- RGAA 4.1.2

## Installation

```bash
npm install rgaa-spreadsheet-parser
```

## Usage

```javascript
import { parseRgaaSpreadsheet } from "rgaa-spreadsheet-parser";

const auditPromise = parseRgaaSpreadsheet({
  rgaaVersion: "4.1.2",
  spreadsheetPath: "rgaa-audit-spreadsheet.ods",
});

auditPromise.then((audit) => {
  console.log(audit.metadata);
  console.log(audit.pages);
  console.log(audit.criteria);
});
```

## Development

Inside the project directory, run:

```bash
npm install
npm run build
```

[linkToSpreadsheets]: https://accessibilite.numerique.gouv.fr/ressources/kit-audit/
