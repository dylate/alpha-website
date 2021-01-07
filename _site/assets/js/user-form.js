function signup() {
    getForm().addEventListener("submit", submitForm);
}

/**
 * @param {Event} submission The form submission event
 */
function submitForm(submission) {
    submission.preventDefault();
    hideAlert(getAlert());
    createUser(getFormDataAsJson(getFormData(submission.target)));
}

/**
 * @param {{name: string, email: string}} userData The HTML form being submitted
 */
function createUser(userData) {
    fetch("/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.json())
    .then((jsonResponse) => {
        if (jsonResponse.success) {
            setSuccessAlert(getAlert(), "Stay tuned! We will let you know when you can view the case study!");
        } else {
            setDangerAlert(getAlert(), "Uh-oh! There was an issue signing you up. Please reload the page and try again.");
        }
    })
}

/**
 * @return {{name: string, email: string}} The form data as a JSON Object
 * @param {FormData} formData The the form data from the form in question
 */
function getFormDataAsJson(formData) {
    return {
        name: formData.get("name"),
        email: formData.get("email")
    };
}

/**
 * @return {FormData}
 * @param {EventTarget} form The form in question as received from the submit event
 */
function getFormData(form) {
    return new FormData(form);
}

/**
 * @param {HTMLElement} alert The HTML element of the alert in question
 * @param {string} message The message to be inside of the alert
 */
function setSuccessAlert(alert, message) {
    alert.classList.remove("alert-danger");
    setAlert(alert, "success", message);
}

/**
 * @param {HTMLElement} alert The HTML element of the alert in question
 * @param {string} message The message to be inside of the alert
 */
function setDangerAlert(alert, message) {
    alert.classList.remove("alert-success");
    setAlert(alert, "danger", message);
}

/**
 * @param {HTMLElement} alert The HTML element of the alert in question
 * @param {string} status The status of the alert: success or danger
 * @param {string} message The message to be inside of the alert
 */
function setAlert(alert, status, message) {
    alert.classList.add(`alert-${status}`);
    alert.innerText = message;
    showAlert(alert);
}

/**
 * 
 * @param {HTMLElement} alert The HTML element of the alert in question
 */
function showAlert(alert) {
    alert.style.display = "block";
}

/**
 * 
 * @param {HTMLElement} alert The HTML element of the alert in question
 */
function hideAlert(alert) {
    alert.style.display = "none";
}

/**
 * @return {HTMLElement} the html element of the form's alert
 */
function getAlert() {
    return document.querySelector("#userFormAlert");
}

/**
 * @return {HTMLElement} the html element of the form in quesiton
 */
function getForm() {
    return document.getElementById("userForm");
}

signup();