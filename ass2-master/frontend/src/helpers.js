/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export function change_user_img(img, img_id) {
    let img_div = document.getElementById(img_id)
    img_div.src = img
}

export function set_img(response,img_tag) {
    if (response.hasOwnProperty('image')) {
        img_tag.src = response.image
    }
    else {
        img_tag.src = "styles/img_210318.png"
    }
}

/* pop up message */
export function popup_message(title, message) {
    let pop_up = document.getElementById('popup')
    let pop_up_body = pop_up.getElementsByClassName('modal-body')[0]
    clear_child(pop_up_body)

    $('#popup').on('show.bs.modal', function () {
        var modal = $(this)
        modal.find('.modal-title').text(title)
    })
    let message_section = document.createElement('div')
    message_section.appendChild(document.createTextNode(message))
    pop_up_body.appendChild(message_section)
}

/* swap between pages */
export function swap_page(page_render) {
    let pages = document.getElementsByClassName('page')
    let page_want_to_render = document.getElementById(page_render)
    for (let i = 0; i < pages.length; i++) {
        pages[i].className = 'page off'
    }
    page_want_to_render.className = 'page on'
}


/* get current time */
export function get_current_time() {
    let current = new Date()
    let current_time = current.toISOString()
    return current_time
}

/* remove all the child nodes */
export function clear_child(parent) {
    const child_count = parent.childElementCount
    for (let i = 0; i < child_count; i++) {
        parent.removeChild(parent.lastChild)
    }
}

/* hide the element */
export function hide_element(element) {
    let element_to_hide = document.getElementById(element)
    element_to_hide.className = 'off'
}

/* check if all inputs are entered */
export function check_input(form, input_name,tagname,border) {
    let input_class = form.getElementsByClassName(input_name)[0]
    let input_error = input_class.getElementsByClassName('notice')[0]
    let input = input_class.getElementsByTagName(tagname)[0]

    if (input.value.length == 0) {
        input.style.cssText = border + ":1px solid red"
        input_error.style.cssText = "display:inline-block;"
    }

    else {
        input.style.cssText = border + ": 1px solid #cfd8dc;"
        input_error.style.cssText = "display:none;"
    }
}
