let play_state = 0;
document.getElementById('play-start').addEventListener('click', (e) => {
    if (play_state == 0) {
        document.getElementById('themSounds').play();
        play_state = 1;
        journeyStart();
        document.getElementById('play-start').innerHTML = '◾';

    } else {
        document.getElementById('themSounds').pause();
        play_state = 0;
        document.getElementById('play-start').innerHTML = '▶';

    }
});
async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function journeyStart() {
    kaaroScrollTo('page-1');
    await delay(2000);
    kaaroScrollTo('page-2');
    await delay(4000);
    kaaroScrollTo('page-3');
    await delay(1000);
    kaaroScrollTo('page-4');
    await delay(1000);
    kaaroScrollTo('page-5');
    await delay(1000);
    kaaroScrollTo('page-6');
    await delay(1000);
    kaaroScrollTo('page-7');
    await delay(1000);
    kaaroScrollTo('page-8');
    await delay(5000);
    kaaroScrollTo('page-9');
    await delay(2000);
    kaaroScrollTo('intro');
}

function kaaroScrollTo(el_id) {
    console.log('next scoll is ', el_id);
    document.getElementById(el_id).scrollIntoView({behavior: 'smooth', block: 'end'});

}