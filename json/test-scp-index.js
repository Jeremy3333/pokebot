const fs = require("fs");

let rawdata = fs.readFileSync("./json/scp.json");
let scp = JSON.parse(rawdata);
scp.scp.forEach((index) => {
  if (index.index.length > 10) {
    console.log(index.id);
  }
});
