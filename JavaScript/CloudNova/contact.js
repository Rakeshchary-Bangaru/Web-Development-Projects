const contactForm =
    document.getElementById("contact-form");

const formStatus =
    document.getElementById("form-status");

const currentYear =
    document.getElementById("current-year");


if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}


contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (!name || !email || !message) {

            formStatus.textContent =
                "Please complete all required fields.";

            return;
        }


        const lead = {
            name,
            email,
            phone,
            message
        };


        console.log(
            "Lead captured locally:",
            lead
        );


        formStatus.textContent =
            "Form is working. AWS backend will be connected next.";


        contactForm.reset();
    }
);