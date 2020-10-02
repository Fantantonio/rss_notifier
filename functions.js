const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();

let rawdata = fs.readFileSync('settings.json');
const settings = JSON.parse(rawdata);


var cnt = 0;
settings.rss_links.forEach(rss_link => {
    (async () => {

        let feed = await parser.parseURL(rss_link);

        document.getElementById("card-wrapper").insertAdjacentHTML('beforeend', `
            <div class="card m-4" id="rss-container">
                <div class="card-body" id="feed-${cnt}">
                    <h5 class="card-title">${feed.title}</h5>
                </div>
            </div>
        `);


        for (let i = 0; i < 5 && i < feed.items.length; i += 1) {
            let item = feed.items[i];
            console.log(item);
            var content = item.content;
            if (item.content === undefined && item.description !== undefined) {
                var content = item.description;
            }
            document.getElementById(`feed-${cnt}`).insertAdjacentHTML('beforeend', `
                <div class="card">
                    <div class="card-body" id="feed-${cnt}">
                        <a href="${item.link}" target="_blank">${item.title.capitalize()}</a>
                        <p>${content}</p>
                        <footer class="blockquote-footer">${item.pubDate}</footer>
                    </div>
                </div>
            `);
        };
        cnt += 1;
    })()
});


String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}