const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();


// Get settings data from file
let rawdata = fs.readFileSync('settings.json');
const settings = JSON.parse(rawdata);

/* FUNCTION DECLARATIONS */
// Run the code above for each RSS site
const rssLoader = function () {
    // Clean card-wrapper
    document.getElementById("card-wrapper").innerHTML = "";

    var cnt = 0;
    settings.rss_links.forEach(rss_link => {
        (async () => {

            let feed = await parser.parseURL(rss_link);

            // Create a wrapper for each RSS site
            document.getElementById("card-wrapper").insertAdjacentHTML('beforeend', `
            <div class="card m-4" id="rss-container">
                <h5 class="card-header feed-card-title">${feed.title}
                    <div class="float-right">
                        <i class="fas fa-caret-up float-right"></i>
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
}

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

// Return the parent element if it has the class provided
function hasSomeParentTheClass(element, classname) {
    if (element.className && element.className.split(' ').indexOf(classname) >= 0) {
        return element;
    }
    return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
}

// Shows a notification
function showNotification(text) {
    const notification = new Notification("New articles", {
        body: text,
        icon: "asset/img/logo.png"
    })
    notification.onclick = function () {
        window.focus();
    };
}

// Check if is it possible to notify
function notify(text) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        showNotification(text);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification(text);
            }
        });
    }
}


/* USAGE OF FUNCTIONS */
// Load RSS links as cards
rssLoader();


/* LISTENERS */
document.addEventListener("DOMContentLoaded", function () {

    // Add listeners to enable card title show hide body
    document.addEventListener('click', function (event) {

        // check to enable click also on arrow icon
        let buffer = undefined;
        buffer = hasSomeParentTheClass(event.target, "feed-card-title");

        // show/hide management
        if (buffer) {
            let body = buffer.parentElement.querySelector(".card-body");
            if (body.style.display === "none") {
                body.style.display = "block";
                // Change arrow icon
                buffer.querySelector("i").className = "fas fa-caret-up";
            } else {
                body.style.display = "none";
                // Change arrow icon
                buffer.querySelector("i").className = "fas fa-caret-down";
            }
        }
    });

    document.getElementById("home-btn-refresh").addEventListener("click", rssLoader);

    // Open the settings page
    document.getElementById("home-btn-settings").addEventListener("click", function () {
        nw.Window.open("settings.html", {
            position: 'center',
            width: 480,
            height: 640
        });
    });

    setInterval(function () {
        rssLoader(); //todo: show an alert
        notify("New articles found");
    }, 600000); // Every 10 minutes
});