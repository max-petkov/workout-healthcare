// Functions
const capitalizeWord = (word) =>
  word.split("")[0].toUpperCase() + word.slice(1).toLowerCase();

const fadeAnimation = function (element) {
  element.classList.toggle("fade-in-animation");
};

const inActiveElAnimation = function (el) {
  if (window.getComputedStyle(el).getPropertyValue("display") !== "none") {
    el.classList.add("el-inactive");
    if (window.innerWidth >= 768)
      setTimeout(() => el.classList.add("d-none"), 500);
    else setTimeout(() => el.classList.add("d-none-md"), 500);
  } else {
    el.classList.remove("el-inactive");
    if (window.innerWidth >= 768) el.classList.remove("d-none");
    else el.classList.remove("d-none-md");
  }
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

const keepProfileFormValues = function () {
  createProfile.querySelector('input[name="name"]').value = profileData.name;
  createProfile.querySelector('input[name="age"]').value = profileData.age;
  createProfile.querySelector('input[name="weight"]').value =
    profileData.weight;
  createProfile.querySelector('input[name="height"]').value =
    profileData.height;

  createProfile.querySelector(
    `[name="routine"][value="${profileData.routine}"]`
  ).checked = true;
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

const render1RMWithoutSave = function (exercise, weight) {
  oneRepMaxInfo.insertAdjacentHTML(
    "beforeend",
    `<li class="mb-1">
        <span><b>${capitalizeWord(exercise.value)}</b>: ${profile
      .calcOneRepMax(+weight.value)
      .toFixed(1)} kg</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-1 check-statistics toggle-slide mr-1 bi bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
      </svg>
      </li>`
  );
};

const renderCalcNoSaveResults = function (ulId, titleText, result) {
  if (!document.getElementById(ulId)) {
    const ul = document.createElement("ul");
    const title = document.createElement("h3");
    ul.setAttribute("id", ulId);
    ul.classList.add("mb-1rem");
    title.classList.add("mb-1", "text-underline");
    title.textContent = titleText;
    ul.appendChild(title);
    containerPersonalInfo.lastElementChild.appendChild(ul);

    ul.insertAdjacentHTML(
      "beforeend",
      `<li class="mb-1">
          ${result}
        </li>`
    );
    document.getElementById("resultLists").classList.remove("d-none");
  } else {
    document.getElementById(ulId).insertAdjacentHTML(
      "beforeend",
      `<li class="mb-1">
          ${result}
        </li>`
    );
  }
};

const renderGuestProfile = function () {
  document.getElementById("resultLists").classList.remove("d-none");
  const title = document.createElement("h2");
  title.classList.add("mb-1rem");
  title.setAttribute("id", "guestResults");
  title.textContent = "Make calculations and all results will be printed";
  document.getElementById("resultLists").prepend(title);
  loginOptions.classList.add("d-none");
  greetings.classList.remove("d-none");
  profileName.textContent = "Guest";
  navMenu.firstElementChild.firstElementChild.textContent = "Create profile";
  formProfile.firstElementChild.firstElementChild.textContent =
    "Create profile:";
  profileLogIn.classList.remove("d-none");
  calcContainer.classList.remove("d-none-md");
  profileInfo.remove();
};

function renderNutrion(foods) {
  const table = document.createElement("table");
  table.classList.add("mt-2rem");
  nutritionContainer.lastElementChild.appendChild(table);
  table.innerHTML = `
  <thead>
    <tr>
      <th>Name</th>
      <th>Size(g)</th>
      <th>Calories</th>
      <th>TotalFat</th>
      <th>SaturatedFat</th>
      <th>Cholesterol</th>
      <th>Carbohydrates</th>
      <th>Protein</th>
      <th>Sodium</th>
      <th>Fiber</th>
    </tr>
  </thead>
  <tbody></tbody>
  <tfoot></tfoot>
    `;

  const size = [];
  const kcal = [];
  const fatTot = [];
  const fatSat = [];
  const chol = [];
  const carbs = [];
  const prot = [];
  const sod = [];
  const fib = [];
  foods.forEach(function (obj) {
    // Rendering food
    table.lastElementChild.previousElementSibling.insertAdjacentHTML(
      "beforeend",
      `<tr>
    <td>${obj.name}</td>
    <td>${obj.serving_size_g}g</td>
    <td>${obj.calories}kcal</td>
    <td>${obj.fat_total_g}g</td>
    <td>${obj.fat_saturated_g}g</td>
    <td>${obj.cholesterol_mg}mg</td>
    <td>${obj.carbohydrates_total_g}g</td>
    <td>${obj.protein_g}g</td>
    <td>${obj.sodium_mg}mg</td>
    <td>${obj.fiber_g}g</td>
    </tr>`
    );
    size.push(obj.serving_size_g);
    kcal.push(obj.calories);
    fatTot.push(obj.fat_total_g);
    fatSat.push(obj.fat_saturated_g);
    chol.push(obj.cholesterol_mg);
    carbs.push(obj.carbohydrates_total_g);
    prot.push(obj.protein_g);
    sod.push(obj.sodium_mg);
    fib.push(obj.fiber_g);
  });

  // Render total
  table.lastElementChild.insertAdjacentHTML(
    "beforeend",
    `
  <tr>
    <th>Total:</th>
    <th>${size.reduce((accum, val) => accum + val, 0)}g</th>
    <th>${kcal.reduce((accum, val) => accum + val, 0).toFixed(1)}kcal</th>
    <th>${fatTot.reduce((accum, val) => accum + val, 0).toFixed(1)}g</th>
    <th>${fatSat.reduce((accum, val) => accum + val, 0).toFixed(1)}g</th>
    <th>${chol.reduce((accum, val) => accum + val, 0).toFixed(1)}mg</th>
    <th>${carbs.reduce((accum, val) => accum + val, 0).toFixed(1)}g</th>
    <th>${prot.reduce((accum, val) => accum + val, 0).toFixed(1)}g</th>
    <th>${sod.reduce((accum, val) => accum + val, 0).toFixed(1)}mg</th>
    <th>${fib.reduce((accum, val) => accum + val, 0).toFixed(1)}g</th>
  </tr>
  `
  );
}

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
    if (name.value.length >= 100) {
      renderErrorValid(name, "Name must be lower than 100 symbols!");
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

// Tippy
tippy.delegate("#oneRepMaxInfo", {
  target: "svg",
  content: "Check statistics",
  placement: "right",
});

tippy("#infoRM", {
  content:
    "Find the heaviest weight you can lift 4-6 times and calculate it. For example you can lift 5 times 60 kg put 60 into weight field and calc it.",
});

tippy("#infoBMI", {
  content:
    "BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to adult men and women.  Enter weight(kg) and height(cm) into the calculator.",
});

tippy("#infoBMR", {
  content:
    "BMR (Basal Metabolic Rate) is the number of calories required to keep your body functioning at rest. Enter weight(kg), height(cm) and age into the calculator.",
});

tippy("#infoWokoutRoutine", {
  content:
    "The Harris Benedict Equation is a formula that uses your BMR and then applies an activity factor to determine your total daily energy expenditure (calories).",
});

tippy("#infoNutrition", {
  content:
    "EXAMPLE SEARCHING: 100g potatoes and 200g tomato chicken etc... It'll display statistics for every food which is search + will calculate the total of kcal, protein, fat, etc... of the searched foods",
});
