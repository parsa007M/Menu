/* 1- Store HTML Id into a variable */
const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

/* 2-  Search meal and fetch from API */

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty
  // trim() : The trim() method removes whitespace from both sides of a string.
  if (term.trim()) {
    // fetch the url
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      // then parsa json
      .then((res) => res.json())
      // then change html dynamicly
      .then((data) => {
        console.log(data);
        // Add meal title into result Head
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
        // If the result is null
        if (data.meals === null) {
          // Write the message "There are no search results. Try again!"
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          // else
          // get the meals values and map it
          mealsEl.innerHTML = data.meals
            .map(
              //show meal's image, info
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join(""); // The join() method returns the array as a string.
        }
      });
    // Clear search text
    search.value = "";
  } else {
    // else alert message
    alert("Please enter a search term");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener("submit", searchMeal);
/* random.addEventListener('click', getRandomMeal); */

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    // The find() method returns the value of the first element in an array
    if (item.classList) {
      return item.classList.contains("meal-info"); // The contains() method returns a Boolean value
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
