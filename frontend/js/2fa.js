async function generate2FA() {

    try {

        const token =
        localStorage.getItem('token');

        const response = await fetch(

            'https://localhost:5000/api/auth/generate-2fa',

            {
                method: 'GET',

                headers: {

                    Authorization: token
                }
            }
        );

        const data =
        await response.json();

        document
        .getElementById('qr')
        .src = data.qr;

    } catch (err) {

        console.log(err);

        alert('2FA Error');
    }
}



async function verify2FA() {

    try {

        const token =
        localStorage.getItem('token');

        const otp =
        document.getElementById('otp').value;

        const response = await fetch(

            'https://localhost:5000/api/auth/verify-2fa',

            {
                method: 'POST',

                headers: {

                    'Content-Type':
                    'application/json',

                    Authorization:
                    token
                },

                body: JSON.stringify({

                    token: otp
                })
            }
        );

        const data =
        await response.json();

        alert(data.message);

    } catch (err) {

        console.log(err);

        alert('Verification Error');
    }
}