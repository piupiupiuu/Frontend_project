/* load the pages */
import { clear_child, get_current_time, hide_element, swap_page, change_user_img, popup_message } from "./helpers.js"
import { get_job_feed, get_user } from "./fetch.js"
import { handle_job_information, view_someone_profile } from "./feed.js"
import {id} from './login.js'
import {change_scroll} from './main.js'

/* display main page */
export function load_main_page(connection) {
    /* display header*/
    display_header()
    
    if (connection === true) {
        /* display user's image*/
        let user = get_user(id)
        user.then(data => {
            if (data.status == 200) {
                data.json().then(response => {
                    let item_name = id + 'user'
                    localStorage.setItem(item_name, JSON.stringify(response))
                    if (response.hasOwnProperty('image')) {
                        let source_img = response.image
                        change_user_img(source_img, 'profile-img')
                    }
                })
            }
        })
    }

    else {
        let item_name = id + 'user'
        let response = JSON.parse(localStorage.getItem(item_name))
        if (response.hasOwnProperty('image')) {
            let source_img = response.image
            change_user_img(source_img, 'profile-img')
        }
    }


    /* switch to feed page*/
    swap_page('main-page')
    change_scroll('on')

    /* active 'me' button */
    let me = document.getElementById('personal-profile')
    me.addEventListener('click', view_someone_profile.bind(null, id, true,connection))

    /* active 'home' button */
    let home = document.getElementById('homepage')
    home.addEventListener('click', function () {
        feed_main_page(connection)
    })

    /* feed the page*/
    feed_main_page(connection)

    /* turn on push notification */
    if (connection === true) {
        push_notification()
    }
    
}

/* display header */
export function display_header() {
    let header = document.getElementsByTagName('header')[0]
    header.className = 'on'
    header.style.cssText = "background-color:#534e4e; opacity:0.8"
    let title = header.getElementsByTagName('h1')[0]
    title.style.cssText = "border:none;"
}

/* feed the main page */
export function feed_main_page(connection) {
    /* remove all existing info */
    const job_section = document.getElementById('job-information')
    clear_child(job_section)
    const personal_info = document.getElementById('job-information')
    clear_child(personal_info)

    /* hide the personal profile */
    hide_element('personal-information')
    
    load_job_feed(0, connection)
}

export function load_job_feed(start, connection) {
    if (connection === true) {
        let job_info = get_job_feed(start)
        job_info.then(data => {
            if (data.status === 200) {
                data.json().then(response => {
                    /* sort the job post */
                    response.sort(function (a, b) {
                        return b.createdAt < a.createdAt ? -1 : 1
                    })
                    let item_name = 'load_job_feed' + start
                    localStorage.setItem(item_name, JSON.stringify(response))

                    for (let i = 0; i < response.length; i++) {
                        handle_job_information(response[i],false,connection)
                    }
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
        let item_name = 'load_job_feed' + start
        let response = JSON.parse(localStorage.getItem(item_name))
        for (let i = 0; i < response.length; i++) {
            handle_job_information(response[i],false,connection)
        }
    }
}


export function push_notification() {
    let current_time = get_current_time()
    localStorage.setItem('push_current_time', current_time)
    setInterval(function () {
        let job_info = get_job_feed(0)
        job_info.then(data => {
            if (data.status === 200) {
                data.json().then(response => {
                    if (response[0].createdAt > localStorage.getItem('push_current_time')) {
                        let new_post_user = get_user(response[0].creatorId)
                        new_post_user.then(data => {
                            if (data.status === 200) {
                                data.json().then(response => {
                                    let message = response.name + ' posts a new job'
                                    alert(message)
                                })
                            }
                        })
                        localStorage.setItem('push_current_time',response[0].createdAt) 
                    }
                })
            }
        })
    }, 1000)
}