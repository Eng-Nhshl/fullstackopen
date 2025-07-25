const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const usernameValidation = /^[a-zA-Z0-9_.-]+$/

module.exports = { passwordValidation, usernameValidation }