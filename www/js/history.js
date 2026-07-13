const API_URL = "http://localhost:5000/api";
const user = JSON.parse(localStorage.getItem("user"));

async function loadHistory() {

    try {

        const response = await fetch(
            `${API_URL}/transaction/history/${user.accountNumber}`
        );

        const data = await response.json();

        const history = document.getElementById("history");

        history.innerHTML = "";

        data.forEach(tx => {

            history.innerHTML += `
            <div class="card">
                <h3>₦${Number(tx.amount).toLocaleString()}</h3>
                <p>${tx.description}</p>
                <small>${new Date(tx.createdAt).toLocaleString()}</small>
            </div>
            `;

        });

    } catch (err) {

        alert("Unable to load history");

    }

}

