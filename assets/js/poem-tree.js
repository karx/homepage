google.charts.load("current", { packages: ["wordtree"] });
google.charts.setOnLoadCallback(initChart);

var globalChartHandle;
let chart_width = 400;

var options = {
    wordtree: {
        format: "implicit",
        word: "started",
        type: "double",
        // width: chart_width,
        // chartArea: {
        //     width: chart_width
        // }
    }
};
var g_phrases_array = ["Let's get started shall we"];
var g_data_backtup;

let poemSpeed = 250;

function initChart() {
    var data = google.visualization.arrayToDataTable([
        ["Phrases"],
        ["We are now live, time to get started"]
    ]);

    var chart = new google.visualization.WordTree(
        document.getElementById("wordtree_basic")
    );
    globalChartHandle = chart;
    chart.draw(data, options);
}

async function getFocusWord(phrase) {
    var words = phrase.split(' ');
    return words[Math.floor(words.length / 2)]; // middle word
}

async function updateChartWithStrings(phrase_array, focusWord = 'not_set') {
    console.log(`changing data of the graph`);
    let chart = globalChartHandle;
    let data_array = [["Phrases"]];
    g_phrases_array = [...g_phrases_array, ...phrase_array];
    if (focusWord === 'not_set') {
        focusWord = await getFocusWord(phrase_array[0]);

    }
    options.wordtree.word = focusWord;

    g_phrases_array.forEach(str => {
        data_array.push([str]);
    });

    console.log(data_array);
    var data = google.visualization.arrayToDataTable(data_array);
    chart.draw(data, options);
    g_data_backtup = data;
}

async function updateChartToFocusWord(word) {
    if (word.length > 0) {
        let chart = globalChartHandle;
        options.wordtree.word = word;
        chart.draw(g_data_backtup, options);
    }
}

async function test() {
    updateChartWithStrings(['Getting started is 50% of सह job done'], 'started');
    loadEntirePoem();
    showPlayButton();
}

async function loadEntirePoem() {

    let poemPhrases = await getAllPoemPhrases();
    // console.log(poemPhrases);
    updateChartWithStrings(poemPhrases);

}

function perform_vibration(type = 1) {
    try {
        if (type == 0) {
            window.navigator.vibrate(300);
        } else if (type == 1) {
            window.navigator.vibrate([20, 30, 20, 30, 20]);
        } else if (type == 2) {
            window.navigator.vibrate([20]);
        }
    } catch (error) {
        console.log(error);
    }

}

async function getAllPoemPhrases() {
    let rawPoemString = document.getElementById('raw-poem').innerText;
    let poemPhrases = rawPoemString.split('\n').filter(p => p.length > 0);
    return poemPhrases;
}

async function startThePoemViz() {
    console.log('poem Play');

    let poemPhrases = await getAllPoemPhrases();
    await asyncForEach(
        poemPhrases,
        async (phrase, i) => {
            // console.log(phrase);
            colorPoemLine(i);
            let wordArray = phrase.split(' ');
            await asyncForEach(
                wordArray,
                async (word) => {
                    var outString = word.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    // word = word.replace(',',"").replace('!',"").replace('-',"").replace('?',""); //convert to regex

                    // hack for sentences ending with - ||| Example बोले-
                    if (outString.indexOf('-') != outString.length - 1) {
                        updateChartToFocusWord(outString);
                        await waitFor(poemSpeed);
                    }

                });
        });
    console.log('Fin.');
}

async function showPlayButton() {
    document.getElementById('play-poem').style.display = 'block';
}

async function colorPoemLine(n) {

}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key == '+') {
        console.log('speedIncrease');
        poemSpeed += 5;
    } else if (e.key == '-') {
        poemSpeed -= 5;
    } else if (e.key == '*') {
        poemSpeed *= 2;
    } else if (e.key == '/') {
        poemSpeed /= 2;
    }
});

document.getElementById('play-poem').addEventListener('click', async (e) => {
    document.getElementById('wordtree_basic').firstChild.firstChild.style.width = '90vw';
    await startThePoemViz();
});

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(test, 500);
}, false)
