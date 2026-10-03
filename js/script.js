
console.log("CampusConnect JavaScript Connected Successfully!");

// =====================================================
// HOME PAGE CARDS NAVIGATION
// =====================================================

const notesCard = document.getElementById("notesCard");

if (notesCard) {
    notesCard.onclick = function () {
        window.location.href = "/notes";
    };
}


const eventsCard = document.getElementById("eventsCard");

if (eventsCard) {
    eventsCard.onclick = function () {
        window.location.href = "/events";
    };
}


const placementCard = document.getElementById("placementCard");

if (placementCard) {
    placementCard.onclick = function () {
        window.location.href = "/placement";
    };
}


const profileCard = document.getElementById("profileCard");

if (profileCard) {
    profileCard.onclick = function () {
        window.location.href = "/profile";
    };
}


// =====================================================
// LOGIN + FLASK BACKEND
// =====================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("errorMessage");

        if (email === "" || password === "") {

            errorMessage.textContent = "Please fill all fields.";
            return;
        }

        errorMessage.textContent = "";

        try {

            const response = await fetch("/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            const result = await response.json();

            if (result.success) {

                alert("Login Successful! Welcome to CampusConnect 🎉");

                // Protected Flask route
                window.location.href = "/home";

            } else {

                errorMessage.textContent = result.message;

            }

        } catch (error) {

            errorMessage.textContent = "Unable to connect to server.";

            console.error(error);

        }

    });

}


// =====================================================
// SIGNUP + FLASK BACKEND
// =====================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value.trim();

        const confirmPassword =
            document.getElementById("confirmPassword").value.trim();

        const signupError =
            document.getElementById("signupError");


        if (
            fullName === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            signupError.textContent = "Please fill all fields.";
            return;

        }


        if (password.length < 6) {

            signupError.textContent =
                "Password must be at least 6 characters.";

            return;

        }


        if (password !== confirmPassword) {

            signupError.textContent =
                "Passwords do not match.";

            return;

        }


        signupError.textContent = "";


        try {

            const response = await fetch("/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: fullName,
                    email: email,
                    password: password

                })

            });


            const result = await response.json();


            if (result.success) {

                alert("Account created successfully! 🎉");

                // Go to Flask login route
                window.location.href = "/";

            } else {

                signupError.textContent = result.message;

            }


        } catch (error) {

            signupError.textContent =
                "Unable to connect to server.";

            console.error(error);

        }

    });

}


// =====================================================
// NOTES SEARCH
// =====================================================

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        let value =
            searchInput.value.toLowerCase();

        const cards = [

            {
                element:
                    document.getElementById("dbmsCard"),
                text: "dbms"
            },

            {
                element:
                    document.getElementById("pythonCard"),
                text: "python"
            },

            {
                element:
                    document.getElementById("javaCard"),
                text: "java"
            },

            {
                element:
                    document.getElementById("webCard"),
                text: "web dev"
            }

        ];


        cards.forEach(function (card) {

            if (!card.element) return;


            if (card.text.includes(value)) {

                card.element.style.display = "block";

            } else {

                card.element.style.display = "none";

            }

        });

    });

}


// =====================================================
// EVENTS SEARCH
// =====================================================

const eventSearch =
    document.getElementById("eventSearch");

if (eventSearch) {

    eventSearch.addEventListener("keyup", function () {

        let value =
            eventSearch.value.toLowerCase();


        const events = [

            {
                element:
                    document.getElementById("hackathonCard"),
                text: "hackathon"
            },

            {
                element:
                    document.getElementById("aiCard"),
                text: "ai"
            },

            {
                element:
                    document.getElementById("seminarCard"),
                text: "seminar"
            },

            {
                element:
                    document.getElementById("recruitmentCard"),
                text: "recruitment"
            }

        ];


        events.forEach(function (event) {

            if (!event.element) return;


            if (event.text.includes(value)) {

                event.element.style.display = "flex";

            } else {

                event.element.style.display = "none";

            }

        });

    });

}


// =====================================================
// PROFILE PHOTO UPLOAD + LOCAL STORAGE
// =====================================================

const uploadBtn =
    document.getElementById("uploadBtn");

const photoInput =
    document.getElementById("photoInput");

const profileImage =
    document.getElementById("profileImage");


