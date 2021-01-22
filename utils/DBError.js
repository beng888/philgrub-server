//* Handle Errors
export const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = {};

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000 && err.keyValue.hasOwnProperty("email")) {
    errors.email = "that email is already registered";
    return errors;
  }
  // duplicate username error
  if (err.code === 11000 && err.keyValue.hasOwnProperty("location")) {
    errors.location = "that location is already registered";
    return errors;
  }

  if (err.code === 11000 && err.keyValue.hasOwnProperty("postal")) {
    errors.postal = "that postal is already registered";
    return errors;
  }

  if (
    err.message.includes("Validation failed:") ||
    err.message.includes("validation failed")
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties !== undefined) {
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
};
