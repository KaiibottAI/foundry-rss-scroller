Hooks.once("ready", async function () {
    // CONFIGURATION
    const journalName = "News Feed"; // Change this to your Journal Entry's name
    const scrollSpeed = 150; // Lower is faster

    // Find the journal entry
    const journal = game.journal.find(j => j.name === journalName);
    if (!journal) return ui.notifications.warn(`Journal "${journalName}" not found.`);



    // Create or update the scrolling text
    let scrollingFeed = document.getElementById("rss-scroll");

    if (!scrollingFeed) {
        scrollingFeed = document.createElement("div");
        scrollingFeed.id = "rss-scroll";
        document.body.appendChild(scrollingFeed);
    }

    let textContainer = document.getElementById("rss-scroll-content");
    if (!textContainer) {
        textContainer = document.createElement("div");
        textContainer.id = "rss-scroll-content";
        scrollingFeed.appendChild(textContainer);
    }

    // Dragging functionality
    let isDragging = false;
    let offsetX, offsetY;

    scrollingFeed.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - scrollingFeed.getBoundingClientRect().left;
        offsetY = e.clientY - scrollingFeed.getBoundingClientRect().top;
        scrollingFeed.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Prevent dragging off-screen
            const maxX = window.innerWidth - scrollingFeed.offsetWidth;
            const maxY = window.innerHeight - scrollingFeed.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX)); // Keep within horizontal bounds
            newY = Math.max(0, Math.min(newY, maxY)); // Keep within vertical bounds

            scrollingFeed.style.left = `${newX}px`;
            scrollingFeed.style.top = `${newY}px`;
            scrollingFeed.style.transform = "none"; // Reset transform so the position updates correctly
        }
    });


    document.addEventListener("mouseup", () => {
        isDragging = false;
        scrollingFeed.style.cursor = "grab";
    });


    // this is the scrolling text string
    const text = journal.pages.contents.map(p => p.text.content).join(" ••• ");

    // Remove HTML tags using regex
    const strippedText = text.replace(/<[^>]+>/g, ''); // This will remove any HTML tags

    // Set the cleaned text into the container
    textContainer.innerText = strippedText

    // Apply animation dynamically
    textContainer.style.animation = `scrollText ${scrollSpeed}s linear infinite`;
});
