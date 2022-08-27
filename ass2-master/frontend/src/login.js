/* login and sign in */
import { load_main_page } from "./load.js"
import { check_input, popup_message } from "./helpers.js"

export var token
export var id

/* login */
export function login(form) {
    if (form.email.value.length > 0 && form.password.value.length > 0) {

        const login_information = {
            "email": form.email.value,
            "password": form.password.value
        }
        fetch('http://localhost:5005/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(login_information)
        })
            .then(data => {
                /* online mode */
                localStorage.clear()
                localStorage.setItem('connection', true)
                start_login(data, form.password.value, form.email.value)
            })
            .catch(error => {
                /* offline mode */
                localStorage.setItem('connection', false)
                if (form.email.value === localStorage.getItem('email') && form.password.value === localStorage.getItem('password')) {
                    change_id_token(localStorage.getItem('id'), localStorage.getItem('token'))
                    load_main_page(false)
                }
                else {
                    let message = 'Currently no access to the internet, please check your connection'
                    let title = 'Error'
                    popup_message(title, message)
                    $('#popup').modal('show')
                }
            })


    }

    else {
        check_input(form, 'email', 'input', 'border-bottom')
        check_input(form, 'password', 'input', 'border-bottom')
    }
}

/* sign up */
export function sign_up(form) {
    if (form.email.value.length > 0 && form.username.value.length > 0 && form.password.value.length > 0 && form.confirmpassword.value.length > 0) {
        if (form.password.value != form.confirmpassword.value) {
            const message = 'The passwords you entered do not match. Please try again.'
            const title = 'Error'
            popup_message(title, message);
            $('#popup').modal();
        }

        else {
            const sign_up_information = {
                "email": form.email.value,
                "password": form.password.value,
                "name": form.username.value
            }
            fetch('http://localhost:5005/auth/register', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sign_up_information)
            })
                .then(data => {
                    localStorage.clear()
                    localStorage.setItem('connection', true)
                    start_login(data, form.password.value, form.email.value)
                })
                .catch(error => {
                    /* offline mode */
                    let message = 'Currently no access to the internet, please check your connection'
                    let title = 'Error'
                    popup_message(title, message)
                    $('#popup').modal('show')
                })

        }


    }

    else {
        check_input(form, 'email', 'input', 'border-bottom')
        check_input(form, 'username', 'input', 'border-bottom')
        check_input(form, 'password', 'input', 'border-bottom')
        check_input(form, 'confirmpassword', 'input', 'border-bottom')
    }
}

export function change_id_token(new_id, new_token) {
    id = new_id
    token = new_token
}
export function start_login(data, password, email) {
    if (data.status === 200) {
        data.json().then(response => {
            token = response.token
            id = response.userId
            localStorage.setItem('token', token)
            localStorage.setItem('id', id)
            localStorage.setItem('email', email)
            localStorage.setItem('password', password)

            load_main_page(true)
        })
    }

    else {
        data.json().then(response => {
            popup_message('Error', response.error)
            $('#popup').modal('show')
        })
    }
}


/* swap between sign up page and login form */
export function swap_to_sign_in_or_up(form_hide, form_render) {
    form_hide.className = "off"
    form_render.className = "on"
}

