import { BaseComponent } from "../../baseComponent.js";
import { DOMUtils } from "../../dom-utils.js";
import { _appChart } from "../../services/chart.js";

class PieChartComponent extends BaseComponent {
  constructor() {
    super(import.meta.url);
  }
  labelFun() {
    const iconMapping = {
      "Air Conditioner": "ac_unit",
      "Refrigerator": "kitchen",
      "Lighting & Fans": "mode_fan",
    };
    return {
      // Line 1: The Material Icon
      iconLine: {
        align: 'right',   // Aligns to the left of the center point
        offset: 5,       // Distance in pixels to the left
        font: {
          family: "Material Symbols Outlined",
          size: 20,
        },
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent Red Tint
        // Isolates just the icon text to this specific layer
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return iconMapping[label] || "bar_chart";
        },
      },

      // Line 2: The Text Label (Uses "as-is" parent font settings)
      labelLine: {
        align: 'right',  // Aligns to the right of the center point
        offset: 34,       // Distance in pixels to the right
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Transparent Red Tint
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
        padding:{
          bottom: 9,
          right: 10,
        }
      },

      // Line 3: The Numeric Value (Uses "as-is" parent font settings)
      valueLine: {
        anchor: 'end',
        align: 'bottom',
        offset: 6,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Transparent Red Tint
        borderRadius: 4,
        padding: 5,
        font:{
          size: 11,
        },
        formatter: (value) => {
          return `${value} %`;
        },
      },
    };
  }
  // Use this instead of connectedCallback()
  onInit() {
    const chartLabel = ["Air Conditioner", "Refrigerator", "Lighting & Fans"];
    const chartColor = [
      "#3b82f6", // Blue (Air Conditioner)
      "#f97316", // Orange (Refrigerator)
      "#10b981", // Green (Lighting & Fans)
    ];
    const chartData = [75, 22, 3];
    
    const ctx = this.shadow.getElementById("consumptionChart").getContext("2d");

    const tooltipCallback = (context) => ` ${context.label}: ${context.raw}%`;

    _appChart.pieChart([
      ctx,
      chartData,
      chartLabel,
      chartColor,
      this.labelFun,
      tooltipCallback,
    ]);
  }
}
DOMUtils.define(PieChartComponent);
