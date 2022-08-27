import {token} from './login.js'

/* get user */
export function get_user(id) {
    let url = 'http://localhost:5005/user?userId=' + id
    let user = fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
    return user
}

/* get job */
export function get_job_feed(start) {
    let url = 'http://localhost:5005/job/feed?start=' + start
    let job = fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
    return job
}

/* post comment */
export function post_comment(comment) {
    let comment_submit = fetch('http://localhost:5005/job/comment', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(comment)
    })
    return comment_submit
}

/* like or unlike */
export function post_like(like_or_unlike) {
    let like_submit = fetch("http://localhost:5005/job/like", {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(like_or_unlike)
    })
    return like_submit
}

/* watch or unwatch */
export function watch_user(turnon, email) {
    let body_text = {
        "email": email,
        "turnon": turnon
    }
    let watch = fetch('http://localhost:5005/user/watch', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(body_text)
    })
    return watch
    
}


/* delete job*/
export function delete_job(job_id) {
    let delete_body = {
        "id": job_id
    }
    let job_deleted = fetch('http://localhost:5005/job', {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(delete_body)
    })
    return job_deleted
}

/* post new job */
export function post_job(new_job_title, content, new_job_start_iso, new_job_description) {
    let new_job_information = {
        "title": new_job_title,
        "image": content,
        "start": new_job_start_iso,
        "description": new_job_description
    }
    let job_posted = fetch('http://localhost:5005/job', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(new_job_information)
    })
    return job_posted
}

/* update new job */
export function update_job(job_content) {
    let job_updated = fetch('http://localhost:5005/job', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(job_content)
    })
    return job_updated
}

/* update peronsal profile */
export function update_profile(new_profile) {
    let updated_user = fetch('http://localhost:5005/user', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(new_profile)
    })
    return updated_user
}
