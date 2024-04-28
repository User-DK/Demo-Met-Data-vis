import * as Plot from '@observablehq/plot';
import { groupSort } from 'd3-array';

export default function visualize(data) {
  const div = document.querySelector("#visualization");
  div.innerHTML = "";

  const { state, district, year, annualTotal, annualMean, monthlyAverages } = data;

  const monthlyAveragesStr = Object.entries(monthlyAverages)
    .map(([month, avg]) => `${month}: ${avg}`)
    .join(', ');

  div.innerHTML = `
    <h3>State: ${state}</h3>
    <h3>District: ${district}</h3>
    <h3>Year: ${year}</h3>
    <h3>Annual Total: ${annualTotal}</h3>
    <h3>Annual Mean: ${annualMean}</h3>
    <h3>Monthly Averages: ${monthlyAveragesStr}</h3>
  `;

  const barsData = [
    { name: 'Annual Mean', value: annualMean },
    { name: 'Annual Total', value: annualTotal }
  ];

  // Plot for annual data
  const plotForAnnual = Plot.plot({
    marks: [
      Plot.barY(barsData, { x: "name", y: "value", fill: 'value' })
    ],
    x: {
      label: 'Measures'
    },
    y: {
      label: 'Rainfall'
    },
    height: 500,
  });

  const monthlyAveragesArray = Object.entries(monthlyAverages)
    .map(([month, value]) => ({ month, value }));

  console.log(monthlyAveragesArray)

  const plotForMonthly = Plot.plot({
    marks: [
      Plot.barY(monthlyAveragesArray, { x: "month", y: "value", fill: "value", sort: { x: "y" } })
    ],
    x: {
      label: 'Month'
    },
    y: {
      label: 'Avg. Rainfall'
    },
    height: 500,
  });
  const plotsContainer = document.createElement('div');
  plotsContainer.style.display = 'flex';
  plotsContainer.style.justifyContent = 'space-around';

  plotsContainer.append(plotForAnnual);
  plotsContainer.append(plotForMonthly);

  div.append(plotsContainer);
}
