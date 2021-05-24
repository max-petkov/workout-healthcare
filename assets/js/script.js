"use strict";

const personalInfoForm = document.querySelector("#personalInfo");
const showCreateProfile = document.getElementById("showCreateProfile");
const hideCreateProfile = document.querySelector(".bi-x");
const formProfile = document.getElementById("personalInfo");
const profileInfo = document.getElementById("profileInfo");
const profileName = document.getElementById("profileName");
const greetings = document.getElementById("greetings");
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
};

// Event Listeners
personalInfoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {};
  const form = new FormData(this);
  form.forEach((value, key) => (data[key] = value));

  // Insert personal data into object
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

  // Insert data into HTML
  const html = `
  <h3>Personal information:</h3>
  <li>name: ${profile.personalInfo.name}</li>
  <li>age: ${profile.personalInfo.age}</li>
  <li>weight: ${profile.personalInfo.weight} kg</li>
  <li>height: ${profile.personalInfo.height} cm</li>
  <li>BMI: ${profile.personalInfo.BMI}</li>
  <li>BMR: ${profile.personalInfo.BMR} kcal</li>
  <li>Workout routine: ${profile.personalInfo.workout}</li>
  <li>Workout Calories: ${profile.personalInfo.workoutCalories} kcal</li>
  `;

  showCreateProfile.classList.add("d-none");
  formProfile.style.opacity = 0;
  formProfile.style.right = "-512px";
  profileInfo.innerHTML = html;
  profileName.innerHTML = profile.personalInfo.name;
  greetings.classList.remove("d-none");
  greetings.classList.add("d-flex");

  console.log(profile);
});

showCreateProfile.addEventListener("click", function () {
  formProfile.style.opacity = 1;
  formProfile.style.right = "29px";
});

hideCreateProfile.addEventListener("click", function () {
  formProfile.style.opacity = 0;
  formProfile.style.right = "-512px";
});
