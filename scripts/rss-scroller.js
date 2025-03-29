class RSSScroller extends Application {

    constructor(options = {}) {
        // assign dynamically for things that the gm would want to add
        options = Object.assign({
            title: game.settings.get('rss-scroller', 'title') || 'RSS Scroller',
            width: game.settings.get('rss-scroller', 'width') || 500,
            height: game.settings.get('rss-scroller', 'height') || 100,
            fontsize: game.settings.get('rss-scroller', 'fontSize') || 14
        }, options);

        super(options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rss-scroll"]
        });
    }

    get template() {
        return "modules/rss-scroller/templates/rss-scroller.html";
    }

    getData() {
        const feedData = fetchRSSFeed();
        return { items: feedData.journalText };
    }

    // update the fontsize of the rss scroller while you change the value in menu
    activeListeners(html) {
        super.activeListeners(html);
        const fontSize = game.settings.get('rss-scroller', 'fontSize')
        html.find(".rss-scroll-content").css("font-size", `${this.options.fontSize}px`)
    }
};

function fetchRSSFeed() {

    const journalName = "News Feed"; // this needs to be a setting later
    const journal = game.journal.getName(journalName); // Finds journal by name

    if (!journal) {
        console.warn(`RSS Scroller: Journal entry "${journalName}" not found.`);
        return { items: [] };
    }

    const journalPages = [...journal.pages.values()]; // Get the text inside the journal pages
    // const journalText = journalPages.map(pages => pages.text.content).join(" --- ").replace(/<\/?[^>]+(>|$)/g, ''); // join all the pages together to make one long string for the rss srolling
    const journalText = journalPages.map(pages => pages.text.content).join(" --- ").replace(/<p>|<\/p>/g, ''); // join all the pages together to make one long string for the rss srolling

    return { journalText };
};

function updateScrollerFontSize(fontSize) {
    const scroller = document.querySelector(".rss-scroll-content");
    if (scroller) {
        scroller.style.fontSize = `${fontSize}px`;
    }
};

Hooks.once("init", () => {
    game.settings.register('rss-scroller', 'title', {
        name: 'Name of RSS Scroller',
        hint: 'Name of the RSS Window',
        scope: 'world',
        config: true,
        type: String,
        default: 'RSS Scroller',
        onChange: value => {
            console.log(value)
        },
        requiresReload: true
    });
    game.settings.register('rss-scroller', 'width', {
        name: 'Width',
        hint: 'How wide the RSS Feed window should be.',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 400,
            max: 1400,
            step: 10
        },
        default: 800,
        onChange: value => {
            console.log(value)
        },
        requiresReload: true
    });
    game.settings.register('rss-scroller', 'height', {
        name: 'Height',
        hint: 'How tall the RSS Feed window should be.',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 50,
            max: 400,
            step: 10
        },
        default: 100,
        onChange: value => {
            console.log(value)
        },
        requiresReload: true
    });
    game.settings.register('rss-scroller', 'fontSize', {
        name: 'Font Size',
        hint: 'Size of the RSS Scroller font',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 8,
            max: 72,
            step: 1
        },
        default: 40,
        onChange: value => {
            updateScrollerFontSize(value)
        },
        requiresReload: false
    });
});

// Initialize the scroller when Foundry is ready
Hooks.once("ready", function () {
    const rssScroller = new RSSScroller();
    rssScroller.render(true);
});
