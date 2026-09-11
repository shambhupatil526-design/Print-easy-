document.addEventListener("DOMContentLoaded", function () {

  let copies = 1;

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby3xq8_U_on5PosBmN8vPjBgO3p6869l-FHHya2akWlPXBWlDI-iB9fp80WLne5kX3D/exec";

  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");
  const copiesDisplay = document.getElementById("copies");
  const amountDisplay = document.getElementById("amount");

  function calculateAmount() {

    const printType =
      document.querySelector('input[name="printType"]:checked');

    if (!printType) return;

    let price = 3;

    if (printType.value === "bw") {

      const side =
        document.querySelector('input[name="side"]:checked');

      if (!side) return;

      price = side.value === "single" ? 3 : 5;

    } else {

      const side =
        document.querySelector('input[name="colorSide"]:checked');

      if (!side) return;

      price = side.value === "single" ? 5 : 10;
    }

    if (amountDisplay) {
      amountDisplay.textContent = copies * price;
    }
  }

  window.changeCopies = function (value) {

    copies += value;

    if (copies < 1) copies = 1;
    if (copies > 100) copies = 100;

    if (copiesDisplay) {
      copiesDisplay.textContent = copies;
    }

    calculateAmount();
  };

  /* FILE SELECT */

  if (fileInput) {

    fileInput.addEventListener("change", function () {

      if (this.files && this.files.length > 0) {

        const selectedFile = this.files[0];

        if (fileName) {
          fileName.textContent =
            "Selected: " + selectedFile.name;
        }

        console.log("File selected:", selectedFile.name);
      }
    });
  }

  /* PRINT TYPE */

  document
    .querySelectorAll('input[name="printType"]')
    .forEach(function (radio) {

      radio.addEventListener("change", calculateAmount);
    });

  document
    .querySelectorAll('input[name="side"], input[name="colorSide"]')
    .forEach(function (radio) {

      radio.addEventListener("change", calculateAmount);
    });

  /* INITIAL AMOUNT */

  calculateAmount();

  /* CREATE ORDER */

  window.createOrder = function () {

    const file =
      fileInput ? fileInput.files[0] : null;

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
      document.querySelector('input[name="printType"]:checked');

    let price;
    let typeName;

    if (printType.value === "bw") {

      const side =
        document.querySelector('input[name="side"]:checked');

      if (side.value === "single") {
        price = 3;
        typeName = "B&W Single Side";
      } else {
        price = 5;
        typeName = "B&W Double Side";
      }

    } else {

      const side =
        document.querySelector('input[name="colorSide"]:checked');

      if (side.value === "single") {
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

    const orderBox =
      document.getElementById("orderBox");

    orderBox.innerHTML = `
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
  };

  /* PAYMENT SCREEN */

  window.showPayment = function (total, orderId) {

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
  };

  /* UPI */

  window.startUPIPayment = function (total, orderId) {

    const upiId = "7498323617@ybl";
    const name = "Print Easy";
    const note = "Print Order " + orderId;

    /*
      Save order first.
      Then open UPI.
    */

    sendOrderToDrive("UPI", orderId)
      .finally(function () {

        const upiLink =
          "upi://pay" +
          "?pa=" + encodeURIComponent(upiId) +
          "&pn=" + encodeURIComponent(name) +
          "&am=" + encodeURIComponent(total) +
          "&cu=INR" +
          "&tn=" + encodeURIComponent(note);

        window.location.href = upiLink;
      });
  };

  /* SEND FILE + ORDER TO GOOGLE DRIVE + SHEET */

  function sendOrderToDrive(paymentMethod, orderId) {

    return new Promise(function (resolve, reject) {

      const file =
        fileInput ? fileInput.files[0] : null;

      if (!file) {
        alert("File not found.");
        reject("File not found");
        return;
      }

      const customerName =
        document.getElementById("customerName").value.trim();

      const mobileNumber =
        document.getElementById("mobileNumber").value.trim();

      const printType =
        document.querySelector('input[name="printType"]:checked');

      let price;
      let typeName;

      if (printType.value === "bw") {

        const side =
          document.querySelector('input[name="side"]:checked');

        if (side.value === "single") {
          price = 3;
          typeName = "B&W Single Side";
        } else {
          price = 5;
          typeName = "B&W Double Side";
        }

      } else {

        const side =
          document.querySelector('input[name="colorSide"]:checked');

        if (side.value === "single") {
          price = 5;
          typeName = "Color Single Side";
        } else {
          price = 10;
          typeName = "Color Double Side";
        }
      }

      const total = copies * price;

      const reader = new FileReader();

      reader.onload = function () {

        const base64Data =
          reader.result.split(",")[1];

        const data = {

          orderId: orderId,

          customerName: customerName,

          mobile: mobileNumber,

          fileName: file.name,

          fileType: file.type,

          fileData: base64Data,

          copies: copies,

          printType: typeName,

          rate: price,

          total: total,

          payment: paymentMethod
        };

        fetch(APPS_SCRIPT_URL, {

          method: "POST",

          body: JSON.stringify(data)

        })
        .then(function (response) {

          return response.text();

        })
        .then(function (result) {

          console.log("Server Response:", result);

          resolve(result);

        })
        .catch(function (error) {

          console.error("Upload Error:", error);

          reject(error);
        });
      };

      reader.onerror = function () {

        reject("Could not read file.");
      };

      reader.readAsDataURL(file);
    });
  }

  /* PAY AT SHOP */

  window.paymentDone = function (orderId) {

    document.getElementById("orderBox").innerHTML = `
      <div class="order-success">

        <h2>✅ Order Confirmed</h2>

        <p><b>Order ID:</b> ${orderId}</p>

        <p>Payment method: Pay at Shop</p>

        <p>Your print order has been received.</p>

        <p>📁 File is being sent to shop.</p>

        <p>🧾 Order details are being saved.</p>

        <button class="pay-button"
          onclick="location.reload()">

          🖨️ New Print Order

        </button>

      </div>
    `;

    sendOrderToDrive("Pay at Shop", orderId)
      .then(function () {

        console.log("Order successfully sent.");

      })
      .catch(function (error) {

        console.error("Order upload failed:", error);
      });
  };

});
