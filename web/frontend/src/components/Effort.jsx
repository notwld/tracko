import React, { useState, useEffect } from 'react';
import effortFormulaImage from '../assets/effort.png';
import scheduleImage from '../assets/schedule.png';
import pmAutoFormulaImage from '../assets/effortCodeIntegration.png';
import eslocFormulaImage from '../assets/esloc.png';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Link } from "react-router-dom";

import '../components/EAF.css';
import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '../config/firebase';
import { onSnapshot, updateDoc, query ,deleteDoc, doc} from 'firebase/firestore';


function Effort({ eaf, total, totalLOC }) {
    const [effort, setEffort] = useState(0.0);
    const [asloc, setAsloc] = useState();
    const [ATPROD, setATPROD] = useState();
    const [AT, setAT] = useState();
    const [AAM, setAAM] = useState();

    const scalefactors = total;
    const effortcostdrivers = eaf;
    const sloc = totalLOC / 1000;
    const B = scalefactors;
    const C = 3.67;
    console.log("Huzzu king: ", totalLOC);
    const [costPerPersonMonth, setCostPerPersonMonth] = useState(0.00);
    function handleCostPerPersonsMonth(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setCostPerPersonMonth(value);

    }

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

    const pmAuto = (
        <Popover id="popover-basic" className="custom-popover">
            <Popover.Header as="h3">PMAuto</Popover.Header>
            <Popover.Body>
                <span>
                    <p>For code that is automatically generated, the reuse model estimates the number of person months required to integrate this code.</p>
                    <p>The formula for effort estimation is:</p>
                    <p>
                        <strong>PMAuto = (ASLOC x AT/100) / ATPROD</strong>
                    </p>
                    <p><strong>ASLOC</strong> is Adapted Source Lines of Code</p>
                    <p><strong>AT</strong> is the percentage of adapted code that is automatically generated.</p>
                    <p><strong>ATPROD</strong> is the productivity of engineers in integrating such code.</p>
                    <p>Boehm et al. (Boehm, et al., 2000) have measured <strong>ATPROD</strong> to be about 2,400 source statements per month.</p>

                </span>
            </Popover.Body>
        </Popover>
    );

    const esLoc = (
        <Popover id="popover-basic" className="custom-popover" >
            <Popover.Header as="h3">Esloc</Popover.Header>
            <Popover.Body>
                <p>When code has to be understood and integrated:</p>
                <p><strong>ESLOC = ASLOC * (1-AT/100) * AAM</strong>.</p>
                <p><strong>ASLOC</strong> is Adapted Source Lines of Code</p>
                <p><strong>AT</strong> is the percentage of adapted code that is automatically generated.</p>

                <p><strong>ESLOC</strong> is Equivalent Source Lines of Code</p>
                <p><strong>AAM</strong> is the Adaptation Adjustment Multiplier computed from:</p>
                <ul>
                    <li>The costs of changing the reused code,</li>
                    <li>The costs of understanding how to integrate the code, and</li>
                    <li>The costs of reuse decision making.</li>
                </ul>
            </Popover.Body>
        </Popover>
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedData, setSavedData] = useState([]);
    // const save = () => {
    //     const data = {
    //         effort: calculatedEffort,
    //         cost: Math.floor(calculatedEffort * costPerPersonMonth),
    //         schedule: calculatedSchedule,
    //         esloc: calculateEsloc(),
    //     }
    //     addDoc(collection(database, "cocomo2")).then(() => {
    //         alert("Data Saved")
    //     })
    // }
    const save = () => {
        const data = {
            effort: calculatedEffort.toFixed(2),
            cost: (calculatedEffort * costPerPersonMonth).toFixed(2),
            schedule: calculatedSchedule.toFixed(2),
            esloc: calculateEsloc().toFixed(2),

        };

        addDoc(collection(database, "cocomo2"), data).then(() => {
            alert("Data has been saved");
        }).catch((error) => {
            alert("Error adding document: ", error);
        });
    }
    const fetchSavedData = () => {
        const q = query(collection(database, "cocomo2"));
        onSnapshot(q, (querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() }); // Include the document ID in the object
          });
          console.log("Retrieved data from Firestore:", data); // Log the retrieved data
          setSavedData(data);
        });
      };
      
    const openModal = () => {
        fetchSavedData();
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
      const deleteRow = async (index) => {
        const docId = savedData[index].id; // Assuming each document in Firestore has a unique ID
        const newData = [...savedData];
        newData.splice(index, 1);
        setSavedData(newData);
      
        try {
          await deleteDoc(doc(database, "cocomo2", docId));
          console.log("Document successfully deleted!");
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      };


    return (
        <div className="container">
            <div style={{ marginLeft: "200px" }}>
                <header>

                    <h3><strong>Effort Calculation</strong></h3>
                    {/* <p>{eaf}</p>
                <p>LOC from conversion Huzzu king: {totalLOC}</p>
                <p>Eaf previous Calculated: {eaf}</p><br/>
                <p>Total: {total}</p> */}
                </header>

                {/* <img src={effortFormulaImage} className='effort-formula-image' alt='effort formula' /> */}
                <div>
                    <p>Enter Cost per Person-Month</p>
                    <input
                        type="number"
                        placeholder="Enter cost per person-month"
                        onChange={handleCostPerPersonsMonth}
                        value={costPerPersonMonth}
                        min="0"
                    />

                </div>

            </div>
            <div className="output-section" style={{ marginLeft: "200px" }}>
                {/* <h2>Data= </h2> */}
                <p>Scale Factors= {scalefactors}</p>
                <p>Effort Adjustment Factors= {effortcostdrivers.toFixed(2)}</p>
                <p>Source Lines of Code= {sloc}</p>
                <p><strong style={{ color: 'red' }}>Note:</strong> <strong>A</strong> is a constant derived from historical Project data (Currently <strong>A = 2.95</strong> in COCOMOII.2000). Also Boehm proposes that the coefficient <strong>A</strong> should be <strong>2.94</strong> (sometimes <strong>A = 2.45</strong> in initial calibration).</p>
                <p>A = Constant = 2.45</p>
                <p><h2>Effort = {calculatedEffort.toFixed(2)} person-month</h2></p>
                <p><h2>Cost = {Math.floor(calculatedEffort * costPerPersonMonth)} $</h2></p>
            </div>
            <h3 className='schedule-title' style={{ marginLeft: "200px" }}><strong>Schedule Calculation</strong></h3>
            {/* <img src={scheduleImage} className='effort-formula-image' alt='schedule formula' /> */}

            <div className="output-section" style={{ marginLeft: "200px" }}>
                {/* <h2>Data= </h2> */}
                <p>C = Constant= 3.67</p>
                <p>B = Scale Factors= {B}</p>
                <p>Effort= {calculatedEffort.toFixed(2)} person-month </p>
                <p><h2>Schedule = {calculatedSchedule.toFixed(2)} Months</h2></p>

            </div>
            <OverlayTrigger trigger="click" placement='bottom' overlay={pmAuto} >
                <h3 className='pm-auto-title' style={{ marginLeft: "200px" }}><strong>PM Auto Calculation</strong></h3>


            </OverlayTrigger>

            {/* <img src={pmAutoFormulaImage} className='pmauto-formula-image' alt='pm auto formula' /> */}
            <div className="data" style={{ marginLeft: "200px" }}>
                {/* <h2>Data= </h2> */}
                <input type='number' placeholder='Enter ASLOC' value={asloc} onChange={handleAslocChange}></input><br />
                <input type='number' placeholder='Enter AT' value={AT} onChange={handleATChange}></input><br />
                <input type='number' placeholder='Enter ATPROD' value={ATPROD} onChange={handleATPRODChange}></input><br />

                {/* <p>ASLOC = {asloc}</p>
                <p>AT = {AT}</p>
                <p>ATPROD = {ATPROD}</p> */}
                <div className="output-section" >

                    <p>Effort Calculated = {calculatePmAuto()} person-month</p>
                </div>
            </div>
            <OverlayTrigger trigger="click" placement='bottom' overlay={esLoc}  >
                <h3 className='esloc-title' style={{ marginLeft: "200px" }}><strong>ESLOC Calculation</strong></h3></OverlayTrigger>
            {/* <img src={eslocFormulaImage} className='esloc-formula-image' alt='esloc formula' /> */}
            <div className="data" style={{ marginLeft: "200px" }}>
                {/* <h2>Data= </h2> */}
                <div className="output-section">
                    <p>ASLOC = {asloc ? asloc : 'not defined yet'}</p>
                    <p>AT = {AT ? AT : 'not defined yet'}</p>
                    <input type='number' placeholder='Enter AAM' value={AAM} onChange={handleAAMChange}></input>
                </div>
                {/* <p>AAM= {AAM}</p> */}


            </div>
            <div className="output-section" style={{ marginLeft: "200px" }}>
                <p>ESLOC = {calculateEsloc()} LOC</p>
                <button className="btn btn-primary" onClick={() => {
                    save()
                }}>
                    Save
                </button>
                <button className='btn btn-secondary' style={{marginLeft:"10px"}} onClick={openModal}>History</button>

            </div>
            {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">History</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
  <table className="table table-bordered" style={{ marginLeft: "0px" }}>
    <thead>
      <tr>
      <th>Effort (person-month)</th>
    
        <th>Cost ($)</th>
        <th>Schedule (Months)</th>
        <th>ESLOC</th>
       
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {savedData.map((data, index) => (
        <tr key={index}>
            <td>{data.effort}</td>
            <td>{data.cost}</td>
            <td>{data.schedule}</td>
            <td>{data.esloc}</td>
          
          <td>
            <button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
            <div className='references' style={{ marginLeft: "45px", width: "1000px", marginBottom: "10px" }}>
                <h3>References</h3>
                <ul>

                    <li>Stutzke, Richard.<Link to={"https://web.archive.org/web/20200328141813/https://uweb.engr.arizona.edu/~ece473/readings/14-Software%20Estimating%20Technology.doc"} >Software Estimating Technology: A Survey</Link>. Archived from the original on 28 March 2020. Retrieved 9 Oct 2016.</li>
                    <li>Boehm, Barry (1981). <Link to={"https://archive.org/details/softwareengineer0000boeh"}>Software Engineering Economics</Link>. Prentice-Hall. ISBN 0-13-822122-7.</li>
                    <li>Barry Boehm, Chris Abts, A. Winsor Brown, Sunita Chulani, Bradford K. Clark, Ellis Horowitz, Ray Madachy, Donald J. Reifer, and Bert Steece. <Link to={"https://en.wikipedia.org/wiki/Software_Cost_Estimation_with_COCOMO_II_(book)"}>Software Cost Estimation with COCOMO II</Link> (with CD-ROM). Englewood Cliffs, NJ:Prentice-Hall, 2000. ISBN 0-13-026692-2</li>
                </ul>
            </div>

        </div>
    );
}

export default Effort;
