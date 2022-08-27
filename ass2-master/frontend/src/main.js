import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, check_input, swap_page, popup_message } from './helpers.js';
import { sign_up, swap_to_sign_in_or_up, login } from './login.js'
import { load_main_page } from './load.js'
import { view_someone_profile } from './feed.js'
import { post_new_job, check_job_content, update_my_profile } from './post.js'
import { watch_user } from './fetch.js'
import { load_job_feed } from './load.js'
import { change_id_token } from './login.js';

/*infinity scroll var*/
var infinite_scroll = 'on'

export function change_scroll (on_off) {
    infinite_scroll = on_off
}

/* url fragment*/
export function url_fragment(connection) {
    var url_routing = window.location.hash.substring(1);
    var arg = url_routing.split('=')
    if (arg[0] === 'feed' || arg[0] === 'profile') {
        change_id_token(localStorage.getItem('id'), localStorage.getItem('token'))
        load_main_page(connection)
        start = 5
        if (arg[0] === 'profile') {
            view_someone_profile(arg[1], false, connection)
        }
    }
}

fetch('http://localhost:5005', {
    method: 'Get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})
    .then(data => {
        url_fragment(true)
    })
    .catch(error => {
        url_fragment(false)
    })

/* sign up form */
let sign_up_form = document.getElementById('sign-up-form')
/* login form */
let login_form = document.getElementById('login-form')

/* sign up process*/
/* check if input is filled */
sign_up_form.email.addEventListener('blur', check_input.bind(null, sign_up_form, 'email', 'input', 'border-bottom'))
sign_up_form.username.addEventListener('blur', check_input.bind(null, sign_up_form, 'username', 'input', 'border-bottom'))
sign_up_form.password.addEventListener('blur', check_input.bind(null, sign_up_form, 'password', 'input', 'border-bottom'))
sign_up_form.confirmpassword.addEventListener('blur', check_input.bind(null, sign_up_form, 'confirmpassword', 'input', 'border-bottom'))
/* sign up */
let sign_up_button = document.getElementById('sign-up-btn')
sign_up_button.addEventListener('click', sign_up.bind(null, sign_up_form))
/* swap to login page */
let swap_to_sign_in_button = document.getElementById("swap-to-sign-in-btn")
swap_to_sign_in_button.addEventListener('click', swap_to_sign_in_or_up.bind(null, sign_up_form, login_form))

/* login process*/
/* check if input is filled */
login_form.email.addEventListener('blur', check_input.bind(null, login_form, 'email', 'input', 'border-bottom'))
login_form.password.addEventListener('blur', check_input.bind(null, login_form, 'password', 'input', 'border-bottom'))
/* login */
let log_in_button = document.getElementById('login-btn')
log_in_button.addEventListener('click', login.bind(null, login_form))
/* swap to sign up page */
let swap_to_sign_up_button = document.getElementById("swap-to-sign-up-btn")
swap_to_sign_up_button.addEventListener('click', swap_to_sign_in_or_up.bind(null, login_form, sign_up_form))

/* swap to post job page */
let post_job = document.getElementById('post-job')
let swap_to_post_button = post_job.getElementsByTagName('button')[0]
swap_to_post_button.addEventListener('click', swap_page.bind(null, 'post-job-page'))

/* swap to home page (feed page) */
let home = document.getElementById('homepage')
home.addEventListener('click', swap_page.bind(null, 'main-page'))
home.addEventListener('click', function () {
    start = 5
    infinite_scroll = 'on'
})

/* swap to my profile */
let me = document.getElementById('personal-profile')
me.addEventListener('click', swap_page.bind(null, 'main-page'))
me.addEventListener('click', function () {
    infinite_scroll = 'off'
})

/* active post_job_button */
let post_job_button = document.getElementsByClassName('post')[0]
post_job_button.getElementsByTagName('button')[0].addEventListener('click', post_new_job)
/* check if all inputs are entered */
let new_job_form = document.getElementById('new-job')
new_job_form.job_title.addEventListener('blur', check_input.bind(null, new_job_form, 'job-title', 'input', 'border'))
new_job_form.job_img.addEventListener('blur', check_job_content.bind(null, new_job_form))
new_job_form.job_start.addEventListener('blur', check_input.bind(null, new_job_form, 'job-start', 'input', 'border'))
new_job_form.job_description.addEventListener('blur', check_input.bind(null, new_job_form, 'job-description', 'textarea', 'border'))

/* when user updates the img, the img can be seen immediately without submit */
let update_form = document.getElementById("update-personal")
update_form.img.addEventListener('change', function () {
    let show_icon = update_form.getElementsByClassName('upload_img')[0]
    fileToDataUrl(update_form.img.files[0]).then(content => {
        show_icon.style.cssText = "background-image: url(" + content + ")"
    })
})

/* active update_profile button */
let update_profile_button = update_form.getElementsByClassName('update')[0]
update_profile_button.getElementsByTagName('button')[0].addEventListener('click', update_my_profile)

/* active search bar */
let search_bar = document.getElementsByClassName('search_bar')[0]
let search_watch = search_bar.getElementsByTagName('input')[0]
let search_button = search_bar.getElementsByTagName('button')[0]
search_watch.addEventListener('input', function () {
    if (search_watch.value.length > 0) {
        search_button.className = 'on'
    }
    else {
        search_button.className = 'off'
    }
})
search_button.addEventListener('click', function () {
    let connection = localStorage.getItem('connection')
    if (connection === 'true') {
        let watch_email = search_watch.value
        let watch = watch_user(true, watch_email)
        watch.then(data => {
            if (data.status === 200) {
                search_watch.value = ""
                search_button.className = 'off'
                const personal_file = document.getElementById("personal-information")
                /* if we are already on that user's profile page, then 'refresh' the page to display the correct watch button*/
                if (personal_file.childElementCount > 0) {
                    let profile_email = personal_file.getElementsByClassName('profile_email')[0]
                    if (profile_email.textContent === watch_email) {
                        let profile_id = personal_file.getElementsByClassName('profile_id')[0]
                        view_someone_profile(profile_id.textContent.split(' ')[1], false, true)
                    }
                }
                const message = "Watch successfully"
                const title = 'Successful'
                popup_message(title, message)
                $('#popup').modal('show')
            }
            else {
                data.json().then(response => {
                    popup_message('Error', response.error)
                    $('#popup').modal('show')
                })
            }
        })
    }
    else {
        let title = 'Error'
        let message = 'Currently no access to the internet, please check your connection'
        popup_message(title, message)
        $('#popup').modal('show')
    }

})

/* infinite scroll */
const job_feed = document.getElementById("job-information")
var start = 5
job_feed.addEventListener('scroll', function () {
    if (infinite_scroll === 'on') {
        if (job_feed.scrollTop + job_feed.clientHeight >= job_feed.scrollHeight - 100) {
            if (localStorage.getItem('connection') === 'true') {
                load_job_feed(start, true)
            }
            else {
                load_job_feed(start, false)
            }
            start = start + 5
        }
    }
})









