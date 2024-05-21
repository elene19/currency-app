import { CurrencyConverter, CurrencyNames } from "../services/apiCurrency";
import styles from "./converter.module.css";

function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
console.log(formatNumberWithCommas(1000000));

declare global {
  interface Window {
    handleChangeFrom: (selectElement: HTMLSelectElement) => void;
    handleChangeTo: (selectElement: HTMLSelectElement) => void;
    handleKeyUp: (inputValue: string, inverse: boolean) => void;
    handleKeyUp2: (inputValue: string) => void;
  }
}

export default async function Converter() {
  const swapperBtn = document.getElementById("swapperBtn");
  console.log(swapperBtn);
  console.log(swapperBtn);
  swapperBtn?.addEventListener("click", () => {
    console.log("button clicked");
  });
  const dataForCurrencyNames = await CurrencyNames();

  const fetchData = async (from: string, to: string, amount: string) => {
    const dataForConvertion = await CurrencyConverter(from, to, amount);
    return dataForConvertion;
  };

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
    document.getElementById("swapperBtn")?.addEventListener("click", () => {
      console.log("tadam");
    });
    console.log(selectFrom, selectTo, selectFromInput, selectToInput);
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

    const selectedValue = selectedOptions.value.slice(0, 3);
    selectedOptions.value = selectedValue;
    selectElement.value = selectedValue;

    const convertTo = (
      document.getElementById("toSelector") as HTMLSelectElement
    ).value.slice(0, 3);
    console.log(convertTo);
    const data = await fetchData(
      selectedValue,
      convertTo,
      selectFromInput.value
    );
    const changed = Number(selectFromInput.value) < 1 ? "" : (data as string);
    // console.log(selectFromInput, changed, "changed");
    selectToInput.value = changed;
    console.log(data, "DATAAAAAAAAAAAAA");
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

    console.log(selectToInput);

    const changed = Number(selectFromInput) < 1 ? "" : (data as string);
    selectToInput.value = changed;
    // console.log(selectToInput);
  };

  // Swap function to swap selected options in selectors and fetch new data
  // const swapSelectors = async () => {
  //   const fromSelector = document.getElementById(
  //     "fromSelector"
  //   ) as HTMLSelectElement;
  //   const toSelector = document.getElementById(
  //     "toSelector"
  //   ) as HTMLSelectElement;
  //   const selectFromInput = document.getElementById(
  //     "selectFromInput"
  //   ) as HTMLInputElement;
  //   const selectToInput = document.getElementById(
  //     "selectToInput"
  //   ) as HTMLInputElement;

  //   // Swap selected options in selectors
  //   const tempValue = fromSelector.value;
  //   fromSelector.value = toSelector.value;
  //   toSelector.value = tempValue;

  //   // Fetch new data based on the swapped currencies
  //   const fromCurrency = fromSelector.value.slice(0, 3);
  //   const toCurrency = toSelector.value.slice(0, 3);
  //   const data = await CurrencyConverter(
  //     fromCurrency,
  //     toCurrency,
  //     selectFromInput.value
  //   );

  //   // Update the target input field with the fetched data
  //   selectToInput.value =
  //     Number(selectFromInput.value) < 1 ? "" : (data as string);
  //   const swapButton = document.getElementById("swapperBtn");
  //   swapButton.addEventListener("click", async () => {
  //     await swapSelectors();
  //   });
  // };

  return `<div class=${styles.converterContainer} >
  <div class=${styles.selectors} id="selectors">
 
  <div class='from'>
<select  id='fromSelector' class='fromSelector' onchange="handleChangeFrom(this)" >
<option>USD US Dollar</option>

${dataForCurrencyNames?.map((el) => {
  return `<option id='optionFrom'>${el}</option>`;
})}

</select>
  </div>

  <div class='to'>
<select id="toSelector" onchange="handleChangeTo(this)">
<option>GEL Georgian Lari</option>
${dataForCurrencyNames?.map((el) => {
  return `<option >${el}</option>`;
})}
</select>
  </div>

  </div>





  <div class=${styles.inputs}>
  <button onclick="" class=${
    styles.swapper
  } id='swapperBtn'> <i class="fa-solid fa-right-left"></i></button>
  <div class='from'>
<input type='number' id='selectFromInput' onkeyup='handleKeyUp(this)'  />
  </div>

  <div class='to'>
  <input type='number' id= 'selectToInput' onkeyup='handleKeyUp(this, true)' />
  </div>

  </div>





  <div class=${styles.dateSection}>
  <span>Date</span>
  <input type='date' id='date'>
  </div>

  </div>`;
}
