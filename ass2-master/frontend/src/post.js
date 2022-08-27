import { update_job, update_profile, post_job } from "./fetch.js"
import { check_input, fileToDataUrl, popup_message, change_user_img } from "./helpers.js"

/* post new job */
export function post_new_job() {
    let connection = localStorage.getItem('connection')
    let new_job_form = document.getElementById('new-job')
    if (new_job_form.job_title.value.length > 0 && new_job_form.job_img.files.length > 0 && new_job_form.job_start.value.length > 0 && new_job_form.job_description.value.length > 0) {
        if (connection === 'true') {
            let new_job_title = new_job_form.job_title.value
            let new_job_content = fileToDataUrl(new_job_form.job_img.files[0])
            let new_job_start = new Date(new_job_form.job_start.value)
            let new_job_start_iso = new_job_start.toISOString()
            let new_job_description = new_job_form.job_description.value
            new_job_content.then(content => {
                let job_posted = post_job(new_job_title, content, new_job_start_iso, new_job_description)
                job_posted.then(data => {
                    if (data.status === 200) {
                        new_job_form.reset()
                        const message = "Your job is posted successfully"
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
            })
        }
        else {
            let title = 'Error'
            let message = 'Currently no access to the internet, please check your connection'
            popup_message(title, message)
            $('#popup').modal('show')
        }

    }
    else {
        check_input(new_job_form,'job-title','input','border')
        check_job_content(new_job_form)
        check_input(new_job_form,'job-start','input','border')
        check_input(new_job_form,'job-description','textarea','border')
    }
}


export function check_job_content(form) {
    let job_content = form.getElementsByClassName('job-img')[0]
    let job_content_error = job_content.getElementsByClassName('notice')[0]
    if (form.job_img.files.length === 0) {
        form.job_img.style.cssText = "border: 1px solid red"
        job_content_error.style.cssText = "display: inline-block"
    }
    else {
        form.job_img.style.cssText = "border: 1px solid #cfd8dc;"
        job_content_error.style.cssText = "display: none;"
    }
}

/* update job post */
export function submit_job_update(job_content, update_job_form) {
    let connection = localStorage.getItem('connection')
    if (connection === 'true') {
        let job_updated = update_job(job_content)
        job_updated.then(data => {
            if (data.status === 200) {
                /* update the 'last update' attribute, to detect if user makes further updates */
                if (job_content.hasOwnProperty('title')) {
                    update_job_form.job_title.setAttribute('last_update', job_content['title'])
                }

                if (job_content.hasOwnProperty('description')) {
                    update_job_form.job_description.setAttribute('last_update', job_content['description'])
                }

                const message = "Your update has been made successfully"
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

}

/* update personal profile */
export function update_my_profile() {
    let update_profile_form = document.getElementById('update-personal')
    var new_profile = {}
    if (update_profile_form.email.value !== update_profile_form.email.getAttribute('last_update')) {
        new_profile['email'] = update_profile_form.email.value
    }

    if (update_profile_form.username.value !== update_profile_form.username.getAttribute('last_update')) {
        new_profile['name'] = update_profile_form.username.value
    }

    if (update_profile_form.password.value !== update_profile_form.password.getAttribute('last_update')) {
        new_profile['password'] = update_profile_form.password.value
    }

    if (update_profile_form.img.files.length > 0) {
        fileToDataUrl(update_profile_form.img.files[0]).then(content => {
            new_profile['image'] = content
            submit_update_profile(new_profile, update_profile_form)
        })
    }

    else {
        submit_update_profile(new_profile, update_profile_form)
    }
}

export function submit_update_profile(new_profile, update_profile_form) {
    let connection = localStorage.getItem('connection')
    if (connection === 'true') {
        let updated_user = update_profile(new_profile)
        updated_user.then(data => {
            if (data.status === 200) {
                if (new_profile.hasOwnProperty('email')) {
                    update_profile_form.email.setAttribute('last_update', new_profile['email'])
                }
                if (new_profile.hasOwnProperty('name')) {
                    update_profile_form.username.setAttribute('last_update', new_profile['name'])
                }

                if (new_profile.hasOwnProperty('image')) {
                    change_user_img(new_profile['image'], 'profile-img')

                }
                if (new_profile.hasOwnProperty('password')) {
                    update_profile_form.password.setAttribute('last_update', new_profile['password'])
                    localStorage.setItem('password', new_profile['password'])
                }

                const message = "Your update has been made successfully"
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

}