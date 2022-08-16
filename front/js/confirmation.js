
displayOrderId()

function displayOrderId() {
    const orderId = document.getElementById("orderId");
    orderId.innerText = localStorage.getItem("orderId");
  }

