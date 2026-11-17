const projectEntries = [
    {
        title: "Northstar Search",
        category: "SEARCH / DISCOVERY",
        description: "A fast, fictional search experience with instant local filtering and curated discovery cards.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/northstar-search-1.svg",
        video: "",
        url: "demo_websites/northstar-search/index.html"
    },
    {
        title: "Signal Current",
        category: "NEWS / CURRENT EVENTS",
        description: "A responsive editorial dashboard with topic filters and locally saved reading picks.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/signal-current-1.svg",
        video: "",
        url: "demo_websites/signal-current/index.html"
    },
    {
        title: "Morrow Market",
        category: "E-COMMERCE / HOME",
        description: "A warm, boutique home-goods storefront concept with a working demo cart.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/morrow-market-1.svg",
        video: "",
        url: "demo_websites/morrow-market/index.html"
    },
    {
        title: "Pebble Pantry",
        category: "E-COMMERCE / GROCERY",
        description: "A cheerful grocery shop concept with category browsing and a sample basket.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/pebble-pantry-1.svg",
        video: "",
        url: "demo_websites/pebble-pantry/index.html"
    },
    {
        title: "Circuit Bloom",
        category: "E-COMMERCE / TECHNOLOGY",
        description: "A bold, fictional tech shop with product cards and a no-payment demo cart.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/circuit-bloom-1.svg",
        video: "",
        url: "demo_websites/circuit-bloom/index.html"
    },
    {
        title: "Thread & Timber",
        category: "E-COMMERCE / APPAREL",
        description: "A considered apparel storefront concept focused on materials and simple shopping.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/thread-and-timber-1.svg",
        video: "",
        url: "demo_websites/thread-and-timber/index.html"
    },
    {
        title: "Letterlane",
        category: "COMMUNICATION / MAIL",
        description: "A local-only mail interface concept. Composing a message never sends or stores it.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/letterlane-1.svg",
        video: "",
        url: "demo_websites/letterlane/index.html"
    },
    {
        title: "Morrow Ledger",
        category: "FINANCE / DASHBOARD",
        description: "A fictional finance dashboard with sample figures only—no accounts, payments, or advice.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/morrow-ledger-1.svg",
        video: "",
        url: "demo_websites/morrow-ledger/index.html"
    },
    {
        title: "Little Lantern",
        category: "EDUCATION / LEARNING",
        description: "A friendly learning space with a sample lesson, progress state, and knowledge check.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/little-lantern-1.svg",
        video: "",
        url: "demo_websites/little-lantern/index.html"
    },
    {
        title: "Daylight Desk",
        category: "PRODUCTIVITY / MAPS / MEDIA / UTILITIES",
        description: "A playful all-in-one workspace demo with tasks, local places, media picks, and quick tools.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/daylight-desk-1.svg",
        video: "",
        url: "demo_websites/daylight-desk/index.html"
    },
    {
        title: "French Cat Security",
        category: "SECURITY / CONCEPT",
        description: "A fictional security studio with a scripted demo scan and sample services.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/french-cat-security-1.svg",
        video: "",
        url: "demo_websites/french-cat-security/index.html"
    },
    {
        title: "Ember Kitchen",
        category: "FOOD / RESTAURANT",
        description: "A fictional wood-fired restaurant concept with an interactive sample menu.",
        date: "INTERACTIVE CONCEPT",
        image: "demo_websites/shared/art/ember-kitchen-1.svg",
        video: "",
        url: "demo_websites/ember-kitchen/index.html"
    },
];

const certificateEntries = [
    // Add only certificates that are ready to be shared publicly.
];

const collectionGrid = document.getElementById("collectionGrid");
const collectionCount = document.getElementById("collectionCount");
const collectionKind = document.body.dataset.collection;
const collectionEntries = {
    projects: projectEntries,
    certificates: certificateEntries
};

const configuredCollection = collectionEntries[collectionKind];
const activeCollection = Array.isArray(configuredCollection)
    ? configuredCollection.filter((entry) =>
        entry && typeof entry.title === "string" && entry.title.trim()
    )
    : undefined;

if (collectionCount && Array.isArray(activeCollection)) {
    collectionCount.textContent =
        `${String(activeCollection.length).padStart(2, "0")} ${collectionKind.toUpperCase()}`;
}

function appendTextElement(parent, tagName, className, value) {
    if (!value) {
        return;
    }

    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    element.textContent = value;
    parent.appendChild(element);
}

