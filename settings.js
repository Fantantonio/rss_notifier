const fs = require('fs');

// Read settings from JSON
var rawdata = fs.readFileSync('settings.json');
var data = JSON.parse(rawdata);

// Precompile textarea
const textarea_rss_links = document.getElementById("settings-link-area");
textarea_rss_links.value = data.rss_links;

// Save data in JSON
document.getElementById("settings-save-rss-links-edit").addEventListener("click", function () {
    links = textarea_rss_links.value.split(",");
    data.rss_links = links;
    data = JSON.stringify(data);
    fs.writeFileSync('settings.json', data);
});

// Reset data in textarea on Cancel click
document.getElementById("settings-cancel-rss-links-edit").addEventListener("click", function () {
    textarea_rss_links.value = data.rss_links;
});