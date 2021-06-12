const fs = require("fs");
async function scrap() {
  var json = { scp: [] };
  const scraper = require("./scrapper");
  let entry;
  let id = 3510;
  var counts = 4001;
  while (counts < 5999) {
    if (`${counts}`.length == 1) {
      numbre = `00${counts}`;
    } else if (`${counts}`.length == 2) {
      var numbre;
      numbre = `0${counts}`;
    } else {
      numbre = counts;
    }
    var link = `http://www.scpwiki.com/scp-${numbre}`;
    await scraper(link).then((res) => {
      entry = res;
    });
    counts++;
    entry.link = link;
    if (entry.index != null && entry.index.startsWith("SCP-")) {
      entry.id = id;
      id++;
      console.log(`Scrapped SCP-${numbre}`);
      json.scp.push(entry);
    } else {
      console.log(`Failed at Scrappe SCP-${numbre}`);
    }
  }
  json = JSON.stringify(json);
  fs.writeFile("./json/scp-temp.json", json, function (err) {
    if (err) return console.log(err);
  });
}
scrap();
