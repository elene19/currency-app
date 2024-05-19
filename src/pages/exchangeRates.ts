import subscribe from "./subscribe";
import { getChange } from "./getChange";
import './exRates.css'

interface Data {
  base: string;
  date: string;
  privacy: string;
  rates: {
    [key: string]: number;
  };
  success: boolean;
  terms: string;
  timestamp: number;
}


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
            option.textContent = `${currency[0]} ${currency[1].name}`;
            addCurrencySelect.appendChild(option);
          });

          addCurrencyButton.addEventListener("click", () => {
            addCurrencyButton.style.display = "none";
            addCurrencySelect.style.display = "inline"
            cancelButton.style.display = 'inline';
          });

          addCurrencySelect.addEventListener("change", (event) => {
            const selectedCurrency = (event.target as HTMLSelectElement).value;
            addCurrencyToRates(selectedCurrency);
            addCurrencyButton.style.display = "inline";
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
    
    const updateRates = (base: string = "GEL") => {

      subscribe(base, "EUR,USD,GBP,TRY", (data) => {
        const rates = Object.entries(data.rates) as [string, number][];
        const ratesList = document.getElementById("rates-list") as HTMLDivElement;
    
        ratesList.innerHTML = '';
    
        rates.forEach((rate) => {
          addRateToList(base, rate[0], rate[1]);
        });
      });
    };

    
    const addRateToList = (base: string, currency: string, rate: number) => {
      
      const ratesList = document.getElementById("rates-list") as HTMLDivElement;
      const listItem = document.createElement("li");
      listItem.className = "list-item";
      
      const rateTitle = document.createElement("h4");
      rateTitle.className = "rate-title";
      rateTitle.innerHTML = currency;
      
      const rateAmount = document.createElement("h4");
      rateAmount.className = "rate-amount";
      rateAmount.innerHTML = rate.toString();
      
      const change = document.createElement("h4");
      change.className = "change";
      
     getChange(base, (data: Data) => {
        const changes = Object.entries(data.rates)
        const today = changes[changes.length - 1][1];
        const yesterday = changes[0][1];
        const changeRate = ((today[currency] - yesterday[currency]) / yesterday[currency]) * 100;
        const roundedChangeRate = +changeRate;
        const formattedChangeRate = roundedChangeRate >= 0 ? `+${roundedChangeRate.toFixed(7)}%` : `${roundedChangeRate.toFixed(7)}%`;
        change.innerHTML = formattedChangeRate;
      })

      const chart = document.createElement("h4");
      chart.className = "chart";
      chart.innerHTML = "Chart";

      listItem.appendChild(rateTitle);
      listItem.appendChild(rateAmount);
      listItem.appendChild(change);
      listItem.appendChild(chart);

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
                <h3>Chart</h3>
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