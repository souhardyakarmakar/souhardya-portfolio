/* =========================================================
   PORTFOLIO GAME MENU — MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const loadingScreen = document.getElementById("loadingScreen");
const gameInterface = document.getElementById("gameInterface");
const loadingVideo = document.getElementById("loadingVideo");

const menuItems = document.querySelectorAll(".menu-item");

const infoDrawer = document.getElementById("infoDrawer");
const drawerClose = document.getElementById("drawerClose");

const drawerNumber = document.getElementById("drawerNumber");
const drawerCategory = document.getElementById("drawerCategory");
const drawerContent = document.getElementById("drawerContent");

const customCursor = document.getElementById("customCursor");

const hudTime = document.getElementById("hudTime");

const exitModal = document.getElementById("exitModal");
const exitYes = document.getElementById("exitYes");
const exitNo = document.getElementById("exitNo");

const returnButton = document.getElementById("returnButton");
const sectionBack = document.getElementById("sectionBack");

const sections = document.querySelectorAll(".portfolio-section");
const pageRoutes = {
    works: "projects.html",
    certificates: "certificates.html"
};

const background = document.querySelector(".background");
const character = document.querySelector(".player-character");
const cornerLogo = document.getElementById("cornerLogo");


/* Update this profile object as your details change. */
const PROFILE_CONFIG = {
    name: "Souhardya Karmakar",
    role: "First-year engineering student and web developer",
    college: "Netaji Subhash Engineering College",
    location: "Kolkata, India",
    webExperience: "5 years",
    socialMediaExperience: "1.5 years",
    technologies: [
        "JavaScript",
        "HTML",
        "CSS",
        "Python",
        "C#",
        "C++",
        "Django",
        "Java (basic)",
        "SQL (basic)",
        "YAML",
        "PHP (basic)",
        "Tailwind CSS",
        "React JS",
        "Node.js (basic)",
    ],
    externalUrl: ""
};


function populateProfile() {
    const profileValues = {
        name: PROFILE_CONFIG.name,
        role: PROFILE_CONFIG.role,
        college: PROFILE_CONFIG.college,
        location: PROFILE_CONFIG.location,
        webExperience: PROFILE_CONFIG.webExperience,
        socialMediaExperience: PROFILE_CONFIG.socialMediaExperience
    };

    document.querySelectorAll("[data-profile]").forEach((element) => {
        const key = element.dataset.profile;
        if (profileValues[key]) {
            element.textContent = profileValues[key];
        }
    });

    document.getElementById("aboutBio").textContent =
        `${PROFILE_CONFIG.name} is a ${PROFILE_CONFIG.role.toLowerCase()} based in ${PROFILE_CONFIG.location}.`;

    const technologyList = document.getElementById("technologyList");
    PROFILE_CONFIG.technologies.forEach((technology) => {
        const tag = document.createElement("span");
        tag.className = "technology-tag";
        tag.textContent = technology;
        technologyList.appendChild(tag);
    });

    if (PROFILE_CONFIG.externalUrl) {
        let externalUrl;
        try {
            externalUrl = new URL(PROFILE_CONFIG.externalUrl);
        } catch (error) {
            console.error("The external page URL is invalid.", error);
        }

        if (externalUrl && externalUrl.protocol === "https:") {
            cornerLogo.href = externalUrl.href;
            cornerLogo.target = "_blank";
            cornerLogo.rel = "noopener noreferrer";
            cornerLogo.setAttribute("aria-label", "Open Souhardya's external page");
            cornerLogo.title = "Open external page";
        } else if (externalUrl) {
            console.error("The external page URL must use HTTPS.");
        }
    }
}

populateProfile();


/* =========================================================
   MENU DATA
========================================================= */

