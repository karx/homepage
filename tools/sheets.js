const { google } = require("googleapis");
const fs = require("fs");
const config = require('./config.json');
const YAML = require("json-to-pretty-yaml");

let sheets = google.sheets({
  version: "v4",
  auth: config.G_SHEETS_API,
});

let debug = false;
let qualifiers128_backup = require("./qualifiers128.json");
let qualifiers64_backup = require("./qualifiers64.json");
let qualifiers32_backup = require("./qualifiers32.json");
let teams_backup = require("./allPlayerData.json");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function getAllPlayers() {
  if (!debug) {
    sheets.spreadsheets.values
      .get({
        spreadsheetId: "1I3cnl0rgKrwoymq82MhHXg_SasBPbsvqbfRnGgdI11U",
        range: "Qualifier Teams!B5:J",
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

async function getAllQualifiers64() {
  //Round of 64
  if (!debug) {
    sheets.spreadsheets.values
      .get({
        spreadsheetId: "1I3cnl0rgKrwoymq82MhHXg_SasBPbsvqbfRnGgdI11U",
        range: "Qualifiers!K8:Q",
      })
      .then((sheetVal) => {
        console.log(sheetVal.data);
        fs.writeFileSync("./qualifiers64.json", JSON.stringify(sheetVal.data));
        qualifiers64ToMD(sheetVal.data);
      });
  } else {
    let data = qualifiers64_backup;
    console.log(data.range);
    qualifiers64ToMD(data);
  }
}


async function getAllQualifiers32() {
  //Round of 32
  if (!debug) {
    sheets.spreadsheets.values
      .get({
        spreadsheetId: "1I3cnl0rgKrwoymq82MhHXg_SasBPbsvqbfRnGgdI11U",
        range: "Qualifiers!T14:Z",
      })
      .then((sheetVal) => {
        console.log(sheetVal.data);
        fs.writeFileSync("./qualifiers32.json", JSON.stringify(sheetVal.data));
        qualifiers32ToMD(sheetVal.data);
      });
  } else {
    let data = qualifiers32_backup;
    console.log(data.range);
    qualifiers32ToMD(data);
  }
}

async function qualifiers128ToMD(data) {
  let qualifiers128 = data.values;
  let totalLength = qualifiers128.length;
  console.log({ totalLength });
  for (i = 0; i < totalLength; i += 6) {
    let data = "";
    let filename = qualifiers128[i][0].split(" #").join("_");

    let team_1_slug = qualifiers128[i+2][0].split(' ').join('_').toLowerCase();
    let team_2_slug = qualifiers128[i+3][0].split(' ').join('_').toLowerCase();
    // converting team names into links to team pages
    qualifiers128[i+2][0] = `[${qualifiers128[i+2][0]}](/teams/${qualifiers128[i+2][0].split(' ').join('_').toLowerCase()})`;
    qualifiers128[i+3][0] = `[${qualifiers128[i+3][0]}](/teams/${qualifiers128[i+3][0].split(' ').join('_').toLowerCase()})`;

    data += `---\n`;
    data += YAML.stringify({
      team_1: qualifiers128[i + 2][0],
      team_2: qualifiers128[i + 3][0],
      team_1_slug: team_1_slug,
      team_2_slug: team_2_slug,
      title: qualifiers128[i][0],
      optval: filename,
      type: 'qualifier',
      round: 'Round of 128'
    });

    data += YAML.stringify({
      status: qualifiers128[i + 2][1] === "-" ? "TBP" : "Concluded",
      excerpt: `${qualifiers128[i + 2][0]} vs ${qualifiers128[i + 3][0]}`,
    });
    data += `\n---\n`;

    data += `## Results\n\n`;
    data += `| ${qualifiers128[i + 1].join(" | ")} |\n`;
    data += `| -- | -- | -- | -- | -- | -- | -- |\n`;
    data += `| ${qualifiers128[i + 2].map(v => '*' + v + '*').join(" | ")} |\n`;
    data += `| ${qualifiers128[i + 3].map(v => '*' + v + '*').join(" | ")} |\n`;


    console.log(filename);
    fs.writeFileSync(`../_qualifiers/${filename}.md`, data);
  }
}

async function qualifiers64ToMD(data) {
  let qualifiers64 = data.values;
  let totalLength = qualifiers64.length;
  console.log({ totalLength });
  for (i = 0; i < totalLength; i += 12) {
    let data = "";
    let filename = qualifiers64[i][0].split(" #").join("_");
    let team_1_slug = qualifiers64[i+2][0].split(' ').join('_').toLowerCase();
    let team_2_slug = qualifiers64[i+3][0].split(' ').join('_').toLowerCase();

    // converting team names into links to team pages
    qualifiers64[i+2][0] = `[${qualifiers64[i+2][0]}](/teams/${qualifiers64[i+2][0].split(' ').join('_').toLowerCase()})`;
    qualifiers64[i+3][0] = `[${qualifiers64[i+3][0]}](/teams/${qualifiers64[i+3][0].split(' ').join('_').toLowerCase()})`;

    data += `---\n`;
    data += YAML.stringify({
      team_1: qualifiers64[i + 2][0],
      team_2: qualifiers64[i + 3][0],
      team_1_slug: team_1_slug,
      team_2_slug: team_2_slug,
      title: qualifiers64[i][0],
      optval: filename,
      type: 'qualifier',
      round: 'Round of 64'
    });

    data += YAML.stringify({
      status: qualifiers64[i + 2][1] === "-" ? "TBP" : "Concluded",
      excerpt: `${qualifiers64[i + 2][0]} vs ${qualifiers64[i + 3][0]}`,
    });
    data += `\n---\n`;

    data += `## Results\n\n`;
    data += `| ${qualifiers64[i + 1].join(" | ")} |\n`;
    data += `| -- | -- | -- | -- | -- | -- | -- |\n`;
    data += `| ${qualifiers64[i + 2].join(" | ")} |\n`;
    data += `| ${qualifiers64[i + 3].join(" | ")} |\n`;


    console.log(filename);
    fs.writeFileSync(`../_qualifiers/${filename}.md`, data);
  }
}


async function qualifiers32ToMD(data) {
  let qualifiers32 = data.values;
  let totalLength = qualifiers32.length;
  console.log({ totalLength });
  for (i = 0; i < totalLength; i += 24) {
    let data = "";
    let filename = qualifiers32[i][0].split(" #").join("_");
    let team_1_slug = qualifiers32[i+2][0].split(' ').join('_').toLowerCase();
    let team_2_slug = qualifiers32[i+3][0].split(' ').join('_').toLowerCase();

    // converting team names into links to team pages
    qualifiers32[i+2][0] = `[${qualifiers32[i+2][0]}](/teams/${qualifiers32[i+2][0].split(' ').join('_').toLowerCase()})`;
    qualifiers32[i+3][0] = `[${qualifiers32[i+3][0]}](/teams/${qualifiers32[i+3][0].split(' ').join('_').toLowerCase()})`;

    data += `---\n`;
    data += YAML.stringify({
      team_1: qualifiers32[i + 2][0],
      team_2: qualifiers32[i + 3][0],
      team_1_slug: team_1_slug,
      team_2_slug: team_2_slug,
      title: qualifiers32[i][0],
      optval: filename,
      type: 'qualifier',
      round: 'Round of 32'
    });

    data += YAML.stringify({
      status: qualifiers32[i + 2][1] === "-" ? "TBP" : "Concluded",
      excerpt: `${qualifiers32[i + 2][0]} vs ${qualifiers32[i + 3][0]}`,
    });
    data += `\n---\n`;

    data += `## Results\n\n`;
    data += `| ${qualifiers32[i + 1].join(" | ")} |\n`;
    data += `| -- | -- | -- | -- | -- | -- | -- |\n`;
    data += `| ${qualifiers32[i + 2].join(" | ")} |\n`;
    data += `| ${qualifiers32[i + 3].join(" | ")} |\n`;


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

      title: eachTeam[3],
      player_1: eachTeam[4],
      player_2: eachTeam[5],
      match_difference: eachTeam[7],
      map_difference: eachTeam[8],
      seed: eachTeam[0],
      average_elo: eachTeam[1].replace(',','.'),
      sheet: 'silver',
      team_slug: eachTeam[3].split(' ').join('_').toLowerCase(),
    });
    if (eachTeam[6] !== "") {
      data += YAML.stringify({

        subsitute: eachTeam[6],
        excerpt: `${eachTeam[4]}, ${eachTeam[5]} and ${eachTeam[6]}`
      });
    } else {
      data += YAML.stringify({
        excerpt: `${eachTeam[4]} and ${eachTeam[5]}`
      });
    }

    data += YAML.stringify({
      status: eachTeam[7].split('-')[1] === "1" ? "DNQ" : eachTeam[7] === '0-0' ? "Pending" : "Qualified"
    });
    data += `\n---\n`;
    data += `## Players\n\n`;
    data += `| Player 1 | Player 2 | Subsitute |\n`;
    data += `| -- | -- | -- |\n`;
    data += `| ${eachTeam[4]} | ${eachTeam[5]} | ${eachTeam[6] === "" ? "NIL" : eachTeam[6]} |\n`;


    let filename = eachTeam[3].split(" ").join("_").toLowerCase();
    console.log(filename);
    fs.writeFileSync(`../_teams/${filename}.md`, data);
  })

}

getAllPlayers().catch(console.error);
getAllQualifiers128().catch(console.error);
getAllQualifiers64().catch(console.error);
getAllQualifiers32().catch(console.error);
