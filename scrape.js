const request = require("request");
const cheerio = require("cheerio");

let ICAO = process.argv[2];

request(
  "https://www.aisweb.aer.mil.br/?i=aerodromos&codigo=" + ICAO,
  (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const tudo = $("body > div > div > div > div > div:nth-child(2)")
        .text()
        .replace(/\s+/g, " ");

      const nascer = $(
        "body > div > div > div > div > div > div > div > h4 > sunrise "
      )
        .text()
        .replace(/\s+/g, " ");

      const por = $(
        "body > div > div > div > div > div > div > div > h4 > sunset "
      )
        .text()
        .replace(/\s+/g, " ");

      const cartas = [];

      $("body > div > div > div > div > div:nth-child(2) >  ul > li ").each(
        function(i, e) {
          cartas[i] = $(this)
            .text()
            .replace(/\s+/g, " ");
        }
      );

      const metarp1 = tudo.search("METAR");
      const metarp2 = tudo.search("TAF");
      const tafp2 = tudo.search("Cartas");

      const metar = tudo.substring(metarp1 + 5, metarp2);
      const taf = tudo.substring(metarp2 + 3, tafp2);

      console.log("Metar: " + metar);
      console.log("TAF: " + taf);
      console.log("Nascer do Sol: " + nascer);
      console.log("Por do Sol: " + por);
      console.log("Cartas: " + cartas);
    }
  }
);