const menuData = {

    about: {
        number: "01",
        category: "PLAYER PROFILE",

        title: ["ABOUT ", "ME"],

        text:
            `${PROFILE_CONFIG.name} is a first-year engineering student at ${PROFILE_CONFIG.college} in ${PROFILE_CONFIG.location}. They have ${PROFILE_CONFIG.webExperience} of web development experience and ${PROFILE_CONFIG.socialMediaExperience} of social media management experience.`,

        stats: [
            ["NAME", PROFILE_CONFIG.name.toUpperCase()],
            ["ROLE", "FIRST-YEAR ENGINEERING STUDENT"],
            ["LOCATION", PROFILE_CONFIG.location.toUpperCase()]
        ]
    },


    skills: {
        number: "02",
        category: "SKILL TREE",

        title: ["MY ", "SKILLS"],

        text: "Languages and tools I use. SQL is at a beginner level.",
        tags: PROFILE_CONFIG.technologies
    },


    works: {
        number: "03",
        category: "MISSION SELECT",

        title: ["MY ", "PROJECTS"],

        text:
            "Explore interactive website demos and selected web development projects in the project archive.",

        stats: [
            ["WEB DEVELOPMENT", "LIVE PROJECTS"],
            ["SOCIAL MEDIA", "COMING SOON"]
        ]
    },


    certificates: {
        number: "04",
        category: "ACHIEVEMENTS",

        title: ["CERTIFIC", "ATES"],

        text:
            "I’m still building this collection. When I have certificates I’m ready to share, I’ll add the verified details here.",

        stats: [
            ["STATUS", "READY TO UPDATE"]
        ]
    },


    education: {
        number: "05",
        category: "EDUCATION & EXPERIENCE",

        title: ["MY ", "JOURNEY"],

        text: `First-year student at ${PROFILE_CONFIG.college}.`,

        stats: [
            ["WEB DEVELOPMENT", PROFILE_CONFIG.webExperience],
            ["SOCIAL MEDIA MANAGEMENT", PROFILE_CONFIG.socialMediaExperience]
        ]
    }

};


/* =========================================================
   PAGE LOADING
========================================================= */

function revealPortfolio() {
    loadingScreen.classList.add("loaded");
    gameInterface.classList.add("ready");
    document.dispatchEvent(new Event("portfolio:intro-finished"));
}

let introTransitionScheduled = false;
let introPlaybackTimer = 0;
let introAudioAttempted = false;
let introErrorVideoAttempted = false;
let introErrorVideoPlaybackTimer = 0;

function transitionAfterIntro() {
    if (!introTransitionScheduled) {
        introTransitionScheduled = true;
        window.clearTimeout(introPlaybackTimer);
        window.clearTimeout(introErrorVideoPlaybackTimer);
        introPlaybackTimer = 0;
        introErrorVideoPlaybackTimer = 0;
        window.setTimeout(revealPortfolio, 1000);
    }
}

function playIntroErrorVideo(error) {
    if (introErrorVideoAttempted) {
        console.error("The backup video could not be loaded.");
        transitionAfterIntro();
        return;
    }

    introErrorVideoAttempted = true;
    console.error("The intro video could not be played. Trying assets/404.mp4.", error);
    loadingVideo.pause();
    loadingVideo.autoplay = true;
    loadingVideo.muted = true;
    loadingVideo.volume = 0;
    loadingVideo.loop = false;
    loadingVideo.preload = "auto";
    loadingVideo.removeAttribute("src");
    loadingVideo.querySelectorAll("source").forEach((source) => source.remove());
    loadingVideo.src = "assets/404.mp4";
    loadingVideo.load();

    const playback = loadingVideo.play();
    if (playback && typeof playback.catch === "function") {
        playback.catch((fallbackError) => {
            if (fallbackError.name === "AbortError") {
                return;
            }

            console.error("Unable to play assets/404.mp4.", fallbackError);
            transitionAfterIntro();
        });
    }

    introErrorVideoPlaybackTimer = window.setTimeout(() => {
        if (
            !introTransitionScheduled &&
            loadingVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
            loadingVideo.paused &&
            !loadingVideo.ended
        ) {
            console.warn("The browser did not start assets/404.mp4.");
            transitionAfterIntro();
        }
    }, 4000);
}

function enableSoundOnInteraction() {
    const enableSound = () => {
        loadingVideo.muted = false;
        loadingVideo.volume = 1;
        document.removeEventListener("pointerdown", enableSound);
        document.removeEventListener("keydown", enableSound);
    };

    document.addEventListener("pointerdown", enableSound, { once: true });
    document.addEventListener("keydown", enableSound, { once: true });
}

function resumeIntroVideo() {
    if (
        !document.hidden &&
        loadingVideo.paused &&
        !loadingVideo.ended &&
        !introTransitionScheduled
    ) {
        startIntroVideo();
    }
}

