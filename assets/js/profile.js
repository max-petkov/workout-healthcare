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
const showCalculators = document.getElementById("showCalculators");
const generateMeals = document.getElementById("generateMeals");
const mealsContainer = document.getElementById("mealsContainer");
const navMenu = document.getElementById("navMenu");
const introduction = document.getElementById("introduction");
const calcContainer = document.querySelector(".calculators");
const formOneRepMax = document.getElementById("oneRepMax");
const oneRepMaxInfo = document.getElementById("oneRepMaxInfo");
const formBMI = document.getElementById("bmi");
const formBMR = document.getElementById("bmr");
const formWorkoutRoutine = document.getElementById("formWorkoutRoutine");
const containerPersonalInfo = document.getElementById("personalInfoContainer");
const containerMeals = document.getElementById("mealsContainer");

// Profile Object
const profile = {
  personalInfo: {},
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

  validateName(name);
  validateAge(age);
  validateWeight(weight);
  validateHeight(height);
  validateWorkoutRoutine(workoutRoutine, radioBtnsContainer);

  if (
    validateName(name) &&
    validateAge(age) &&
    validateHeight(height) &&
    validateWeight(weight) &&
    validateWorkoutRoutine(workoutRoutine, radioBtnsContainer)
  ) {
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

    if (!profileData) {
      // Create profile
      const personalInfoJSON = JSON.stringify(profile.personalInfo);
      localStorage.setItem("profile", personalInfoJSON);
    } else {
      // Update profile
      const updateObj = Object.assign(profileData, profile.personalInfo);
      localStorage.setItem("profile", JSON.stringify(updateObj));
    }
    location.reload();
  }
});

// Render localStorage data
if (profileData) {
  renderProfile(profileData);

  createProfile.querySelector('input[name="name"]').value = profileData.name;
  createProfile.querySelector('input[name="age"]').value = profileData.age;
  createProfile.querySelector('input[name="weight"]').value =
    profileData.weight;
  createProfile.querySelector('input[name="height"]').value =
    profileData.height;

  createProfile.querySelector(
    `[name="routine"][value="${profileData.routine}"]`
  ).checked = true;

  loginOptions.classList.add("d-none");
  greetings.classList.remove("d-none");
  greetings.classList.add("d-flex");
  profileLogIn.classList.remove("d-none");
  profileLogIn.classList.add("d-flex");
}

if (profileData?.exercises) {
  renderOneRepMax();
}

// Navigation menu
showCreateProfile.addEventListener("click", function () {
  formProfile.parentElement.classList.toggle("d-none");
  setTimeout(function () {
    fadeAnimation(formProfile);
  }, 300);
});

hideCreateProfile.addEventListener("click", function () {
  fadeAnimation(formProfile);
  setTimeout(function () {
    formProfile.parentElement.classList.add("d-none");
  }, 300);
});

editProfile.addEventListener("click", function () {
  formProfile.firstElementChild.firstElementChild.textContent = "Edit profile:";
  formProfile.parentElement.classList.remove("d-none");
  navMenu.parentElement.classList.add("d-none");
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

showCalculators.addEventListener("click", function () {
  navMenu.parentElement.classList.toggle("d-none");
  fadeAnimation(navMenu);
  inActiveElAnimation(calcContainer);
});

generateMeals.addEventListener("click", function () {
  navMenu.parentElement.classList.toggle("d-none");
  fadeAnimation(navMenu);
  inActiveElAnimation(mealsContainer);
});

greetings.addEventListener("click", function () {
  navMenu.parentElement.classList.toggle("d-none");
  setTimeout(function () {
    fadeAnimation(navMenu);
  });
});

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

// One Rep Max Calculator
formOneRepMax.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validation
  const weight = this.querySelector('input[name="maxWeight"]');
  const exercise = this.querySelector('input[name="exerciseName"]');
  validateName(exercise);
  validateWeight(weight);

  // Result
  if (validateWeight(weight) && validateName(exercise)) {
    this.nextElementSibling.firstElementChild.textContent = `Result: ${profile
      .calcOneRepMax(+weight.value)
      .toFixed(1)} kg`;

    if (oneRepMaxInfo.children.length > 0) {
      render1RMWithoutSave(exercise, weight);
    } else {
      const title = document.createElement("h3");
      title.classList.add("mb-1", "text-underline");
      title.textContent = "One Rep Max";
      oneRepMaxInfo.appendChild(title);
      render1RMWithoutSave(exercise, weight);
    }
  }
  // Save into localstorage
  if (profileData && validateWeight(weight) && validateName(exercise)) {
    const saveData = this.nextElementSibling.lastElementChild;
    saveData.classList.remove("d-none");

    saveData.addEventListener("click", function (e) {
      e.stopImmediatePropagation();

      if (!profileData.hasOwnProperty("exercises")) {
        // Create exercises property with objs
        profileData.exercises = [];
        profileData.exercises.push({
          exercise: capitalizeWord(exercise.value),
          result: profile.calcOneRepMax(+weight.value).toFixed(1),
        });
        localStorage.setItem("profile", JSON.stringify(profileData));
      } else {
        const existingProperty = profileData.exercises.filter(
          (val) => val.exercise === capitalizeWord(exercise.value)
        );

        if (!existingProperty.length) {
          // Adding a new exercize
          profileData.exercises.push({
            exercise: capitalizeWord(exercise.value),
            result: profile.calcOneRepMax(+weight.value).toFixed(1),
          });
          localStorage.setItem("profile", JSON.stringify(profileData));
        } else {
          // Change value on existing exercise
          profileData.exercises.find((obj) => {
            if (obj.exercise === capitalizeWord(exercise.value)) {
              obj.result = profile.calcOneRepMax(+weight.value).toFixed(1);
              return true;
            }
          });
          localStorage.setItem("profile", JSON.stringify(profileData));
        }
      }
      location.reload();
    });
  }
});

