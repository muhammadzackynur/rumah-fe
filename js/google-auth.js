const GOOGLE_CLIENT_ID = "215039442935-3pod2eug4io8dlfpo9druojrpn9sqi67.apps.googleusercontent.com";
const GOOGLE_API_URL = "http://10.208.73.186:8000/api/auth/google";

(function () {
    const btn = document.getElementById("googleButton");
    if (!btn) return;

    let tokenClient = null;

    function initGoogle() {
        if (!window.google || !google.accounts) {
            showMessage("Gagal memuat Google. Periksa koneksi internet.", "error");
            return false;
        }

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            callback: handleGoogleResponse,
            error_callback: function () {
                btn.disabled = false;
                showMessage("Login Google dibatalkan.", "error");
            }
        });

        return true;
    }

    async function handleGoogleResponse(response) {
        if (response.error || !response.access_token) {
            btn.disabled = false;
            showMessage("Login Google gagal.", "error");
            return;
        }

        try {
            const res = await fetch(GOOGLE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ access_token: response.access_token })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Login Google gagal.");
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            showMessage("Berhasil! Mengalihkan...", "success");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            btn.disabled = false;
            showMessage(error.message || "Tidak dapat terhubung ke server.", "error");
        }
    }

    btn.addEventListener("click", function () {
        if (!tokenClient && !initGoogle()) return;

        btn.disabled = true;
        tokenClient.requestAccessToken({ prompt: "select_account" });
    });
})();