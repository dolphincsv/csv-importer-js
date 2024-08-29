# DolphinCSV Javascript SDK

**[DolphinCSV](https://dolphincsv.com)** is an **embeddable CSV importer** designed to help your users import spreadsheet data into your product. It works out of the box and takes just 10 minutes to set up.

You can embed the **DolphinCSV importer** in your product by using our JavaScript SDKs. Click here if you're looking for the **[React SDK](https://github.com/dolphincsv/)**.

To get your **Client ID**, **[create an account](https://service.dolphincsv.com/auth)**.

Check out our **[documentation here](https://docs.dolphincsv.com)**.

If you ever get stuck or need any help, feel free to click the chat button on the bottom right of our **[website](https://dolphincsv.com)**, and we'll assist you.

## Installation

### Node.js

```bash
npm install @dolphincsv/csv-import-js
```

### Browser (JavaScript)

```html
<script src="https://unpkg.com/@dolphincsv/csv-importer-js/dist/packages/index.1.0.0.umd.js" type="text/javascript"></script>
```

## Usage

### Node.js

```javascript
import { DolphinCSVImporter } from "@dolphincsv/importer";

var importer = DolphinCSVImporter({
    mode: 'development',
    clientId: "YOUR_CLIENT_ID",
    templateKey: "YOUR_TEMPLATE_KEY",
    iFrameClassName: '',
    columns: [
        {key: "name", label: "Name", type: "text", required: true},
        {key: "postcode", label: "postcode", type: "us_postcode", required: true},
        {key: "birthday", label: "Birthday", type: "date", required: true},
        ],
    onSuccess: (importedData) => console.dir(importedData),
    onError: (err) => console.log(err),
    onClose: () => { /* do something */ },
});

importer.launch();
```

### Browser (JavaScript)

```html
<script type="text/javascript">
  var importer = DolphinCSV.DolphinCSVImporter({
    mode: 'development',
    clientId: "YOUR_CLIENT_ID",
    templateKey: "YOUR_TEMPLATE_KEY",
    iFrameClassName: '',
    columns: [
      {key: "name", label: "Name", type: "text", required: true},
      {key: "postcode", label: "postcode", type: "us_postcode", required: true},
      {key: "birthday", label: "Birthday", type: "date", required: true},
    ],
    onSuccess: (importedData) => console.dir(importedData),
    onError: (err) => console.log(err),
    onClose: () => { /* do something */ },
  });

  importer.launch();
</script>
```
