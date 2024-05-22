import Chart from 'chart.js/auto';

type chartData = [string, {
    [key: string]: number;
}][]
 
export const ChartComponent = (data: chartData, currency: string, id: string) => {
    const chartId = document.getElementById(`chart${id}`);
    console.log(data)
    
    if (chartId instanceof HTMLCanvasElement) {
        new Chart(
            chartId,
            {
                type: 'line',
                data: {
                    labels: ['','','','','','','',],
                    datasets: [{
                        fill: false,
                        label: "Chart",
                        borderWidth: 1,
                        data: data.reverse().map((row) => row[1][currency]),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                  scales: {
                      x: {
                          display: false
                      },
                      y: {
                          display: false
                      }
                  },
                  plugins: {
                      legend: {
                          display: false
                      },
                      tooltip: {
                          enabled: false
                      }
                  }
                }
            }
        );
    } else {
        console.error("Chart element not found or not a canvas element");
    }
};
