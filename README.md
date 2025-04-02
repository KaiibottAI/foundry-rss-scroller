# FoundryVTT RSS Scroller

## Overview

The FoundryVTT RSS Scroller is a module that creates a scrolling text window in FoundryVTT using journal entries as the source for RSS-style news feeds. The feed is fully customizable, allowing users to adjust font size, scrolling speed, window dimensions, and more.

## Features

Reads text from a specified journal entry and displays it as a scrolling news ticker.

Supports dynamic settings, allowing users or the GM to modify:

- RSS Window Title (GM)
- Journal source (GM)
- Font size (User or GM)
- Scroll speed (User or GM)
- Window width & height (GM)
- Resizable or fixed window size (User or GM)

<!-- Persistent settings via FoundryVTT game settings. -->

Ability to toggle, open, and close the RSS scroller window dynamically via macro.

## Installation

1. Download or clone the module into your FoundryVTT modules directory.
```
https://github.com/KaiibottAI/foundry-rss-scroller/blob/test/module.json
```
or
```cli
git clone https://github.com/KaiibottAI/foundry-rss-scroller.git
```
2. Add the module to your game via Manage Modules in FoundryVTT.
3. Enable it in your world modules.

## Settings


The module provides several customizable settings via Game Settings.

| Setting | Description | Default |
| :-: | - | :-: |
| RSS Scroller Title | The title of the RSS Scroller window that will show to the players | "RSS Scroller" | 
| Journal Name | The Journal name where the RSS Scroller will retrieve information from. This RSS Scroller does respect any html code you may have for the text, for example bolding and italics. Does not respect images linked in the journal.| "News Feed" |
| Fixed RSS Size | Toggle for if the RSS Scroller should be resizable on the fly or if you prefer rigid numbers of the height and width | False |
| Width | The default width of the RSS Scroller window | 800 |
| Height | The default height of the RSS Scroller window | 100 |
| Font Size | The default font size of the RSS Scroller text | 40 |
| RSS Scroll Speed | The speed of the RSS Scroller text. Lower number = Faster speed | 100 |

## Developer API

#### How It Works?

The module reads the text from a specified journal entry in the game settings. It processes the content, stripping unnecessary HTML tags, paragraghs and page breaks, and formatting it into a continuous scrolling ticker. The scroller applies Foundry settings to modify its appearance and behavior. The text is animated with CSS to create a seamless scrolling effect.

#### Future Enhancements

- Support for multiple feeds and cycling between them.
- Additional customization options (e.g., text color, background color).
    - Themes

#### Troubleshooting

- Journal entry not found? Double-check the name in the settings (case-sensitive).
    - Double check the name you have in the RSS Scroller setting `Journal Name`, capitalization does matter. "News Feed" is not equal to "news feed".
- Text scrolling too fast/slow?
    -  Adjust the RSS Speed setting to a higher number.
- Window size not right?
    -  Modify the Width and Height settings or toggle the "resizeable" setting on for more control.

## Macros available

Open the RSS Feed Window
```javascript
openRSSFeed();
```

Close the RSS Feed Window
```javascript
closeRSSFeed();
```

Toggle the RSS Feed Window
```javascript
toggleRSSFeed();
```