function startIntroVideo() {
    if (!loadingVideo.paused) {
        return;
    }

    if (!introAudioAttempted) {
        loadingVideo.muted = false;
        loadingVideo.volume = 1;
        introAudioAttempted = true;
    }

    if (introPlaybackTimer === 0) {
        introPlaybackTimer = window.setTimeout(() => {
            introPlaybackTimer = 0;
            if (!introTransitionScheduled && loadingVideo.currentTime === 0 && !loadingVideo.ended) {
                console.error("The intro video did not start playing.");
                playIntroErrorVideo(new Error("Intro playback timed out."));
            }
        }, 8000);
    }

    const playback = loadingVideo.play();

    if (playback && typeof playback.catch === "function") {
        playback.catch((error) => {
            if (error.name === "AbortError") {
                return;
            }

            if (error.name === "NotAllowedError") {
                loadingVideo.muted = true;
                enableSoundOnInteraction();

                const mutedPlayback = loadingVideo.play();
                if (mutedPlayback && typeof mutedPlayback.catch === "function") {
                    mutedPlayback.catch((mutedError) => {
                        if (mutedError.name === "AbortError") {
                            return;
                        }

                        console.error("Unable to autoplay the intro video.", mutedError);
                        playIntroErrorVideo(mutedError);
                    });
                }
                return;
            }

            console.error("Unable to play the intro video.", error);
            playIntroErrorVideo(error);
        });
    }
}

if (document.documentElement.dataset.consentChoice !== "declined") {
    document.addEventListener("visibilitychange", resumeIntroVideo);
    window.addEventListener("focus", resumeIntroVideo);
    loadingVideo.addEventListener("playing", () => {
        window.clearTimeout(introPlaybackTimer);
        window.clearTimeout(introErrorVideoPlaybackTimer);
        introPlaybackTimer = 0;
        introErrorVideoPlaybackTimer = 0;
    }, { once: true });

    loadingVideo.addEventListener("ended", transitionAfterIntro, { once: true });
    loadingVideo.addEventListener("error", () => {
        if (introErrorVideoAttempted) {
            console.error("The backup video could not be loaded.");
            transitionAfterIntro();
            return;
        }

        playIntroErrorVideo(new Error("Intro media load failed."));
    });

    if (loadingVideo.error) {
        console.error("The intro video source is unavailable.");
        transitionAfterIntro();
    } else {
        startIntroVideo();
    }
}


/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    hudTime.textContent = `${hours}:${minutes}`;

}

updateClock();

setInterval(updateClock, 1000);


/* =========================================================
   DRAWER CONTENT
========================================================= */

function generateDrawerContent(data) {
    drawerContent.replaceChildren();

    const heading = document.createElement("h2");
    const [title, accentText] = data.title;
    const accent = document.createElement("span");
    accent.textContent = accentText;
    heading.append(document.createTextNode(title), accent);

    const description = document.createElement("p");
    description.textContent = data.text;

    drawerContent.append(heading, description);

    if (data.stats) {
        const stats = document.createElement("div");
        stats.className = "drawer-stats";

        data.stats.forEach(([label, value]) => {
            const stat = document.createElement("div");
            stat.className = "drawer-stat";

            const statLabel = document.createElement("span");
            statLabel.textContent = label;

            const statValue = document.createElement("strong");
            statValue.textContent = value;

            stat.append(statLabel, statValue);
            stats.appendChild(stat);
        });

        drawerContent.appendChild(stats);
    }

    if (data.tags) {
        const tags = document.createElement("div");
        tags.className = "drawer-tags";

        data.tags.forEach((value) => {
            const tag = document.createElement("span");
            tag.textContent = value;
            tags.appendChild(tag);
        });

        drawerContent.appendChild(tags);
    }
}


/* =========================================================
   OPEN DRAWER
========================================================= */

function openDrawer(sectionName) {

    const data = menuData[sectionName];

    if (!data) return;


    drawerNumber.textContent = data.number;

    drawerCategory.textContent = data.category;

    generateDrawerContent(data);

    infoDrawer.classList.add("open");
    document.body.classList.add("drawer-open");
    menuItems.forEach((item) => {
        item.setAttribute("aria-expanded", String(item.dataset.section === sectionName));
    });

}


/* =========================================================
   CLOSE DRAWER
========================================================= */

function closeDrawer() {

    infoDrawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
    menuItems.forEach((item) => item.setAttribute("aria-expanded", "false"));

}


/* =========================================================
   MENU HOVER
========================================================= */

