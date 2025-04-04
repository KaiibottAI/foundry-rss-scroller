let rssScrollerInstance = null; // Store the current instance of an rss feed
const moduleName = 'foundry-rss-scroller'

class RSSScroller extends Application {

    // Please help, I don't know how to get some default stuff to stick. I have it down in the ready hook since I can't figure it :D
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: moduleName,
            title: game.settings.get(moduleName, 'title') || 'RSS Scroller',
            resizable: game.settings.get(moduleName, 'resizeable'),
            width: game.settings.get(moduleName, 'width'),
            height: game.settings.get(moduleName, 'height'),
            fontsize: game.settings.get(moduleName, 'fontSize'),
            rssspeed: game.settings.get(moduleName, 'rssSpeed'),
            template: "modules/foundry-rss-scroller/templates/rss-scroller.html",
            classes: ["rss-scroll"]
        });
    }

    getData() {
        const feedData = fetchRSSFeed();
        return {
            items: feedData.journalText
        };
    }

    activeListeners(html) {
        super.activeListeners(html);
    }
};

// Go get the journal entries and combine them to make a feed.
// If you only have one page, that's okay, it still works the same.
function fetchRSSFeed() {

    const journalName = game.settings.get(moduleName, 'journalName'); // this needs to be a setting later
    const journal = game.journal.getName(journalName); // Finds journal by name

    if (!journal) {
        ui.notifications.warn(`RSS Scroller: Journal entry "${journalName}" not found.`);
        return { journalText };
    }

    const journalPages = [...journal.pages.values()]; // Get the text inside the journal pages
    const journalText = journalPages.map(pages => pages.text.content).join(" --- ").replace(/<p>|<\/p>/g, ''); // join all the pages together to make one long string for the rss srolling

    return { journalText };
};

// open/close the RSS Scroll window
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

// Most of these functions are self explanitory by their name
function updateScrollerFontSize(fontSize) {
    document.documentElement?.style.setProperty('--rss-font-size', `${fontSize}px`);
};
function updateRSSHeight(height) {
    document.documentElement?.style.setProperty('--rss-height', `${height}px`);
};
function updateRSSWidth(width) {
    document.documentElement?.style.setProperty('--rss-width', `${width}px`);
};
function updateRSSScrollerSpeed(rssSpeed) {
    document.documentElement?.style.setProperty('--rss-speed', `${rssSpeed}s`);
};
function applyRSSTheme(theme) {
    document.documentElement.setAttribute('data-rss-theme', theme);
};
function updateRSSFont(selectedFont) {
    document.documentElement?.style.setProperty("--rss-font-family", `"${selectedFont}"`);
};

Hooks.once("init", () => {

    // Set up all the module settings
    game.settings.register(moduleName, 'rssTheme', {
        name: 'RSS Scroller Theme',
        hint: 'Collection of pre-made themes for the RSS Scroller to have a unique style',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "cyberpunk-red": "CyberpunkRED",
            "deep-blue": "Deep Blue",
            "fallout-nuclear": "Fallout Terminal Green"
        },
        default: 'cyberpunk-red',
        onChange: (value) => {
            applyRSSTheme(value)
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'title', {
        name: 'RSS Scroller Title',
        hint: 'The title of the RSS Scroller window that will show to the players.',
        scope: 'world',
        config: true,
        type: String,
        default: 'RSS Scroller',
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-title', `${value}`);
        },
        requiresReload: true
    });
    game.settings.register(moduleName, 'rssFont', {
        name: "RSS Font",
        hint: "Select the font for the RSS scroller.",
        scope: "client",
        config: true,
        type: String,
        choices: Object.fromEntries(Object.keys(CONFIG.fontDefinitions).map(f => [f, f])),
        default: "Orbitron",
        onChange: (value) => {
            updateRSSFont(value);
            game.settings.set(moduleName, 'rssFont', value);
        },
        requiresReload: false
    });
    game.settings.register(moduleName, 'journalName', {
        name: 'Journal Name',
        hint: 'Captialization MATTERS. "news feed" != "News Feed". Journal permission does not matter from what I can tell',
        scope: 'world',
        config: true,
        type: String,
        default: 'News Feed',
        onChange: (value) => {
            game.settings.set(moduleName, 'journalName', value);
        },
        requiresReload: true
    });
    game.settings.register(moduleName, 'resizeable', {
        name: 'Fixed RSS Size or Draggable?',
        hint: 'If you choose draggable sizing, the RSS Feed will start at your settings but allow for more flexable drag sizing if preferred.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            game.settings.set(moduleName, 'resizeable', value);
        },
        requiresReload: true
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
            game.settings.set(moduleName, 'width', value);
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
            updateRSSHeight(value);
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
            game.settings.set(moduleName, 'fontSize', value);
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
            game.settings.set(moduleName, 'rssSpeed', value);
        },
        requiresReload: false
    });

});

// Initialize the scroller when Foundry is ready
Hooks.once("ready", () => {

    // Added these all down here since this is how I could get the settings to be 'retained' upon reloading. I still do not understand it.
    applyRSSTheme(game.settings.get(moduleName, 'rssTheme'));
    updateScrollerFontSize(game.settings.get(moduleName, 'fontSize'));
    updateRSSScrollerSpeed(game.settings.get(moduleName, 'rssSpeed'));
    updateRSSHeight(game.settings.get(moduleName, 'height'));
    updateRSSWidth(game.settings.get(moduleName, 'width'));
    updateRSSFont(game.settings.get(moduleName, 'rssFont'));

});
