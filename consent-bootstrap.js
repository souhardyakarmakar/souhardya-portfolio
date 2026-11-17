(() => {
    try {
        const choice = window.sessionStorage.getItem("souhardyaPortfolioTermsConsentV2");
        if (choice === "accepted" || choice === "declined") {
            document.documentElement.classList.add("consent-choice-saved");
            document.documentElement.dataset.consentChoice = choice;
        }
    } catch (error) {
        console.error("The saved consent choice could not be read before rendering.", error);
    }
})();
