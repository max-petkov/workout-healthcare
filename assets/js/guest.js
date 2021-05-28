// Variables
const logInGuest = document.getElementById("logInGuest");

// Login as Guest
logInGuest.addEventListener("click", function () {
  loginOptions.style.transition = "0.5s";
  loginOptions.style.opacity = 0;

  if (window.innerWidth <= 768)
    document.querySelector(".info").style.order = -1;

  setTimeout(function () {
    renderGuestProfile();
  }, 500);
});

editProfile.addEventListener("click", function () {
  if (!profileData) {
    formProfile.firstElementChild.firstElementChild.textContent =
      "Create profile";
  }
});
