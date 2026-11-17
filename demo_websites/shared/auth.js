(() => {
    const bar = document.querySelector(".fx-uright");
    if (!bar) {
        return;
    }

    let user = null;
    let returnFocus = null;
    let editingProfile = false;

    const createElement = (tagName, className, text) => {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    };

    const showToast = (message) => {
        if (window.fxToast) {
            window.fxToast(message);
        }
    };

    const modal = createElement("div", "fx-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "demoDialogTitle");
    modal.setAttribute("aria-describedby", "demoDialogDescription");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;

    const box = createElement("div", "fx-box");
    const heading = createElement("h3", "", "Welcome");
    heading.id = "demoDialogTitle";
    const description = createElement("p");
    description.id = "demoDialogDescription";

    const form = document.createElement("form");
    const nameInput = createElement("input");
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.placeholder = "Display name (optional)";
    nameInput.autocomplete = "nickname";
    nameInput.maxLength = 30;
    nameInput.setAttribute("aria-label", "Display name");

    const continueButton = createElement("button", "fx-go", "Continue");
    continueButton.type = "submit";
    form.append(nameInput, continueButton);

    const cancelButton = createElement("button", "alt", "Cancel");
    cancelButton.type = "button";
    box.append(heading, description, form, cancelButton);
    modal.appendChild(box);
    document.body.appendChild(modal);

    const close = () => {
        modal.classList.remove("on");
        modal.setAttribute("aria-hidden", "true");
        modal.inert = true;
        if (returnFocus && returnFocus.isConnected) {
            returnFocus.focus();
        }
    };

    const open = (mode, trigger) => {
        returnFocus = trigger;
        editingProfile = mode === "profile";
        heading.textContent = editingProfile ? "Your demo profile" : "Try the demo";
        description.textContent = editingProfile
            ? "Change your display name for this page."
            : "Choose a display name to explore. Nothing is saved or sent.";
        nameInput.value = editingProfile ? user.name : "";
        cancelButton.textContent = editingProfile ? "Done" : "Cancel";
        modal.inert = false;
        modal.setAttribute("aria-hidden", "false");
        modal.classList.add("on");
        nameInput.focus();
    };

    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target === cancelButton) {
            close();
        }
    });

    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== "Tab") {
            return;
        }

        const controls = [nameInput, continueButton, cancelButton];
        if (event.shiftKey && document.activeElement === controls[0]) {
            event.preventDefault();
            controls[controls.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
            event.preventDefault();
            controls[0].focus();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = nameInput.value.trim() || "Guest";
        user = { name };
        render();
        close();
        showToast(editingProfile ? "Demo profile updated for this page." : `Welcome, ${name}!`);
    });

    function render() {
        bar.replaceChildren();
        bar.classList.remove("open");

        if (!user) {
            const loginButton = createElement("button", "fx-login", "Try demo");
            loginButton.type = "button";
            loginButton.addEventListener("click", () => open("login", loginButton));
            bar.appendChild(loginButton);
            return;
        }

        const profileButton = createElement("button", "fx-chip");
        profileButton.type = "button";
        const initials = createElement("i", "", user.name.slice(0, 2).toUpperCase());
        profileButton.append(initials, document.createTextNode(user.name));
        profileButton.addEventListener("click", () => bar.classList.toggle("open"));

        const menu = createElement("div", "fx-menu");
        menu.appendChild(createElement("b", "", user.name));

        const editButton = createElement("button", "", "Edit display name");
        editButton.type = "button";
        editButton.addEventListener("click", () => open("profile", profileButton));

        const logoutButton = createElement("button", "", "End demo session");
        logoutButton.type = "button";
        logoutButton.addEventListener("click", () => {
            user = null;
            render();
            showToast("Demo session ended.");
        });

        menu.append(editButton, logoutButton);
        bar.append(profileButton, menu);
    }

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".fx-uright")) {
            bar.classList.remove("open");
        }

        const action = event.target.closest("[data-need-login]");
        if (action && !user) {
            event.preventDefault();
            open("login", action);
            showToast("Choose a display name to continue.");
        }
    });

    render();
})();
