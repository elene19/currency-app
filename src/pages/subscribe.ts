async function subscribe(base = 'USD', rates = 'GEL,GBP,EUR', onDataArrived: (arg: any) => void){
    let response = await fetch(`https://api.fxratesapi.com/latest?base=${base}&currencies=${rates}&resolution=1m&amount=1&places=6&format=json`);
    if (response.status == 502) {
        await new Promise(resolve => setTimeout(resolve, 60000)); 
        await subscribe(base, rates, onDataArrived);
        console.log('status 502');
    } else if (response.status != 200) {
        console.log(response.statusText);
        await new Promise(resolve => setTimeout(resolve, 60000)); 
        await subscribe(base, rates, onDataArrived);
    } else {
        const message = await response.json();
        onDataArrived(message);
        await new Promise(resolve => setTimeout(resolve, 60000)); 
        await subscribe(base, rates, onDataArrived);
    }
}
export default subscribe;


