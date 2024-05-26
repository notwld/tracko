import React, { useState, useEffect } from 'react';
import "./StyleSheets/Calculations.css";
import axios from 'axios';

const teamMembers = [
  { name: "Alice", availabilityDays: 8, interruptHours: 24,salary: 150000 , perDaySalary: 6800 },
  { name: "Bob", availabilityDays: 8, interruptHours: 22, salary: 200000, perDaySalary: 9100},
  { name: "Charlie", availabilityDays: 10, interruptHours: 34 , salary: 100000, perDaySalary: 4500},
//   { name: "David", availabilityDays: 8, interruptHours: 25, salary: 150000, perDaySalary: 6800},
];

const officeHoursPerDay = 8;
const sprintLength = 2; // in weeks
const workingDays = 10; // in a sprint
const weekdays=workingDays/sprintLength;
const hrsPerStoryPoint = 2; // hours per story point

function Calculations() {
  const [totalAvailabilityHours, setTotalAvailabilityHours] = useState(0);
  const [storyPointsPerSprint, setStoryPointsPerSprint] = useState(0);
    const [SalaryAsPerAvailableDays, setSalaryAsPerAvailableDays] = useState(0);
    const [inflationRate, setInflationRate] = useState(0);
    const [currencyConversionWeight,setCurrencyConversionWeight]=useState('');

    //for currency Conversion
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [pkrRate, setPkrRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);

    //for second dropdown Currency Conversion
    const [secondCurrencies, setSecondCurrencies] = useState([]);
    const [secondSelectedCurrency, setSecondSelectedCurrency] = useState('');
    const [secondCurrentCurrencyRate, setSecondCurrentCurrencyRate] = useState(null);
    const [secondConvertedAmount, setSecondConvertedAmount] = useState(null);

    function handleCurrencyConversionWeight(e){
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        
        setCurrencyConversionWeight(value);
    }

    function handleInflationRateChange(e) {
        let value = e.target.value;
    // Convert to number only if it's not empty
    if (value !== "") {
        value = parseFloat(value);
        // If conversion is not successful or the value is negative, return
        if (isNaN(value) || value < 0) return;
    }
    
    setInflationRate(value);
    }
  useEffect(() => {
    let totalAvailHours = 0;
    let totalSalarySumAsPerAvailableDays = 0;

    teamMembers.forEach(member => {
      const interruptHoursPerDay = member.interruptHours / weekdays;
      const availableHoursPerDay = officeHoursPerDay - interruptHoursPerDay;
      const totalAvailableHours = member.availabilityDays * availableHoursPerDay;
      totalAvailHours += totalAvailableHours;
      const IndividualSalaryAsPerAvailableDays= member.availabilityDays * member.perDaySalary;
      totalSalarySumAsPerAvailableDays += IndividualSalaryAsPerAvailableDays;
    });

    setTotalAvailabilityHours(totalAvailHours);
    setSalaryAsPerAvailableDays(totalSalarySumAsPerAvailableDays);
    setStoryPointsPerSprint((totalAvailHours / hrsPerStoryPoint).toFixed(2));
  }, []);
  const calculateTotalCostAsPerAvailableDays = () => {
   const totalCost=(SalaryAsPerAvailableDays+(SalaryAsPerAvailableDays* (inflationRate / 100) ))
   return totalCost;
  }

  

useEffect(() => {
  // Fetch the list of currencies on component mount for first dropdown
  axios.get('https://open.er-api.com/v6/latest/USD')
    .then(response => {
      setCurrencies(Object.keys(response.data.rates));
    })
    .catch(error => console.error('Error fetching the currency list:', error));

  // Fetch the list of currencies on component mount for second dropdown
  axios.get('https://open.er-api.com/v6/latest/USD')
    .then(response => {
      setSecondCurrencies(Object.keys(response.data.rates));
    })
    .catch(error => console.error('Error fetching the currency list:', error));
}, []);

useEffect(() => {
  if (selectedCurrency) {
    // Fetch the exchange rate for the selected currency and PKR for first dropdown
    axios.get(`https://open.er-api.com/v6/latest/${selectedCurrency}`)
      .then(response => {
        const rate = response.data.rates['PKR'];
        setPkrRate(rate);
      })
      .catch(error => console.error('Error fetching the currency rate:', error));
  }
}, [selectedCurrency]);

useEffect(() => {
  if (secondSelectedCurrency) {
    // Fetch the exchange rate for the selected currency for second dropdown
    axios.get(`https://open.er-api.com/v6/latest/${secondSelectedCurrency}`)
      .then(response => {
        const rate = response.data.rates['PKR'];
        setSecondCurrentCurrencyRate(rate);
      })
      .catch(error => console.error('Error fetching the currency rate:', error));
  }
}, [secondSelectedCurrency]);

useEffect(() => {
  if (pkrRate) {
    const amount = 1; // Assume a default amount of 1 for conversion
    const converted = amount * pkrRate;
    setConvertedAmount(converted.toFixed(2));
  }
}, [pkrRate]);

useEffect(() => {
  if (secondCurrentCurrencyRate) {
    const amount = 1; // Assume a default amount of 1 for conversion
    const converted = amount * secondCurrentCurrencyRate;
    setSecondConvertedAmount(converted.toFixed(2));
  }
}, [secondCurrentCurrencyRate]);


  const calculateFirstConversion = () => {
    const projectCostInUSD=(SalaryAsPerAvailableDays+(SalaryAsPerAvailableDays * (inflationRate / 100)))*currencyConversionWeight;
    const projectCostInUSD2=projectCostInUSD/convertedAmount;
    return projectCostInUSD2.toFixed(2);
  }
  // const calculateFirstConversion = () => {
  //   const projectCostInUSD=SalaryAsPerAvailableDays*currencyConversionWeight;
  //   const projectCostInUSD2=projectCostInUSD/convertedAmount;
  //   return projectCostInUSD2.toFixed(2);
  // }
  const calculateSecondConversion = () => {
    const currencyConversionRatio=secondConvertedAmount/convertedAmount;
    const multipliedRatiofromWeight=currencyConversionWeight*currencyConversionRatio;
    if(multipliedRatiofromWeight<currencyConversionWeight){
      const newRatioForConversion=currencyConversionWeight-multipliedRatiofromWeight;
      const newProjectCostByRatio=(SalaryAsPerAvailableDays+(SalaryAsPerAvailableDays * (inflationRate / 100)))*newRatioForConversion;
      const finalCost= newProjectCostByRatio/secondConvertedAmount;
      return finalCost.toFixed(2);
    }
    if(multipliedRatiofromWeight>currencyConversionWeight){
      const newRatioForConversion=currencyConversionWeight+multipliedRatiofromWeight;
      const newProjectCostByRatio=(SalaryAsPerAvailableDays+(SalaryAsPerAvailableDays * (inflationRate / 100)))*newRatioForConversion;
      const finalCost= newProjectCostByRatio/secondConvertedAmount;
      return finalCost.toFixed(2);
    }
   
  }
  // const calculateSecondConversion = () => {
  //   const currencyConversionRatio=secondConvertedAmount/convertedAmount;
  //   const multipliedRatiofromWeight=currencyConversionWeight*currencyConversionRatio;
  //   if(multipliedRatiofromWeight<currencyConversionWeight){
  //     const newRatioForConversion=currencyConversionWeight-multipliedRatiofromWeight;
  //     const newProjectCostByRatio=SalaryAsPerAvailableDays*newRatioForConversion;
  //     const finalCost= newProjectCostByRatio/secondConvertedAmount;
  //     return finalCost.toFixed(2);
  //   }
  //   if(multipliedRatiofromWeight>currencyConversionWeight){
  //     const newRatioForConversion=currencyConversionWeight+multipliedRatiofromWeight;
  //     const newProjectCostByRatio=SalaryAsPerAvailableDays*newRatioForConversion;
  //     const finalCost= newProjectCostByRatio/secondConvertedAmount;
  //     return finalCost.toFixed(2);
  //   }
   
  // }


  return (
    <div className="calculations-app">
      <h1>Team Availability and Sprint Planning</h1>
      <p>Office Hrs per Day: {officeHoursPerDay}</p>
      <p>Sprint Length: {sprintLength}</p>
      <p>Working Days: {workingDays}</p>
      <p>Hrs Per Story point: {hrsPerStoryPoint}</p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Salary Per Month</th>
            <th>Salary Per Day</th>
            <th>Availability During Sprint (in Days)</th>
            <th>Interrupt Hours</th>
            <th>Interrupt Hours (per Day)</th>
            <th>Availability Hours (per Day)</th>
            <th>Total Availability Hours (in Sprint)</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map(member => {
            const interruptHoursPerDay = (member.interruptHours / weekdays).toFixed(2);
            const availableHoursPerDay = (officeHoursPerDay - interruptHoursPerDay).toFixed(2);
            const totalAvailableHours = (member.availabilityDays * availableHoursPerDay).toFixed(2);
            return (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.salary}</td>
                <td>{member.perDaySalary}</td>
                <td>{member.availabilityDays}</td>
                <td>{member.interruptHours}</td>
                <td>{interruptHoursPerDay}</td>
                <td>{availableHoursPerDay}</td>
                <td>{totalAvailableHours}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="summary">
        <h3>Total Availability Hours (in Sprint): {totalAvailabilityHours.toFixed(2)}</h3>
        <h3>Story Points per Sprint: {storyPointsPerSprint}</h3>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Salary Per Month</th>
            <th>Salary Per Day</th>
            <th>Availability During Sprint (in Days)</th>
            <th>Salary as Per Available Days</th>
            <th>Availability Hours (per Day)</th>
            <th>Total Availability Hours (in Sprint)</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map(member => {
            const interruptHoursPerDay = (member.interruptHours / weekdays).toFixed(2);
            const availableHoursPerDay = (officeHoursPerDay - interruptHoursPerDay).toFixed(2);
            const totalAvailableHours = (member.availabilityDays * availableHoursPerDay).toFixed(2);
            const SalaryAsPerAvailableDays= (member.availabilityDays * member.perDaySalary).toFixed(2);
            return (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.salary}</td>
                <td>{member.perDaySalary}</td>
                <td>{member.availabilityDays}</td>
                <td>{SalaryAsPerAvailableDays}</td>
                <td>{availableHoursPerDay}</td>
                <td>{totalAvailableHours}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>Salary as per Available Days: {SalaryAsPerAvailableDays}</p>
      <p>Enter Inflation Rate:</p>
      
      <input type="number" name="Enter Inflation Rate" onChange={handleInflationRateChange} value={inflationRate} min="0"  />
        <p>Salary as per Available Days after Inflation: {SalaryAsPerAvailableDays * (inflationRate / 100)}</p>
        <p>total cost with inflation rate: {calculateTotalCostAsPerAvailableDays()}</p>
        
        <p>Enter Weight for Currency Conversion:</p>
    <input type="number" name="Enter Currency Conversion Weight" onChange={handleCurrencyConversionWeight} value={currencyConversionWeight} min="0"  />
      <p>Currency Conversion Weight: {currencyConversionWeight}</p>


        <div>
        <label htmlFor="currency-select">Select a Currency (for PKR conversion): </label>
        <select 
          id="currency-select" 
          value={selectedCurrency} 
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="">Select One …</option>
          {currencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      {convertedAmount !== null && (
        <p>1 {selectedCurrency} is equal to {convertedAmount} PKR</p>
      )}
      <p>Converted Amount: {calculateFirstConversion()} {selectedCurrency}</p>
      

   
<p>Note: if you want to convert the Project Cost into Any Other Currency</p>
      <div>
        <label htmlFor="second-currency-select">Select a Currency (for second conversion): </label>
        <select 
          id="second-currency-select" 
          value={secondSelectedCurrency} 
          onChange={(e) => setSecondSelectedCurrency(e.target.value)}
        >
          <option value="">Select One …</option>
          {secondCurrencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <p>Selected Currency Rate: {secondCurrentCurrencyRate !== null ? secondCurrentCurrencyRate : 'N/A'}</p>
      {secondConvertedAmount !== null && (
        <p>1  {secondSelectedCurrency} is equal to {secondConvertedAmount} PKR</p>
      )}
      <p>Converted Amount: {calculateSecondConversion()} {secondSelectedCurrency}</p>
    </div>
    
    
  );
}

export default Calculations;
