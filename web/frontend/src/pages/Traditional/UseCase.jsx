import { useState } from "react";
import "../Traditional/StyleSheets/UseCase.css";
import {Link} from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../config/firebase";
import { onSnapshot, updateDoc, query ,deleteDoc, doc} from 'firebase/firestore';

function UseCase() {
    const [simpleUseCase, setSimpleUseCase] = useState("");
    const [averageUseCase, setAverageUseCase] = useState("");
    const [complexUseCase, setComplexUseCase] = useState("");

    function handleSimpleInputChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setSimpleUseCase(value);
    }
    
    function handleAverageInputChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setAverageUseCase(value);
    }
    
    function handleComplexInputChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setComplexUseCase(value);
    }
    

    const totalUseCase = simpleUseCase * 5 + averageUseCase * 10 + complexUseCase * 15;
    const [simpleActor, setSimpleActor] = useState("");
    const [averageActor, setAverageActor] = useState("");
    const [complexActor, setComplexActor] = useState("");
    const totalActorWeight = simpleActor * 1 + averageActor * 2 + complexActor * 3;

    const [NoOfPersons,setNoOfPersons] = useState("");
    const [UcpPersonMonth, setUcpPersonMonth] = useState("");
    const [cost, setCost] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedData, setSavedData] = useState([]);


    function handleSimpleActorChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setSimpleActor(value);
    }
    
    function handleAverageActorChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setAverageActor(value);
    }
    
    function handleComplexActorChange(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setComplexActor(value);
    }
    

    function handleNoOfPersons(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setNoOfPersons(value);
    }
    function handleUcpPersonMonth(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setUcpPersonMonth(value);

    }
    function handleCost(e) {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setCost(value);
    }

    

    const [factors, setFactors] = useState([
        { factor: "Distributed system", weight: 0, assessment: 0 },
        { factor: "Performance objectives", weight: 0, assessment: 0 },
        { factor: "End-user efficiency", weight: 0, assessment: 0 },
        { factor: "Complex processing", weight: 0, assessment: 0 },
        { factor: "Reusable code", weight: 0, assessment: 0 },
        { factor: "Easy to install", weight: 0, assessment: 0 },
        { factor: "Easy to use", weight: 0, assessment: 0 },
        { factor: "Portable", weight: 0, assessment: 0 },
        { factor: "Easy to change", weight: 0, assessment: 0 },
        { factor: "Concurrent use", weight: 0, assessment: 0 },
        { factor: "Security", weight: 0, assessment: 0 },
        { factor: "Access for third parties", weight: 0, assessment: 0 },
        { factor: "Training needs", weight: 0, assessment: 0 }
    ]);

    const totalTfactor = factors.reduce((acc, factor) => acc + factor.weight * factor.assessment, 0);

    const handleWeightChange = (index, value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < 0) return;
        const updatedFactors = [...factors];
        updatedFactors[index].weight = parsedValue;
        setFactors(updatedFactors);
    };

    const handleAssessmentChange = (index, value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < 0) return;
        const updatedFactors = [...factors];
        updatedFactors[index].assessment = parsedValue;
        setFactors(updatedFactors);
    };

    const [environmentalFactors, setEnvironmentalFactors] = useState([
        { factor: "Familiar with the development process", weight: 0, assessment: 0 },
        { factor: "Application experience", weight: 0, assessment: 0 },
        { factor: "Object-oriented experience", weight: 0, assessment: 0 },
        { factor: "Lead analyst capability", weight: 0, assessment: 0 },
        { factor: "Motivation", weight: 0, assessment: 0 },
        { factor: "Stable requirements", weight: 0, assessment: 0 },
        { factor: "Part-time staff", weight: 0, assessment: 0 },
        { factor: "Difficult programming language", weight: 0, assessment: 0 }
    ]);

    const totalEnvironmentalFactorImpact = environmentalFactors.reduce((acc, factor) => acc + factor.weight * factor.assessment, 0);

    const handleEnvironmentalWeightChange = (index, value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < 0) return;
        const updatedFactors = [...environmentalFactors];
        updatedFactors[index].weight = parsedValue;
        setEnvironmentalFactors(updatedFactors);
    };

    const handleEnvironmentalAssessmentChange = (index, value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue) || parsedValue < 0) return;
        const updatedFactors = [...environmentalFactors];
        updatedFactors[index].assessment = parsedValue;
        setEnvironmentalFactors(updatedFactors);
    };

    const calculateUUCP = () => {
        return totalUseCase + totalActorWeight;
    };

    const calculateTF = () => {
        return 0.6 + (0.01 * totalTfactor);
    };

    const calculateEF = () => {
        return (1.4 + (-0.03 * totalEnvironmentalFactorImpact));
    };

    const calculateUCP = () => {
        return ((totalUseCase + totalActorWeight) * (1.4 + (-0.03 * totalEnvironmentalFactorImpact)) * (0.6 + (0.01 * totalTfactor))).toFixed(2);
    };

    const calculateDurationInMonths = () => {
      
        return (calculateEffortinPersonMonths()/NoOfPersons).toFixed(2);
    };
    // const calculateDurationInMonths = () => {
    //     const durationInHrs = calculateUCP() * teamProgressDurationPerUseCase;
    //     const durationInDays = durationInHrs / 24;
    //     const durationInMonths = durationInDays / 30.44;
    //     return durationInMonths.toFixed(1);
    // };

    // const calculateDurationinDays = () => {
    //     const durationInHrs = calculateUCP() * teamProgressDurationPerUseCase;
    //     const durationInDays = durationInHrs / 24;
    //     return durationInDays.toFixed(1);
    // };

    // const calculateDurationinHrs = () => {
    //     const durationInHrs = calculateUCP() * teamProgressDurationPerUseCase;
    //     return durationInHrs.toFixed(1);
    // };
    const calculateEffortinPersonMonths = () => {
        return (calculateUCP()/UcpPersonMonth).toFixed(2);
    };
    const calculateCost = () => {
        return (calculateUCP() * cost).toFixed(2);
    }

    const save = ()=>{
        const data = {
            ucp: calculateUCP(),
            duration: calculateDurationInMonths(),
            effort: calculateEffortinPersonMonths(),
            cost: calculateCost(),
            staff: NoOfPersons,
            ucpPersonMonth: UcpPersonMonth,
            costPerUcp: cost,
        }
        addDoc(collection(database, "useCaseTraditional"), data).then(()=>
            alert("Data Saved")
        )
        

    }
    const fetchSavedData = () => {
        const q = query(collection(database, "useCaseTraditional"));
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
          await deleteDoc(doc(database, "useCaseTraditional", docId));
          console.log("Document successfully deleted!");
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      };

    return (
        <div className="use-case-traditional">
            <h1 style={{marginLeft:"200px"}}>Use Case</h1>
            <div className="Use-Case-Calculations" style={{width:"80%",marginLeft:"200px"}}>
                <p>Use Case Point <strong>(UCP)</strong> = {(calculateUCP()) === 0 ? "not yet calculated" : (calculateUCP())}</p>
                {/* <p>Duration = {calculateDurationinHrs()} Hours</p>
                <p>Duration = {calculateDurationinDays()} Days</p> */}
                <p>Duration = {calculateDurationInMonths()} Months</p>
                <p>Effort = {calculateEffortinPersonMonths()} Person-Month</p>
                <p>Cost = {calculateCost()} $</p>
                <div>
                <button className='btn btn-primary' onClick={save}>Save</button>
        <button className='btn btn-secondary' style={{marginLeft:"10px"}} onClick={openModal}>History</button>

                </div>
               
            </div>
            <div style={{marginLeft:"200px"}}>
            <p>Enter No. of Persons</p>
            <input
                type="number"
                placeholder="Enter no. of Persons"
                onChange={handleNoOfPersons}
                value={NoOfPersons}
                min="0"
            />
            {/* <p>{NoOfPersons}</p>
            <p>{calculateEffortinPersonMonths()/NoOfPersons}</p> */}
            <p>Enter UCP Person-month</p>
            <input

                type="number"
                placeholder="Enter UCP Person-month"
                onChange={handleUcpPersonMonth}

                value={UcpPersonMonth}
                min="0"
                />
            <p>Cost per UCP</p>
            <input type="number" placeholder="Enter cost per UCP" onChange={handleCost} value={cost} min="0" />
            <h2><strong>(UUCW)</strong> Unadjusted Use Case Weight</h2>
            </div>
            

            
            <table className="table table-striped table-hover" style={{width:"80%"}}>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Weight</th>
                        <th>Number of Use Cases</th>
                        <th>Product</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Simple</strong></td>
                        <td>5</td>
                        <td><input type="number" placeholder="enter no. of use cases" onChange={handleSimpleInputChange} value={simpleUseCase} min="0" /></td>
                        <td>{5 * simpleUseCase}</td>
                    </tr>
                    <tr>
                        <td><strong>Average</strong></td>
                        <td>10</td>
                        <td><input type="number" placeholder="enter no. of use cases" onChange={handleAverageInputChange} value={averageUseCase} min="0" /></td>
                        <td>{10 * averageUseCase}</td>
                    </tr>
                    <tr>
                        <td><strong>Complex</strong></td>
                        <td>15</td>
                        <td><input type="number" placeholder="enter no. of use cases" onChange={handleComplexInputChange} value={complexUseCase} min="0" /></td>
                        <td>{15 * complexUseCase}</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td></td>
                        <td>{totalUseCase}</td>
                    </tr>
                </tbody>
            </table>
            <h2 style={{marginLeft:"200px"}}><strong>(UAW)</strong> Unadjusted Actor Weight </h2>
            <table className="table table-striped table-hover" style={{width:"80%"}}>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Weight</th>
                        <th>Number of Actors</th>
                        <th>Product</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Simple</strong></td>
                        <td>1</td>
                        <td><input type="number" placeholder="enter no. of Actors" onChange={handleSimpleActorChange} value={simpleActor} min="0" /></td>
                        <td>{1 * simpleActor}</td>
                    </tr>
                    <tr>
                        <td><strong>Average</strong></td>
                        <td>2</td>
                        <td><input type="number" placeholder="enter no. of Actors" onChange={handleAverageActorChange} value={averageActor} min="0" /></td>
                        <td>{2 * averageActor}</td>
                    </tr>
                    <tr>
                        <td><strong>Complex</strong></td>
                        <td>3</td>
                        <td><input type="number" placeholder="enter no. of Actors" onChange={handleComplexActorChange} value={complexActor} min="0" /></td>
                        <td>{3 * complexActor}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td><strong>Total</strong></td>
                        <td>{totalActorWeight}</td>
                    </tr>
                </tbody>
            </table>
            <h2  style={{marginLeft:"200px"}}><strong>(TCF)</strong> Technical Complexity Factor</h2>
            <table className="table table-striped table-hover" style={{width:"80%"}}>
                <thead>
                    <tr>
                        <th>Factor</th>
                        <th>Weight</th>
                        <th>Assessment</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    {factors.map((factor, index) => (
                        <tr key={index}>
                            <td><strong>{factor.factor}</strong></td>
                            <td><input type="number" value={factor.weight} onChange={(e) => handleWeightChange(index, e.target.value)} min="0" /></td>
                            <td><input type="number" value={factor.assessment} onChange={(e) => handleAssessmentChange(index, e.target.value)} min="0" /></td>
                            <td>{factor.weight * factor.assessment}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td><strong>Tfactor</strong></td>
                        <td>{totalTfactor}</td>
                    </tr>
                </tbody>
            </table>
            <h2 style={{marginLeft:"200px"}}><strong>(EF)</strong> Environmental Factor</h2>
            <table className="table table-striped table-hover" style={{width:"80%"}}>
                <thead>
                    <tr>
                        <th>Factor</th>
                        <th>Weight</th>
                        <th>Assessment</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    {environmentalFactors.map((factor, index) => (
                        <tr key={index}>
                            <td><strong>{factor.factor}</strong></td>
                            <td><input type="number" value={factor.weight} onChange={(e) => handleEnvironmentalWeightChange(index, e.target.value)} min="0" /></td>
                            <td><input type="number" value={factor.assessment} onChange={(e) => handleEnvironmentalAssessmentChange(index, e.target.value)} min="0" /></td>
                            <td>{factor.weight * factor.assessment}</td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td><strong>Efactor</strong></td>
                        <td>{totalEnvironmentalFactorImpact}</td>
                    </tr>
                </tbody>
            </table>
            {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">History</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body" >
                <table className="table table-bordered" style={{marginLeft:"0px"}}>
                  <thead>
                    <tr>
                      <th>Use Case Point (UCP)</th>
                      <th>Duration (months)</th>
                      <th>Effort (person-month)</th>
                      <th>Cost ($)</th>
                      <th>Staff</th>
                     
                      <th>UCP (person-month)</th>
                      <th>Cost per UCP</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  
{savedData.map((data, index) => (
  <tr key={index}>
    <td>{data.ucp}</td>
    <td>{data.duration}</td>
    <td>{data.effort}</td>
    <td>{data.cost} $</td>
    <td>{data.staff}</td>
    <td>{typeof data.ucpPersonMonth === 'number' ? data.ucpPersonMonth.toFixed(2) : 'N/A'}</td>
    <td>{typeof data.costPerUcp === 'number' ? data.costPerUcp.toFixed(1) : 'N/A'} $</td>
    <td><button className='btn btn-danger' onClick={() => deleteRow(index)}>Delete</button></td>
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
            <div className='references' style={{marginLeft:"200px",marginBottom:"10px"}}>
                <h3>References</h3>
                <ul>
                  
                    
                    <li>Murali Chemuturi, <Link to={"https://books.google.com.pk/books?id=IwEOB2Mfzx0C&redir_esc=y"}>Software Estimation Best Practices, Tools and Techniques for Software Project Estimators</Link>, J.Ross Publishing, 2009, p. 84-87</li>
                    <li>Dennis, Alan R., Barbara Haley Wixom, and David Tegarden.<Link to={"https://books.google.com.pk/books?id=iUG7AAAACAAJ&redir_esc=y"}>Systems Analysis and Design with UML Version 2.0: An Object-Oriented Approach, Third Edition</Link>, John Wiley & Sons, 2009, Chapter 5 - Functional Modeling</li>
                    <li>Dennis, Alan R., Barbara Haley Wixom, and David Tegarden. Systems Analysis and Design with UML Version 2.0: An Object-Oriented Approach, Fourth Edition, John Wiley & Sons, 2012, Chapter 2 - Project Management</li>
                    <li>Carl Friedrich Kress, Olivier Hummel, Mahmudul Huq: <Link to={"https://ceur-ws.org/Vol-1138/re4p21.pdf"}>A Practical Approach for Reliable Pre-Project Effort Estimation</Link>. In: CEUR Workshop Proceedings, Vol. 1138, p. 23, 2014</li>
                    <li>Wikipedia contributors. (2022, January 17). Use case points. Retrieved from <Link to={"https://en.wikipedia.org/wiki/Use_case_points"}>Link</Link></li>
                </ul>
                </div>
        </div>
    );
}

export default UseCase;
