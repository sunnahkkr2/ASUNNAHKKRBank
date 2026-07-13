const API_URL = "http://localhost:5000/api";

const currentUser = JSON.parse(localStorage.getItem("user"));

async function lookupAccount() {
    const accountNumber = document.getElementById("receiverAccount").value.trim();

    if (!accountNumber) return;

    try {
        const response = await fetch(`${API_URL}/user/lookup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accountNumber })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("receiverName").innerText = data.message;
            return;
        }

        document.getElementById("receiverName").innerText =
            data.fullName;

    } catch (err) {
        alert("Server connection failed.");
    }
}

async function transferMoney() {

    const receiverAccount =
        document.getElementById("receiverAccount").value.trim();

    const amount =
        document.getElementById("amount").value;

    const description =
        document.getElementById("description").value;

    const pin =
        document.getElementById("pin").value;

    try {

        const response = await fetch(`${API_URL}/transaction/transfer`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                senderAccount: currentUser.accountNumber,

                receiverAccount,

                amount,

                description,

                pin

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Transfer Successful!");

        localStorage.setItem(
            "lastTransaction",
            JSON.stringify(data.transaction)
        );

        window.location.href = "receipt.html";

    } catch (err) {

        alert("Unable to connect to server.");

    }

}
