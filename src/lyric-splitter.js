function splitGeniusLyrics() {
    var cols = [];

    document.querySelectorAll('div[data-lyrics-container="true"]').forEach((div) => {
        var textSplit = div.innerText.split('[');
        // skipping the first one
        for (i=1; i<textSplit.length+1; i++){
            if (textSplit[i] !== undefined)
                cols.push('[' + textSplit[i]);
        }
    });

    // Drop any dups
    cols = [...new Set(cols)];

    var innerHTML = "<div style='width:100%; display:flex; justify-content: space-around; flex-flow: row wrap; align-items: stretch;'>";
    var equalWidth = (100/cols.length);
    for (i=0; i<cols.length; i++){
        innerHTML = innerHTML + "<div style='width:" + equalWidth + "%'>" + cols[i] + "</div>";
    }
    innerHTML = innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    var root = document.querySelector('#lyrics-root');
    root.style = "display: block;"
    root.innerHTML = innerHTML;
};



const supportedSitesArray = [
    [/.*:\/\/genius\.com\/.*/, splitGeniusLyrics]
]
const supportedSites = new Map(supportedSitesArray);

const url = window.location.href;
for (let [regex, spliiterFunc] of supportedSites) {
    if (url.match(regex))
        spliiterFunc();
}
