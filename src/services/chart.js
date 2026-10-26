// Point directly to where node_modules lives relative to this file
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register core configurations and the datalabels plugin
Chart.register(...registerables);
Chart.register(ChartDataLabels);

class AppChart {
  constructor() {}

  pieChart(chartData) {
    return new Chart(...this.getPieChartData(...chartData));
  }

  getPieChartData(_ele, _data, _chartLabel, _chartColor, _labelFun, _tooltipFun) {
    return [
      _ele,
      {
        type: "doughnut",
        data: {
          labels: _chartLabel,
          datasets: [
            {
              // Data matching the percentage slice distribution values
              data: _data,
              // Custom Hex Colors matching the reference image layout
              backgroundColor: _chartColor,
              borderWidth: 0, // Clean aesthetic border removal
              cutout: "78%", // Thickness slider for the inner ring radius
              borderRadius: 4, // Rounded styling tips on segments
            },
          ],
        },
        // 3. Register the plugin locally for this chart
        plugins: [ChartDataLabels], 
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // TRANSFORM TO SEMI-CIRCLE CONFIGURATION
          rotation: 270, // Rotate starting angle to bottom-left
          circumference: 180, // Only arc over half the full circle perimeter (180deg),
          layout: {
            padding: 20, // Add padding so labels don't get cut off at the edge
          },
          plugins: {
            datalabels: {
                formatter: () => null,
                anchor: "end", // Position at the edge of the slice
                align: "end", // Push it past the outer boundary
                textAlign: "center",
                color: "#333",
                lineHeight: 1.6,
                labels: _labelFun()
            },
            legend: {
              display: false, // Hide the generic chart legend block
            },
            tooltip: {
              callbacks: {
                label: _tooltipFun,
              },
            },
          },
        },
      },
    ];
  }
}

export const _appChart = new AppChart();
