const PHONE_BREAKPOINT = 720;
const primaryNav = document.querySelector('nav[aria-label="Primary navigation"]');
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll('nav[aria-label="Primary navigation"] a');
const projectFilters = document.querySelectorAll(".project-filter");
const projectCards = document.querySelectorAll("#projects article[data-category]");
const contactForm = document.querySelector("#contact-form");

if (primaryNav && navToggle) {
    const closeNav = () => {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        primaryNav.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= PHONE_BREAKPOINT) {
                closeNav();
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            window.innerWidth <= PHONE_BREAKPOINT &&
            primaryNav.classList.contains("is-open") &&
            !primaryNav.contains(event.target)
        ) {
            closeNav();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > PHONE_BREAKPOINT) {
            closeNav();
        }
    });
}

if (projectFilters.length > 0 && projectCards.length > 0) {
    projectFilters.forEach((filterButton) => {
        filterButton.addEventListener("click", () => {
            const selectedFilter = filterButton.dataset.filter;

            projectFilters.forEach((button) => {
                const isActive = button === filterButton;
                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });

            projectCards.forEach((card) => {
                const categories = card.dataset.category.split(" ");
                const matchesFilter =
                    selectedFilter === "all" || categories.includes(selectedFilter);

                card.classList.toggle("is-hidden", !matchesFilter);
            });
        });
    });
}

if (contactForm) {
    const contactEmailAddress = "GuyZoektWerk@outlook.com";
    const fieldRules = {
        name: {
            input: document.querySelector("#name"),
            error: document.querySelector("#name-error"),
            message: "Please enter your name."
        },
        email: {
            input: document.querySelector("#email"),
            error: document.querySelector("#email-error"),
            message: "Please enter your email address."
        },
        message: {
            input: document.querySelector("#message"),
            error: document.querySelector("#message-error"),
            message: "Please enter a message."
        }
    };

    const validateField = ({ input, error, message }) => {
        const value = input.value.trim();
        const isEmpty = value === "";
        const isEmailField = input.type === "email";
        const hasEmailFormat = !isEmailField || input.validity.valid;

        let errorMessage = "";

        if (isEmpty) {
            errorMessage = message;
        } else if (isEmailField && !hasEmailFormat) {
            errorMessage = "Please enter a valid email address.";
        }

        error.textContent = errorMessage;
        input.classList.toggle("is-invalid", errorMessage !== "");
        input.setAttribute("aria-invalid", String(errorMessage !== ""));

        return errorMessage === "";
    };

    Object.values(fieldRules).forEach((field) => {
        field.input.addEventListener("input", () => {
            validateField(field);
        });
    });

    contactForm.addEventListener("submit", (event) => {
        const fields = Object.values(fieldRules);
        const invalidField = fields.find((field) => !validateField(field));

        event.preventDefault();

        if (invalidField) {
            invalidField.input.focus();
            return;
        }

        const name = fieldRules.name.input.value.trim();
        const email = fieldRules.email.input.value.trim();
        const message = fieldRules.message.input.value.trim();
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:${contactEmailAddress}?subject=${subject}&body=${body}`;
        contactForm.reset();
        fields.forEach((field) => {
            field.error.textContent = "";
            field.input.classList.remove("is-invalid");
            field.input.setAttribute("aria-invalid", "false");
        });
    });
}