function appendSecureLink(card, value, kind) {
    if (!value) {
        return;
    }

    if (kind === "projects" && !/^https:/i.test(value)) {
        const localUrl = resolveLocalAsset(value, "project link");
        if (!localUrl) {
            return;
        }

        const localLink = document.createElement("a");
        localLink.className = "collection-card-link";
        localLink.href = localUrl.href;
        localLink.textContent = "OPEN DEMO ↗";
        card.appendChild(localLink);
        return;
    }

    let url;
    try {
        url = new URL(value);
    } catch (error) {
        console.error("A collection item has an invalid URL.", error);
        return;
    }

    if (url.protocol !== "https:") {
        console.error("Collection item links must use HTTPS.");
        return;
    }

    const link = document.createElement("a");
    link.className = "collection-card-link";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = kind === "projects" ? "VIEW PROJECT ↗" : "VERIFY CERTIFICATE ↗";
    card.appendChild(link);
}

function resolveLocalAsset(value, label) {
    if (!value) {
        return null;
    }

    if (
        typeof value !== "string" ||
        value.startsWith("/") ||
        value.split(/[\\/]/).includes("..")
    ) {
        console.error(`${label} must use a relative path inside the website.`);
        return null;
    }

    let url;
    try {
        url = new URL(value, window.location.href);
    } catch (error) {
        console.error(`A collection ${label} path is invalid.`, error);
        return null;
    }

    const siteRoot = new URL(".", window.location.href);
    if (
        url.origin !== window.location.origin ||
        url.protocol !== window.location.protocol ||
        !url.href.startsWith(siteRoot.href)
    ) {
        console.error(`Collection ${label} files must be stored inside this website.`);
        return null;
    }

    return url;
}

function appendLocalImage(card, value, title) {
    const url = resolveLocalAsset(value, "image");
    if (!url) {
        return;
    }

    const image = document.createElement("img");
    image.className = "collection-image";
    image.src = url.href;
    image.alt = title ? `${title} preview` : "Collection item preview";
    image.draggable = false;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        console.error(`Unable to load collection image: ${url.pathname}`);
    }, { once: true });
    card.appendChild(image);
}

function appendLocalVideo(card, value, title, poster) {
    const url = resolveLocalAsset(value, "video");
    if (!url) {
        return;
    }

    const video = document.createElement("video");
    video.className = "collection-video";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", `${title} project video`);

    const posterUrl = resolveLocalAsset(poster, "video poster");
    if (posterUrl) {
        video.poster = posterUrl.href;
    }

    const source = document.createElement("source");
    source.src = url.href;
    const extension = url.pathname.toLowerCase().match(/\.[^.]+$/)?.[0];
    const mimeTypes = {
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".ogv": "video/ogg"
    };
    if (extension && mimeTypes[extension]) {
        source.type = mimeTypes[extension];
    }
    video.appendChild(source);

    video.addEventListener("error", () => {
        console.error(`Unable to load project video: ${url.pathname}`);
    }, { once: true });
    card.appendChild(video);
}

function appendLocalPdfLink(card, value) {
    const url = resolveLocalAsset(value, "certificate PDF");
    if (!url) {
        return;
    }

    const link = document.createElement("a");
    link.className = "collection-card-link";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.type = "application/pdf";
    link.textContent = "OPEN CERTIFICATE PDF ↗";
    card.appendChild(link);
}

function renderCollection(entries, kind) {
    if (!collectionGrid || !entries) {
        console.error("The requested portfolio collection is unavailable.");
        return;
    }

    if (entries.length === 0) {
        const emptyState = document.createElement("article");
        emptyState.className = "collection-empty";
        appendTextElement(
            emptyState,
            "span",
            "collection-card-label",
            kind === "projects" ? "PROJECT COLLECTION" : "CERTIFICATE COLLECTION"
        );
        appendTextElement(
            emptyState,
            "h2",
            "",
            kind === "projects" ? "A little more work is on the way." : "A collection worth sharing takes time."
        );
        appendTextElement(
            emptyState,
            "p",
            "",
            kind === "projects"
                ? "I’m putting together a few projects to share here. Until then, explore the interactive concepts in the archive."
                : "I’m still building this collection. When I have certificates I’m ready to share, I’ll add them here with the details needed to verify each one."
        );
        collectionGrid.appendChild(emptyState);
        return;
    }

    entries.forEach((entry) => {
        const card = document.createElement("article");
        card.className = "collection-card";

        if (kind === "projects" && entry.video) {
            appendLocalVideo(card, entry.video, entry.title, entry.image);
        } else {
            appendLocalImage(card, entry.image, entry.title);
        }
        appendTextElement(
            card,
            "span",
            "collection-card-label",
            kind === "projects" ? entry.category : "CERTIFICATE"
        );
        appendTextElement(card, "h2", "", entry.title);
        appendTextElement(
            card,
            "p",
            "collection-card-meta",
            kind === "projects" ? entry.date : [entry.issuer, entry.year].filter(Boolean).join(" · ")
        );
        appendTextElement(card, "p", "", entry.description);
        if (kind === "certificates") {
            appendLocalPdfLink(card, entry.pdf);
        }
        appendSecureLink(card, entry.url, kind);
        collectionGrid.appendChild(card);
    });
}

renderCollection(activeCollection, collectionKind);
