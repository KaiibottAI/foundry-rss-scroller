const REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS = 'foundry-rss-scroller'

class RSSScroller extends Application {

    // Please help, I don't know how to get some default stuff to stick. I have it down in the ready hook since I can't figure it :D
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS,
            title: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'title') || 'RSS Scroller',
            resizable: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'resizeable'),
            width: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'width'),
            height: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'height'),
            fontsize: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'fontSize'),
            rssspeed: game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssSpeed'),
            template: "modules/foundry-rss-scroller/templates/rss-scroller.html",
            classes: ["rss-scroll"]
        });
    }

    getData() {
        const feedData = fetchRSSFeed();
        if (!feedData || feedData.journalText.length === 0) {
            ui.notifications.warn(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | No journal text found for rendering.`);
        };
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

    const journalName = game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'journalName');
    const journal = game.journal.getName(journalName);

    if (!journal) {
        ui.notifications.warn(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | Journal entry "${journalName}" not found.`);
        return { journalText: "" };  // Return an empty string if no journal found
    }

    // Get the pages sorted by the 'sort' field to match the visual order
    const journalPages = [...journal.pages._source]
        .sort((a, b) => a.sort - b.sort); // Sort by the 'sort' field

    if (!journalPages || journalPages.length === 0) {
        ui.notifications.warn(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | Journal entry "${journalName}" doesn't appear to have pages with text.`);
        return { journalText: "" };  // Return an empty string if no pages found
    }

    // Combine the text content from each page and clean the HTML tags
    const journalText = journalPages
        .map(page => page.text.content)  // Access the text content from each page
        .join(" --- ")  // Combine the text content with separator
        .replace(/<p>|<\/p>/g, '');  // Remove <p> tags to prevent extra line breaks

    return { journalText };
}


// // // open/close the RSS Scroll window
// function toggleRSSFeed() {
//     // Ensure an instance exists
//     // courtesy of @mxzf from FoundryVTT Discord 
//     // JS has a fun little ??= operator, nullish coalescing assignment, which says "if this thing exists, cool; if it doesn't, assign this to it"
//     ui['RSSScroller'] ??= new RSSScroller();
//     // If it's already rendered, close it (this doesn't delete it, it simply closes the app)
//     if (ui.RSSScroller.rendered) ui.RSSScroller.close();
//     // Otherwise, if it's not rendered, render it
//     else ui.RSSScroller.render(true);
// };

function toggleRSSFeed() {
    // If GM, emit to everyone; otherwise just local toggle
    const isGM = game.user.isGM;

    // Ensure an instance exists
    ui['RSSScroller'] ??= new RSSScroller();

    if (isGM) {
        // Broadcast to all clients
        game.socket.emit(`module.${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS}`, {
            action: "openTicker"
        });
    }

    // Toggle locally on this client
    if (ui.RSSScroller.rendered) {
        ui.notifications.warn(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | ${RSSScroller.defaultOptions.title} is closing.`)
        ui.RSSScroller.close();
    } else {
        ui.notifications.warn(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | ${RSSScroller.defaultOptions.title} is open!`)
        ui.RSSScroller.render(true);
    }
}

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
    game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssTheme', theme);
    document.documentElement.setAttribute('data-rss-theme', theme);
};
function updateRSSFont(selectedFont) {
    document.documentElement?.style.setProperty("--rss-font-family", `"${selectedFont}"`);
};

Hooks.once("init", () => {

    // Set up all the module settings
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssTheme', {
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
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'title', {
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
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'journalName', {
        name: 'Journal Name',
        hint: 'Captialization MATTERS. "news feed" != "News Feed". Journal permission does not matter from what I can tell',
        scope: 'world',
        config: true,
        type: String,
        default: 'News Feed',
        onChange: (value) => {
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'journalName', value);
        },
        requiresReload: true
    });
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'resizeable', {
        name: 'Fixed RSS Size or Draggable?',
        hint: 'If you choose draggable sizing, the RSS Feed will start at your settings but allow for more flexable drag sizing if preferred.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'resizeable', value);
        },
        requiresReload: true
    });
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'width', {
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
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'width', value);
        },
        requiresReload: false
    });
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'height', {
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
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'fontSize', {
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
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'fontSize', value);
        },
        requiresReload: false
    });
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssSpeed', {
        name: 'RSS Speed',
        hint: 'The speed of the RSS Scroller text. This controls "how long" the scroller takes to go thru the text. Higher number = slower speed.',
        scope: 'client',
        config: true,
        type: Number,
        range: {
            min: 1,
            max: 300,
            step: 1
        },
        default: 20,
        onChange: (value) => {
            let root = document.querySelector(':root');
            root.style.setProperty('--rss-speed', `${value}s`);
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssSpeed', value);
        },
        requiresReload: false
    });

});

// Initialize the scroller when Foundry is ready
Hooks.once("ready", () => {

    game.socket.on(`module.${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS}`, (payload) => {
        if (payload.action === "openTicker") {
            // your existing function to open the ticker window
            console.log(`${REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS} | Opening RSS Feed for all.`)
            toggleRSSFeed();
        }
    });

    // This has to load later since Foundry loads fonts at a different time that is past `init` :(
    game.settings.register(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssFont', {
        name: "RSS Font",
        hint: "Select the font for the RSS scroller. Supports Custom Fonts if uploaded to Foundry Font Settings.",
        scope: "client",
        config: true,
        type: String,
        // choices: Object.fromEntries(Object.keys(CONFIG.fontDefinitions).map(f => [f, f])), // Default foundry fonts that are loaded
        choices: Object.fromEntries(Object.keys(FontConfig.getAvailableFontChoices()).map(f => [f, f])), // Get all fonts that are available for edit in Foundry, including custom upload
        default: "Orbitron",
        onChange: (value) => {
            updateRSSFont(value);
            game.settings.set(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssFont', value);
        },
        requiresReload: false
    });

    // Added these all down here since this is how I could get the settings to be 'retained' upon reloading. I still do not understand it.
    applyRSSTheme(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssTheme'));
    updateScrollerFontSize(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'fontSize'));
    updateRSSScrollerSpeed(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssSpeed'));
    updateRSSHeight(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'height'));
    updateRSSWidth(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'width'));
    updateRSSFont(game.settings.get(REALLYLONGMODULENAMETONOTCONFLICTWITHOTHERTHINGS, 'rssFont'));

});
