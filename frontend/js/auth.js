async function register() {

    try {

        const response = await fetch(
            'https://localhost:5000/api/auth/register',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

               body: JSON.stringify({

    name:
    document.getElementById('name').value,

    email:
    document.getElementById('email').value,

    password:
    document.getElementById('password').value,

    role:
    document.getElementById('role').value
})
            }
        );

        const data =
        await response.json();

        alert(data.message);

        if (data.role === 'admin') {

    window.location.href =
    'admin.html';

} else if (data.role === 'manager') {

    window.location.href =
    'manager.html';

} else {

    window.location.href =
    'dashboard.html';
}
    } catch (err) {

        console.log(err);

        alert('Register Error');
    }
}


async function login() {

    try {

        const response = await fetch(
            'https://localhost:5000/api/auth/login',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

    email:
    document.getElementById('email').value,

    password:
    document.getElementById('password').value,

    otp:
    document.getElementById('otp').value
})
            }
        );

        const data =
        await response.json();

        if (data.token) {

            localStorage.setItem(
                'token',
                data.token
            );

            alert('Login Success');

            window.location.href =
            'dashboard.html';

        } else {

            alert(data.message);
        }

    } catch (err) {

        console.log(err);

        alert('Login Error');
    }
}