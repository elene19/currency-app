import subscribe from "./subscribe";
import { getChange } from "./getChange";
import { ChartComponent } from "./chart";
import { nanoid } from "nanoid";
import euFlag from '../assets/Flag_of_Europe.svg.png'
import './exRates.css';

const ExchangeRates = () => {
  let selectedBaseCurrency = "GEL";
    fetch(`https://api.fxratesapi.com/currencies`)
    .then(res => res.json())
    .then(cur => {
        const currencies = Object.entries(cur) as [string, { name: string }][];
        const currencyOptions = document.getElementById("currency-options") as HTMLSelectElement | null;

        if(currencyOptions){
          const selectedOption = currencyOptions.value;
          currencyOptions.addEventListener('change', (event) => {
             selectedBaseCurrency = (event.target as HTMLSelectElement).value;
             updateRates(selectedBaseCurrency);
           });

           currencies.forEach((currency) => {
                 const option = document.createElement("option") as HTMLOptionElement;
                //  const img = document.createElement("img");
                //   img.style.width = '24px'
                //   const countryCode = currency.slice(0, currency.length - 1);
                //   const imgUrl = countryCode === 'EU' ? euFlag : `https://flagsapi.com/${countryCode}/flat/24.png`
                //   img.setAttribute('src', imgUrl)

                //   option.innerHTML = imgUrl
                 option.value = currency[0];
                 option.textContent = `${currency[0]} ${currency[1].name}`;
                 if(currency[0] === "GEL"){
                   option.selected = true;
                 }
                 currencyOptions.appendChild(option);
             });

             if(selectedOption === ""){
              updateRates("GEL")
             } else {
               updateRates(selectedOption)
             }
        }

        const addCurrencyButton = document.getElementById("add-currency-button") as HTMLDivElement;
        const addCurrencySelect = document.getElementById("add-currency-select") as HTMLButtonElement;
        const cancelButton = document.getElementById("cancel-button") as HTMLButtonElement;
        if(addCurrencyButton && addCurrencySelect) {
          currencies.forEach((currency) => {
            const option = document.createElement("option") as HTMLOptionElement;
            option.value = currency[0];
            // const flag = `https://flagsapi.com/${countryCode}/flat/24.png`
            option.textContent = `${currency[0]} ${currency[1].name}`;
            addCurrencySelect.appendChild(option);
          });

          addCurrencyButton.addEventListener("click", () => {
            addCurrencyButton.style.display = "none";
            addCurrencySelect.style.display = "inline"
            cancelButton.style.display = 'flex';
          });

          addCurrencySelect.addEventListener("change", (event) => {
            const selectedCurrency = (event.target as HTMLSelectElement).value;
            const prevCurrencies = localStorage.getItem('currencies')?.split(",");
            const isAlreadyAdded = prevCurrencies?.includes(selectedCurrency)
            if(prevCurrencies){
              !isAlreadyAdded && localStorage.setItem('currencies', prevCurrencies + ',' + selectedCurrency)
              !isAlreadyAdded && addCurrencyToRates(selectedCurrency);
            } else {
              !isAlreadyAdded && localStorage.setItem('currencies', 'EUR,USD,GEL,GBP' + ',' + selectedCurrency)
              !isAlreadyAdded && addCurrencyToRates(selectedCurrency);

            }
            addCurrencyButton.style.display = "flex";
            addCurrencySelect.style.display = "none";
            cancelButton.style.display = 'none';
          });

          cancelButton.addEventListener('click', () => {
            addCurrencySelect.style.display = 'none';
            cancelButton.style.display = 'none';
            addCurrencyButton.style.display = 'flex';
        });
        }
    })
    .catch(error => {
        console.error('Error fetching currencies:', error);
    }); 
    const currencies = localStorage.getItem('currencies');
    const updateRates = (base: string = "GEL") => {
      let defaultCurrencies = "EUR,USD,GEL,GBP";
      const currenciesData = currencies || defaultCurrencies;
      subscribe(base, currenciesData, (data) => {

        const rates = Object.entries(data.rates) as [string, number][];
        const currenciesArray = currenciesData?.split(",");
        const currencyIndexMap = new Map();
        currenciesArray.forEach((currency, index) => {
          currencyIndexMap.set(currency, index);
      });

      rates.sort((a,b) => {
        const indexA = currencyIndexMap.get(a[0]);
    const indexB = currencyIndexMap.get(b[0]);
    
      if (indexA === undefined && indexB === undefined) {
          return 0;
      } else if (indexA === undefined) {
          return 1;
      } else if (indexB === undefined) {
          return -1;
      } else {
          return indexA - indexB;
      }
      })
        const ratesList = document.getElementById("rates-list") as HTMLDivElement;
        ratesList.innerHTML = '';
    
        rates.forEach((rate) => {
          addRateToList(base, rate[0], rate[1]);
        });
      });
    };

    
    const addRateToList = (base: string, currency: string, rate: number) => {
      const img = document.createElement("img");
      img.style.width = '24px'
      const countryCode = currency.slice(0, currency.length - 1);
      const imgUrl = countryCode === 'EU' ? euFlag : `https://flagsapi.com/${countryCode}/flat/24.png`
      img.setAttribute('src', imgUrl)
      
      const ratesList = document.getElementById("rates-list") as HTMLDivElement;
      const listItem = document.createElement("li");
      listItem.className = "list-item";
      

      const titleDiv = document.createElement("div");
      titleDiv.className = "title-div";
      const rateTitle = document.createElement("h4");
      rateTitle.className = "rate-title";
      rateTitle.innerHTML = currency;
      titleDiv.append(img, rateTitle);

      
      const rateAmount = document.createElement("h4");
      rateAmount.className = "rate-amount";
      rateAmount.style.width = "100px";
      rateAmount.innerHTML = rate.toString();
      
      const change = document.createElement("h4");
      change.className = "change";
      const canvas = document.createElement("canvas");
      
     getChange(base, (data) => {
        const changes = Object.entries(data.rates)
        const today = (changes[changes.length - 1][1]);
        const yesterday = changes[0][1];
        const changeRate = ((yesterday[currency] - today[currency]) / yesterday[currency]) * 100;

        const roundedChangeRate = +changeRate;
        const formattedChangeRate = roundedChangeRate >= 0 ? `+${roundedChangeRate.toFixed(7)}%` : `${roundedChangeRate.toFixed(7)}%`;
        change.innerHTML = formattedChangeRate;
        change.style.color = roundedChangeRate >= 0? "#1E8723" : "#B30021";
        
        canvas.className = 'chart';
        const id = nanoid()
        canvas.id = `chart${id}`;
        ChartComponent(changes, currency, id);
      })

      listItem.appendChild(titleDiv);
      listItem.appendChild(rateAmount);
      listItem.appendChild(change);
      listItem.appendChild(canvas);

      ratesList.appendChild(listItem);
  };

  const addCurrencyToRates = (currency: string) => {
      subscribe(selectedBaseCurrency, currency, (data) => {
          const rate = data.rates[currency];
          addRateToList(selectedBaseCurrency, currency, rate);
      });
  };
    
    return `
        <div id="exr-container">
            <div class="currency-list">
              <div class="currency-header">
                <select class="currency-options" id="currency-options"></select>
                <h3>Amount</h3>
                <h3>Change (24h)</h3>
                <h3>Chart (24h)</h3>
              </div>
              <div id="rates-list"></div>
              <div class="add-currency" id="add-currency-button">
                <button>+</button>
                <h3>Add Currency</h3>
              </div>
              <div class="add-select-container">
                <select class="add-currency-select" id="add-currency-select" style="display:none"></select>
                <button id="cancel-button" style="display:none">X</button>
              </div>
            <div>
        </div>
    `;
};

export default ExchangeRates;