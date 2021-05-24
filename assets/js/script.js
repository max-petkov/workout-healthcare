"use strict";

const createProfile = document.querySelector("#personalInfo");
const editProfile = document.getElementById("editProfile");
const removeProfile = document.getElementById("removeProfile");
const showCreateProfile = document.getElementById("showCreateProfile");
const hideCreateProfile = document.querySelector(".bi-x");
const formProfile = document.getElementById("personalInfo");
const profileInfo = document.getElementById("profileInfo");
const profileName = document.getElementById("profileName");
const greetings = document.getElementById("greetings");
const navMenu = document.getElementById("navMenu");
const profileData = JSON.parse(localStorage.getItem("profile"));
const fadeAnimation = function (element) {
  element.classList.toggle("fade-in-animation");
};
const renderErrorValid = function (el, msg) {
  el.style.marginBottom = "0.5rem";
  el.nextElementSibling.textContent = msg;
};

const profile = {
  personalInfo: {},
  oneRepMax: {
    benchPress: 80,
    squat: 110,
    deadliftClassic: 110,
    deadliftSumo: 110,
  },
  calcBMI: function (weight, height) {
    const BMI = (weight / (height * height)) * 10000;
    return BMI.toFixed(1);
  },
  calcOneRepMax: function (weight) {
    this.oneRepMax.benchPress = weight * 1.09703 + 14.2546;
  },
  calcBodyNeeds: function (weight, height, age) {
    const BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    return BMR;
  },
  calcWorkoutRoutineCalories: function (BMR, routine) {
    if (routine === "1") return BMR * 1.2;
    if (routine === "2") return BMR * 1.375;
    if (routine === "3") return BMR * 1.55;
    if (routine === "4") return BMR * 1.725;
    if (routine === "5") return BMR * 1.9;
  },
  renderBMI: function (BMI) {
    if (BMI < 18.5) return "Underweight";
    if (BMI >= 18.5 && BMI <= 24.9) return "Normal";
    if (BMI >= 25 && BMI <= 29.9) return "Overweight";
    if (BMI >= 30 && BMI <= 34.9) return "Obesity I";
    if (BMI > 35) return "Obesity II";
  },
};

const renderProfile = function (obj) {
  const html = `
  <h3 class="mb-1">Personal information:</h3>
  <li class="mb-1"><b>Name:</b> ${obj?.name}</li>
  <li class="mb-1"><b>Age:</b> ${obj?.age}</li>
  <li class="mb-1"><b>Weight:</b> ${obj?.weight} kg</li>
  <li class="mb-1"><b>Height:</b> ${obj?.height} cm</li>
  <li class="mb-1"><b>BMI:</b> ${obj?.BMI} (${profile.renderBMI(obj?.BMI)})</li>
  <li class="mb-1"><b>BMR:</b> ${obj?.BMR} kcal</li>
  <li class="mb-1"><b>Workout routine:</b> ${obj?.workout}</li>
  <li class="mb-1"><b>Workout Calories:</b> ${obj?.workoutCalories} kcal</li>
  `;
  profileInfo.innerHTML = html;
  profileName.innerHTML = obj?.name;
};

// Creating Profile
createProfile.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate data
  const name = document.querySelector('input[name="name"]');
  const age = document.querySelector('input[name="age"]');
  const weight = document.querySelector('input[name="weight"]');
  const height = document.querySelector('input[name="height"]');
  const workoutRoutine = this.querySelector('input[type="radio"]');
  let valid = true;

  if (!name.value) {
    renderErrorValid(name, "Field can not be empty");
    valid = false;
  }

  if (!age.value) {
    renderErrorValid(age, "Field can not be empty");
    valid = false;
  } else {
    if (!age.value.match(/[0-9]/g)) {
      renderErrorValid(age, "Field must contain numbers!");
      valid = false;
    }
  }

  if (!weight.value) {
    renderErrorValid(weight, "Field can not be empty");
    valid = false;
  } else {
    if (!weight.value.match(/[0-9]/g)) {
      renderErrorValid(weight, "Field must contain numbers!");
      valid = false;
    }
  }

  if (!height.value) {
    renderErrorValid(height, "Field can not be empty");
    valid = false;
  } else {
    if (!height.value.match(/[0-9]/g)) {
      renderErrorValid(height, "Field must contain numbers!");
      valid = false;
    }
  }

  if (valid) {
    // Getting data from form
    const data = {};
    const form = new FormData(this);
    form.forEach((value, key) => (data[key] = value));

    // Insert form data into profile obj
    profile.personalInfo = data;
    profile.personalInfo.workout = document.querySelector(
      `input[value="${data.routine}"]`
    )?.nextElementSibling.textContent;
    profile.personalInfo.BMI = +profile.calcBMI(+data.weight, +data.height);
    profile.personalInfo.BMR = +profile.calcBodyNeeds(
      +data.weight,
      +data.height,
      +data.age
    );
    profile.personalInfo.workoutCalories = +profile.calcWorkoutRoutineCalories(
      profile.personalInfo.BMR,
      data.routine
    );

    // Insert profile obj data into local storage
    const personalInfoJSON = JSON.stringify(profile.personalInfo);
    localStorage.setItem("profile", personalInfoJSON);

    // Render data into HTML
    renderProfile(profile.personalInfo);

    // Remove create button and add greetings menu
    fadeAnimation(formProfile);
    showCreateProfile.classList.add("d-none");
    greetings.classList.remove("d-none");
    greetings.classList.add("d-flex");
  }
});

// Render localStorage data
if (profileData) {
  renderProfile(profileData);
  showCreateProfile.classList.add("d-none");
  greetings.classList.remove("d-none");
  greetings.classList.add("d-flex");
}

showCreateProfile.addEventListener("click", () => fadeAnimation(formProfile));
hideCreateProfile.addEventListener("click", () => fadeAnimation(formProfile));
editProfile.addEventListener("click", function () {
  formProfile.firstElementChild.firstElementChild.textContent = "Edit profile:";
  fadeAnimation(formProfile);
  fadeAnimation(navMenu);
});
removeProfile.addEventListener("click", function () {
  const remove = confirm("Are you sure you want to remove profile?");
  if (remove) {
    localStorage.removeItem("profile");
    location.reload();
  }
});
greetings.addEventListener("click", () => fadeAnimation(navMenu));
