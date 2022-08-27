/* feed the page */

import { delete_job, get_user, post_comment, post_like, watch_user } from "./fetch.js"
import { clear_child, set_img, popup_message, swap_page,get_current_time,fileToDataUrl } from "./helpers.js"
import { submit_job_update } from './post.js'
import {id} from './login.js'
import { change_scroll } from "./main.js"

/* if edit == true, then the user can delete or edit the job info */
export function handle_job_information(information, edit, connection) {
    const job_feed = document.getElementById("job-information")

    /* create a div for each job */
    const single_job = document.createElement("div")
    single_job.className = 'single-job'

    /* creator's information: img name id email created_at */
    const creator_information = document.createElement("div")
    creator_information.className = "creator_information"
    single_job.appendChild(creator_information)

    /* store creator id，name and created at */
    const creator_name_id_time = document.createElement("div")
    creator_name_id_time.className = "creator_name_id_time"

    /* created time */
    const created_time = document.createElement("div")
    created_time.className = "created_time"
    update_created_time(information, created_time, connection)

    /* get creator name and image by id*/

    if (connection === true) {
        let creator = get_user(information.creatorId)
        creator.then(data => {
            if (data.status == 200) {
                data.json().then(response => {
                    let item_name = information.creatorId + 'user'
                    localStorage.setItem(item_name, JSON.stringify(response))
                    get_creator_info(response, information, creator_name_id_time, creator_information, created_time, connection)
                })
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
        let item_name = information.creatorId + 'user'
        let response = JSON.parse(localStorage.getItem(item_name))
        get_creator_info(response, information, creator_name_id_time, creator_information, created_time, connection)
    }


    /* job title */
    const job_title = document.createElement("div")
    job_title.className = "job_title"
    job_title.appendChild(document.createTextNode(information.title))
    single_job.appendChild(job_title)

    /* job starting date */
    const start_date_time = information.start.split('T')[0]
    const start_date = start_date_time.split('-')
    const job_start = document.createElement("div")
    job_start.className = "job_start"
    job_start.appendChild(document.createTextNode("Start at: " + start_date[2] + "/" + start_date[1] + "/" + start_date[0]))
    single_job.appendChild(job_start)

    /* job description */
    const job_description = document.createElement("div")
    job_description.className = "job_description"
    job_description.appendChild(document.createTextNode("Job description:"))
    job_description.appendChild(document.createElement('br'))
    job_description.appendChild(document.createTextNode(information.description))
    single_job.appendChild(job_description)

    /* job content */
    const job_img = document.createElement("img")
    job_img.src = information.image
    const job_content = document.createElement("div")
    job_content.className = "job_content"
    job_content.appendChild(job_img)
    single_job.append(job_content)

    job_feed.appendChild(single_job)

    /*number of likes and comments*/
    const likes_and_comments = document.createElement("div")
    likes_and_comments.className = "likes_and_comments"

    /* because we are live updating comment and like, so store them separately from the job info */
    if (connection === true) {
        var comment_like_info = information
        let item_name = information.id + 'job'
        localStorage.setItem(item_name, JSON.stringify(information))
    }
    else {
        let item_name = information.id + 'job'
        var comment_like_info = JSON.parse(localStorage.getItem(item_name))
    }

    /*num of likes*/
    const likes = document.createElement("div")
    likes.className = "likes"

    let number_of_likes = comment_like_info.likes.length
    let show_number_of_likes = document.createElement('div')
    show_number_of_likes.appendChild(document.createTextNode(number_of_likes + ' Likes'))
    likes.appendChild(show_number_of_likes)
    likes_and_comments.appendChild(likes)

    /*show likes list*/
    const show_likes = document.createElement('div')
    show_likes.className = "show_likes show_likes_and_comments"
    const show_likes_list = document.createElement('div')
    show_likes.appendChild(show_likes_list)
    update_likes_list(comment_like_info, show_likes_list, connection)
    var previous_like = []
    for (let i = 0; i < comment_like_info.likes.length; i++) {
        previous_like[i] = comment_like_info.likes[i].userId
    }

    /*num of comments */
    const comments = document.createElement("div")
    comments.className = "comments"
    let number_of_comments = comment_like_info.comments.length
    let show_number_of_comments = document.createElement('div')
    show_number_of_comments.appendChild(document.createTextNode(number_of_comments + ' Comments'))
    comments.appendChild(show_number_of_comments)
    likes_and_comments.appendChild(comments)

    single_job.appendChild(likes_and_comments)


    /*show comments list*/
    /* comments */
    const show_comments = document.createElement('div')
    show_comments.className = "show_comments"
    const show_comments_list = document.createElement('div')
    show_comments.appendChild(show_comments_list)
    update_comment_list(comment_like_info, show_comments_list, connection)
    var previous_comment = []
    for (let i = 0; i < comment_like_info.comments.length; i++) {
        previous_comment[i] = comment_like_info.comments[i].userId
    }

    /* live updates for created_time, likes and comments */
    if (connection === true) {
        setInterval(function () {
            /* because |{creator's job}| =< |{feed's job}| */
            let creator_user = get_user(information.creatorId)
            creator_user.then(data => {
                if (data.status === 200) {
                    data.json().then(response => {
                        for (let i = 0; i < response.jobs.length; i++) {
                            if (response.jobs[i].id === information.id) {
                                /* update created time */
                                clear_child(created_time)
                                update_created_time(information, created_time, connection)

                                /* update local storage */
                                var comment_like_info = response.jobs[i]
                                let item_name = response.jobs[i].id + 'job'
                                localStorage.setItem(item_name, JSON.stringify(response.jobs[i]))

                                /* update number of likes */
                                clear_child(likes)
                                let number_of_likes = comment_like_info.likes.length
                                let show_number_of_likes = document.createElement('div')
                                show_number_of_likes.appendChild(document.createTextNode(number_of_likes + ' Likes'))
                                likes.appendChild(show_number_of_likes)

                                /* update number of comments */
                                clear_child(comments)
                                let number_of_comments = comment_like_info.comments.length
                                let show_number_of_comments = document.createElement('div')
                                show_number_of_comments.appendChild(document.createTextNode(number_of_comments + ' Comments'))
                                comments.appendChild(show_number_of_comments)

                                /* update like list */
                                var current_like = []
                                let like_length = comment_like_info.likes.length

                                for (let j = 0; j < like_length; j++) {
                                    current_like[j] = comment_like_info.likes[j].userId
                                }

                                if ((current_like.length === previous_like.length && current_like.every((v, i) => v === previous_like[i])) === false) {
                                    let update_likes = document.createElement('div')
                                    update_likes_list(comment_like_info, update_likes, connection)
                                    show_likes.replaceChild(update_likes, show_likes.firstChild)
                                    previous_like = current_like
                                }

                                /* update comment list */
                                var current_comment = []
                                let comment_length = comment_like_info.comments.length

                                for (let j = 0; j < comment_length; j++) {
                                    current_comment[j] = comment_like_info.comments[j].userId
                                }

                                if ((current_comment.length === previous_comment.length && current_comment.every((v, i) => v === previous_comment[i])) === false) {
                                    let update_comments = document.createElement('div')
                                    update_comment_list(comment_like_info, update_comments, connection)
                                    show_comments.replaceChild(update_comments, show_comments.firstChild)
                                    previous_comment = current_comment
                                }
                            }
                        }
                    })
                }
            })
        }, 1000)
    }


    /*like and comment button*/
    const like_and_comment_button = document.createElement('div')
    like_and_comment_button.className = "like_and_comment_button"

    /*like button*/
    const like_button = document.createElement('button')
    like_button.className = 'like_button'
    like_button.type = 'button'
    like_button.appendChild(document.createTextNode('Like'))
    like_and_comment_button.appendChild(like_button)

    /*comment button*/
    const comment_button = document.createElement('button')
    comment_button.className = 'comment_button'
    comment_button.type = 'button'
    comment_button.appendChild(document.createTextNode('Comment'))
    like_and_comment_button.appendChild(comment_button)

    single_job.appendChild(like_and_comment_button)

    /*comment input*/
    const leave_comment = document.createElement('div')
    leave_comment.className = "leave_comment off"
    const comment_input = document.createElement('input')
    comment_input.className = "comment_input"
    comment_input.type = 'text'
    comment_input.placeholder = "Add a comment..."

    /*comment submit*/
    const comment_submit = document.createElement('button')
    comment_submit.className = "comment_submit off"
    comment_submit.type = 'button'
    comment_submit.appendChild(document.createTextNode('Post'))

    leave_comment.appendChild(comment_input)
    leave_comment.appendChild(comment_submit)
    single_job.appendChild(leave_comment)

    comment_button.addEventListener('click', function () {
        if (leave_comment.className === 'leave_comment on') {
            leave_comment.className = "leave_comment off"
            comment_button.style.backgroundColor = 'rgb(239,239,239) '
        }
        else {
            leave_comment.className = "leave_comment on"
            comment_button.style.backgroundColor = '#BCDFFA'
        }
    })

    /* if empty comment, hide the submit button */
    comment_input.addEventListener('input', function () {
        if (comment_input.value.length === 0) {
            comment_submit.className = 'comment_submit off'
        }
        else {
            comment_submit.className = 'comment_submit on'
        }
    })

    comment_submit.addEventListener('click', function () {
        if (connection === true) {
            const comment_body = {
                'id': information.id,
                'comment': comment_input.value
            }
            let comment_fetch = post_comment(comment_body)
            comment_fetch.then(data => {
                if (data.status === 200) {
                    comment_input.value = ''
                    comment_submit.className = 'comment_submit off'
                    const message = 'Your comment is successfully posted'
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

    /* display the right color for the like button*/
    like_button.style.cssText = 'background-color:rgb(239,239,239)'
    for (let i = 0; i < information.likes.length; i++) {
        if (information.likes[i].userId == localStorage.getItem('userId')) {
            like_button.style.cssText = 'background-color:#BCDFFA'
        }
    }

    like_button.addEventListener('click', function () {
        if (connection === true) {
            /* liked -> unlike */
            if (like_button.style.backgroundColor == 'rgb(188, 223, 250)') {
                var like_or_unlike = {
                    "id": information.id,
                    "turnon": false
                }
            }
            /* unlike -> like */
            else {
                var like_or_unlike = {
                    "id": information.id,
                    "turnon": true
                }
            }
            let like_fetch = post_like(like_or_unlike)
            like_fetch.then(data => {
                if (data.status === 200) {
                    if (like_button.style.backgroundColor == 'rgb(188, 223, 250)') {
                        like_button.style.cssText = 'background-color:rgb(239,239,239) '
                    }
                    /* unlike -> like */
                    else {
                        like_button.style.cssText = 'background-color:#BCDFFA'
                    }
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

    /*show likes and comments*/
    likes.addEventListener('click', function () {
        let pop_up = document.getElementById('popup')
        let pop_up_body = pop_up.getElementsByClassName('modal-body')[0]
        clear_child(pop_up_body)
        $('#popup').on('show.bs.modal', function () {
            var modal = $(this)
            modal.find('.modal-title').text('Likes')
        })
        pop_up_body.appendChild(show_likes)

        $('#popup').modal();
    })


    comments.addEventListener('click', function () {
        let pop_up = document.getElementById('popup')
        let pop_up_body = pop_up.getElementsByClassName('modal-body')[0]
        clear_child(pop_up_body)
        pop_up_body.appendChild(show_comments)
        $('#popup').on('show.bs.modal', function () {
            var modal = $(this)
            modal.find('.modal-title').text('Comments')
        })
        $('#popup').modal();

    })

    if (edit === true) {
        let edit_delete = document.createElement('div')
        edit_delete.className = "edit_delete"
        let edit_button = document.createElement("button")
        edit_button.className = 'edit_button'
        edit_button.title = "Update"
        let edit_icon = document.createElement('img')
        edit_icon.className = "edit_icon"
        edit_icon.src = "styles/post.png"
        edit_button.appendChild(edit_icon)
        edit_button.addEventListener('click', swap_page.bind(null, 'update-job-page'))
        edit_button.addEventListener('click', function () {
            let update_form = document.getElementById('update-job')
            update_form.job_title.value = information.title
            update_form.job_title.setAttribute("last_update", information.title)
            update_form.job_description.value = information.description
            update_form.job_description.setAttribute("last_update", information.description)
            let update_button = update_form.getElementsByTagName('button')[0]
            update_button.setAttribute("job_id", information.id)

            update_button.addEventListener('click', function () {
                if (connection === true) {
                    if (information.id === update_button.getAttribute('job_id')) {
                        var update_job_content = { "id": update_button.getAttribute('job_id') }
                        if (update_form.job_title.value !== update_form.job_title.getAttribute('last_update')) {
                            update_job_content['title'] = update_form.job_title.value
                        }

                        if (update_form.job_start.value.length > 0) {
                            let new_job_start = new Date(update_form.job_start.value)
                            let new_job_start_iso = new_job_start.toISOString()
                            update_job_content['start'] = new_job_start_iso
                        }

                        if (update_form.job_description.value !== update_form.job_description.getAttribute('last_update')) {
                            update_job_content['description'] = update_form.job_description.value
                        }

                        if (update_form.job_img.files.length > 0) {
                            fileToDataUrl(update_form.job_img.files[0]).then(content => {
                                update_job_content['image'] = content
                                submit_job_update(update_job_content, update_form)
                            })
                        }

                        else {
                            submit_job_update(update_job_content, update_form)
                        }
                    }
                }
                else {
                    let title = 'Error'
                    let message = 'Currently no access to the internet, please check your connection'
                    popup_message(title, message)
                    $('#popup').modal('show')
                }
            })
        })

        let delete_button = document.createElement("button")
        delete_button.className = 'delete_button'
        delete_button.title = "Delete"
        let delete_icon = document.createElement('img')
        delete_icon.className = "delete_icon"
        delete_icon.src = "styles/delete.png"
        delete_button.addEventListener('click', function () {
            if (connection === true) {
                let delete_fetch = delete_job(information.id)
                delete_fetch.then(data => {
                    if (data.status === 200) {
                        view_someone_profile(id, true, connection)
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
        delete_button.appendChild(delete_icon)
        edit_delete.appendChild(edit_button)
        edit_delete.appendChild(delete_button)
        single_job.appendChild(edit_delete)
    }
}

function get_creator_info(response, information, creator_name_id_time, creator_information, created_time, connection) {
    /* creator name */
    const creator_name = document.createElement("div")
    creator_name.className = 'creator_name name_button'
    creator_name.appendChild(document.createTextNode(response.name))
    creator_name.addEventListener('click', view_someone_profile.bind(null, information.creatorId, false, connection))

    /* creator email */
    const creator_email = document.createElement("div")
    creator_email.className = 'creator_email'
    creator_email.appendChild(document.createTextNode(response.email))
    creator_name_id_time.appendChild(creator_name)
    creator_name_id_time.appendChild(creator_email)
    creator_name_id_time.appendChild(created_time)

    const creator_img = document.createElement("img")
    set_img(response, creator_img)
    const creator_icon = document.createElement("div")
    creator_icon.className = "creator_img"
    creator_icon.appendChild(creator_img)
    creator_information.appendChild(creator_icon)

    creator_information.appendChild(creator_name_id_time)
}

function update_created_time(information, created_time, connection) {
    if (connection === true) {
        var current = new Date().getTime()
        let item_name = information.id + '_current_time'
        localStorage.setItem(item_name, current)
    }
    else {
        let item_name = information.id + '_current_time'
        var current = localStorage.getItem(item_name)
    }

    const show_created_time = document.createElement('div')
    let time_diff = (current - Date.parse(information.createdAt)) / 1000 / 60 / 60 / 24
    if (time_diff > 1) {
        const date_time = information.createdAt.split('T')[0]
        const date = date_time.split('-')
        show_created_time.appendChild(document.createTextNode("Post at: " + date[2] + "/" + date[1] + "/" + date[0]))
    }
    else {
        let hours = Math.floor((current - Date.parse(information.createdAt)) / 1000 / 60 / 60)
        let minutes = Math.floor(((current - Date.parse(information.createdAt)) / 1000 / 60 / 60 - hours) * 60)
        show_created_time.appendChild(document.createTextNode(hours + " hours " + minutes + " minutes ago"))
    }
    created_time.appendChild(show_created_time)
}

function update_comment_list(information, show_comments, connection) {
    for (let i = 0; i < information.comments.length; i++) {
        let single_comment = document.createElement('div')
        single_comment.className = "single_comment"
        show_comments.appendChild(single_comment)

        let commentor = document.createElement('div')
        commentor.className = 'commentor'
        single_comment.appendChild(commentor)

        let comment_text = document.createElement('div')
        comment_text.className = 'comment_text'
        comment_text.appendChild(document.createTextNode(information.comments[i].comment))
        single_comment.appendChild(comment_text)

        if (i < information.comments.length - 1) {
            let divider = document.createElement('div')
            divider.className = 'comment_divider'
            show_comments.appendChild(divider)
        }

        let comment_information = document.createElement('div')
        comment_information.className = 'comment_information'

        /* name */
        const comment_name = document.createElement('div')
        comment_name.className = 'comment_name name_button'
        comment_name.appendChild(document.createTextNode(information.comments[i].userName))
        comment_name.addEventListener('click', view_someone_profile.bind(null, information.comments[i].userId, false, connection))

        /* email */
        const comment_email = document.createElement('div')
        comment_email.className = 'comment_email'
        comment_email.appendChild(document.createTextNode(information.comments[i].userEmail))

        /* Id */
        const comment_id = document.createElement('div')
        comment_id.className = 'comment_id'
        comment_id.appendChild(document.createTextNode("ID " + information.comments[i].userId))

        comment_information.appendChild(comment_name)
        comment_information.appendChild(comment_email)
        comment_information.appendChild(comment_id)

        if (connection === true) {
            let comment_user = get_user(information.comments[i].userId)
            comment_user.then(data => {
                if (data.status === 200) {
                    data.json().then(response => {
                        let item_name = information.comments[i].userId + 'user'
                        localStorage.setItem(item_name, JSON.stringify(response))
                        set_comment_like_img(response, commentor, comment_information,'comment')
                    })
                }
            })
        }
        else {
            let item_name = information.comments[i].userId + 'user'
            let response = JSON.parse(localStorage.getItem(item_name))
            set_comment_like_img(response, commentor, comment_information,'comment')
        }
    }
}

function update_likes_list(information, show_likes, connection) {
    for (let i = 0; i < information.likes.length; i++) {
        let single_like = document.createElement('div')
        single_like.className = 'single_like'
        show_likes.appendChild(single_like)
        if (i < information.likes.length - 1) {
            let divider = document.createElement('div')
            divider.className = 'like_divider'
            show_likes.appendChild(divider)
        }

        let like_information = document.createElement('div')
        like_information.className = "like_information"

        /* name */
        const like_name = document.createElement('div')
        like_name.className = 'like_name name_button'
        like_name.appendChild(document.createTextNode(information.likes[i].userName))
        like_name.addEventListener('click', view_someone_profile.bind(null, information.likes[i].userId, false, connection))

        /* email */
        const like_email = document.createElement('div')
        like_email.className = 'like_email'
        like_email.appendChild(document.createTextNode(information.likes[i].userEmail))

        /* Id */
        const like_id = document.createElement('div')
        like_id.className = 'like_id'
        like_id.appendChild(document.createTextNode("ID " + information.likes[i].userId))

        like_information.appendChild(like_name)
        like_information.appendChild(like_email)
        like_information.appendChild(like_id)

        if (connection === true) {
            let like_user = get_user(information.likes[i].userId)
            like_user.then(data => {
                if (data.status === 200) {
                    data.json().then(response => {
                        let item_name = information.likes[i].userId + 'user'
                        localStorage.setItem(item_name, JSON.stringify(response))
                        set_comment_like_img(response, single_like, like_information,'like')
                    })
                }
            })
        }
        else {
            let item_name = information.likes[i].userId + 'user'
            let response = JSON.parse(localStorage.getItem(item_name))
            set_comment_like_img(response, single_like, like_information,'like')
        }
    }
}

function set_comment_like_img(response, section, info, comment_or_like) {
    const img = document.createElement("img")
    set_img(response, img)
    const icon = document.createElement("div")
    icon.className = comment_or_like + '_img'
    icon.appendChild(img)
    section.appendChild(icon)
    section.append(info)
}

function load_someone_profile(userid, edit, connection, response) {
    $('#popup').modal('hide')
    change_scroll('off')

    let job_information = response.jobs
    /* show the job posts */

    /* remove all the children first */
    const job_feed = document.getElementById("job-information")
    clear_child(job_feed)
    job_feed.scrollTop = 0

    /* sort the job post */
    job_information.sort(function (a, b) {
        return b.createdAt < a.createdAt ? -1 : 1
    })

    /* show the job post information */
    if (edit === true) {
        for (let i = 0; i < job_information.length; i++) {
            handle_job_information(job_information[i], true, connection)
        }
    }
    else {
        for (let i = 0; i < job_information.length; i++) {
            handle_job_information(job_information[i], false, connection)
        }
    }

    /* show the profile */
    /* remove all the children first */
    const personal_file = document.getElementById("personal-information")
    personal_file.className = 'on'
    clear_child(personal_file)

    /* show the profile information */
    /* show the profile img */
    const profile_img = document.createElement('img')
    const profile_icon = document.createElement('div')
    profile_icon.className = 'profile_img'
    set_img(response, profile_img)
    profile_icon.appendChild(profile_img)

    /* show the name */
    const profile_name = document.createElement('div')
    profile_name.className = 'profile_name'
    profile_name.appendChild(document.createTextNode(response.name))

    /* show the id */
    const profile_id = document.createElement('div')
    profile_id.className = 'profile_id'
    profile_id.appendChild(document.createTextNode('ID ' + response.id))

    /* show the email */
    const profile_email = document.createElement('div')
    profile_email.className = 'profile_email'
    profile_email.appendChild(document.createTextNode(response.email))

    /* show the profile_statistics */
    const profile_stat = document.createElement('div')
    profile_stat.className = 'profile_stat'

    const number_of_post = document.createElement('div')
    number_of_post.className = 'num_of_post'
    number_of_post.appendChild(document.createTextNode(response.jobs.length))
    number_of_post.appendChild(document.createElement('br'))
    number_of_post.appendChild(document.createTextNode('Posts'))
    profile_stat.appendChild(number_of_post)

    const number_of_followers = document.createElement('div')
    number_of_followers.className = 'num_of_followers'
    number_of_followers.appendChild(document.createTextNode(response.watcheeUserIds.length))
    number_of_followers.appendChild(document.createElement('br'))
    number_of_followers.appendChild(document.createTextNode('Watchees'))
    profile_stat.appendChild(number_of_followers)

    personal_file.appendChild(profile_icon)
    personal_file.appendChild(profile_name)
    personal_file.appendChild(profile_id)
    personal_file.appendChild(profile_email)
    personal_file.appendChild(profile_stat)

    /* follow */
    const watch_button = document.createElement('button')
    watch_button.className = 'watch_button'
    var watch_or_unwatch = document.createTextNode('Watch')
    var turnon = true
    for (let i = 0; i < response.watcheeUserIds.length; i++) {
        if (id == response.watcheeUserIds[i]) {
            watch_or_unwatch = document.createTextNode('Unwatch')
            turnon = false
        }
    }
    watch_button.appendChild(watch_or_unwatch)
    personal_file.appendChild(watch_button)
    watch_button.addEventListener('click', function () {
        if (connection === true) {
            let watch = watch_user(turnon, response.email)
            watch.then(data => {
                if (data.status === 200) {
                    /* upate time for push notification */
                    let current_time = get_current_time()
                    localStorage.setItem('push_current_time', current_time)
                    view_someone_profile(userid, edit, connection)
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

    /* update profile */
    if (edit === true) {
        let update_profile = document.createElement('button')
        update_profile.className = 'update_profile'
        update_profile.title = "Update"
        let update_icon = document.createElement('img')
        update_icon.className = 'update_icon'
        update_icon.src = "styles/post.png"
        update_profile.appendChild(update_icon)
        personal_file.appendChild(update_profile)
        update_profile.addEventListener('click', swap_page.bind(null, 'update-personal-page'))
        update_profile.addEventListener('click', function () {
            let update_form = document.getElementById("update-personal")
            update_form.email.value = response.email
            update_form.email.setAttribute("last_update", response.email)
            update_form.username.value = response.name
            update_form.username.setAttribute("last_update", response.name)
            update_form.password.value = localStorage.getItem('password')
            update_form.password.setAttribute("last_update", localStorage.getItem('password'))
            let show_icon = update_form.getElementsByClassName('upload_img')[0]
            if (response.hasOwnProperty('image')) {
                show_icon.style.cssText = "background-image: url(" + response.image + ")"
            }
            else {
                show_icon.style.cssText = "background-image: url(" + "styles/img_210318.png" + ")"
            }
        })
    }

    /* show watchee list */
    const show_watchee = document.createElement('div')

    show_watchee.className = 'show_watchee'
    for (let i = 0; i < response.watcheeUserIds.length; i++) {
        let single_watchee = document.createElement('div')
        single_watchee.className = 'single_watchee'
        show_watchee.appendChild(single_watchee)
        if (i < response.watcheeUserIds.length - 1) {
            let divider = document.createElement('div')
            divider.className = 'watchee_divider'
            show_watchee.appendChild(divider)
        }

        let watchee_information = document.createElement('div')
        watchee_information.className = "watchee_information"

        /* show img, name, id, email */
        if (connection === true) {
            let watchee = get_user(response.watcheeUserIds[i])
            watchee.then(data => {
                if (data.status === 200) {
                    data.json().then(res => {
                        let item_name = response.watcheeUserIds[i] + 'user'
                        localStorage.setItem(item_name, JSON.stringify(res))
                        display_watchee(res, single_watchee, watchee_information, connection)
                    })
                }
            })
        }
        else {
            let item_name = response.watcheeUserIds[i] + 'user'
            let res = JSON.parse(localStorage.getItem(item_name))
            display_watchee(res, single_watchee, watchee_information, connection)
        }
    }

    number_of_followers.addEventListener('click', function () {
        let pop_up = document.getElementById('popup')
        let pop_up_body = pop_up.getElementsByClassName('modal-body')[0]
        clear_child(pop_up_body)
        pop_up_body.appendChild(show_watchee)
        $('#popup').on('show.bs.modal', function () {
            var modal = $(this)
            modal.find('.modal-title').text('Watchees')
        })
        $('#popup').modal();
    })

}

function display_watchee(response, single_watchee, watchee_information, connection) {
    const watchee_img = document.createElement('img')
    set_img(response, watchee_img)
    /* img */
    const watchee_icon = document.createElement("div")
    watchee_icon.className = "watchee_img"
    watchee_icon.appendChild(watchee_img)
    single_watchee.appendChild(watchee_icon)

    /* name */
    const watchee_name = document.createElement('div')
    watchee_name.className = "watchee_name name_button"
    watchee_name.appendChild(document.createTextNode(response.name))
    watchee_information.appendChild(watchee_name)
    watchee_name.addEventListener('click', view_someone_profile.bind(null, response.id, false, connection))

    /* watchee email */
    const watchee_email = document.createElement('div')
    watchee_email.className = 'watchee_email'
    watchee_email.appendChild(document.createTextNode(response.email))
    watchee_information.appendChild(watchee_email)

    /* watchee id */
    const watchee_id = document.createElement('div')
    watchee_id.className = 'watchee_id'
    watchee_id.appendChild(document.createTextNode('ID ' + response.id))
    watchee_information.appendChild(watchee_id)

    single_watchee.appendChild(watchee_information)
}

/* if true, then user can update the information */
export function view_someone_profile(userid, edit, connection) {
    if (connection === true) {
        let personal_user = get_user(userid)
        personal_user.then(data => {
            if (data.status === 200) {
                data.json().then(response => {
                    let item_name = userid + 'user'
                    localStorage.setItem(item_name, JSON.stringify(response))
                    load_someone_profile(userid, edit, connection, response)
                })
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
        let item_name = userid + 'user'
        let response = JSON.parse(localStorage.getItem(item_name))
        load_someone_profile(userid, edit, connection, response)
    }
}
