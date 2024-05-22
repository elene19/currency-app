import { CurrencyConverter, CurrencyNames } from "../services/apiCurrency";
import styles from "./converter.module.css";

function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// console.log(formatNumberWithCommas(1000000));
const date = new Date();
const formattedDate = date
  .toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .split("/")
  .reverse()
  .join("-");

declare global {
  interface Window {
    handleChangeFrom: (selectElement: HTMLSelectElement) => void;
    handleChangeTo: (selectElement: HTMLSelectElement) => void;
    handleKeyUp: (inputValue: string, inverse: boolean) => void;
    // handleKeyUp2: (inputValue: string) => void;
    handleDateChange: (inputElement: HTMLInputElement) => void;
  }
}
function activateOption(
  select: HTMLSelectElement,
  value: string
  // selectTwo: HTMLSelectElement
) {
  // console.log(value, "value");
  // console.log(select.value, selectTwo.value, "1221415");
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      // select.options[i].selected = true;
      // console.log(value, select.options[i].value);
      select.selectedIndex = i;
      // console.log(select.options[i].selected, "BLABLA");
      // console.log(select[i]);
      break;
    }
  }
}
export default async function Converter() {
  const dataForCurrencyNames = await CurrencyNames();

  const fetchData = async (from: string, to: string, amount: string) => {
    const dataForConvertion = await CurrencyConverter(from, to, amount);
    return dataForConvertion;
  };
  document.addEventListener("click", async (e) => {
    const swapBtn = document.getElementById("swapperBtn");
    if (e.target === swapBtn || (e.target as HTMLElement).id === "icon") {
      // console.log(1);
      const fromSelector = document.getElementById(
        "fromSelector"
      ) as HTMLSelectElement;
      const toSelector = document.getElementById(
        "toSelector"
      ) as HTMLSelectElement;
      const selectFromInput = document.getElementById(
        "selectFromInput"
      ) as HTMLInputElement;
      const selectToInput = document.getElementById(
        "selectToInput"
      ) as HTMLInputElement;
      // console.log(fromSelector.selectedIndex);

      // swapping images
      const fromImg = document.getElementById("fromIMG") as HTMLImageElement;
      const toImg = document.getElementById("toIMG") as HTMLImageElement;
      const imgvalue = fromImg.src;
      fromImg.src = toImg.src;
      toImg.src = imgvalue;

      window.localStorage.setItem("from", JSON.stringify(toSelector.value));
      window.localStorage.setItem("to", JSON.stringify(fromSelector.value));
      // console.log(fromSelector.value);
      let localstorageFROM = JSON.parse(
        window.localStorage.getItem("from") as string
      );
      let localstorageTO = JSON.parse(
        window.localStorage.getItem("to") as string
      );
      activateOption(fromSelector, localstorageFROM);
      activateOption(toSelector, localstorageTO);

      const data = await fetchData(
        fromSelector.value.slice(0, 3),
        toSelector.value.slice(0, 3),
        selectFromInput.value
      );
      // console.log(data);
      selectToInput.value =
        Number(selectFromInput.value) < 1 ? "" : (data as string);
    }
  });
  // window.dateChanger = async (input: HTMLInputElement) {

  // }

  window.handleKeyUp = async (input, inverse: boolean) => {
    const selectFrom = (
      document.getElementById("fromSelector") as HTMLSelectElement
    )?.value.slice(0, 3);
    const selectTo = (
      document.getElementById("toSelector") as HTMLSelectElement
    )?.value.slice(0, 3);
    const selectFromInput = (
      document.getElementById("selectFromInput") as HTMLInputElement
    )?.value;
    const selectToInput = (
      document.getElementById("selectToInput") as HTMLInputElement
    )?.value;

    // console.log(selectFrom, selectTo, selectFromInput, selectToInput);
    const [from, to] = inverse
      ? [selectTo, selectFrom]
      : [selectFrom, selectTo];
    const data = await fetchData(
      from,
      to,
      inverse ? selectToInput : selectFromInput
    );

    const targetInput = document.getElementById(
      inverse ? "selectFromInput" : "selectToInput"
    ) as HTMLInputElement;
    targetInput.value =
      Number(inverse ? selectToInput : selectFromInput) < 1
        ? ""
        : (data as string);
  };

  ////////////////
  window.handleChangeFrom = async function (selectElement: HTMLSelectElement) {
    const selectFromInput = document.getElementById(
      "selectFromInput"
    ) as HTMLInputElement;

    const selectToInput = document.getElementById(
      "selectToInput"
    ) as HTMLInputElement;

    const selectedOptions = selectElement.options[selectElement.selectedIndex];
    // console.log(selectedOptions, "FROM");
    window.localStorage.setItem("from", JSON.stringify(selectedOptions.value));
    const selectedValue = selectedOptions.value.slice(0, 3);
    // console.log(selectedValue, "wgeqegefsef");
    // selectedOptions.value = selectedValue;
    // selectElement.value = selectedValue;

    const convertTo = (
      document.getElementById("toSelector") as HTMLSelectElement
    ).value.slice(0, 3);
    // console.log(convertTo);
    const data = await fetchData(
      selectedValue,
      convertTo,
      selectFromInput.value
    );
    const changed = Number(selectFromInput.value) < 1 ? "" : (data as string);
    // console.log(selectFromInput, changed, "changed");
    selectToInput.value = changed;
    // console.log(data, "DATAAAAAAAAAAAAA");

    (
      document.getElementById("fromIMG") as HTMLImageElement
    ).src = `https://flagsapi.com/${selectedValue.slice(0, 2)}/flat/32.png`;
  };

  ///////////////////////////////
  window.handleChangeTo = async function (selectElement: HTMLSelectElement) {
    const selectFromInput = (
      document.getElementById("selectFromInput") as HTMLInputElement
    )?.value;

    let selectToInput = document.getElementById(
      "selectToInput"
    ) as HTMLInputElement;

    const convertFrom = (
      document.getElementById("fromSelector") as HTMLSelectElement
    ).value.slice(0, 3);
    const selectedOptions = selectElement.options[selectElement.selectedIndex];
    const selectedValue = selectedOptions.value.slice(0, 3);
    const data = await fetchData(convertFrom, selectedValue, selectFromInput);
    window.localStorage.setItem("to", JSON.stringify(selectedOptions.value));

    // console.log(selectedOptions, "TO");

    const changed = Number(selectFromInput) < 1 ? "" : (data as string);
    selectToInput.value = changed;
    (
      document.getElementById("toIMG") as HTMLImageElement
    ).src = `https://flagsapi.com/${selectedValue.slice(0, 2)}/flat/32.png`;
    // console.log(selectToInput);
  };
  // const from = document.getElementById("fromSelector") as HTMLSelectElement;
  // console.log(from?.value.slice(0, 2));
  // const to = (
  //   document.getElementById("toSelector") as HTMLSelectElement
  // )?.value.slice(0, 2);
  // console.log(from, to);

  window.handleDateChange = async function (inputElement) {
    const fromSelector = document.getElementById(
      "fromSelector"
    ) as HTMLSelectElement;
    const toSelector = document.getElementById(
      "toSelector"
    ) as HTMLSelectElement;
    const selectFromInput = document.getElementById(
      "selectFromInput"
    ) as HTMLInputElement;
    const selectToInput = document.getElementById(
      "selectToInput"
    ) as HTMLInputElement;
    console.log(inputElement.value);
    const data = await fetchData(
      fromSelector.value.slice(0, 3),
      toSelector.value.slice(0, 3),
      selectFromInput.value
    );
    selectToInput.value =
      Number(selectFromInput.value) < 1 ? "" : (data as string);
  };

  return `<div class=${styles.converterContainer} >
  <div class='${styles.selectors}' id="selectors">
  <div class='from'>
  <img id='fromIMG' src="https://flagsapi.com/US/flat/32.png" class='${
    styles.imgFrom
  }'/>
<select  id='fromSelector' class='fromSelector' onchange="handleChangeFrom(this)" >
<option >USD US Dollar</option>
${dataForCurrencyNames?.map((el) => {
  return `
  <option  value='${el.trim()}'>${el.trim()}</option>`;
})}

</select>
  </div>
  <div class='to'>
  <img id='toIMG' src="https://flagsapi.com/GE/flat/32.png" class='${
    styles.imgFrom
  }'/>
<select id="toSelector" onchange="handleChangeTo(this)">
<option >GEL Georgian Lari</option>
${dataForCurrencyNames?.map((el) => {
  return `<option value='${el.trim()}'>${el.trim()}</option>`;
})}
</select>
  </div>

  </div>





  <div class=${styles.inputs}>
  <button onclick="" class=${
    styles.swapper
  } id='swapperBtn'> <i class="fa-solid fa-right-left" id='icon'></i></button>
  <div class='from'>
<input type='number' id='selectFromInput' onkeyup='handleKeyUp(this)'  />
  </div>

  <div class='to'>
  <input type='number' id= 'selectToInput' onkeyup='handleKeyUp(this, true)' />
  </div>

  </div>



  <div class=${styles.dateSection}>
  <span>Date</span>
  <input type='date' id='date' value='${formattedDate}' onchange='handleDateChange(this)'>
  </div>

  </div>`;
}

window.addEventListener("beforeunload", () => {
  localStorage.clear();
});
