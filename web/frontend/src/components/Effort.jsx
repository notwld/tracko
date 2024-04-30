import React, { useState, useEffect } from 'react';
import effortFormulaImage from '../assets/effort.png';
import scheduleImage from '../assets/schedule.png';
import pmAutoFormulaImage from '../assets/effortCodeIntegration.png';
import eslocFormulaImage from '../assets/esloc.png';
import './Effort.css';

function Effort({eaf,total,totalLOC}) {
    const [effort, setEffort] = useState(0.0);
    const [asloc, setAsloc] = useState();
    const [ATPROD, setATPROD] = useState();
    const [AT, setAT] = useState();
    const [AAM, setAAM] = useState();

    const scalefactors = total;
    const effortcostdrivers = eaf;
    const sloc = totalLOC/1000;
    const B = scalefactors;
    const C = 3.67;
    console.log("Huzzu king: ",totalLOC);

    // const ASLOC=20000;
    // const AT = 30; // Example value for average time per line of code (in minutes)
    // const ATPROD = 2400; // Example value for average time per programmer (in hours)
    // const AAM = 0.7056 // Example value for average time per programmer (in hours)

    const calculatePmAuto = () => {
        const PMAuto = (asloc * AT / 100) / ATPROD;
        return PMAuto.toFixed(2);
    }
    const calculateEsloc = () => {
        const esloc = asloc * (1 - AT / 100) * AAM;
        return Number(esloc);
    }
    function handleAslocChange(e) {
        setAsloc(e.target.value);
    }
    function handleATChange(e) {
        setAT(e.target.value);
    }
    function handleATPRODChange(e) {
        setATPROD(e.target.value);
    }
    function handleAAMChange(e) {
        setAAM(e.target.value);
    }

    useEffect(() => {
        // Calculate effort and set it in the state
        const calculatedEffort = 2.45 * Math.pow(sloc, scalefactors) * effortcostdrivers;
        setEffort(calculatedEffort);
        localStorage.setItem('effort', calculatedEffort);
    }, [sloc, scalefactors, effortcostdrivers]);

    const calculatedEffort = 2.45 * Math.pow(sloc, scalefactors) * effortcostdrivers;
    const calculatedSchedule = C * Math.pow(effort, (0.33 + 0.2 * (B - 1.01)));

    return (
        <div className="container">
            <header>
                
                <h1>Effort Calculation</h1>
                {/* <p>{eaf}</p> */}
                <p>LOC from conversion Huzzu king: {totalLOC}</p>
                <p>Eaf previous Calculated: {eaf}</p><br/>
                <p>Total: {total}</p>
            </header>

            <img src={effortFormulaImage} className='effort-formula-image' alt='effort formula' />
            <div className="data">
                <h2>Data= </h2>
                <p>Scale Factors= {scalefactors}</p>
                <p>Effort Adjustment Factors= {effortcostdrivers}</p>
                <p>Source Lines of Code= {sloc}</p>
                <p>B=Constant= 2.45</p>
                <p><h2>Effort Calculated = {calculatedEffort}</h2></p>
            </div>
            <h1 className='schedule-title'>Schedule Calculation</h1>
            <img src={scheduleImage} className='effort-formula-image' alt='schedule formula' />
            <div className="data">
                <h2>Data= </h2>
                <p>C = Constant= 3.67</p>
                <p>B = Scale Factors= {B}</p>
                <p>Effort= {calculatedEffort} </p>
                <p><h2>Effort Calculated = {calculatedSchedule}</h2></p>
            </div>
            <h1 className='pm-auto-title'>PM Auto Calculation</h1>

            <img src={pmAutoFormulaImage} className='pmauto-formula-image' alt='pm auto formula' />
            <div className="data">
                <h2>Data= </h2>
                <input type='number' placeholder='Enter ASLOC' value={asloc} onChange={handleAslocChange}></input><br />
                <input type='number' placeholder='Enter AT' value={AT} onChange={handleATChange}></input><br />
                <input type='number' placeholder='Enter ATPROD' value={ATPROD} onChange={handleATPRODChange}></input><br />

                {/* <p>ASLOC = {asloc}</p>
                <p>AT = {AT}</p>
                <p>ATPROD = {ATPROD}</p> */}
                <p><h2>Effort Calculated = {calculatePmAuto()} person-months</h2></p>
            </div>
            <h1 className='esloc-title'>ESLOC Calculation</h1>
            <img src={eslocFormulaImage} className='esloc-formula-image' alt='esloc formula' />
            <div className="data">
                <h2>Data= </h2>
                <p>ASLOC = {asloc ? asloc : 'not defined yet'}</p>
                <p>AT = {AT ? AT : 'not defined yet'}</p>
                <input type='number' placeholder='Enter AAM' value={AAM} onChange={handleAAMChange}></input>

                {/* <p>AAM= {AAM}</p> */}
                <p><h2>ESLOC = {calculateEsloc()} LOC</h2></p>
                
            </div>

        </div>
    );
}

export default Effort;
