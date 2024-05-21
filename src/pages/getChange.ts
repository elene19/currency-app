interface Data {
    base: string;
    date: string;
    privacy: string;
    rates: {
      [key: string]: {
        [key: string]: number;
      };
    };
    success: boolean;
    terms: string;
    timestamp: number;
  };  

export const getChange = (base: string, onDataArrived: (arg: Data) => void) => {

    function formatDate(date: Date) {
        const pad = (num: number) => num.toString().padStart(2, '0');
        const padMilliseconds = (num: number) => num.toString().padStart(3, '0');
    
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        const milliseconds = padMilliseconds(date.getMilliseconds());
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    const end_date = formatDate(currentDate);

    const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const start_date = formatDate(twentyFourHoursAgo);
    
    fetch(`https://api.fxratesapi.com/timeseries?start_date=${start_date}&end_date=${end_date}&base=${base}&accuracy=hour`)
    .then(res => res.json())
    .then(data => onDataArrived(data))
    .catch(error => {
        console.error('Error fetching time series data:', error);
    });
}
