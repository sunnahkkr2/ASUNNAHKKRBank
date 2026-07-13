const API_URL = "http://localhost:5000/api";

const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
    location.href = "login.html";
}

async function lookupAccount() {

    const accountNumber =
        document.getElementById("receiverAccount").value.trim();

    if (accountNumber.length < 10) {
        document.getElementById("receiverName").innerText = "";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/user/lookup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                accountNumber
            })

        });

        const data = await response.json();

        if (!response.ok) {

            document.getElementById("receiverName").style.color = "red";
            document.getElementById("receiverName").innerText = data.message;

            return;

        }

        document.getElementById("receiverName").style.color = "#00A651";
        document.getElementById("receiverName").innerText = data.fullName;

    } catch (e) {

        document.getElementById("receiverName").style.color = "red";
        document.getElementById("receiverName").innerText =
            "Server connection failed";

    }

}

function transferMoney() {

    const receiverAccount =
        document.getElementById("receiverAccount").value.trim();

    const amount =
        document.getElementById("amount").value;

    const description =
        document.getElementById("description").value;

    const pin =
        document.getElementById("pin").value;

    const receiverName =
        document.getElementById("receiverName").innerText;

    if (!receiverAccount || !amount || !pin) {

        alert("Please fill all required fields.");

        return;

    }

    localStorage.setItem(
        "pendingTransfer",
        JSON.stringify({

            receiverAccount,
            receiverName,
            amount,
            description,
            pin

        })
    );

    location.href = "confirm-transfer.html";

}
