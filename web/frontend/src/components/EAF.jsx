import { useState } from 'react';
import './EAF.css'; 
import { useEffect } from 'react';
import Effort from './Effort.jsx';
function Eaf({total, totalLOC}) {

  const [eaf, setEaf] = useState(0.00);
  console.log(total);

  const [values, setValues] = useState({
    RCPX: { value: 0.0, clicked: false },
    RUSE: { value: 0.0, clicked: false },
    PDIF: { value: 0.0, clicked: false },
    PERS: { value: 0.0, clicked: false },
    PREX: { value: 0.0, clicked: false },
    FCIL: { value: 0.0, clicked: false },
    SCED: { value: 0.0, clicked: false },
  });

  const calculateTotal = () => {
    const eaftotal = Object.values(values).reduce((acc, { value }) => acc * value, 1);
    setEaf(eaftotal);
    localStorage.setItem('eaf', eaftotal);
    return eaftotal.toFixed(4);
  };

  const handleClick = (factor, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [factor]: { value, clicked: true },
    }));
    calculateTotal();
  };

  useEffect(() => {
    calculateTotal();
  }, [values]); // Run the effect whenever values change

  return (
    <div className="container">
      
      <header>
        <h1>Effort Adjustment Factors</h1>
      </header>

      <div className="table-container">
        <h1>EAF Table</h1>
        <p>{total}</p>
        <p>LOC from conversion: {totalLOC}</p>
        <table className="eaf-table">
          <thead>
            <tr>
              <th>Scale Factors</th>
              <th>Extra Low</th>
              <th>Very Low</th>
              <th>Low</th>
              <th>Nominal</th>
              <th>High</th>
              <th>Very High</th>
              <th>Extra High</th>
              <th>Value</th>
            </tr>
          </thead>
            <tbody>
            <tr>
              <td>RCPX</td>
              <td onClick={() => handleClick('RCPX', 0.73)} className={values.RCPX.clicked && values.RCPX.value === 0.73 ? 'clicked' : ''}>0.73</td>
              <td onClick={() => handleClick('RCPX', 0.81)} className={values.RCPX.clicked && values.RCPX.value === 0.81 ? 'clicked' : ''}>0.81</td>
              <td onClick={() => handleClick('RCPX', 0.98)} className={values.RCPX.clicked && values.RCPX.value === 0.98 ? 'clicked' : ''}>0.98</td>
              <td onClick={() => handleClick('RCPX', 1.0)} className={values.RCPX.clicked && values.RCPX.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('RCPX', 1.30)} className={values.RCPX.clicked && values.RCPX.value === 1.30 ? 'clicked' : ''}>1.30</td>
              <td onClick={() => handleClick('RCPX', 1.74)} className={values.RCPX.clicked && values.RCPX.value === 1.74 ? 'clicked' : ''}>1.74</td>
              <td onClick={() => handleClick('RCPX', 2.38)} className={values.RCPX.clicked && values.RCPX.value === 2.38 ? 'clicked' : ''}>2.38</td>

              <td>{values.RCPX.value}</td>
            </tr>
            <tr>
              <td>RUSE</td>
              <td>-</td>
              <td>-</td>
              <td onClick={() => handleClick('RUSE', 0.95)} className={values.RUSE.clicked && values.RUSE.value === 0.95 ? 'clicked' : ''}>0.95</td>
              <td onClick={() => handleClick('RUSE', 1.0)} className={values.RUSE.clicked && values.RUSE.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('RUSE', 1.07)} className={values.RUSE.clicked && values.RUSE.value === 1.07 ? 'clicked' : ''}>1.07</td>
              <td onClick={() => handleClick('RUSE', 1.15)} className={values.RUSE.clicked && values.RUSE.value === 1.15 ? 'clicked' : ''}>1.15</td>
              <td onClick={() => handleClick('RUSE', 1.24)} className={values.RUSE.clicked && values.RUSE.value === 1.24 ? 'clicked' : ''}>1.24</td>

              <td>{values.RUSE.value}</td>
            </tr>
            <tr>
              <td>PDIF</td>
              <td>-</td>
              <td>-</td>
              <td onClick={() => handleClick('PDIF', 0.87)} className={values.PDIF.clicked && values.PDIF.value === 0.87 ? 'clicked' : ''}>0.87</td>
              <td onClick={() => handleClick('PDIF', 1.0)} className={values.PDIF.clicked && values.PDIF.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('PDIF', 1.29)} className={values.PDIF.clicked && values.PDIF.value === 1.29 ? 'clicked' : ''}>1.29</td>
              <td onClick={() => handleClick('PDIF', 1.81)} className={values.PDIF.clicked && values.PDIF.value === 1.81 ? 'clicked' : ''}>1.81</td>
              <td onClick={() => handleClick('PDIF', 2.61)} className={values.PDIF.clicked && values.PDIF.value === 2.61 ? 'clicked' : ''}>2.61</td>

              <td>{values.PDIF.value}</td>
            </tr>
            <tr>
              <td>PERS</td>
              <td onClick={() => handleClick('PERS', 2.12)} className={values.PERS.clicked && values.PERS.value === 2.12 ? 'clicked' : ''}>2.12</td>
              <td onClick={() => handleClick('PERS', 1.62)} className={values.PERS.clicked && values.PERS.value === 1.62 ? 'clicked' : ''}>1.62</td>
              <td onClick={() => handleClick('PERS', 1.26)} className={values.PERS.clicked && values.PERS.value === 1.26 ? 'clicked' : ''}>1.26</td>
              <td onClick={() => handleClick('PERS', 1.0)} className={values.PERS.clicked && values.PERS.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('PERS', 0.83)} className={values.PERS.clicked && values.PERS.value === 0.83 ? 'clicked' : ''}>0.83</td>
              <td onClick={() => handleClick('PERS', 0.63)} className={values.PERS.clicked && values.PERS.value === 0.63 ? 'clicked' : ''}>0.63</td>
              <td onClick={() => handleClick('PERS', 0.50)} className={values.PERS.clicked && values.PERS.value === 0.50 ? 'clicked' : ''}>0.50</td>

              <td>{values.PERS.value}</td>
            </tr>
            <tr>
              <td>PREX</td>
              <td onClick={() => handleClick('PREX', 1.59)} className={values.PREX.clicked && values.PREX.value === 1.59 ? 'clicked' : ''}>1.59</td>
              <td onClick={() => handleClick('PREX', 1.33)} className={values.PREX.clicked && values.PREX.value === 1.33 ? 'clicked' : ''}>1.33</td>
              <td onClick={() => handleClick('PREX', 1.12)} className={values.PREX.clicked && values.PREX.value === 1.12 ? 'clicked' : ''}>1.12</td>
              <td onClick={() => handleClick('PREX', 1.0)} className={values.PREX.clicked && values.PREX.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('PREX', 0.87)} className={values.PREX.clicked && values.PREX.value === 0.87 ? 'clicked' : ''}>0.87</td>
              <td onClick={() => handleClick('PREX', 0.71)} className={values.PREX.clicked && values.PREX.value === 0.71 ? 'clicked' : ''}>0.71</td>
              <td onClick={() => handleClick('PREX', 0.62)} className={values.PREX.clicked && values.PREX.value === 0.62 ? 'clicked' : ''}>0.62</td>

              <td>{values.PREX.value}</td>
            </tr>
            <tr>
              <td>FCIL</td>
              <td onClick={() => handleClick('FCIL', 1.43)} className={values.FCIL.clicked && values.FCIL.value === 1.43 ? 'clicked' : ''}>1.43</td>
              <td onClick={() => handleClick('FCIL', 1.30)} className={values.FCIL.clicked && values.FCIL.value === 1.30 ? 'clicked' : ''}>1.30</td>
              <td onClick={() => handleClick('FCIL', 1.10)} className={values.FCIL.clicked && values.FCIL.value === 1.10 ? 'clicked' : ''}>1.10</td>
              <td onClick={() => handleClick('FCIL', 1.0)} className={values.FCIL.clicked && values.FCIL.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('FCIL', 0.87)} className={values.FCIL.clicked && values.FCIL.value === 0.87 ? 'clicked' : ''}>0.87</td>
              <td onClick={() => handleClick('FCIL', 0.73)} className={values.FCIL.clicked && values.FCIL.value === 0.73 ? 'clicked' : ''}>0.73</td>
              <td onClick={() => handleClick('FCIL', 0.62)} className={values.FCIL.clicked && values.FCIL.value === 0.62 ? 'clicked' : ''}>0.62</td>

              <td>{values.FCIL.value}</td>
            </tr>
            <tr>
              <td>SCED</td>
              <td>-</td>
              <td onClick={() => handleClick('SCED', 1.43)} className={values.SCED.clicked && values.SCED.value === 1.43 ? 'clicked' : ''}>1.43</td>
              <td onClick={() => handleClick('SCED', 1.14)} className={values.SCED.clicked && values.SCED.value === 1.14 ? 'clicked' : ''}>1.14</td>
              <td onClick={() => handleClick('SCED', 1.0)} className={values.SCED.clicked && values.SCED.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('SCED', 1.0)} className={values.SCED.clicked && values.SCED.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td onClick={() => handleClick('SCED', 1.0)} className={values.SCED.clicked && values.SCED.value === 1.0 ? 'clicked' : ''}>1.0</td>
              <td>-</td>

              <td>{values.SCED.value}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td colSpan="7">{eaf}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Effort eaf={eaf} total={total} totalLOC={totalLOC}/>
    </div>
  );
}

export default Eaf;
