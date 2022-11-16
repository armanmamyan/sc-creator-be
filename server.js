const fs = require("fs-extra");
const cors = require("cors");
const readline = require("readline");
const express = require("express");
const path = require("path");
const templatePath = path.join(__dirname, "contracts");

const PORT = process.env.PORT || 3001;

const app = express();

// read JSON variables

// Have Node serve the files for our built React app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "./contracts")));
app.use(cors({ origin: "https://smartcontractbuilder.net/", credentials: true }))

app.post("/api/create-contract", async (req, res) => {
  const packageObj = req.body;
  const variableNames = new RegExp(Object.keys(packageObj).join("|"), "gi");
  const {HAS_WHITELIST, WITH_REFUND, CONTRACT_VERSION, HAS_MERKLE} = packageObj;
  
  const isStandard = CONTRACT_VERSION == 'ERC721+';

  let contract = isStandard ? 'ERC721Standard' : `${CONTRACT_VERSION}Standard`;

  if(HAS_WHITELIST && WITH_REFUND) {
    contract += 'WithPresaleAndRefund'
  } else if(HAS_WHITELIST && !WITH_REFUND) {
    contract += 'WithPresale'
  } else if(!HAS_WHITELIST && !WITH_REFUND  && HAS_MERKLE) {
    contract += 'WithMerkle'
  } else if(!HAS_WHITELIST && HAS_MERKLE && WITH_REFUND) {
    contract += 'WithMerkleAndRefund'
  } else if(!HAS_WHITELIST && !HAS_MERKLE && WITH_REFUND) {
    contract += 'WithRefund'
  }
  
  const fileStream = fs.createReadStream(
    `${templatePath}/${contract}.sol`,
    "utf-8"
  );
  const writeStream = fs.createWriteStream(
    `${templatePath}/${packageObj["CONTRACT_NAME"]}.sol`
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

  const stream = fs.createReadStream(`${templatePath}/${packageObj["CONTRACT_NAME"]}.sol`);

  // res.set({'Access-Control-Allow-Origin': '*'})
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "octet-stream",
    "Content-Disposition":
      "attachment; filename=" + `${packageObj["CONTRACT_NAME"]}.sol`,
  });
  
  stream.pipe(
    res
  );

});


app.delete("/api/delete-contract", async (req, res) => {
  const packageObj = req.query;
  console.log(packageObj);
  fs.unlink(`${templatePath}/${packageObj.contractName}.sol`);
  
  res.set({'Access-Control-Allow-Origin': '*'})
  res.status(200).send('Successfully deleted')
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
