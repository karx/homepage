// new Twitch.Embed("twitch-embed", {
//   width: 854,
//   height: 480,
//   channel: "monstercat",
//   // only needed if your site is also embedded on embed.example.com and othersite.example.com
//   parent: ["embed.example.com", "othersite.example.com"]
// });

async function getAllReleventStreams() {
  let game_id = 13389;
  let filters = ["2v2", "wc", "World Cup"];
  let streamsData = await fetch(
    `https://tbridge.akriya.co.in/gamestreams?game_id=${game_id}&filter=${filters.join(
      ","
    )}`
  );
  streams = await streamsData.json();
  console.log(streams);

  return streams;
}

async function embedTop4Stream() {
  let streams = await getAllReleventStreams();
  addStreamToDOM(streams.slice(0, 5));
}

async function embedAllStream() {
  let streams = await getAllReleventStreams();
  addStreamToDOM(streams);
}

function addStreamToDOM(streams) {
  if (streams.length < 1) {
    document.getElementById("lookingStreams").innerHTML =
      "👻 No live events at the moment 👻";
  } else {
    document.getElementById("lookingStreams").style.display = "none";
    let parentContainer = document.getElementById("stream-embeds");

    streams.forEach((element, i) => {
      let el_id = `twitch-embed-${i}`;
      let el = document.createElement("div");
      el.setAttribute("id", el_id);
      parentContainer.appendChild(el);

      let twitchEmebd = new Twitch.Embed(el_id, {
        width: 340,
        // height: '80%',
        channel: element.user_name,
        autoplay: false,
        layout: "video",
        theme: "light",
        // only needed if your site is also embedded on embed.example.com and othersite.example.com
        parent: ["2v2wc.netlify.app", "localhost"],
      });
    });
  }
}
