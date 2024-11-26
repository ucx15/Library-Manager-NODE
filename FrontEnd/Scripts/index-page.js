document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form); // Capture form data
    const jsonData = Object.fromEntries(formData.entries()); // Convert to JSON

    fetch('http://localhost:5000/api/login',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(jsonData)
        })
        .then(resp => {
            if (! resp.ok) {
                throw new Error('Failed to login');
            }
            return resp.text();
        })
        .then(isLoggedIn => {
            isLoggedIn = parseInt(isLoggedIn);

            if (isLoggedIn) {
                window.location.href = "./interface.html";
            }
            else {
                console.log("Login Failed!!");
            }
        })
        .catch(error => {
            console.log(error);
        });
});
