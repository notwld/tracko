import { useEffect, useState } from 'react';
import './Cocomo.css'; 
import Eaf from './EAF.jsx';	
import { Link } from "react-router-dom"
import Conversion from './Conversion.jsx';
function Cocomo({totalLOC}) {
  
  const [total, setTotal] = useState(0.00);
  const [values, setValues] = useState({
    Precedentdness: { value: 0.00, clicked: false },
    Flexibility: { value: 0.00, clicked: false },
    SignificantRisks: { value: 0.00, clicked: false },
    TeamInteraction: { value: 0.00, clicked: false },
    ProcessMaturity: { value: 0.00, clicked: false },
  });
  

  const handleClick = (factor, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [factor]: { value, clicked: true },
      
    }));
    calculateTotal();
  
  };
  

  const calculateTotal = () => {
    const total = Object.values(values).reduce((acc, currentValue) => acc + parseFloat(currentValue.value), 0) + 1.01;
    setTotal(total);
    
    localStorage.setItem('total', total);
    return total.toFixed(2);
  };
  
  useEffect(() => {
    calculateTotal();
  }, [values])
  
  return (
    <div className="container">
      {/* <Conversion/> */}
     
      <div className="table-container">
        <h1>Scale Factors</h1>
        <p>LOC from conversion: {totalLOC}</p>
      <table className="cocomo-table"> 
        <thead>
          <tr>
            <th>Scale Factors</th>
            <th>Very Low (0.05)</th>
            <th>Low (0.04)</th>
            <th>Nominal (0.03)</th>
            <th>High (0.02)</th>
            <th>Very High (0.01)</th>
            <th>Extra High (0.00)</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        <tr>
  <td>Precedentdness</td>
  <td onClick={() => handleClick('Precedentdness', 0.05)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0.05 ? 'clicked' : ''}>Thoroughly unprecedented</td>
  <td onClick={() => handleClick('Precedentdness', 0.04)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0.04 ? 'clicked' : ''}>Largely unprecedented</td>
  <td onClick={() => handleClick('Precedentdness', 0.03)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0.03 ? 'clicked' : ''}>Somewhat unprecedented</td>
  <td onClick={() => handleClick('Precedentdness', 0.02)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0.02 ? 'clicked' : ''}>Generally Familiar</td>
  <td onClick={() => handleClick('Precedentdness', 0.01)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0.01 ? 'clicked' : ''}>Largely Familiar</td>
  <td onClick={() => handleClick('Precedentdness', 0)} className={values.Precedentdness.clicked && values.Precedentdness.value === 0 ? 'clicked' : ''}>Thoroughly familiar</td>
  <td>{values.Precedentdness.value}</td>
</tr>

<tr >
  <td>Flexibility</td>
  <td onClick={() => handleClick('Flexibility', 0.05)} className={values.Flexibility.clicked && values.Flexibility.value === 0.05 ? 'clicked' : ''}>Rigorous</td>
  <td onClick={() => handleClick('Flexibility', 0.04)} className={values.Flexibility.clicked && values.Flexibility.value === 0.04 ? 'clicked' : ''}>Occasional relaxation</td>
  <td onClick={() => handleClick('Flexibility', 0.03)} className={values.Flexibility.clicked && values.Flexibility.value === 0.03 ? 'clicked' : ''}>Some relaxation</td>
  <td onClick={() => handleClick('Flexibility', 0.02)} className={values.Flexibility.clicked && values.Flexibility.value === 0.02 ? 'clicked' : ''}>General conformity</td>
  <td onClick={() => handleClick('Flexibility', 0.01)} className={values.Flexibility.clicked && values.Flexibility.value === 0.01 ? 'clicked' : ''}>Some conformity</td>
  <td onClick={() => handleClick('Flexibility', 0)} className={values.Flexibility.clicked && values.Flexibility.value === 0 ? 'clicked' : ''}>General goals</td>
  <td>{values.Flexibility.value}</td>
</tr>
<tr>
  <td>Significant risks eliminated</td>
  <td onClick={() => handleClick('SignificantRisks', 0.05)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0.05 ? 'clicked' : ''}>Little (20%)</td>
  <td onClick={() => handleClick('SignificantRisks', 0.04)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0.04 ? 'clicked' : ''}>Some (40%)</td>
  <td onClick={() => handleClick('SignificantRisks', 0.03)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0.03 ? 'clicked' : ''}>Often (60%)</td>
  <td onClick={() => handleClick('SignificantRisks', 0.02)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0.02 ? 'clicked' : ''}>Generally (75%)</td>
  <td onClick={() => handleClick('SignificantRisks', 0.01)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0.01 ? 'clicked' : ''}>Mostly (90%)</td>
  <td onClick={() => handleClick('SignificantRisks', 0)} className={values.SignificantRisks.clicked && values.SignificantRisks.value === 0 ? 'clicked' : ''}>Full (100%)</td>
  <td>{values.SignificantRisks.value}</td>
</tr>
<tr>
  <td>Team interaction process</td>
  <td onClick={() => handleClick('TeamInteraction', 0.05)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0.05 ? 'clicked' : ''}>Very Difficult</td>
  <td onClick={() => handleClick('TeamInteraction', 0.04)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0.04 ? 'clicked' : ''}>Some difficulty interactions</td>
  <td onClick={() => handleClick('TeamInteraction', 0.03)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0.03 ? 'clicked' : ''}>Basically cooperative interactions</td>
  <td onClick={() => handleClick('TeamInteraction', 0.02)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0.02 ? 'clicked' : ''}>Largely cooperative</td>
  <td onClick={() => handleClick('TeamInteraction', 0.01)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0.01 ? 'clicked' : ''}>Highly cooperative</td>
  <td onClick={() => handleClick('TeamInteraction', 0)} className={values.TeamInteraction.clicked && values.TeamInteraction.value === 0 ? 'clicked' : ''}>Seamless interactions</td>
  <td>{values.TeamInteraction.value}</td>
</tr>
<tr>
  <td>Process maturity</td>
  <td onClick={() => handleClick('ProcessMaturity', 0.05)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0.05 ? 'clicked' : ''}>SW-CMM Level 1 Lower</td>
  <td onClick={() => handleClick('ProcessMaturity', 0.04)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0.04 ? 'clicked' : ''}>SW-CMM Level 1 Upper</td>
  <td onClick={() => handleClick('ProcessMaturity', 0.03)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0.03 ? 'clicked' : ''}>SW-CMM Level 2</td>
  <td onClick={() => handleClick('ProcessMaturity', 0.02)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0.02 ? 'clicked' : ''}>SW-CMM Level 3</td>
  <td onClick={() => handleClick('ProcessMaturity', 0.01)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0.01 ? 'clicked' : ''}>SW-CMM Level 4</td>
  <td onClick={() => handleClick('ProcessMaturity', 0)} className={values.ProcessMaturity.clicked && values.ProcessMaturity.value === 0 ? 'clicked' : ''}>SW-CMM Level 5</td>
  <td>{values.ProcessMaturity.value}</td>
</tr>

        </tbody>
        <tfoot>
          <tr>
            <td>Add</td>
            <td colSpan="7">1.01</td>
          </tr>
          <tr>
            <td>Total</td>
            <td colSpan="7">{total}</td>
          </tr>
        </tfoot>
      </table>
    
      
       </div>
       <Eaf total={total} totalLOC={totalLOC}/>
    </div>
  );
}

export default Cocomo;
