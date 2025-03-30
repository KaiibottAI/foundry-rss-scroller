import { setting } from "scripts/rss-scroller.js";

export const registerRSSSettings = function () {

    let modulename = "rss-scroller";

    game.settings.register(modulename, 'title', {
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
    game.settings.register(modulename, 'width', {
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
    game.settings.register(modulename, 'height', {
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
    game.settings.register(modulename, 'fontSize', {
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
    game.settings.register(modulename, 'rssSpeed', {
        name: 'RSS Speed',
        hint: 'The speed of the RSS Scroller text. Higher number = slower speed.',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 1,
            max: 200,
            step: 1
        },
        default: 100,
        onChange: value => {
            updateScrollerSpeed(value)
        },
        requiresReload: false
    });
}