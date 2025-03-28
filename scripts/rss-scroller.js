class RSSScroller extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "RSS Scroller", // this needs to be a setting later
            width: 400, // this needs to be a setting later
            height: 100, // this needs to be a setting later
            classes: ["rss-scroll"],
        });
    }

    get template() {
        return "modules/rss-scroller/templates/rss-scroller.html";
    }

    getData() {
        const feedData = fetchRSSFeed();
        return { items: feedData.journalText };
    }
}

function fetchRSSFeed() {

    const journalName = "News Feed"; // this needs to be a setting later
    const journal = game.journal.getName(journalName); // Finds journal by name

    if (!journal) {
        console.warn(`RSS Scroller: Journal entry "${journalName}" not found.`);
        return { items: [] };
    }

    const journalPages = [...journal.pages.values()]; // Get the text inside the journal pages
    const journalText = journalPages.map(pages => pages.text.content).join(" --- "); // join all the pages together to make one long string for the rss srolling

    return { journalText };
}


// Initialize the scroller when Foundry is ready
Hooks.once("ready", function () {
    const rssScroller = new RSSScroller();
    rssScroller.render(true);
});