menuItems.forEach(item => {

    item.addEventListener("mouseenter", () => {

        const section = item.dataset.section;


        /* EXIT behaves differently */

        if (section === "exit") {

            closeDrawer();

            return;

        }


        openDrawer(section);

    });


    item.addEventListener("mouseleave", () => {

        /*
         * Don't immediately close.
         * This allows the user to move
         * from the menu into the drawer.
         */
    });


    item.addEventListener("click", () => {

        const section = item.dataset.section;

        if (pageRoutes[section]) {
            window.location.assign(pageRoutes[section]);
            return;
        }

        if (section === "exit") {

            openExitModal();

            return;

        }


        selectMenuItem(item);

        closeDrawer();

        openSection(section);

    });

});


/* =========================================================
   DRAWER CLOSE
========================================================= */

drawerClose.addEventListener("click", () => {

    closeDrawer();

});


/* =========================================================
   SELECT MENU ITEM
========================================================= */

function selectMenuItem(selectedItem) {

    menuItems.forEach(item => {

        item.classList.remove("active");

    });

    selectedItem.classList.add("active");
    currentMenuIndex = getVisibleMenuItems().indexOf(selectedItem);

}


/* =========================================================
   OPEN PORTFOLIO SECTION
========================================================= */

function openSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove("active");

    });


    const target = document.getElementById(sectionName);

    if (!target) return;


    target.classList.add("active");
    target.scrollTop = 0;
    gameInterface.classList.add("section-open");
    sectionBack.setAttribute("aria-hidden", "false");
    closeDrawer();
    closeExitModal();
}


/* =========================================================
   RETURN TO MENU
========================================================= */

function returnToMenu() {
    sections.forEach(section => {
        section.classList.remove("active");
    });

    gameInterface.classList.remove("section-open");
    sectionBack.setAttribute("aria-hidden", "true");
    closeDrawer();
    closeExitModal();
    selectMenuItem(menuItems[0]);
}

sectionBack.addEventListener("click", returnToMenu);
returnButton.addEventListener("click", returnToMenu);


/* =========================================================
   EXIT MODAL
========================================================= */

function openExitModal() {

    exitModal.classList.add("open");

}


function closeExitModal() {

    exitModal.classList.remove("open");

}


exitNo.addEventListener("click", () => {

    closeExitModal();

});


exitYes.addEventListener("click", () => {

    returnToMenu();

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        returnToMenu();
        return;

    }

    if (
        document.querySelector(".portfolio-section.active") ||
        exitModal.classList.contains("open")
    ) {
        return;
    }

    if (
        event.key === "Enter" &&
        event.target.closest("button, a, input, textarea, select")
    ) {
        return;
    }

});


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

let currentMenuIndex = 0;

function getVisibleMenuItems() {
    return Array.from(menuItems).filter((item) => item.getClientRects().length > 0);
}

function updateKeyboardSelection() {

    const visibleMenuItems = getVisibleMenuItems();

    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    const selected = visibleMenuItems[currentMenuIndex];
    if (!selected) {
        return;
    }

    selected.classList.add("active");


    const section = selected.dataset.section;


    if (section !== "exit") {

        openDrawer(section);

    } else {

        closeDrawer();

    }

}


document.addEventListener("keydown", event => {

    if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Enter"
    ) {

        return;

    }


    if (event.key === "ArrowDown") {

        currentMenuIndex++;

        if (currentMenuIndex >= getVisibleMenuItems().length) {

            currentMenuIndex = 0;

        }

        updateKeyboardSelection();

    }


    if (event.key === "ArrowUp") {

        currentMenuIndex--;

        if (currentMenuIndex < 0) {

            currentMenuIndex = getVisibleMenuItems().length - 1;

        }

        updateKeyboardSelection();

    }


    if (event.key === "Enter") {

        const selected = getVisibleMenuItems()[currentMenuIndex];

        if (selected) {
            selected.click();
        }

    }

    event.preventDefault();

});


/* =========================================================
   CUSTOM CURSOR
========================================================= */

