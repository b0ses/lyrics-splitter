function splitGeniusLyrics() {
    var cols = [];

    document.querySelectorAll('div[data-lyrics-container="true"]').forEach((div) => {
        var textSplit = div.innerText.split('[');
        // skipping the first one
        for (i=1; i<textSplit.length+1; i++){
            if (textSplit[i] !== undefined){
                var sectionText = '[' + textSplit[i];
                // Dropping any sections with no lyrics
                if (sectionText.trim().slice(-1) !== ']')
                    cols.push(sectionText);
            }       
        }
    });

    // Drop any dups
    cols = [...new Set(cols)];

    var innerHTML = "<div style='width:98%; box-sizing:content-box; display:flex; justify-content: space-around; flex-flow: row wrap; align-items: stretch;'>";
    var equalWidth = (98/cols.length);
    for (i=0; i<cols.length; i++){
        innerHTML = innerHTML + "<div style='width:" + equalWidth + "%'>" + cols[i] + "</div>";
    }
    innerHTML = innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    var root = document.querySelector('#lyrics-root');
    root.style = "display: block; margin:10px;"
    root.innerHTML = innerHTML;
};

function splitAZLyrics() {
    var cols = [];
    var title = '';

    document.querySelectorAll('div.col-xs-12.col-lg-8.text-center').forEach((div) => {
        var textSplit = div.innerText.split('\n\n');
        const extraGroups = 4;
        title = textSplit[0].split('\n')[3].trim();
        artist = textSplit[0].split('\n')[2].split('Lyrics')[0].trim();
        for (i=1; i<textSplit.length+1-extraGroups; i++){
            if (textSplit[i].trim() !== undefined && textSplit[i].trim() !== "")
                cols.push(textSplit[i].trim());
        }
    });

    // Drop any dups
    cols = [...new Set(cols)];
        
    var innerHTML = "<b>" + title + " - " + artist + "</b><br><br><div style='width:98%; box-sizing:content-box; display:flex; justify-content: space-around; flex-flow: row wrap; align-items: stretch;'>";
    var equalWidth = (98/cols.length);
    for (i=0; i<cols.length; i++){
        innerHTML = innerHTML + "<div style='width:" + equalWidth + "%'>" + cols[i] + "</div>";
    }
    innerHTML = innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    var root = document.querySelector('div.main-page');
    root.style = "display: block;margin:10px;width:100%;"
    root.innerHTML = innerHTML;
};

function splitGoogleLyrics() {
    var cols = [];

    const compositionLyrics = document.querySelector('div[data-attrid=\'kc:/music/composition:lyrics\']');
    const recordingClusterLyrics = document.querySelector('div[data-attrid=\'kc:/music/recording_cluster:lyrics\']');
    var lyricsDiv = (compositionLyrics || recordingClusterLyrics);

    const parentDiv = lyricsDiv.querySelector('span').parentElement.parentElement;

    parentDiv.childNodes.forEach((div) => {
        if (div.innerText.trim() !== undefined && div.innerText.trim() !== "") {
            cols.push(div.innerText.trim());
        }
    })
    
    // Drop any dups
    cols = [...new Set(cols)];

    var innerHTML = "<div style='width:98%; box-sizing:content-box; display:flex; justify-content: space-around; flex-flow: row wrap; align-items: stretch;'>";
    var equalWidth = (98/cols.length);
    for (i=0; i<cols.length; i++){
        innerHTML = innerHTML + "<div style='width:" + equalWidth + "%'>" + cols[i] + "</div>";
    }
    innerHTML = innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const mainDiv = document.getElementById('center_col')
    mainDiv.style = "position:relative;margin:0px;width:100%";

    const higherDiv = document.getElementById('rcnt');
    higherDiv.style = "position:relative;margin:10px;max-width:100%";

    lyricsDiv.style = "display:block;margin:0px;width:100%;"
    lyricsDiv.innerHTML = innerHTML;
};

function splitSMLyrics() {
    var cols = [];

    let lyricBox = document.querySelector('div.holder.lyric-box');
    var textSplit = lyricBox.innerText.split('\n\n');
    for (i=0; i<textSplit.length+1; i++){
        if (textSplit[i] !== undefined && textSplit[i].trim() !== ''){
            cols.push(textSplit[i]);
        }       
    }

    // Drop any dups
    cols = [...new Set(cols)];

    var innerHTML = "<div style='width:98%; box-sizing:content-box; display:flex; justify-content: space-around; flex-flow: row wrap; align-items: stretch;'>";
    var equalWidth = (98/cols.length);
    // Skip the last one - "Edit Lyrics"
    for (i=0; i<cols.length-1; i++){
        innerHTML = innerHTML + "<div style='width:" + equalWidth + "%'>" + cols[i] + "</div>";
    }
    innerHTML = innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    let mainPage = document.querySelector('div.main-holder');
    mainPage.style = "max-width:initial;"

    let mainContent = document.getElementById('content');
    mainContent.style = "width:100%;line-height:1.571em;overflow:visible;"

    lyricBox.style = "display:block;margin:0px;width:100%;"
    lyricBox.innerHTML = innerHTML;
};


const supportedSitesArray = [
    [/.*:\/\/www\.azlyrics\.com\/.*/, splitAZLyrics],
    [/.*:\/\/genius\.com\/.*/, splitGeniusLyrics],
    [/.*:\/\/www\.google\.com\/.*/, splitGoogleLyrics],
    [/.*:\/\/songmeanings\.com\/.*/, splitSMLyrics]
]
const supportedSites = new Map(supportedSitesArray);

const url = window.location.href;
for (let [regex, splitterFunc] of supportedSites) {
    if (url.match(regex))
        splitterFunc();
}
