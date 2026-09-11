let copies = 1;

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby3xq8_U_on5PosBmN8vPjBgO3p6869l-FHHya2akWlPXBWlDI-iB9fp80WLne5kX3D/exec";

const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const copiesDisplay = document.getElementById("copies");
const amountDisplay = document.getElementById("amount");

function changeCopies(value) {
  copies += value;

  if (copies < 1) copies = 1;
  if (copies > 100) copies = 100;

  copiesDisplay.textContent = copies;
  calculateAmount();
}

function calculateAmount() {
  const printType =
    document.querySelector('input[name="printType"]:checked').value;

  let price = 3;

  if (printType === "bw") {
    const side =
      document.querySelector('input[name="side"]:checked').value;

    price = side === "single" ? 3 : 5;
  } else {
    const side =
      document.querySelector('input[name="colorSide"]:checked').value;

    price = side === "single" ? 5 : 10;
  }

  amountDisplay.textContent = copies * price;
}

fileInput.addEventListener("change", function () {
  if (this.files.length > 0) {
    fileName.textContent = "Selected: " + this.files[0].name;
  }
});

document.querySelectorAll('input[name
