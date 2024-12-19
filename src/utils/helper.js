import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";


const calculatePercent = (price, priceDiscount) => {
  if (price === 0 || !price || priceDiscount === 0 || !priceDiscount) {
    return 0;
  }
  return Math.round(((price - priceDiscount) / price) * 100);
};
const formatNumber = (number) => {
  let numberParse=Number(number);
  if (!numberParse || numberParse === 0) {
    return 0;
  }
  return numberParse.toLocaleString("de-DE");
};
const covertMoneyToNumber = (money) => {
  if (!money) return 0;
  const cleanedStr = money.replace(/\./g, ""); // Loại bỏ dấu chấm
  return Number(cleanedStr);
}
const convertNumberToStar = (number) => {
  if (!number) {
    return new Array(5).fill(React.createElement(FaRegStar));
  }
  number = Number(number);
  let stars = [];
  for (let i = 1; i <= number; i++) {
    stars.push(React.createElement(FaStar));
  }
  if (number !== 0 && number % Math.floor(number) !== 0) {
    stars.push(React.createElement(FaRegStarHalfStroke));
    number++;
  }
  for (let i = 5; i > number; i--) {
    stars.push(React.createElement(FaRegStar));
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
      case "brand":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "brand", mes: "Yêu cầu thương hiệu" },
          ]);
          break;
        }
        break;
        case "series":
          if (arr[1].trim() === "") {
            invalid++;
            setInvalidField((prev) => [
              ...prev,
              { name: "series", mes: "Yêu cầu dòng sản phẩm" },
            ]);
            break;
          }
          break;
      case "firstName":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "firstName", mes: "Yêu cầu họ" },
          ]);
          break;
        }
        break;
      case "description":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "description", mes: "Description  is required" },
          ]);
          break;
        }
        break;
      case "connectionPort":
        if (arr[1].trim() === "") {
          invalid++;
          setInvalidField((prev) => [
            ...prev,
            { name: "connectionPort", mes: "Connection port  is required" },
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
const toBase64 = file => new Promise((resolve, reject) => {
  if (!file) resolve('File empty');
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});
function capitalizeFirstCharacter(str) {
  if (!str) return str; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const convertObjToValueLabel = (obj) => {
  return Object.entries(obj).map(([key, value]) => {
    return { value: key, label: value };
  });
}
const getValueLabel = (obj) => {
  return obj.map(item => ({ value: item._id, label: item.title }));
}
export {
  calculatePercent,
  formatNumber,
  convertNumberToStar,
  getTimeHMS,
  validateForm,
  covertMoneyToNumber,
  toBase64,
  capitalizeFirstCharacter,
  convertObjToValueLabel,
  getValueLabel
};
