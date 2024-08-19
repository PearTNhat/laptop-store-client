const calculatePercent = (price, priceDiscount) => {
  if (price === 0 || !price || priceDiscount === 0 || !priceDiscount) {
    return 0;
  }
  return Math.round(((price - priceDiscount) / price) * 100);
};
const formatNumber = (number) => {
  if (!number) {
    return 0;
  }
  return number.toLocaleString("de-DE");
};
const convertNumberToStar = (number) => {
  if (!number) {
    return [0, 0, 0, 0, 0];
  }
  number = Number(number);
  let stars = [];
  for (let i = 1; i <= number; i++) {
    stars.push(1);
  }
  if (number !== 0 && number % Math.floor(number) !== 0) {
    stars.push(0.5);
    number++;
  }
  for (let i = 5; i > number; i--) {
    stars.push(0);
  }
  return stars;
};
const getTimeHMS = (time) => {
  time = Number(time) / 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return { hours, minutes, seconds };
};
const validateForm = (payload, setInvalidField) => {
  let invalid = 0;
  setInvalidField([]);
  const formatPayload = Object.entries(payload);
  for (let arr of formatPayload) {
    switch (arr[0]) {
      case "firstName":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "firstName", mes: "First name is required" },
          ]);
          break;
        }
        break;
      case "lastName":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "lastName", mes: "Last name is required" },
          ]);
          break;
        }
        break;
      case "email":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "email", mes: "Email is required" },
          ]);
          break;
        }
        if (!arr[1].match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)) {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "email", mes: "Email invalid" },
          ]);
          break;
        }
        break;
      case "emailResetPassword":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "emailResetPassword", mes: "Email is required" },
          ]);
          break;
        }
        if (!arr[1].match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)) {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "emailResetPassword", mes: "Email invalid" },
          ]);
          break;
        }
        break;
      case "password":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "password", mes: "Password is required" },
          ]);
          break;
        }
        if (arr[1].length < 6) {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "password", mes: "Password must be at least 6 characters" },
          ]);
          break;
        }
        break;
      case "confirmPassword":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "confirmPassword", mes: "Confirm password is required" },
          ]);
          break;
        }
        if (arr[1] !== payload.password) {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            {
              name: "confirmPassword",
              mes: "The confirm password does not match the password",
            },
          ]);
          break;
        }
        break;
    }
  }
  return invalid;
};
export {
  calculatePercent,
  formatNumber,
  convertNumberToStar,
  getTimeHMS,
  validateForm,
};
