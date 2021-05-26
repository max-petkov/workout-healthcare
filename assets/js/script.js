"use strict";

// Variables
const createProfile = document.querySelector("#personalInfo");
const editProfile = document.getElementById("editProfile");
const removeProfile = document.getElementById("removeProfile");
const showCreateProfile = document.getElementById("showCreateProfile");
const hideCreateProfile = document.querySelector(".bi-x");
const formProfile = document.getElementById("personalInfo");
const profileInfo = document.getElementById("profileInfo");
const profileName = document.getElementById("profileName");
const profileData = JSON.parse(localStorage.getItem("profile"));
const profileLogIn = document.getElementById("profile");
const loginOptions = document.getElementById("loginOptions");
const greetings = document.getElementById("greetings");
const navMenu = document.getElementById("navMenu");
const introduction = document.getElementById("introduction");
const calcContainer = document.querySelector(".calculators");
const formOneRepMax = document.getElementById("oneRepMax");
const formBMI = document.getElementById("bmi");
const formBMR = document.getElementById("bmr");
const formWorkoutRoutine = document.getElementById("workoutRoutine");
const containerPersonalInfo = document.getElementById("personalInfoContainer");
const containerMeals = document.getElementById("mealsContainer");

// Functions
const fadeAnimation = function (element) {
  element.classList.toggle("fade-in-animation");
};
const renderErrorValid = function (el, msg) {
  el.style.marginBottom = "0.4rem";
  if (el.type === "text") {
    el.style.border = "1px solid rgb(220, 53, 69)";
    el.style.boxShadow = "1px 1px 4px rgba(220, 53, 69, 0.5)";
  }
  el.nextElementSibling.style.marginBottom = "0.5rem";
  el.nextElementSibling.style.fontSize = "0.8rem";
  el.nextElementSibling.style.color = "rgb(220, 53, 69)";
  el.nextElementSibling.textContent = msg;
};
const renderSuccessValid = function (el, msg) {
  el.style.marginBottom = "0.4rem";
  if (el.type === "text") {
    el.style.border = "1px solid rgb(25, 135, 84)";
    el.style.boxShadow = "1px 1px 4px rgba(25, 135, 84, 0.5)";
  }
  el.nextElementSibling.style.marginBottom = "0.5rem";
  el.nextElementSibling.style.fontSize = "0.8rem";
  el.nextElementSibling.style.color = "rgb(25, 135, 84)";
  el.nextElementSibling.textContent = msg;
};
const renderProfile = function (obj) {
  const html = `
  <h3 class="mb-1">Personal information:</h3>
  <li class="mb-1"><b>Name:</b> ${obj?.name}</li>
  <li class="mb-1"><b>Age:</b> ${obj?.age}</li>
  <li class="mb-1"><b>Weight:</b> ${obj?.weight} kg</li>
  <li class="mb-1"><b>Height:</b> ${obj?.height} cm</li>
  <li class="mb-1"><b>BMI:</b> ${obj?.BMI.toFixed(1)} (${profile.renderBMI(
    obj?.BMI
  )})</li>
  <li class="mb-1"><b>BMR:</b> ${obj?.BMR.toFixed(1)} kcal</li>
  <li class="mb-1"><b>Workout routine:</b> ${obj?.workout}</li>
  <li class="mb-1"><b>Workout Calories:</b> ${obj?.workoutCalories.toFixed(
    1
  )} kcal</li>
  `;
  profileInfo.innerHTML = html;
  profileName.innerHTML = obj?.name;
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
    const oneRepMax = weight * 1.09703 + 14.2546;
    return oneRepMax;
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

// Creating Profile
createProfile.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate data
  const name = document.querySelector('input[name="name"]');
  const age = document.querySelector('input[name="age"]');
  const weight = document.querySelector('input[name="weight"]');
  const height = document.querySelector('input[name="height"]');
  const radioBtnsContainer = document.getElementById("routineWorkout");
  const workoutRoutine = document.querySelector(
    'input[name="routine"]:checked'
  );
  let valid = true;

  if (!name.value) {
    renderErrorValid(name, "Field can not be empty!");
    valid = false;
  } else {
    if (name.value.length >= 50) {
      renderErrorValid(name, "Name must be lower than 50 symbols!");
      valid = false;
    } else {
      renderSuccessValid(name, "OK!");
    }
  }

  if (!age.value) {
    renderErrorValid(age, "Field can not be empty!");
    valid = false;
  } else {
    if (Number.isInteger(+age.value)) {
      renderSuccessValid(age, "OK!");
    } else {
      renderErrorValid(age, "Field must contain integers!");
      valid = false;
    }
  }

  if (!weight.value) {
    renderErrorValid(weight, "Field can not be empty!");
    valid = false;
  } else {
    if (!weight.value.match(/^\d*\.?\d*$/g)) {
      renderErrorValid(weight, "Field must contain numbers!");
      valid = false;
    } else {
      renderSuccessValid(weight, "OK!");
    }
  }

  if (!height.value) {
    renderErrorValid(height, "Field can not be empty!");
    valid = false;
  } else {
    if (Number.isInteger(+height.value)) {
      renderSuccessValid(height, "OK!");
    } else {
      renderErrorValid(height, "Value must be in centimeters!");
      valid = false;
    }
  }

  if (!workoutRoutine) {
    renderErrorValid(radioBtnsContainer, "You need to select one option!");
    valid = false;
  } else {
    renderSuccessValid(radioBtnsContainer, "OK!");
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

    location.reload();
  }
});

// Render localStorage data
if (profileData) {
  renderProfile(profileData);
  loginOptions.classList.add("d-none");
  greetings.classList.remove("d-none");
  greetings.classList.add("d-flex");
  profileLogIn.classList.remove("d-none");
  profileLogIn.classList.add("d-flex");
}

// Navigation menu
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

// Accordation
calcContainer.addEventListener("click", function (e) {
  e.target
    .closest(".calculator-tab")
    ?.nextElementSibling.classList.toggle("calc-content--active");
  e.target
    .closest(".calculator-tab")
    ?.querySelector(".toggle-slide")
    .classList.toggle("rotate-chevron");
});

// 1 Rep Max Calculator
formOneRepMax.addEventListener("submit", function (e) {
  e.preventDefault();
  const weight = this.firstElementChild;
  let valid = true;
  // Validation
  if (!weight.value) {
    renderErrorValid(weight, "Field can not be empty!");
    valid = false;
  } else {
    if (!weight.value.match(/^\d*\.?\d*$/g)) {
      renderErrorValid(weight, "Field must contain numbers!");
      valid = false;
    } else {
      renderSuccessValid(weight, "OK!");
    }
  }

  // Result
  if (valid) {
    this.nextElementSibling.firstElementChild.textContent = `Result: ${profile
      .calcOneRepMax(+weight.value)
      .toFixed(1)} kg`;
  }
  // Save into localstorage
  if (profileData && valid) {
    const saveBtn = document.createElement("button");
    saveBtn.classList.add("btn", "ml-1");
    saveBtn.textContent = "Save to profile";
    this.nextElementSibling.appendChild(saveBtn);
  }
});

formBMI.addEventListener("submit", function (e) {
  e.preventDefault();
  this.nextElementSibling.textContent = "UNDER CONSTRUCTION!";
});
formBMR.addEventListener("submit", function (e) {
  e.preventDefault();
  this.nextElementSibling.textContent = "UNDER CONSTRUCTION!";
});
formWorkoutRoutine.addEventListener("submit", function (e) {
  e.preventDefault();
  this.nextElementSibling.textContent = "UNDER CONSTRUCTION!";
});
