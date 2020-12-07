const fs = require("fs");
const config = require("./config.json");
const request = require("./await-request");

async function getAllAoEStreams() {

  let streams = [];

  let streamDataRaw = await twitchCallWithPage(
    "https://api.twitch.tv/helix/streams",
    {
      game_id: 13389,
      first: 100
    }
  );
  let streamData = JSON.parse(streamDataRaw);

  console.log(streamData.data.length);
  streams.push(...streamData.data);


  // while(streamData.data.length > 0) {
  //   let nextToken = streamData.pagination.cursor;
  //   console.log(nextToken);
  //   streamDataRaw = await twitchCallWithPage(
  //     "https://api.twitch.tv/helix/streams",
  //     {
  //       game_id: 13389
  //     },
  //     nextToken
  //   );
  //   streamData = JSON.parse(streamDataRaw);

  //   console.log(streamData.data.length);
  //   console.log(streamData);

  //   streams.push(...streamData.data);
  // }

  // console.log(streams);
  fs.writeFileSync(`./allAoE-II-stream-7-Dec-2020.json`, JSON.stringify(streams));
  return streams;

}


async function get2v2WCStreams() {
  let aoeStreams = await getAllAoEStreams();
  let filtered = aoeStreams.filter( x =>  !!isStreamData2v2(x));
  console.log(filtered.length);
  fs.writeFileSync(`./allAoE-II-2v2-7-Dec-2020.json`, JSON.stringify(filtered));
}

function isStreamData2v2(streamData) {
  if(
    streamData.title.includes('2v2') ||
    streamData.title.includes('World Cup') ||
    streamData.title.includes('wc')
  ) {
    return true
  } else {
    return false
  }
}

async function twitchCallWithPage(url, qs, token = "") {
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Client-Id": config.Twitch_ClientID,
    Authorization: "Bearer " + config.Twitch_Auth
  };
  console.log("------------------");
  if (token !== "") {
    qs = {
      ...qs,
      after: token,
    };
  }
  console.log(qs);
  let twitch_response = await request({
    method: "get",
    url: url,
    qs: qs,
    headers: headers,
    // json: true
  });
  return twitch_response;
}

get2v2WCStreams();
