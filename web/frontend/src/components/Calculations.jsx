import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calculations = ({
  officeHoursPerDay,
  sprintLength,
  workingDays,
  hrsPerStoryPoint,
  teamMembers,
  totalAvailabilityHours,
  totalStoryPoints,
  storyPointsPerSprint,
}) => {
//   const [totalAvailabilityHours, setTotalAvailabilityHours] = useState(0);
//   const [storyPointsPerSprint, setStoryPointsPerSprint] = useState(0);
  const [SalaryAsPerAvailableDays, setSalaryAsPerAvailableDays] = useState(0);
  const [inflationRate, setInflationRate] = useState(0);
  const [currencyConversionWeight, setCurrencyConversionWeight] = useState('');

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [pkrRate, setPkrRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const [secondCurrencies, setSecondCurrencies] = useState([]);
  const [secondSelectedCurrency, setSecondSelectedCurrency] = useState('');
  const [secondCurrentCurrencyRate, setSecondCurrentCurrencyRate] = useState(null);
  const [secondConvertedAmount, setSecondConvertedAmount] = useState(null);

  const weekdays = workingDays / sprintLength;

  function handleCurrencyConversionWeight(e) {
    let value = e.target.value;
    if (value !== "") {
      value = parseFloat(value);
      if (isNaN(value) || value < 0) return;
    }
    setCurrencyConversionWeight(value);
  }

  function handleInflationRateChange(e) {
    let value = e.target.value;
    if (value !== "") {
      value = parseFloat(value);
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
      const individualSalaryAsPerAvailableDays = member.availabilityDays * member.perDaySalary;
      totalSalarySumAsPerAvailableDays += individualSalaryAsPerAvailableDays;
    });

    setSalaryAsPerAvailableDays(totalSalarySumAsPerAvailableDays);
  }, [teamMembers, officeHoursPerDay, weekdays, hrsPerStoryPoint]);

  const calculateTotalCostAsPerAvailableDays = () => {
    const totalCost = SalaryAsPerAvailableDays + (SalaryAsPerAvailableDays * (inflationRate / 100));
    return totalCost;
  }

  useEffect(() => {
    axios.get('https://open.er-api.com/v6/latest/USD')
      .then(response => {
        setCurrencies(Object.keys(response.data.rates));
        setSecondCurrencies(Object.keys(response.data.rates));
      })
      .catch(error => console.error('Error fetching the currency list:', error));
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
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
      const amount = 1;
      const converted = amount * pkrRate;
      setConvertedAmount(converted.toFixed(2));
    }
  }, [pkrRate]);

  useEffect(() => {
    if (secondCurrentCurrencyRate) {
      const amount = 1;
      const converted = amount * secondCurrentCurrencyRate;
      setSecondConvertedAmount(converted.toFixed(2));
    }
  }, [secondCurrentCurrencyRate]);

  const calculateFirstConversion = () => {
    const projectCostInUSD = (SalaryAsPerAvailableDays + (SalaryAsPerAvailableDays * (inflationRate / 100))) * currencyConversionWeight;
    const projectCostInUSD2 = projectCostInUSD / convertedAmount;
    return projectCostInUSD2.toFixed(2);
  }

  const calculateSecondConversion = () => {
    const currencyConversionRatio = secondConvertedAmount / convertedAmount;
    const multipliedRatioFromWeight = currencyConversionWeight * currencyConversionRatio;
    let newRatioForConversion, newProjectCostByRatio, finalCost;

    if (multipliedRatioFromWeight < currencyConversionWeight) {
      newRatioForConversion = currencyConversionWeight - multipliedRatioFromWeight;
      newProjectCostByRatio = (SalaryAsPerAvailableDays + (SalaryAsPerAvailableDays * (inflationRate / 100))) * newRatioForConversion;
      finalCost = newProjectCostByRatio / secondConvertedAmount;
    } else {
      newRatioForConversion = currencyConversionWeight + multipliedRatioFromWeight;
      newProjectCostByRatio = (SalaryAsPerAvailableDays + (SalaryAsPerAvailableDays * (inflationRate / 100))) * newRatioForConversion;
      finalCost = newProjectCostByRatio / secondConvertedAmount;
    }

    return finalCost.toFixed(2);
  }

  return (
    <div className="calculations-app">
        <h1 className="h-6">
            Calculations
        </h1>
      <p>Salary as per Available Days: {SalaryAsPerAvailableDays}</p>
      <p>Enter Inflation Rate:</p>
      <input type="number" name="Enter Inflation Rate" onChange={handleInflationRateChange} value={inflationRate} min="0" />
      <p>Salary as per Available Days after Inflation: {(SalaryAsPerAvailableDays * (inflationRate / 100)).toFixed(2)}</p>
      <p>Total cost with inflation rate: {calculateTotalCostAsPerAvailableDays().toFixed(2)}</p>

      <p>Enter Weight for Currency Conversion:</p>
      <input type="number" name="Enter Currency Conversion Weight" onChange={handleCurrencyConversionWeight} value={currencyConversionWeight} min="0" />
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

      <p>Note: if you want to convert the Project Cost into UAE Dirham</p>
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
        <p>1 {secondSelectedCurrency} is equal to {secondConvertedAmount} PKR</p>
      )}
      <p>Converted Amount: {calculateSecondConversion()} {secondSelectedCurrency}</p>
    </div>
  );
}

export default Calculations;