if (uploadBtn && photoInput && profileImage) {

    const savedImage =
        localStorage.getItem("profileImage");


    if (savedImage) {

        profileImage.src = savedImage;

    }


    uploadBtn.onclick = function () {

        photoInput.click();

    };


    photoInput.onchange = function () {

        const file =
            photoInput.files[0];


        if (file) {

            const reader =
                new FileReader();


            reader.onload = function (e) {

                profileImage.src =
                    e.target.result;


                localStorage.setItem(
                    "profileImage",
                    e.target.result
                );


                alert(
                    "Profile Photo Updated Successfully!"
                );

            };


            reader.readAsDataURL(file);

        }

    };

}


// =====================================================
// PROFILE + FLASK BACKEND
// =====================================================

const editBtn =
    document.getElementById("editBtn");


if (editBtn) {

    // -------------------------------------------------
    // LOAD PROFILE FROM DATABASE
    // -------------------------------------------------

    async function loadProfile() {

        try {

            const response =
                await fetch("/api/profile");


            const result =
                await response.json();


            if (result.success) {

                const user =
                    result.user;


                const nameText =
                    document.getElementById("nameText");

                const courseText =
                    document.getElementById("courseText");

                const collegeText =
                    document.getElementById("collegeText");

                const emailText =
                    document.getElementById("emailText");

                const phoneText =
                    document.getElementById("phoneText");


                if (nameText) {

                    nameText.innerText =
                        user.name || "Not Available";

                }


                if (courseText) {

                    courseText.innerText =
                        user.course || "Not Available";

                }


                if (collegeText) {

                    collegeText.innerText =
                        user.college || "Not Available";

                }


                if (emailText) {

                    emailText.innerText =
                        user.email || "Not Available";

                }


                if (phoneText) {

                    phoneText.innerText =
                        user.phone || "Not Available";

                }


            } else {

                window.location.href = "/";

            }


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

        }

    }


    // Load profile when page opens
    loadProfile();


    // -------------------------------------------------
    // EDIT PROFILE
    // -------------------------------------------------

    editBtn.onclick = async function () {


        const nameText =
            document.getElementById("nameText");

        const courseText =
            document.getElementById("courseText");

        const collegeText =
            document.getElementById("collegeText");

        const emailText =
            document.getElementById("emailText");

        const phoneText =
            document.getElementById("phoneText");


        let newName = prompt(
            "Enter Your Name",
            nameText ? nameText.innerText : ""
        );


        if (
            newName === null ||
            newName.trim() === ""
        ) {
            return;
        }


        let newCourse = prompt(
            "Enter Your Course",
            courseText ? courseText.innerText : ""
        );


        if (
            newCourse === null ||
            newCourse.trim() === ""
        ) {
            return;
        }


        let newCollege = prompt(
            "Enter Your College",
            collegeText ? collegeText.innerText : ""
        );


        if (
            newCollege === null ||
            newCollege.trim() === ""
        ) {
            return;
        }


        let newEmail = prompt(
            "Enter Your Email",
            emailText ? emailText.innerText : ""
        );


        if (
            newEmail === null ||
            newEmail.trim() === ""
        ) {
            return;
        }


        let newPhone = prompt(
            "Enter Your Phone Number",
            phoneText ? phoneText.innerText : ""
        );


        if (
            newPhone === null ||
            newPhone.trim() === ""
        ) {
            return;
        }


        // -------------------------------------------------
        // SEND UPDATED DATA TO FLASK
        // -------------------------------------------------

        try {

            const response =
                await fetch("/api/profile", {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: newName.trim(),

                        course: newCourse.trim(),

                        college: newCollege.trim(),

                        email: newEmail.trim(),

                        phone: newPhone.trim()

                    })

                });


            const result =
                await response.json();


            if (result.success) {

                alert(
                    "Profile Updated Successfully!"
                );


                // Reload updated profile
                loadProfile();


            } else {

                alert(result.message);

            }


        } catch (error) {

            alert(
                "Unable to connect to server."
            );

            console.error(error);

        }

    };

}


// =====================================================
// LOGOUT + FLASK BACKEND
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.onclick = async function () {


        let confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        try {

            const response =
                await fetch("/logout", {

                    method: "POST"

                });


            const result =
                await response.json();


            if (result.success) {

                alert("Logout Successful!");


                // Flask login route
                window.location.href = "/";


            } else {

                alert("Logout failed.");

            }


        } catch (error) {

            alert(
                "Unable to connect to server."
            );

            console.error(error);

        }

    };

}
