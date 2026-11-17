(() => {
    const storageKey = "souhardyaPortfolioTermsConsentV2";
    const consentGate = document.getElementById("consentGate");
    const declineScreen = document.getElementById("declineScreen");
    const agreementCheckbox = document.getElementById("termsAgreement");
    const acceptButton = document.getElementById("consentAccept");
    const declineButton = document.getElementById("consentDecline");
    const consentStatus = document.getElementById("consentStatus");
    const declineStatus = document.getElementById("declineStatus");
    const declineVideo = document.getElementById("declineVideo");
    const declineFallback = document.getElementById("declineFallback");
    const exitButton = document.getElementById("exitWebsite");
    let declineVideoUnavailable = false;
    let errorVideoAttempted = false;
    let declineVideoLoadTimer = 0;
    let declineVideoPlaybackTimer = 0;

    if (
        !consentGate ||
        !declineScreen ||
        !agreementCheckbox ||
        !acceptButton ||
        !declineButton ||
        !consentStatus ||
        !declineStatus ||
        !declineVideo ||
        !declineFallback ||
        !exitButton
    ) {
        console.error("The portfolio consent interface is incomplete.");
        return;
    }

    function setLockedLayer(activeLayer) {
        document.body.classList.add("consent-locked");

        Array.from(document.body.children).forEach((element) => {
            element.inert = element !== activeLayer;
        });

        activeLayer.inert = false;
    }

    function unlockPage() {
        document.body.classList.remove("consent-locked");

        Array.from(document.body.children).forEach((element) => {
            element.inert = false;
        });
    }

    function focusFirstControl(layer) {
        const control = layer.querySelector(
            'input:not([disabled]), button:not([disabled]), a[href], video[controls]'
        );
        control?.focus();
    }

    function showConsent() {
        declineVideo.pause();
        window.clearTimeout(declineVideoLoadTimer);
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoLoadTimer = 0;
        declineVideoPlaybackTimer = 0;
        declineScreen.hidden = true;
        consentGate.hidden = false;
        agreementCheckbox.checked = false;
        acceptButton.disabled = true;
        setLockedLayer(consentGate);
        focusFirstControl(consentGate);
    }

    function showVideoFallback(message) {
        window.clearTimeout(declineVideoLoadTimer);
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoLoadTimer = 0;
        declineVideoPlaybackTimer = 0;
        declineVideo.pause();
        declineVideo.hidden = true;
        declineFallback.hidden = false;
        declineFallback.textContent = message;
    }

    function showErrorVideoFallback() {
        window.clearTimeout(declineVideoLoadTimer);
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoLoadTimer = 0;
        declineVideoPlaybackTimer = 0;

        if (errorVideoAttempted) {
            showVideoFallback("The decline and backup videos could not be played. Use EXIT to leave this page.");
            console.error("The backup video is unavailable. Add a supported video as assets/404.mp4.");
            return;
        }

        errorVideoAttempted = true;
        declineVideo.pause();
        declineVideo.hidden = false;
        declineFallback.hidden = true;
        declineVideo.autoplay = true;
        declineVideo.loop = false;
        declineVideo.muted = true;
        declineVideo.controls = false;
        declineVideo.preload = "auto";
        declineVideo.removeEventListener("error", handleDeclineVideoError);
        declineVideo.addEventListener("error", handleErrorVideoError, { once: true });
        declineVideo.src = "assets/404.mp4";
        declineVideo.load();

        const playRequest = declineVideo.play();
        if (playRequest) {
            playRequest.catch((error) => {
                if (error.name === "AbortError" || declineScreen.hidden) {
                    return;
                }

                console.warn("The backup video could not autoplay.", error);
                showVideoFallback("The backup video could not be played. Add a supported assets/404.mp4.");
            });
        }

        declineVideoLoadTimer = window.setTimeout(() => {
            if (!declineScreen.hidden && declineVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
                showVideoFallback("The backup video could not be loaded. Add a supported assets/404.mp4.");
                console.error("The backup video did not load. Add a supported video as assets/404.mp4.");
            }
        }, 10000);

        declineVideoPlaybackTimer = window.setTimeout(() => {
            if (
                !declineScreen.hidden &&
                declineVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
                declineVideo.paused &&
                !declineVideo.ended
            ) {
                showVideoFallback("The backup video could not autoplay. Use EXIT to leave this page.");
                console.warn("The browser did not start the backup video.");
            }
        }, 4000);
    }

    function handleDeclineVideoError() {
        declineVideoUnavailable = true;
        console.error("The decline video could not be loaded. Add it as assets/no.mp4.");

        if (!declineScreen.hidden) {
            showErrorVideoFallback();
        }
    }

    function handleErrorVideoError() {
        if (!declineScreen.hidden) {
            showVideoFallback("The backup video could not be loaded. Add a supported assets/404.mp4.");
        }
        console.error("The backup video could not be loaded. Add it as assets/404.mp4.");
    }

    function showDeclined() {
        window.clearTimeout(declineVideoLoadTimer);
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoLoadTimer = 0;
        declineVideoPlaybackTimer = 0;
        consentGate.hidden = true;
        declineScreen.hidden = false;
        declineStatus.textContent =
            "Your browser may block closing this tab. If it stays open, close it from your browser.";
        declineStatus.hidden = true;
        declineVideo.pause();
        setLockedLayer(declineScreen);
        focusFirstControl(declineScreen);

        if (declineVideoUnavailable || declineVideo.error) {
            showErrorVideoFallback();
            return;
        }

        declineVideo.hidden = false;
        declineFallback.hidden = true;
        declineVideo.autoplay = true;
        declineVideo.loop = false;
        declineVideo.muted = true;
        declineVideo.controls = false;
        declineVideo.preload = "auto";
        declineVideo.currentTime = 0;

        const playRequest = declineVideo.play();
        if (playRequest) {
            playRequest.catch((error) => {
                if (error.name === "AbortError" || declineScreen.hidden) {
                    return;
                }

                console.warn("The decline video could not autoplay.", error);
                showErrorVideoFallback();
            });
        }

        declineVideoLoadTimer = window.setTimeout(() => {
            if (!declineScreen.hidden && declineVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
                showErrorVideoFallback();
                console.error("The decline video did not load. Add a supported video as assets/no.mp4.");
            }
        }, 10000);

        declineVideoPlaybackTimer = window.setTimeout(() => {
            if (
                !declineScreen.hidden &&
                declineVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
                declineVideo.paused &&
                !declineVideo.ended
            ) {
                showErrorVideoFallback();
                console.warn("The browser did not start the decline video.");
            }
        }, 4000);
    }

    function saveChoice(choice) {
        try {
            window.sessionStorage.setItem(storageKey, choice);
        } catch (error) {
            console.error("The consent choice could not be saved for this session.", error);
            consentStatus.textContent =
                "Your browser could not save this choice. It will apply only until you leave this page.";
        }
    }

    function getChoice() {
        try {
            return window.sessionStorage.getItem(storageKey);
        } catch (error) {
            console.error("The session consent choice could not be read.", error);
            consentStatus.textContent =
                "Session storage is unavailable. Your choice will apply only until you leave this page.";
            return null;
        }
    }

    agreementCheckbox.addEventListener("change", () => {
        acceptButton.disabled = !agreementCheckbox.checked;
    });

    window.addEventListener("pageshow", () => {
        if (!consentGate.hidden) {
            agreementCheckbox.checked = false;
            acceptButton.disabled = true;
        }
    });

    acceptButton.addEventListener("click", () => {
        if (!agreementCheckbox.checked) {
            agreementCheckbox.focus();
            return;
        }

        saveChoice("accepted");
        consentGate.hidden = true;
        declineScreen.hidden = true;
        unlockPage();

        const destination = document.querySelector(
            ".menu-item, .collection-nav a[aria-current='page'], main h1"
        );
        if (destination) {
            if (destination.tagName === "H1") {
                destination.setAttribute("tabindex", "-1");
            }
            destination.focus({ preventScroll: true });
        }
    });

    declineButton.addEventListener("click", () => {
        saveChoice("declined");
        showDeclined();
    });

    declineVideo.addEventListener("loadeddata", () => {
        window.clearTimeout(declineVideoLoadTimer);
        declineVideoLoadTimer = 0;
    });

    declineVideo.addEventListener("playing", () => {
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoPlaybackTimer = 0;
    });

    declineVideo.addEventListener("error", handleDeclineVideoError);

    declineVideo.addEventListener("ended", () => {
        window.clearTimeout(declineVideoPlaybackTimer);
        declineVideoPlaybackTimer = 0;
        declineVideo.pause();
    });

    exitButton.addEventListener("click", () => {
        try {
            window.close();
        } catch (error) {
            console.warn("The browser blocked closing this tab.", error);
            declineStatus.hidden = false;
            return;
        }

        if (!window.closed) {
            declineStatus.hidden = false;
        }
    });

    document.addEventListener("keydown", (event) => {
        const activeLayer = consentGate.hidden
            ? (declineScreen.hidden ? null : declineScreen)
            : consentGate;

        if (!activeLayer) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const controls = Array.from(activeLayer.querySelectorAll(
            'a[href], button:not([disabled]):not([hidden]), input:not([disabled]), video[controls]'
        )).filter((element) => element.getClientRects().length > 0);

        if (controls.length === 0) {
            event.preventDefault();
            return;
        }

        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    document.addEventListener("focusin", (event) => {
        const activeLayer = consentGate.hidden
            ? (declineScreen.hidden ? null : declineScreen)
            : consentGate;

        if (activeLayer && !activeLayer.contains(event.target)) {
            focusFirstControl(activeLayer);
        }
    });

    const savedChoice = getChoice();
    if (savedChoice === "accepted") {
        consentGate.hidden = true;
        declineScreen.hidden = true;
        unlockPage();
    } else if (savedChoice === "declined") {
        showDeclined();
    } else {
        const loadingScreen = document.getElementById("loadingScreen");
        if (document.getElementById("loadingVideo") && loadingScreen) {
            consentGate.hidden = true;
            declineScreen.hidden = true;
            setLockedLayer(loadingScreen);
            document.addEventListener("portfolio:intro-finished", showConsent, { once: true });
        } else {
            showConsent();
        }
    }
})();
