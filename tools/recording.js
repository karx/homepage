const { google } = require("googleapis");
const fs = require("fs");
const config = require('./config.json');
const YAML = require("json-to-pretty-yaml");
const admin = require("firebase-admin");
const moment = require('moment');


var serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kaaroscoreboad.firebaseio.com"
});
let db = admin.firestore();

let debug = false;
// let recordings_backup = require("./recordings_backup.json");

async function getlAllRecordings() {
  if (!debug) {
    let allRecs = []
    let recCollection = await db.collection('2v2wc_match_casts').get();
    recCollection.forEach((rec) => {
      let data = rec.data();
      console.log(data);
      allRecs.push(data);
    });
    console.log(allRecs);

    fs.writeFileSync("./allRecData.json", JSON.stringify(allRecs));
    recsToMD(allRecs);

  } else {
    console.log(':P');
  }
}

async function recsToMD(allRecs) {

  allRecs.forEach(async (rawData) => {
    let data = "";
    let eachVod = rawData.matchDetails;
    console.log({eachVod});
    let vod_url = eachVod.vod_url;
    let vod_details = await getVodDetails(vod_url);
    let caster = eachVod.casterName ? `[${eachVod.casterName}](${eachVod.caster})` : eachVod.caster;
    data += `---\n`;
    data += YAML.stringify({

      title: eachVod.match_id,
      casted_url: eachVod.caster,
      match_id: eachVod.match_id,
      vod_url: eachVod.vod_url,
      header: { teaser: getYoutubeVideoImage(eachVod.vod_url) },
      excerpt: `Casted by ${caster}`,
      ...vod_details
    });

    data += `\n---\n`;
    data += `## Replay\n\n`;
    data += `<iframe id="ytplayer" type="text/html" width="640" height="360" class="post-cover"
    src="https://www.youtube.com/embed/${getYoutubeVideoKey(vod_url)}?autoplay=1&origin=http://2v2wc.netlify.app&modestbranding=1&rel=0"
    frameborder="0"></iframe>`

    if (!!eachVod.matchdetails) {
      console.log(eachVod.matchdetails);
      data += `\n\n## Match Summary\n\n`;
      data += eachVod.matchdetails;
    }
    console.log(eachVod.submitted_at.toDate());
    let filename = `${moment(eachVod.submitted_at.toDate()).format(`YYYY-MM-DD-hhmmss`)}_${eachVod.match_id}`;
    console.log(filename);

    fs.writeFileSync(`../_posts/${filename}.md`, data);
  })

}

async function getVodDetails(url) {
  console.log(url);
  let isYoutube = url.includes('youtube.com');
  return {};
}

function getYoutubeVideoImage(url) {
  let key = getYoutubeVideoKey(url);
  return `https://img.youtube.com/vi/${key}/0.jpg`
}

function getYoutubeVideoKey(url) {
  let key = url.split('?v=')[1];
  return key;
}



getlAllRecordings().catch(console.error);