formBMI.addEventListener("submit", function (e) {
  e.preventDefault();
  const weight = this.querySelector('input[name="weightBMICustom"]');
  const height = this.querySelector('input[name="heightBMICustom"]');
  validateWeight(weight);
  validateHeight(height);

  if (validateWeight(weight) && validateHeight(height)) {
    this.nextElementSibling.textContent = `Result: ${profile.calcBMI(
      +weight.value,
      +height.value
    )} (${profile.renderBMI(profile.calcBMI(+weight.value, +height.value))})`;

    renderCalcNoSaveResults(
      "bmiNoSave",
      "BMI",
      this.nextElementSibling.textContent
    );
  }
});

formBMR.addEventListener("submit", function (e) {
  e.preventDefault();
  const weight = this.querySelector('input[name="weightBMRCustom"]');
  const height = this.querySelector('input[name="heightBMRCustom"]');
  const age = this.querySelector('input[name="ageBMRCustom"]');

  validateAge(age);
  validateHeight(height);
  validateWeight(weight);

  if (validateAge(age) && validateHeight(height) && validateWeight(weight)) {
    this.nextElementSibling.textContent = `Result: ${profile
      .calcBodyNeeds(+weight.value, +height.value, +age.value)
      .toFixed(1)} kcal`;

    renderCalcNoSaveResults(
      "bmrNoSave",
      "BMR",
      formBMR.nextElementSibling.textContent
    );
  }
});

formWorkoutRoutine.addEventListener("submit", function (e) {
  e.preventDefault();
  const weight = this.querySelector('input[name="workoutCustomWeight"]');
  const height = this.querySelector('input[name="workoutCustomHeight"]');
  const age = this.querySelector('input[name="workoutCustomAge"]');
  const checkedRadioBtn = this.querySelector(
    'input[name="workoutRoutineDescription"]:checked'
  );
  const radioBtnsContainer = document.getElementById("routineWorkoutCustom");

  validateHeight(height);
  validateWeight(weight);
  validateAge(age);
  validateWorkoutRoutine(checkedRadioBtn, radioBtnsContainer);

  if (
    validateHeight(height) &&
    validateWeight(weight) &&
    validateAge(age) &&
    validateWorkoutRoutine(checkedRadioBtn, radioBtnsContainer)
  ) {
    this.nextElementSibling.textContent = `You need to consume atleast: ${profile
      .calcWorkoutRoutineCalories(
        profile.calcBodyNeeds(+weight.value, +height.value, +age.value),
        checkedRadioBtn.value
      )
      .toFixed(1)} kcal`;

    renderCalcNoSaveResults(
      "workoutRoutineNoSave",
      "Workout Routine",
      formWorkoutRoutine.nextElementSibling.textContent
    );
  }
});

// One Rep Max Statistics
oneRepMaxInfo.addEventListener("click", function (e) {
  const showStatistics = e.target.closest("svg");
  showStatistics?.classList.toggle("rotate-chevron");

  if (showStatistics?.classList.contains("rotate-chevron")) {
    const exerciseValue =
      +showStatistics.previousElementSibling.textContent.split(" ")[1];
    const table = document.createElement("table");
    table.classList.add("mt-1rem", "mb-1rem");
    showStatistics.closest("li").appendChild(table);
    table.innerHTML = `<thead>
      <tr">
      <th class="p-1">№</th>
      <th class="p-1">Perceteges %</th>
      <th>Weight(kg)</th>
      </tr>
      </thead>
      <tbody></tbody>
      `;

    let percent = 1;
    let result = [exerciseValue];
    // Getting values from 95% to 50% based on One Rep Max and render results
    for (let i = 0; i < 10; i++) {
      percent = percent - 0.05;
      let sum = percent * exerciseValue;
      result.push(+sum.toFixed(1));

      table.lastElementChild.insertAdjacentHTML(
        "beforeend",
        `<tr>
      <th class="p-1">${i + 1}.</th>
      <td class="p-1">${(percent.toFixed(2) * 100).toFixed(0)} %</td>
      <td>${sum.toFixed(2)} kg</td>
    </tr>
    `
      );
    }
  } else {
    if (showStatistics) {
      showStatistics.nextElementSibling.style.opacity = 0;
      setTimeout(function () {
        showStatistics.nextElementSibling.remove();
      }, 300);
    }
  }
});
