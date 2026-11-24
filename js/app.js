/* =====================================================
   KONFIGURASI API LARAVEL
===================================================== */

const API_URL = "http://127.0.0.1:8000/api";


/* =====================================================
   ELEMENT
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const rememberCheckbox =
    document.getElementById("remember");

const loginButton =
    document.getElementById("loginButton");

const message =
    document.getElementById("message");

const googleButton =
    document.getElementById("googleButton");


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

togglePassword.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type = "text";

            togglePassword.textContent =
                "Sembunyikan";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent =
                "Lihat";

        }

    }
);


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className =
        "message " + type;

}


function clearMessage() {

    message.textContent = "";

    message.className = "message";

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const remember =
            rememberCheckbox.checked;


        /* ---------------------------------------------
           VALIDASI
        --------------------------------------------- */

        if (!email || !password) {

            showMessage(
                "Email dan kata sandi wajib diisi.",
                "error"
            );

            return;

        }


        /* ---------------------------------------------
           BUTTON LOADING
        --------------------------------------------- */

        loginButton.disabled = true;

        loginButton.textContent =
            "Memproses...";


        try {

            /* -----------------------------------------
               REQUEST KE LARAVEL
            ----------------------------------------- */

            const response =
                await fetch(
                    `${API_URL}/login`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"

                        },

                        body: JSON.stringify({

                            email: email,

                            password: password

                        })

                    }
                );


            const result =
                await response.json();


            /* -----------------------------------------
               ERROR
            ----------------------------------------- */

            if (!response.ok) {

                let errorMessage =
                    result.message ||
                    "Email atau kata sandi salah.";

                if (result.errors) {

                    errorMessage =
                        Object.values(
                            result.errors
                        )
                            .flat()
                            .join(" ");

                }

                throw new Error(
                    errorMessage
                );

            }


            /* -----------------------------------------
               LOGIN BERHASIL
            ----------------------------------------- */

            if (remember) {

                localStorage.setItem(
                    "token",
                    result.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        result.user
                    )
                );

            } else {

                sessionStorage.setItem(
                    "token",
                    result.token
                );

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        result.user
                    )
                );

            }


            /* -----------------------------------------
               MESSAGE
            ----------------------------------------- */

            showMessage(
                "Login berhasil! Mengalihkan...",
                "success"
            );


            loginButton.textContent =
                "Berhasil";


            /* -----------------------------------------
               REDIRECT
            ----------------------------------------- */

            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                1000
            );

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            showMessage(
                error.message ||
                "Tidak dapat terhubung ke server.",
                "error"
            );


            loginButton.disabled =
                false;

            loginButton.textContent =
                "Masuk";

        }

    }
);


/* =====================================================
   GOOGLE LOGIN
===================================================== */

googleButton.addEventListener(
    "click",
    function () {

        showMessage(
            "Login Google belum dikonfigurasi.",
            "error"
        );

    }
);