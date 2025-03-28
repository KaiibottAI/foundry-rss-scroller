class RSSScroller extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "RSS Scroller",
            width: 400,
            height: 100,
            classes: ["rss-scroller"],
        });
    }

    get template() {
        return "modules/rss-scroller/templates/rss-scroller.html";
    }

    async getData() {
        const feedData = await fetchRSSFeed(); // Ensure this function exists
        return { items: feedData.items };
    }
}

async function fetchRSSFeed() {
    // Change this to match the name or ID of your journal entry
    const journalName = "News Feed";
    const journal = game.journal.getName(journalName); // Finds journal by name

    if (!journal) {
        console.warn(`RSS Scroller: Journal entry "${journalName}" not found.`);
        return { items: [] };
    }

    // Extract the journal text and split it into items (assuming each line is an item)
    const journalPages = [...journal.pages.values()];
    const journalText = journalPages.map(pages => pages.text.content).join(" --- ");
    const items = journalText;

    return { items };
}


// Initialize the scroller when Foundry is ready
Hooks.once("ready", async function () {
    const rssScroller = new RSSScroller();
    rssScroller.render(true);
});
