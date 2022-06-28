const fs = require("fs-extra");
const readline = require("readline");
const express = require("express");
const path = require("path");
const templatePath = path.join(__dirname, "templates");

const PORT = process.env.PORT || 3001;

const app = express();

// read JSON variables

// Have Node serve the files for our built React app

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.static(path.resolve(__dirname, "./templates")));

app.post("/api/create-contract", async (req, res) => {
  const packageObj = req.body;
  const variableNames = new RegExp(Object.keys(packageObj).join("|"), "gi");

  const fileStream = fs.createReadStream(
    `./templates/${packageObj["CONTRACT_VERSION"]}Standard.sol`,
    "utf-8"
  );
  const writeStream = fs.createWriteStream(
    `./templates/${packageObj["CONTRACT_NAME"]}.sol`
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    const reg = new RegExp(variableNames, "g");

    const replaced = line.replace(reg, function (matched) {
      return packageObj[matched];
    });

    writeStream.write(replaced + "\n");
  }

  const stream = fs.createReadStream(`./templates/${packageObj["CONTRACT_NAME"]}.sol`);

  res.writeHead(200, {
    "Content-Type": "octet-stream",
    "Content-Disposition":
      "attachment; filename=" + `${packageObj["CONTRACT_NAME"]}.sol`,
  });
  
  stream.pipe(
    res
  );
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
