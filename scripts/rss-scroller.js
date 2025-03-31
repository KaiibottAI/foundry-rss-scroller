let rssScrollerInstance = null; // Store the current instance of an rss feed
const moduleName = 'foundry-rss-scroller'

class RSSScroller extends Application {

    constructor(options = {}) {
        // assign dynamically for things that the gm would want to add
        options = Object.assign({
            title: game.settings.get(moduleName, 'title') || 'RSS Scroller',
            width: game.settings.get(moduleName, 'width'),
            height: game.settings.get(moduleName, 'height'),
            fontsize: game.settings.get(moduleName, 'fontSize'),
            rssspeed: game.settings.get(moduleName, 'rssSpeed')
        }, options);

        super(options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rss-scroll"]
        });
    }

    get template() {
        return "modules/foundry-rss-scroller/templates/rss-scroller.html";
    }

    getData() {
        const feedData = fetchRSSFeed();
        return { items: feedData.journalText };
    }

    // update the fontsize of the rss scroller while you change the value in menu
    activeListeners(html) {
        super.activeListeners(html);
        const fontSize = game.settings.get(moduleName, 'fontSize')
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

function openRSSFeed() {
    // If there's an existing instance, close it first
    if (rssScrollerInstance) {
        rssScrollerInstance.close();
    }

    // Create a new instance and render it
    rssScrollerInstance = new RSSScroller();
    rssScrollerInstance.render(true);
};

function closeRSSFeed() {
    // If there's an existing instance, close it first
    if (rssScrollerInstance) {
        rssScrollerInstance.close();
    }
};

function toggleRSSFeed() {
    // If there's an existing instance, close it first
    if (rssScrollerInstance) {
        rssScrollerInstance.close();
        rssScrollerInstance = null
    } else {
        rssScrollerInstance = new RSSScroller();
        rssScrollerInstance.render(true);
    };
};

function updateScrollerFontSize(fontSize) {
    const scroller = document.querySelector(".rss-scroll-content");
    if (scroller) {
        scroller.style.fontSize = `${fontSize}px`;
    }
};

function updateScrollerSpeed(rssSpeed) {
    const scroller = document.querySelector(".rss-scroll-content");
    if (scroller) {
        scroller.style.animation = `scrollText ${rssSpeed}s linear infinite`;
    }
};

Hooks.once("init", () => {

    game.settings.register(moduleName, 'title', {
        name: 'Name of RSS Scroller',
        hint: 'Name of the RSS Window',
        scope: 'world',
        config: true,
        type: String,
        default: 'RSS Scroller',
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-titls', `${value}`);
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'width', {
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
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-width', `${value}px`);
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'height', {
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
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-height', `${value}px`);
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'fontSize', {
        name: 'Font Size',
        hint: 'Size of the RSS Scroller font',
        scope: 'client',
        config: true,
        type: Number,
        range: {
            min: 8,
            max: 72,
            step: 1
        },
        default: 40,
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-font-size', `${value}px`);
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'rssSpeed', {
        name: 'RSS Speed',
        hint: 'The speed of the RSS Scroller text. Higher number = slower speed.',
        scope: 'client',
        config: true,
        type: Number,
        range: {
            min: 1,
            max: 300,
            step: 1
        },
        default: 100,
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-speed', `${value}s`);
        },
        requiresReload: false
    });

});

// Initialize the scroller when Foundry is ready
Hooks.once("ready", function () {

    // openRSSFeed(); // leave here to make sure this still works

});
