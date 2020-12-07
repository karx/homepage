async function submitVodData(e) {
  e.preventDefault();
  console.log("Yo Yo Vod Submit Clicked");

  let vod_url = document.getElementById('streamurl').value;
  let match_id = document.getElementById('matchid').value;
  let caster = document.getElementById('casterurl').value;

  let casterName = document.getElementById('casterName').value;
  let drafts = document.getElementById('drafts').value;
  let matchdetails = document.getElementById('matchdetails').value;

  let matchDetails = {
    vod_url: vod_url,
    match_id: match_id,
    caster: caster,
    casterName: casterName,
    drafts: drafts,
    matchdetails: matchdetails,
    submitted_at: new Date()
  }
  //Send to Firebase

  let firebaseOP = await db.collection(`2v2wc_match_casts`).add({matchDetails});

    // .then((e) => {console.log(e)})
    // .catch((e)=> {console.error(e)});


  console.log({firebaseOP});
  console.log({matchDetails});
    window.location.href = '/submit-thanks.html';

}
console.log('Up8')