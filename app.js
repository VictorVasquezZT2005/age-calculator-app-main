const form = document.querySelector(".age-form");

const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

const yearsResult = document.querySelector(".years");
const monthsResult = document.querySelector(".months");
const daysResult = document.querySelector(".days");

const fields = document.querySelectorAll(".field");

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function showError(field, message) {
  field.classList.add("error");
  field.querySelector(".error-message").textContent = message;
}

function clearErrors() {
  fields.forEach(f => {
    f.classList.remove("error");
    f.querySelector(".error-message").textContent = "";
  });
}

function validateForm(day, month, year) {
  clearErrors();

  let valid = true;
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  // Required checks
  if (!day) {
    showError(fields[0], "This field is required");
    valid = false;
  }
  if (!month) {
    showError(fields[1], "This field is required");
    valid = false;
  }
  if (!year) {
    showError(fields[2], "This field is required");
    valid = false;
  }

  if (!valid) return false;

  if (month < 1 || month > 12) {
    showError(fields[1], "Must be a valid month");
    valid = false;
  }

  if (year > currentYear) {
    showError(fields[2], "Must be in the past");
    valid = false;
  }

  if (year < minYear) {
    showError(fields[2], `Year must be after ${minYear}`);
    valid = false;
  }

  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31, 30, 31, 30,
    31, 31, 30, 31, 30, 31
  ];

  if (day < 1 || day > daysInMonth[month - 1]) {
    showError(fields[0], "Must be a valid day");
    valid = false;
  }

  return valid;
}

function calculateAge(day, month, year) {
  const today = new Date();

  let currentDay = today.getDate();
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  let ageY = currentYear - year;
  let ageM = currentMonth - month;
  let ageD = currentDay - day;

  if (ageD < 0) {
    const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();
    ageD += prevMonthDays;
    ageM--;
  }

  if (ageM < 0) {
    ageM += 12;
    ageY--;
  }

  return { years: ageY, months: ageM, days: ageD };
}

function animateNumber(element, finalValue, duration = 800) {
  let start = 0;
  const increment = finalValue / (duration / 16);

  function update() {
    start += increment;

    if (start >= finalValue) {
      element.textContent = finalValue;
    } else {
      element.textContent = Math.floor(start);
      requestAnimationFrame(update);
    }
  }

  element.textContent = "0";
  requestAnimationFrame(update);
}

function updateResults(age) {
  if (!age) {
    yearsResult.textContent = "--";
    monthsResult.textContent = "--";
    daysResult.textContent = "--";
    return;
  }

  animateNumber(yearsResult, age.years);
  animateNumber(monthsResult, age.months);
  animateNumber(daysResult, age.days);
}

function formatTwoDigits(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");

    if (input === dayInput || input === monthInput) {
      if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);
      }
      if (input.value.length === 1) {
        input.value = "0" + input.value;
      }
    }

    if (input === yearInput) {
      if (input.value.length > 4) {
        input.value = input.value.slice(0, 4);
      }

      const currentYear = new Date().getFullYear();
      const minYear = currentYear - 100;

      if (input.value.length === 4 && parseInt(input.value) < minYear) {
        input.value = minYear.toString();
      }
    }
  });
}

formatTwoDigits(dayInput);
formatTwoDigits(monthInput);
formatTwoDigits(yearInput);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const day = parseInt(dayInput.value);
  const month = parseInt(monthInput.value);
  const year = parseInt(yearInput.value);

  if (!validateForm(day, month, year)) {
    updateResults(null);
    return;
  }

  const age = calculateAge(day, month, year);
  updateResults(age);
});