let cursorX = 0;
let cursorY = 0;
let ringX = 0;
let ringY = 0;
let cursorFrame = 0;
let previousCursorFrame = 0;
let cursorInitialized = false;
const cursorMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function animateCursor(timestamp) {
    const elapsed = Math.min(timestamp - previousCursorFrame, 50);
    previousCursorFrame = timestamp;
    const easing = cursorMotionPreference.matches
        ? 1
        : 1 - Math.exp(-elapsed / 42);

    ringX += (cursorX - ringX) * easing;
    ringY += (cursorY - ringY) * easing;
    customCursor.style.setProperty("--ring-x", `${ringX - cursorX}px`);
    customCursor.style.setProperty("--ring-y", `${ringY - cursorY}px`);

    if (Math.hypot(cursorX - ringX, cursorY - ringY) < 0.15) {
        ringX = cursorX;
        ringY = cursorY;
        customCursor.style.setProperty("--ring-x", "0px");
        customCursor.style.setProperty("--ring-y", "0px");
        cursorFrame = 0;
        return;
    }

    cursorFrame = requestAnimationFrame(animateCursor);
}

document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") {
        return;
    }

    cursorX = event.clientX;
    cursorY = event.clientY;
    customCursor.style.setProperty("--cursor-x", `${cursorX}px`);
    customCursor.style.setProperty("--cursor-y", `${cursorY}px`);
    customCursor.classList.add("visible");

    if (!cursorInitialized) {
        ringX = cursorX;
        ringY = cursorY;
        cursorInitialized = true;
    }

    if (cursorFrame === 0) {
        previousCursorFrame = performance.now();
        cursorFrame = requestAnimationFrame(animateCursor);
    }
}, { passive: true });

function hideCustomCursor() {
    customCursor.classList.remove("visible");
    cursorInitialized = false;

    if (cursorFrame !== 0) {
        cancelAnimationFrame(cursorFrame);
        cursorFrame = 0;
    }
}

document.documentElement.addEventListener("mouseleave", hideCustomCursor);
window.addEventListener("blur", hideCustomCursor);


/* =========================================================
   CURSOR HOVER EFFECT
========================================================= */

const interactiveElements = document.querySelectorAll(
    "button, a, .project-card, .certificate"
);


interactiveElements.forEach(element => {

    element.addEventListener("mouseenter", () => {

        customCursor.classList.add("hovering");

    });


    element.addEventListener("mouseleave", () => {

        customCursor.classList.remove("hovering");

    });

});

/* =========================================================
   MOUSE PARALLAX
========================================================= */

let targetMouseX = 0;
let targetMouseY = 0;

let currentMouseX = 0;
let currentMouseY = 0;


document.addEventListener("mousemove", event => {

    const x =
        (event.clientX / window.innerWidth) - 0.5;

    const y =
        (event.clientY / window.innerHeight) - 0.5;


    targetMouseX = x;
    targetMouseY = y;

});


function animateParallax() {

    currentMouseX +=
        (targetMouseX - currentMouseX) * 0.04;

    currentMouseY +=
        (targetMouseY - currentMouseY) * 0.04;


    const backgroundX =
        currentMouseX * -25;

    const backgroundY =
        currentMouseY * -18;


    const characterX =
        currentMouseX * 18;

    const characterY =
        currentMouseY * 10;


    background.style.setProperty(
        "--mouse-x",
        `${backgroundX}px`
    );

    background.style.setProperty(
        "--mouse-y",
        `${backgroundY}px`
    );


    character.style.setProperty(
        "--character-x",
        `${characterX}px`
    );

    character.style.setProperty(
        "--character-y",
        `${characterY}px`
    );


    requestAnimationFrame(animateParallax);

}

animateParallax();


/* =========================================================
   CHARACTER REACTION
========================================================= */

menuItems.forEach(item => {

    item.addEventListener("mouseenter", () => {

        const section = item.dataset.section;


        if (section === "works") {

            character.style.transform =
                "translate3d(-25px, -4px, 0) scale(1.02)";

        }

        else if (section === "skills") {

            character.style.transform =
                "translate3d(15px, -3px, 0) scale(1.01)";

        }

        else {

            character.style.transform =
                "translate3d(0, 0, 0) scale(1)";

        }

    });

});


/* =========================================================
   CLICK OUTSIDE DRAWER
========================================================= */

document.addEventListener("click", event => {

    if (
        infoDrawer.classList.contains("open") &&
        !infoDrawer.contains(event.target) &&
        !event.target.closest(".menu-item")
    ) {

        closeDrawer();

    }

});


/* =========================================================
   INITIAL STATE
========================================================= */

setTimeout(() => {

    const firstMenuItem =
        document.querySelector(".menu-item.active");

    if (firstMenuItem) {

        currentMenuIndex = 0;

    }

}, 100);

