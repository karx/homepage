document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    setTimeout(pushThePlayButton, 2600);  
}, false)

function pushThePlayButton() {
  let vids = document.getElementsByClassName("video-autoplay-pusher");
  console.log(vids);
  [...vids].forEach(element => {
      console.log(element);
    element.play();
  });
}
