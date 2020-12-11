// Open login modal when open the page
$(document).ready(function () {
    $('#items-select').prop('disabled', true);
    $('#quantity').val(0)
    $('#quantity').prop('disabled', true);
    $('#change-quantity-button').prop('disabled', true);
    $('#delete-item-button').prop('disabled', true);

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
                var option = '<option value="' + element.id + '">' + element.id + ' - ' + element.username + '</option>'
                $('#users-select').append(option)
            });
            $('#users-select').on('change', function () {
                fetchItems($('#users-select').val())
            })
        },
        error: function () {
            logout2()
            $('#login-modal').modal('show')
        }
    });
}

function fetchItems(id) {
    if (id === '---') {
        $('#items-select').empty()
        var option = document.createElement('option')
        option.innerHTML = '---'
        $('#items-select').append(option)
        $('#items-select').prop('disabled', true);
        $('#quantity').val(0)
        $('#quantity').prop('disabled', true);
        $('#change-quantity-button').prop('disabled', true);
        $('#delete-item-button').prop('disabled', true);
        return
    }
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/api/v1/shopping-list/mod/' + id + '/',
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            $('#items-select').empty()
            var option = document.createElement('option')
            option.innerHTML = '---'
            $('#items-select').append(option)
            $('#quantity').val(0)
            $('#quantity').prop('disabled', true);
            $('#change-quantity-button').prop('disabled', true);
            $('#delete-item-button').prop('disabled', true);
            response.forEach(element => {
                var option = '<option value="' + element.id + '">' + element.id + ' - ' + element.name + '</option>'
                $('#items-select').append(option)
            });
            $('#items-select').prop('disabled', false);
            $('#items-select').on('change', function () {
                var id = $('#items-select').val()
                var quantity = 0
                response.forEach(element => {
                    if (parseInt(element.id) === parseInt(id)) {
                        quantity = element.quantity
                    }
                })
                fetchQuantity(id, quantity)
            })
        },
        error: function () {
            alert('Error fetching items')
        }
    });
}

function fetchQuantity(id, quantity) {
    if (id === '---') {
        $('#quantity').val(0)
        $('#quantity').prop('disabled', true);
        $('#change-quantity-button').prop('disabled', true);
        $('#delete-item-button').prop('disabled', true);
        return
    }
    $('#quantity').prop('disabled', false);
    $('#quantity').val(quantity);
    $('#change-quantity-button').prop('disabled', false);
    $('#delete-item-button').prop('disabled', false);
}

function changeQuantity() {
    var id = $('#items-select').val()
    var quantity = $('#quantity').val()
    if (quantity < 1 || quantity > 5) {
        alert('The quantity should be between 1 and 5')
        return
    }
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:8000/api/v1/shopping-list/mod/edit/' + id + '/',
        headers: {
            'X-CSRFToken': cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken'))
                .split('=')[1]
        },
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            quantity: quantity
        }),
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            alert('The quantity has been changed successfully!')
            location.reload()
        },
        error: function () {
            alert('There was an error carrying out the request')
            location.reload()
        }
    });
}

function deleteItem() {
    var id = $('#items-select').val()
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8000/api/v1/shopping-list/mod/edit/' + id + '/',
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
            alert('The item has been deleted successfully!')
            location.reload()
        },
        error: function () {
            alert('There was an error carrying out the request')
            location.reload()
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
            location.reload()
        },
        error: function () {
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
            location.reload()
        },
        error: function () {
            alert('Error logging out')
        }
    });
}

function logout2() {
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
        },
        error: function () {
            alert('Error logging out')
        }
    });
}