const { google } = require("googleapis");
const fs = require("fs");
const config = require('./config.json');
const YAML = require("json-to-pretty-yaml");

let sheets = google.sheets({
  version: "v4",
  auth: config.G_SHEETS_API,
});

let debug = true;
let qualifiers128_backup = require("./qualifiers128.json");
let teams_backup = require("./allPlayerData.json");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function getAllPlayers() {
  if (!debug) {
    sheets.spreadsheets.values
      .get({
        spreadsheetId: "1I3cnl0rgKrwoymq82MhHXg_SasBPbsvqbfRnGgdI11U",
        range: "Qualifier Teams!B5:H135",
      })
      .then((sheetVal) => {
        console.log(sheetVal.data);
        fs.writeFileSync("./allPlayerData.json", JSON.stringify(sheetVal.data));
        playerDataToMD(sheetVal.data);
      });
  } else {
    let data = teams_backup;
    console.log(data.range);
    playerDataToMD(data);
  }
}

async function getAllQualifiers128() {
  //Round of 128
  if (!debug) {
    sheets.spreadsheets.values
      .get({
        spreadsheetId: "1I3cnl0rgKrwoymq82MhHXg_SasBPbsvqbfRnGgdI11U",
        range: "Qualifiers!B5:H",
      })
      .then((sheetVal) => {
        console.log(sheetVal.data);
        fs.writeFileSync("./qualifiers128.json", JSON.stringify(sheetVal.data));
        qualifiers128ToMD(sheetVal.data);
      });
  } else {
    let data = qualifiers128_backup;
    console.log(data.range);
    qualifiers128ToMD(data);
  }
}

async function qualifiers128ToMD(data) {
  let qualifiers128 = data.values;
  let totalLength = qualifiers128.length;
  console.log({ totalLength });
  for (i = 0; i < totalLength; i += 6) {
    let data = "";

    // converting team names into links to team pages
    qualifiers128[i+2][0] = `[${qualifiers128[i+2][0]}](/teams/${qualifiers128[i+2][0].split(' ').join('_').toLowerCase()})`;
    qualifiers128[i+3][0] = `[${qualifiers128[i+3][0]}](/teams/${qualifiers128[i+3][0].split(' ').join('_').toLowerCase()})`;

    data += `---\n`;
    data += YAML.stringify({
      team_1: qualifiers128[i + 2][0],
      team_2: qualifiers128[i + 3][0],
      title: qualifiers128[i][0],
    });

    data += YAML.stringify({
      status: qualifiers128[i + 2][1] === "-" ? "TBP" : "Concluded",
      excerpt: `${qualifiers128[i + 2][0]} vs ${qualifiers128[i + 3][0]}`,
    });
    data += `\n---\n`;

    data += `## Results\n\n`;
    data += `| ${qualifiers128[i + 1].join(" | ")} |\n`;
    data += `| -- | -- | -- | -- | -- | -- | -- |\n`;
    data += `| ${qualifiers128[i + 2].join(" | ")} |\n`;
    data += `| ${qualifiers128[i + 3].join(" | ")} |\n`;

    let filename = qualifiers128[i][0].split(" #").join("_");
    console.log(filename);
    fs.writeFileSync(`../_qualifiers/${filename}.md`, data);
  }
}

async function playerDataToMD(data) {
  let playerData = data.values;
  let totalLength = playerData.length;
  console.log({ totalLength });
  playerData.forEach((eachTeam) => {
    let data = "";

    data += `---\n`;
    data += YAML.stringify({

      title: eachTeam[1],
      player_1: eachTeam[2],
      player_2: eachTeam[3],
      match_difference: eachTeam[5],
      map_difference: eachTeam[6]
    });
    if (eachTeam[4] !== "") {
      data += YAML.stringify({

        subsitute: eachTeam[4],
        excerpt: `${eachTeam[2]}, ${eachTeam[3]} and ${eachTeam[4]}`
      });
    } else {
      data += YAML.stringify({
        excerpt: `${eachTeam[2]} and ${eachTeam[3]}`
      });
    }

    data += YAML.stringify({
      status: eachTeam[5] === "0-1" ? "DNQ" : eachTeam[5] === '0-0' ? "Pending" : "Qualified"

    });
    data += `\n---\n`;
    data += `## Players\n\n`;
    data += `| Player 1 | Player 2 | Subsitute |\n`;
    data += `| -- | -- | -- |\n`;
    data += `| ${eachTeam[2]} | ${eachTeam[3]} | ${eachTeam[4] === "" ? "NIL" : eachTeam[4]} |\n`;


    let filename = eachTeam[1].split(" ").join("_").toLowerCase();
    console.log(filename);
    fs.writeFileSync(`../_teams/${filename}.md`, data);
  })

}

getAllPlayers().catch(console.error);
getAllQualifiers128().catch(console.error);
