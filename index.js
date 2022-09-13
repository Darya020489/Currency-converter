"use strict";

import { createEl } from "./create_elements.js";

let currencySigns = {
  RUB: "Russian Rubles",
  BYN: "Belarusian Rubles",
  EUR: "Euros",
  USD: "US Dollars",
  GBP: "British Pounds",
  BTC: "Bitcoins",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan Renminbi",
};
const currencyArr = ["RUB", "BYN", "EUR", "USD", "GBP", "BTC", "JPY", "CNY"];
//заполняет селекты########################################################
function fillSelect(select) {
  currencyArr.forEach((el) => {
    const option = createEl("option", "option", el);
    option.value = el;
    select.append(option);
  });
}

const blockConvert = createEl("section", "convert");
const titleConvert = createEl("h2", "convert-title", "Currency converter");
const wrapConvert = createEl("div", "convert-wrap");
const labelAmount = createEl("label", "label label__amount", "Amount");
labelAmount.setAttribute("for", "amount");
const amountInput = createEl("input", "amount-input");
amountInput.type = "text";
amountInput.placeholder = "Enter the amount";
amountInput.id = "amount";
labelAmount.append(amountInput);
const labelFrom = createEl("label", "label label__from", "From");
labelFrom.setAttribute("for", "from");
const selectFrom = createEl("select", "select select__from");
selectFrom.id = "from";
labelFrom.append(selectFrom);
fillSelect(selectFrom);
const changeCurrencyBtn = createEl("button", "change-currency__btn");
const labelTo = createEl("label", "label label__to", "To");
labelTo.setAttribute("for", "to");
const selectTo = createEl("select", "select select__finish");
selectTo.id = "to";
labelTo.append(selectTo);
fillSelect(selectTo);
const convertErrorContainer = createEl("div", "convert__error-container");
const convertResultContainer = createEl("div", "convert__result-container");
wrapConvert.append(labelAmount, labelFrom, changeCurrencyBtn, labelTo);
blockConvert.append(
  titleConvert,
  wrapConvert,
  convertErrorContainer,
  convertResultContainer
);
app.append(blockConvert);

amountInput.focus();
labelAmount.addEventListener("click", () => amountInput.focus());

//обрабатывает клик на инпуте#############################################
amountInput.addEventListener("keydown", (e) => {
  checkDataConvert();
});

//Проверяет данные, введенные в инпуте#########################################
//?????????????????????????????????????????????????????1111111111111111111111111
function checkDataConvert() {
  if (+amountInput.value) {
    console.log(+amountInput.value);
    amountInput.style.borderColor = "";
    convertErrorContainer.innerHTML = "";
    sendRequest();
  } else {
    convertResultContainer.innerHTML = "";
    amountInput.style.borderColor = "red";
    convertErrorContainer.innerHTML = "";
    const valueConvertError = createEl(
      "p",
      "convert__error",
      "Please enter a valid amount"
    );
    convertErrorContainer.append(valueConvertError);
  }
}

//отправляет запрос#################################################
function sendRequest() {
  let convertRezObj;
  let giveCurrency = selectFrom.value;
  let getCurrency = selectTo.value;
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${giveCurrency}&tsyms=${getCurrency}`
  )
    .then((response) => response.json())
    .then((data) => {
      convertRezObj = data;
      console.log(convertRezObj);
      calcAmount(convertRezObj, getCurrency);
    });
}

//рассчитывает значение#################################################
function calcAmount(convertRezObj, currency) {
  console.log(convertRezObj[currency]);
  let rez = (+amountInput.value * convertRezObj[currency]).toFixed(2);
  console.log(rez);
  renderRez(rez);
}

//рендерит результат#######################################################
function renderRez(rez) {
  convertResultContainer.innerHTML = "";
  let content = `${amountInput.value} ${
    currencySigns[selectFrom.value]
  } = ${rez} ${currencySigns[selectTo.value]}`;
  const displayConvert = createEl("div", "convert__result", content);
  convertResultContainer.append(displayConvert);
}

//смена значений селектов#######################################################
selectFrom.addEventListener("change", () => {
  checkDataConvert();
});
selectTo.addEventListener("change", () => {
  checkDataConvert();
});

//клик по кнопке смены валют#######################################################
changeCurrencyBtn.addEventListener("click", () => changeCurrencyValues());
function changeCurrencyValues() {
  console.log(selectFrom.value);
  let temp = selectFrom.value;
  selectFrom.value = selectTo.value;
  selectTo.value = temp;
  checkDataConvert();
}
