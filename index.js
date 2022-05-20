const fs = require("fs-extra");
const readline = require('readline');

// read JSON variables
fs.readJson("./variables.json", async(err, packageObj) => {
  if (err) console.error(err);

  const variableNames = new RegExp(Object.keys(packageObj).join("|"), "gi");

  const fileStream = fs.createReadStream('./templates/ERC721OptimizedWithPresale.sol', 'utf-8');
  const writeStream = fs.createWriteStream(`./templates/${packageObj["CONTRACT_NAME"]}.sol`)

  const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
  });


  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    const reg = new RegExp(variableNames, 'g');

    const replaced = line.replace(reg, function(matched) {
        return packageObj[matched];
      });

      writeStream.write(replaced + '\n');
  }
  
});
