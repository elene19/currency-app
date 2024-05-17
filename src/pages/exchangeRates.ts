import subscribe from "./subscribe";

const ExchangeRates = () => {

    fetch(`https://api.fxratesapi.com/currencies`)
    .then(res => res.json())
    .then(cur => {
        console.log(cur);
        const currencies = Object.entries(cur) as [string, { name: string }][];
        const currencyOptions = document.getElementById("currency-options") as HTMLSelectElement | null;
       currencyOptions && currencies.forEach((currency) => {
          console.log(currency)
            const option = document.createElement("option") as HTMLOptionElement;
            option.value = currency[0];
            option.textContent = `${currency[0]} ${currency[1].name}`;
            currencyOptions.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching currencies:', error);
    });

   subscribe("GEL", "USD,EUR,TRY", (data) => {
      console.log(data)
    });

    return `
        <div id="exr-container">
            <div class="currency-titles">
                <select id="currency-options"></select>
                <li>GEL</li>
                <li>US Dollar</li>
                <li>Euro</li>
                <li>British Pound</li>
            </div>
        </div>
    `;
};

export default ExchangeRates;
