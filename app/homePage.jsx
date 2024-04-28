import { useState, useEffect } from 'react';

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

  function visualize(data){
  const {annualTotal, annualMean, monthlyAverages} = data;
  console.log("hello");
  return(
    <h1>hello kaise hoo</h1>
  );
  }

  return (
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
  );
}

export default HomePage;