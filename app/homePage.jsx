import { useState, useEffect } from 'react';
import * as d3 from 'd3';

function HomePage() {
  const [selectedState, setSelectedState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/admin',{
        method: 'POST'
      });
      const data = await response.json();
      const { states, allDistricts, years} = data;
      setStates(states);
      setAllDistricts(allDistricts);
      setYears(years);
    }
    fetchData();
  }, []); 

  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    // console.log(formData)
  //   for (const [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }
    const response = await fetch('/api/submit', { 
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    visualize(data);
  }

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setDistricts(allDistricts[event.target.value] || []);
  };

  function visualize(data) {
  const svgWidth = 400;
  const svgHeight = 200;
  const barPadding = 5;

  const svg = d3.select('#visualization')
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight);

  const barWidth = (svgWidth / data.length);

  const barChart = svg.selectAll('rect')
                      .data(data)
                      .enter()
                      .append('rect')
                      .attr('x', (d, i) => i * barWidth)
                      .attr('y', (d) => svgHeight - d) 
                      .attr('height', (d) => d) 
                      .attr('width', barWidth - barPadding)
                      .attr('fill', 'steelblue'); 
}

  return (
    <div>
    <form onSubmit={onSubmit}>
      <select id="state" name="state" required onChange={handleStateChange} defaultValue="">
        <option value="" disabled>--Select State--</option>
        {states.map(element => <option key={element} value={element}>{element}</option>)}
      </select>
      <br/>
      <select id="district" name="district" required defaultValue="">
        <option value="" disabled selected>--Select District--</option>
        {districts.map(element => <option key={element} value={element}>{element}</option>)}
      </select>
      <br/>
      <select id="year" name="year" required defaultValue="">
        <option value="" disabled selected>--Select Year--</option>
        {years.map(element => <option key={element} value={element}>{element}</option>)}
      </select>
    <br/>
      <button type="submit">Submit</button>
    </form>
    <div id="visualization"></div>
    </div>
  );
}

export default HomePage;