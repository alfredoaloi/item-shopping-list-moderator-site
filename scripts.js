// Open login modal when open the page
$(document).ready(function () {
    console.log(document.cookie)
    fetchUsers()
});

function fetchUsers() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/api/v1/users/',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            response.forEach(element => {
                var option = document.createElement('option')
                option.innerHTML = element.id + ' - ' + element.username
                $('#users-select').append(option)
            });
        },
        error: function () {
            $('#login-modal').modal('show')
        }
    });
}

function login() {
    var username = $('#username').val()
    var password = $('#password').val()
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/v1/auth/login/',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            username: username,
            password: password
        }),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            $('#close-login-modal').click()
            fetchUsers()
        },
        error: function () {
            $('#invalid-credentials').html('Credentials are not valid!')
        }
    });
}

function logout() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/v1/auth/logout/',
        headers: {
            'X-CSRFToken': cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                .split('=')[1]
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            $('#users-select').empty()
            var option = document.createElement('option')
            option.innerHTML = '---'
            $('#users-select').append(option)
            $('#login-modal').modal('show')
        },
        error: function () {
            console.log('error logouting')
        }
    });
}