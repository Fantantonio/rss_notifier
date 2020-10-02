const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();

// Get settings data from file
let rawdata = fs.readFileSync('settings.json');
const settings = JSON.parse(rawdata);


// Run the code above for each RSS site
var cnt = 0;
settings.rss_links.forEach(rss_link => {
    (async () => {

        let feed = await parser.parseURL(rss_link);

        // Create a wrapper for each RSS site
        document.getElementById("card-wrapper").insertAdjacentHTML('beforeend', `
            <div class="card m-4" id="rss-container">
                <h5 class="card-header feed-card-title">${feed.title}
                    <div class="float-right">
                        <i class="fas fa-caret-up"></i>
                    </div>
                </h5>
                <div class="card-body" id="feed-${cnt}">
                </div>
            </div>
        `);

        // Each article in the RSS link
        for (let i = 0; i < 5 && i < feed.items.length; i += 1) {
            let item = feed.items[i];
            var content = item.content;

            // Manage content/description
            if (item.content === undefined && item.description !== undefined) {
                var content = item.description;
            }

            // Create a card for each article
            document.getElementById(`feed-${cnt}`).insertAdjacentHTML('beforeend', `
                <div class="card mb-2">
                    <div class="card-body" id="feed-${cnt}">
                        <a href="${item.link}" target="_blank">${item.title.capitalize()}</a>
                        <p>${content}</p>
                        <footer class="blockquote-footer">${item.pubDate}</footer>
                    </div>
                </div>
            `);
        };
        cnt += 1;

        // Add img-fluid class to images
        addResponsivenessToImages();

    })()
});

// Add Bootstrap responsive image class to every img
const addResponsivenessToImages = function () {
    let images = document.getElementsByTagName('img');
    for (let image of images) {
        image.className = "img-fluid";
    };
}

// Add method to strings: first letter uppercased
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Add listeners to enable card title show hide body
document.addEventListener('click', function (event) {
    if (event.target.classList.contains("feed-card-title")) {
        let body = event.target.parentElement.querySelector(".card-body");
        if (body.style.display === "none") {
            body.style.display = "block";
            // Change arrow icon
            event.target.querySelector("i").className = "fas fa-caret-up";
        } else {
            body.style.display = "none";
            // Change arrow icon
            event.target.querySelector("i").className = "fas fa-caret-down";
        }
    }
});


document.getElementById("btn-settings").addEventListener("click", function () {
    nw.Window.open("settings.html", {
        position: 'center',
        width: 480,
        height: 640
    });
});

