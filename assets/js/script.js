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

// Functions
const capitalizeWord = (word) =>
  word.split("")[0].toUpperCase() + word.slice(1).toLowerCase();
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
  <h3 class="mb-1 text-underline">Personal information:</h3>
  <li class="mb-1"><b>Name:</b> ${obj?.name}</li>
  <li class="mb-1"><b>Age:</b> ${obj?.age}</li>
  <li class="mb-1"><b>Weight:</b> ${obj?.weight} kg</li>
  <li class="mb-1"><b>Height:</b> ${obj?.height} cm</li>
  <li class="mb-1"><b>BMI:</b> ${obj?.BMI} (${profile.renderBMI(obj?.BMI)})</li>
  <li class="mb-1"><b>BMR:</b> ${obj?.BMR.toFixed(1)} kcal</li>
  <li class="mb-1"><b>Workout routine:</b> ${obj?.workout}</li>
  <li class="mb-1"><b>Workout Calories:</b> ${obj?.workoutCalories.toFixed(
    1
  )} kcal</li>
  `;
  profileInfo.innerHTML = html;
  profileName.innerHTML = obj?.name;
};

const renderOneRepMax = function () {
  const title = document.createElement("h3");
  title.classList.add("mb-1", "text-underline");
  title.textContent = "One Rep Max";
  oneRepMaxInfo.appendChild(title);

  profileData.exercises.forEach(function (val) {
    oneRepMaxInfo.insertAdjacentHTML(
      "beforeend",
      `<li class="mb-1">
        <span><b>${val.exercise}</b>: ${val.result} kg</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-1 check-statistics toggle-slide mr-1 bi bi-chevron-down" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
      </li>`
    );
  });
};

const validateAge = function (age) {
  if (!age.value) {
    renderErrorValid(age, "Field can not be empty!");
    return false;
  } else {
    if (Number.isInteger(+age.value)) {
      renderSuccessValid(age, "OK!");
      return true;
    } else {
      renderErrorValid(age, "Field must contain integers!");
      return false;
    }
  }
};
const validateWeight = function (weight) {
  if (!weight.value) {
    renderErrorValid(weight, "Field can not be empty!");
    return false;
  } else {
    if (!weight.value.match(/^\d*\.?\d*$/g)) {
      renderErrorValid(weight, "Field must contain numbers!");
      return false;
    } else {
      renderSuccessValid(weight, "OK!");
      return true;
    }
  }
};

const validateHeight = function (height) {
  if (!height.value) {
    renderErrorValid(height, "Field can not be empty!");
    return false;
  } else {
    if (Number.isInteger(+height.value)) {
      renderSuccessValid(height, "OK!");
      return true;
    } else {
      renderErrorValid(height, "Value must be in centimeters!");
      return false;
    }
  }
};

const validateName = function (name) {
  if (!name.value) {
    renderErrorValid(name, "Field can not be empty!");
    return false;
  } else {
    if (name.value.length >= 50) {
      renderErrorValid(name, "Name must be lower than 50 symbols!");
      return false;
    } else {
      renderSuccessValid(name, "OK!");
      return true;
    }
  }
};

const validateWorkoutRoutine = function (workoutRoutine, radioBtnsContainer) {
  if (!workoutRoutine) {
    renderErrorValid(radioBtnsContainer, "You need to select one option!");
    return false;
  } else {
    renderSuccessValid(radioBtnsContainer, "OK!");
    return true;
  }
};

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

if (profileData?.exercises) {
  renderOneRepMax();
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
showCalculators.addEventListener("click", function () {
  fadeAnimation(navMenu);
  calcContainer.classList.toggle("calculators-inactive");
  if (calcContainer.classList.contains("calculators-inactive")) {
    setTimeout(function () {
      calcContainer.classList.add("d-none");
    }, 500);
  } else {
    calcContainer.classList.remove("d-none");
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
  }
});

// One Rep Max Statistics
oneRepMaxInfo.addEventListener("click", function (e) {
  const showStatistics = e.target.closest("svg");
  showStatistics?.classList.toggle("rotate-chevron");

  if (showStatistics?.classList.contains("rotate-chevron")) {
    let exerciseValue =
      +showStatistics.previousElementSibling.textContent.split(" ")[1];
    let percent = 1;
    let result = [exerciseValue];

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
    showStatistics?.nextElementSibling.style.opacity = 0;
    setTimeout(function () {
      showStatistics.nextElementSibling.remove();
    }, 300);
  }
});
