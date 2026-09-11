let copies = 1;

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

document.querySelectorAll('input[name="printType"]').forEach(function (radio) {
  radio.addEventListener("change", calculateAmount);
});

document
  .querySelectorAll('input[name="side"], input[name="colorSide"]')
  .forEach(function (radio) {
    radio.addEventListener("change", calculateAmount);
  });

function createOrder() {
  const file = fileInput.files[0];

  const customerName =
    document.getElementById("customerName").value.trim();

  const mobileNumber =
    document.getElementById("mobileNumber").value.trim();

  if (!file) {
    alert("Please select a PDF or Photo first.");
    return;
  }

  if (!customerName) {
    alert("Please enter Customer Name.");
    return;
  }

  if (!/^[0-9]{10}$/.test(mobileNumber)) {
    alert("Please enter a valid 10-digit Mobile Number.");
    return;
  }

  const printType =
    document.querySelector('input[name="printType"]:checked').value;

  let price;
  let typeName;

  if (printType === "bw") {
    const side =
      document.querySelector('input[name="side"]:checked').value;

    if (side === "single") {
      price = 3;
      typeName = "B&W Single Side";
    } else {
      price = 5;
      typeName = "B&W Double Side";
    }
  } else {
    const side =
      document.querySelector('input[name="colorSide"]:checked').value;

    if (side === "single") {
      price = 5;
      typeName = "Color Single Side";
    } else {
      price = 10;
      typeName = "Color Double Side";
    }
  }

  const total = copies * price;

  const orderId =
    "PR" + Date.now().toString().slice(-6);

  document.getElementById("orderBox").innerHTML = `
    <div class="order-success">

      <h2>🧾 Order Summary</h2>

      <p><b>Order ID:</b> ${orderId}</p>
      <p><b>Customer:</b> ${customerName}</p>
      <p><b>Mobile:</b> ${mobileNumber}</p>
      <p><b>File:</b> ${file.name}</p>
      <p><b>Copies:</b> ${copies}</p>
      <p><b>Print:</b> ${typeName}</p>
      <p><b>Rate:</b> ₹${price}</p>

      <div class="amount-box">
        <span>Total Amount</span>
        <strong>₹${total}</strong>
      </div>

      <button class="pay-button"
        onclick="showPayment(${total}, '${orderId}')">

        💳 Pay Now

      </button>

    </div>
  `;
}

function showPayment(total, orderId) {
  document.getElementById("orderBox").innerHTML = `
    <div class="order-success">

      <h2>💳 Payment</h2>

      <p><b>Order ID:</b> ${orderId}</p>

      <div class="amount-box">
        <span>Total Payable</span>
        <strong>₹${total}</strong>
      </div>

      <p>Select Payment Method</p>

      <button class="pay-button"
        onclick="startUPIPayment(${total}, '${orderId}')">

        📱 Pay with UPI

      </button>

      <button class="pay-button"
        onclick="paymentDone('${orderId}')">

        💵 Pay at Shop

      </button>

    </div>
  `;
}

function startUPIPayment(total, orderId) {

  /*
    TEST UPI ID.
    पुढे इथे तुझी स्वतःची UPI ID टाकू.
  */

  const upiId = "7498323617@ybl";

  const name = "Print Easy";

  const note = "Print Order " + orderId;

  const upiLink =
    "upi://pay" +
    "?pa=" + encodeURIComponent(upiId) +
    "&pn=" + encodeURIComponent(name) +
    "&am=" + encodeURIComponent(total) +
    "&cu=INR" +
    "&tn=" + encodeURIComponent(note);

  window.location.href = upiLink;
}

  function paymentDone(orderId) {

  sendOrderToDrive("Pay at Shop", orderId);

  document.getElementById("orderBox").innerHTML = `
    <div class="order-success">

      <h2>✅ Order Confirmed</h2>

      <p><b>Order ID:</b> ${orderId}</p>

      <p>Payment successful.</p>

      <p>Your print order has been received.</p>

      <p>📁 File is being sent to shop.</p>

      <button class="pay-button"
        onclick="location.reload()">

        🖨️ New Print Order

      </button>

    </div>
  `;
  }
