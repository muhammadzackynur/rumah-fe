
/* =====================================================
   CONFIGURATION
===================================================== */

// Sesuaikan dengan alamat Backend Laravel kamu.
const API_URL = "http://127.0.0.1:8000/api/register";


/* =====================================================
   ELEMENT
===================================================== */

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const termsInput = document.getElementById("terms");

const registerButton = document.getElementById("registerButton");

const formMessage = document.getElementById("formMessage");

const googleButton = document.getElementById("googleButton");


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Sembunyikan";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Lihat";

    }

});


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


function hideMessage() {

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


/* =====================================================
   VALIDATION
===================================================== */

function validateForm() {

    const name = nameInput.value.trim();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    if (name.length < 3) {

        showMessage(
            "Nama lengkap minimal 3 karakter.",
            "error"
        );

        nameInput.focus();

        return false;

    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showMessage(
            "Masukkan alamat email yang valid.",
            "error"
        );

        emailInput.focus();

        return false;

    }


    if (password.length < 8) {

        showMessage(
            "Kata sandi minimal 8 karakter.",
            "error"
        );

        passwordInput.focus();

        return false;

    }


    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {

        showMessage(
            "Kata sandi harus mengandung huruf dan angka.",
            "error"
        );

        passwordInput.focus();

        return false;

    }


    if (!termsInput.checked) {

        showMessage(
            "Silakan setujui Syarat dan Ketentuan Ruma.",
            "error"
        );

        termsInput.focus();

        return false;

    }


    return true;

}


/* =====================================================
   REGISTER SUBMIT
===================================================== */

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    hideMessage();


    // Validasi
    if (!validateForm()) {

        return;

    }


    // Ambil data
    const userData = {

        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        password: passwordInput.value,

        password_confirmation: passwordInput.value

    };


    // Loading
    registerButton.disabled = true;

    registerButton.textContent = "Memproses...";


    try {

        // Kirim data ke Laravel
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Accept": "application/json"

            },

            body: JSON.stringify(userData)

        });


        const result = await response.json();


        // Jika gagal
        if (!response.ok) {

            let errorMessage = result.message || "Pendaftaran gagal.";

            if (result.errors) {

                errorMessage = Object.values(result.errors)
                    .flat()
                    .join(" ");

            }

            throw new Error(errorMessage);

        }


        // Jika berhasil
        showMessage(
            "Akun berhasil dibuat! Silakan masuk.",
            "success"
        );


        // Bersihkan password
        registerForm.reset();


        // Arahkan ke halaman login setelah berhasil
        setTimeout(function () {

            window.location.href = "login.html";

        }, 2000);


    } catch (error) {

        console.error("Register Error:", error);

        showMessage(
            error.message || "Tidak dapat terhubung ke server.",
            "error"
        );

    } finally {

        registerButton.disabled = false;

        registerButton.textContent = "Buat akun";

    }

});


/* =====================================================
   GOOGLE REGISTER
===================================================== */

googleButton.addEventListener("click", function () {

    showMessage(
        "Fitur pendaftaran Google belum dikonfigurasi.",
        "error"
    );

});


/* =====================================================
   HELP LINK
===================================================== */

document.getElementById("helpLink").addEventListener("click", function (event) {

    event.preventDefault();

    alert("Silakan hubungi layanan bantuan Ruma.");

});
