import { CurrencyConverter, CurrencyNames } from "../services/apiCurrency";
import styles from "./converter.module.css";

export default async function Converter() {
  const dataForConvertion = await CurrencyConverter();
  const dataForCurrencyNames = await CurrencyNames();
  console.log(dataForConvertion, "cnvert");
  console.log(dataForCurrencyNames, "name");
  //   console.log(new Date());

  //   console.log(formattedDate);

  return `<div class=${styles.converterContainer}>
  <div class=${styles.selectors}>

  <div class='from'>
<select >
${dataForCurrencyNames?.map((el) => {
  return `<option>${el}</option>`;
})}
</select>
  </div>

  <div class='to'>
<select>
${dataForCurrencyNames?.map((el) => {
  return `<option>${el}</option>`;
})}
</select>
  </div>

  </div>





  <div class=${styles.inputs}>

  <div class='from'>
<input type='number'/>
  </div>

  <div class='to'>
  <input type='number'/>
  </div>

  </div>





  <div class=${styles.dateSection}>
  <span>Date</span>
  <input type='date'>
  </div>

  </div>`;
}
