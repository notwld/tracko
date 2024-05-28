import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Link, useLocation } from 'react-router-dom';
import "../Traditional/StyleSheets/SimpleFP.css";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../config/firebase";
import { onSnapshot, updateDoc, query ,deleteDoc, doc} from 'firebase/firestore';

function SimpleFP() {
    const [show, setShow] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [outputs, setOutputs] = useState([]);
    const [logicalFiles, setLogicalFiles] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [externalFiles, setExternalFiles] = useState([]);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [CFP, setCFP] = useState("");
    const [FpPersonMonths,setFpPersonMonths] = useState("");
    const [CostofOneFp,setCostofOneFp] = useState("");
    const handleCFPCalculation = (e) => {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setCFP(value);
    };
    const handleFPCalculation = (e) => {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setFpPersonMonths(value);
    };
    const handleCostOfOneFpCalculation = (e) => {
        let value = e.target.value;
        // Convert to number only if it's not empty
        if (value !== "") {
            value = parseFloat(value);
            // If conversion is not successful or the value is negative, return
            if (isNaN(value) || value < 0) return;
        }
        setCostofOneFp(value);
    };

    


    const [showVAFModal, setShowVAFModal] = useState(false);
    const handleQuestionChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };
    const handleVAFQuestionChange = (index, value) => {
        const newAnswers = [...answersVAF];
        newAnswers[index] = value;
        setAnswersVAF(newAnswers);
    };

    const handleSaveQuestions = () => {
        const totalQuestionsSum = answers.reduce((acc, curr) => acc + curr, 0);
        setCount((prevCount) => ({
            ...prevCount,
            questions: totalQuestionsSum
        }));
        setShowQuestionModal(false);
    };
    const handleSaveVAFQuestions = () => {
        const totalQuestionsSum = answersVAF.reduce((acc, curr) => acc + curr, 0);
        setCount((prevCount) => ({
            ...prevCount,
            questionsVAF: totalQuestionsSum
        }));
        setShowVAFModal(false);
    };
    const [count, setCount] = useState({
        externalInputs: 0,
        externalOutputs: 0,
        externalInquiries: 0,
        internalLogicalFiles: 0,
        externalInterfaceFiles: 0,
    });
    const questions = [
        "Does the system require reliable backup and recovery?",
        "Are specialized data communications required to transfer information to or from the application?",
        "Are there distributed processing functions?",
        "Is performance critical?",
        "Will the system run in an existing, heavily utilized operational environment?",
        "Does the system require online data entry?",
        "Does the online data entry require the input transaction to be built over multiple screens or operations?",
        "Are the ILFs updated online?",
        "Are the inputs, outputs, files, or inquiries complex?",
        "Is the internal processing complex?",
        "Is the code designed to be reusable?",
        "Are conversion and installation included in the design?",
        "Is the system designed for multiple installations in different organizations?",
        "Is the application designed to facilitate change and ease of use by the user?"
    ];
    const questionsVAF = [
        "Data Communications",
        "Distributed Data Processing",
        "Performance",
        "Heavily Used Configuration",
        "Transaction Rate",
        "Online Data Entry",
        "End-User Efficiency",
        "Online Update",
        "Complex Processing",
        "Reusability",
        "Installation Ease",
        "Operational Ease",
        "Multiple Sites",
        "Facilitate Change"

    ]

    const [answers, setAnswers] = useState(Array(questions.length).fill(0));
    const [answersVAF, setAnswersVAF] = useState(Array(questionsVAF.length).fill(0));

    const [counts, setCounts] = useState({
        inputs: 0,
        outputs: 0,
        logicalFiles: 0,
        inquiries: 0,
        externalFiles: 0
    });
    const [complexityTable, setComplexityTable] = useState({
        inputs: 'Low',
        outputs: 'Low',
        logicalFiles: 'Low',
        inquiries: 'Low',
        externalFiles: 'Low'
    });
    const [totalByComplexity, setTotalByComplexity] = useState({
        inputs: 0,
        outputs: 0,
        logicalFiles: 0,
        inquiries: 0,
        externalFiles: 0
    });
    const [functionalComplexity, setFunctionalComplexity] = useState({
        inputs: [],
        outputs: [],
        logicalFiles: [],
        inquiries: [],
        externalFiles: []
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addNewField = (componentType) => {
        switch (componentType) {
            case 'inputs':
                setInputs([...inputs, { input: '', rets: '', dets: '' }]);
                setFunctionalComplexity(prev => ({
                    ...prev,
                    inputs: [...prev.inputs, '']
                }));
                break;
            case 'outputs':
                setOutputs([...outputs, { output: '', rets: '', dets: '' }]);
                setFunctionalComplexity(prev => ({
                    ...prev,
                    outputs: [...prev.outputs, '']
                }));
                break;
            case 'logicalFiles':
                setLogicalFiles([...logicalFiles, { logicalFile: '', rets: '', dets: '' }]);
                setFunctionalComplexity(prev => ({
                    ...prev,
                    logicalFiles: [...prev.logicalFiles, '']
                }));
                break;
            case 'inquiries':
                setInquiries([...inquiries, { inquiry: '', rets: '', dets: '' }]);
                setFunctionalComplexity(prev => ({
                    ...prev,
                    inquiries: [...prev.inquiries, '']
                }));
                break;
            case 'externalFiles':
                setExternalFiles([...externalFiles, { externalFile: '', rets: '', dets: '' }]);
                setFunctionalComplexity(prev => ({
                    ...prev,
                    externalFiles: [...prev.externalFiles, '']
                }));
                break;
            default:
                break;
        }
    }


    const handleChange = (componentType, fieldIndex, fieldName, value) => {
        let newFields;
        switch (componentType) {
            case 'inputs':
                newFields = [...inputs];
                newFields[fieldIndex][fieldName] = value;
                setInputs(newFields);
                break;
            case 'outputs':
                newFields = [...outputs];
                newFields[fieldIndex][fieldName] = value;
                setOutputs(newFields);
                break;
            case 'logicalFiles':
                newFields = [...logicalFiles];
                newFields[fieldIndex][fieldName] = value;
                setLogicalFiles(newFields);
                break;
            case 'inquiries':
                newFields = [...inquiries];
                newFields[fieldIndex][fieldName] = value;
                setInquiries(newFields);
                break;
            case 'externalFiles':
                newFields = [...externalFiles];
                newFields[fieldIndex][fieldName] = value;
                setExternalFiles(newFields);
                break;
            default:
                break;
        }
        updateFunctionalComplexity(componentType, fieldIndex);
    }

    const handleSaveChanges = () => {
        handleClose();
        calculateComplexity();
    }

    const calculateComplexity = () => {
        const newCounts = {
            inputs: inputs.length,
            outputs: outputs.length,
            logicalFiles: logicalFiles.length,
            inquiries: inquiries.length,
            externalFiles: externalFiles.length
        };

        const newComplexityTable = {
            inputs: getCountComplexity(newCounts.inputs, [0, 8, 15]),
            outputs: getCountComplexity(newCounts.outputs, [0, 6, 10]),
            inquiries: getCountComplexity(newCounts.inquiries, [0, 4, 6]),
            logicalFiles: getCountComplexity(newCounts.logicalFiles, [0, 5, 7]),
            externalFiles: getCountComplexity(newCounts.externalFiles, [0, 4, 6])
        };

        setCounts(newCounts);
        setComplexityTable(newComplexityTable);

        // Calculate total by multiplying count with complexity
        const newTotalByComplexity = {
            inputs: calculateTotalByComplexity(newCounts.inputs, newComplexityTable.inputs, 'inputs'),
            outputs: calculateTotalByComplexity(newCounts.outputs, newComplexityTable.outputs, 'outputs'),
            inquiries: calculateTotalByComplexity(newCounts.inquiries, newComplexityTable.inquiries, 'inquiries'),
            logicalFiles: calculateTotalByComplexity(newCounts.logicalFiles, newComplexityTable.logicalFiles, 'logicalFiles'),
            externalFiles: calculateTotalByComplexity(newCounts.externalFiles, newComplexityTable.externalFiles, 'externalFiles')
        };

        setTotalByComplexity(newTotalByComplexity);
    }

    const getCountComplexity = (count, thresholds) => {
        if (count >= thresholds[2]) {
            return 'High';
        } else if (count >= thresholds[1]) {
            return 'Average';
        } else {
            return 'Low';
        }
    }

    const calculateTotalByComplexity = (count, complexity, componentType) => {
        switch (complexity) {
            case 'Low':
                return count * getMultiplierForLow(componentType);
            case 'Average':
                return count * getMultiplierForAverage(componentType);
            case 'High':
                return count * getMultiplierForHigh(componentType);
            default:
                return 0;
        }
    }

    const getMultiplierForLow = (componentType) => {
        switch (componentType) {
            case 'inputs':
                return 3;
            case 'outputs':
                return 4;
            case 'inquiries':
                return 3;
            case 'logicalFiles':
                return 7;
            case 'externalFiles':
                return 5;
            default:
                return 0;
        }
    }

    const getMultiplierForAverage = (componentType) => {
        switch (componentType) {
            case 'inputs':
                return 4;
            case 'outputs':
                return 5;
            case 'inquiries':
                return 4;
            case 'logicalFiles':
                return 10;
            case 'externalFiles':
                return 7;
            default:
                return 0;
        }
    }

    const getMultiplierForHigh = (componentType) => {
        switch (componentType) {
            case 'inputs':
                return 6;
            case 'outputs':
                return 7;
            case 'inquiries':
                return 6;
            case 'logicalFiles':
                return 15;
            case 'externalFiles':
                return 10;
            default:
                return 0;
        }
    }

    const renderComponentFields = (componentType, componentLabel, componentFields) => {
        return (
            <Form.Group className="mb-3" controlId={`component.${componentType}`}>
                <div className="column">
                    <Form.Label className="component-label">{componentLabel}</Form.Label>
                    {componentFields.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                            <Form.Control
                                type="text"
                                placeholder={`Enter ${componentLabel}`}
                                value={field.input || field.output || field.logicalFile || field.inquiry || field.externalFile}
                                onChange={(e) => handleChange(componentType, fieldIndex, getFieldName(componentType), e.target.value)}
                                className="add-button-1"
                            />
                            <Form.Control
                                type="number"
                                placeholder="RETs"
                                value={field.rets}
                                onChange={(e) => handleChange(componentType, fieldIndex, 'rets', e.target.value)}
                                className="add-button-2"
                            />
                            <Form.Control
                                type="number"
                                placeholder="DETs"
                                value={field.dets}
                                onChange={(e) => handleChange(componentType, fieldIndex, 'dets', e.target.value)}
                                className="add-button-3"
                            />
                            <Button className="remove-button" variant="danger" onClick={() => removeField(componentType, fieldIndex)}>Remove</Button>
                        </div>
                    ))}
                </div>
                <div className="column">
                    {componentFields.length === 0 && (
                        <Button className="add-again-button" variant="primary" onClick={() => addNewField(componentType)}>Add {componentLabel}</Button>
                    )}
                </div>
                {componentFields.length > 0 && (
                    <Button className="add-again-button" variant="primary" onClick={() => addNewField(componentType)}>Add {componentLabel}</Button>
                )}
            </Form.Group>
        );
    }
    
    

    const removeField = (componentType, fieldIndex) => {
        switch (componentType) {
            case 'inputs':
                setInputs(inputs.filter((_, index) => index !== fieldIndex));
                setFunctionalComplexity(prev => ({
                    ...prev,
                    inputs: prev.inputs.filter((_, index) => index !== fieldIndex)
                }));
                break;
            case 'outputs':
                setOutputs(outputs.filter((_, index) => index !== fieldIndex));
                setFunctionalComplexity(prev => ({
                    ...prev,
                    outputs: prev.outputs.filter((_, index) => index !== fieldIndex)
                }));
                break;
            case 'logicalFiles':
                setLogicalFiles(logicalFiles.filter((_, index) => index !== fieldIndex));
                setFunctionalComplexity(prev => ({
                    ...prev,
                    logicalFiles: prev.logicalFiles.filter((_, index) => index !== fieldIndex)
                }));
                break;
            case 'inquiries':
                setInquiries(inquiries.filter((_, index) => index !== fieldIndex));
                setFunctionalComplexity(prev => ({
                    ...prev,
                    inquiries: prev.inquiries.filter((_, index) => index !== fieldIndex)
                }));
                break;
            case 'externalFiles':
                setExternalFiles(externalFiles.filter((_, index) => index !== fieldIndex));
                setFunctionalComplexity(prev => ({
                    ...prev,
                    externalFiles: prev.externalFiles.filter((_, index) => index !== fieldIndex)
                }));
                break;
            default:
                break;
        }
    }

    const getFieldName = (componentType) => {
        switch (componentType) {
            case 'inputs': return 'input';
            case 'outputs': return 'output';
            case 'logicalFiles': return 'logicalFile';
            case 'inquiries': return 'inquiry';
            case 'externalFiles': return 'externalFile';
            default: return '';
        }
    }



    const updateFunctionalComplexity = (componentType, fieldIndex) => {
        const rets = getFieldValue(componentType, fieldIndex, 'rets');
        const dets = getFieldValue(componentType, fieldIndex, 'dets');
        const complexity = calculateFunctionalComplexity(rets, dets);
        setFunctionalComplexity(prev => {
            const newComplexities = [...prev[componentType]];
            newComplexities[fieldIndex] = complexity;
            return {
                ...prev,
                [componentType]: newComplexities
            };
        });
    }

    const calculateFunctionalComplexity = (rets, dets) => {
        // Ensure rets and dets are numbers
        rets = Number(rets);
        dets = Number(dets);

        console.log(`Calculating complexity for RETs: ${rets}, DETs: ${dets}`);

        if (rets === 1 && dets >= 51) {
            console.log('Condition met: RET is 1 and DET is 51 or more. Complexity: Average');
            return 'Average';
        } else if (rets >= 6 && dets >= 1 && dets <= 19) {
            return 'Average';
        } else if (rets === 1 && dets >= 20 && dets <= 50) {
            return 'Low';
        } else if (rets >= 2 && rets <= 5 && dets >= 20 && dets <= 50) {
            return 'Average';
        } else if (rets >= 6 && dets >= 20 && dets <= 50) {
            return 'High';
        } else if (rets >= 2 && rets <= 5 && dets >= 51) {
            return 'High';
        } else if (rets >= 6 && dets >= 50) {
            return 'High';
        }
        return 'Low';
    };

    // The rest of the code remains the same

    // Example usage of the calculateFunctionalComplexity function
    const rets = 1;
    const dets = 51;
    console.log(calculateFunctionalComplexity(rets, dets));  // This should output 'Average'

    const getFieldValue = (componentType, fieldIndex, fieldName) => {
        switch (componentType) {
            case 'inputs':
                return inputs[fieldIndex][fieldName];
            case 'outputs':
                return outputs[fieldIndex][fieldName];
            case 'logicalFiles':
                return logicalFiles[fieldIndex][fieldName];
            case 'inquiries':
                return inquiries[fieldIndex][fieldName];
            case 'externalFiles':
                return externalFiles[fieldIndex][fieldName];
            default:
                return '';
        }
    }
    const handleOpenModal = (type) => {
        if (type === 'questions') {
            setShowQuestionModal(true);

        } else {
            setShowVAFModal(true);
        }
    };
    const countByComplexity = (componentType) => {
        const complexityCounts = { low: 0, average: 0, high: 0 };

        functionalComplexity[componentType].forEach(complexity => {
            switch (complexity) {
                case 'Low':
                    complexityCounts.low += 1;
                    break;
                case 'Average':
                    complexityCounts.average += 1;
                    break;
                case 'High':
                    complexityCounts.high += 1;
                    break;
                default:
                    break;
            }
        });

        return complexityCounts;
    };

    const complexityCountsInputs = countByComplexity('inputs');
    const complexityCountsOutputs = countByComplexity('outputs');
    const complexityCountsLogicalFiles = countByComplexity('logicalFiles');
    const complexityCountsInquiries = countByComplexity('inquiries');
    const complexityCountsExternalFiles = countByComplexity('externalFiles');

    const calculateUFP = () => {
        return complexityCountsInputs.low * 3 + complexityCountsInputs.average * 4 + complexityCountsInputs.high * 6 + complexityCountsOutputs.low * 4 + complexityCountsOutputs.average * 5 + complexityCountsOutputs.high * 7 + complexityCountsLogicalFiles.low * 7 + complexityCountsLogicalFiles.average * 10 + complexityCountsLogicalFiles.high * 15 + complexityCountsInquiries.low * 3 + complexityCountsInquiries.average * 4 + complexityCountsInquiries.high * 6 + complexityCountsExternalFiles.low * 5 + complexityCountsExternalFiles.average * 7 + complexityCountsExternalFiles.high * 10;
    }

    const calculateVAF = () => {
        return ((count.questionsVAF * 0.01) + 0.65);
    }
    const calculateDFP = () => {
        return ((complexityCountsInputs.low * 3 + complexityCountsInputs.average * 4 + complexityCountsInputs.high * 6 + complexityCountsOutputs.low * 4 + complexityCountsOutputs.average * 5 + complexityCountsOutputs.high * 7 + complexityCountsLogicalFiles.low * 7 + complexityCountsLogicalFiles.average * 10 + complexityCountsLogicalFiles.high * 15 + complexityCountsInquiries.low * 3 + complexityCountsInquiries.average * 4 + complexityCountsInquiries.high * 6 + complexityCountsExternalFiles.low * 5 + complexityCountsExternalFiles.average * 7 + complexityCountsExternalFiles.high * 10) + (CFP)) * ((count.questionsVAF * 0.01) + 0.65);
    }
    const calculateSimpleFP = () => {
        return (totalByComplexity.inputs + totalByComplexity.outputs + totalByComplexity.logicalFiles + totalByComplexity.inquiries + totalByComplexity.externalFiles) * (0.65 + 0.01 * count.questions);
    }
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">VAF</Popover.Header>
            <Popover.Body>
                this is <strong>VAF</strong><br />
                <Link to="/UseCase" > Use Case</Link>

            </Popover.Body>
        </Popover>
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedData, setSavedData] = useState([]);

    const save = () => {
        const data = {
            fp: calculateSimpleFP().toFixed(2),
            effort: (calculateSimpleFP() / FpPersonMonths).toFixed(2),
            cost: (calculateSimpleFP() * CostofOneFp).toFixed(2),
            dfp: (calculateDFP()).toFixed(2),
            effortDFP: (calculateDFP() / FpPersonMonths).toFixed(2),
            costDFP: (calculateDFP() * CostofOneFp).toFixed(2),
            cfp: CFP,
            fpPersonMonths: FpPersonMonths,
            costofOneFp: CostofOneFp,
            projectId: JSON.parse(localStorage.getItem('project')).project_id
        }
        console.log(data);
        const collectionRef = collection(database, "simpleFP");
        addDoc(collectionRef, data).then(() => {
            alert("Document successfully written!");
            console.log("Document successfully written!");
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
    const fetchSavedData = () => {
        const q = query(collection(database, "simpleFP"));
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
          await deleteDoc(doc(database, "simpleFP", docId));
          console.log("Document successfully deleted!");
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      };



    return (
        <div className="Simple-fp">
            <h1> Function Point Estimation </h1>
            <div className="fp-calculations">
            <h2> Simple FP :{(calculateSimpleFP()).toFixed(2)}</h2>
            <h2> Effort from FP:{(calculateSimpleFP()/FpPersonMonths).toFixed(2)} Person-months </h2>
            <h2> Cost of Project:{(calculateSimpleFP()*CostofOneFp).toFixed(2)} $ </h2>



            {/* <h2 > UFP: {calculateUFP()}</h2>
            <span className="d-inline-block" tabIndex="0" data-bs-toggle="tooltip" data-bs-placement="top" title="This is UFP">
                <h2>UFP:{calculateUFP()}</h2>
            </span>

            <h2> VAF: {calculateVAF()} </h2>
            <OverlayTrigger trigger="click" placement="top-start" overlay={popover}>
                <h2 >VAF: {calculateVAF()}</h2>

            </OverlayTrigger>
            <h2> CFP: {CFP}</h2> */}
            <h2> DFP (Development Project Function Point): {calculateDFP().toFixed(2)} </h2>
            <h2> Effort from DFP:{(calculateDFP()/FpPersonMonths).toFixed(2)} Person-months </h2>
            <h2> Cost of Project:{(calculateDFP()*CostofOneFp).toFixed(2)} $ </h2>
            <div>
            <button className="btn btn-primary" onClick={save}>Save</button>
            <button className='btn btn-secondary' style={{marginLeft:"10px"}} onClick={openModal}>History</button>

            </div>
            </div>
          
            <Button variant="primary" className="add-component-button" onClick={handleShow}>
                Add Component
            </Button>
            <Button variant="primary" className="questions-button" onClick={() => { handleOpenModal("questions") }} >Questions</Button>

            {showQuestionModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Questions</h5>
                                <button type="button" className="close" onClick={() => setShowQuestionModal(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Questions</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((question, index) => (
                                            <tr key={index}>
                                                <td>{question}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        value={answers[index]}
                                                        onChange={(e) => handleQuestionChange(index, parseInt(e.target.value))}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveQuestions}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Button variant="primary" className="vaf-questions-button" onClick={handleOpenModal} >VAF</Button>
            {showVAFModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">VAF Questions</h5>
                                <button type="button" className="close" onClick={() => setShowVAFModal(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Questions</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questionsVAF.map((question, index) => (
                                            <tr key={index}>
                                                <td>{question}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        value={answersVAF[index]}
                                                        onChange={(e) => handleVAFQuestionChange(index, parseInt(e.target.value))}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowVAFModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveVAFQuestions}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <p>{count.questions && (
                <div>
                    <p>Questions Sum: {count.questions}</p>
                </div>
            )}</p>

            <p>
                {count.questionsVAF && (
                    <div>
                        <p>VAF Questions Sum: {count.questionsVAF}</p>

                    </div>
                )}
            </p> */}
            {/* <p>VAF: {((count.questionsVAF * 0.01) + 0.65)}</p> */}
            <p className="cfp-para"><strong>CFP</strong> is the unadjusted function points added by the conversion unadjusted function point count</p>
            <input
                type="number"
                placeholder="Enter CFP"
                value={CFP}
                onChange={handleCFPCalculation}
                min="0"
            />
            <p>CFP: {CFP}</p>
            <p>Enter FP person-months:</p>
            <input type="number" placeholder="Enter FP" value={FpPersonMonths} onChange={handleFPCalculation} min="0" />
            {/* <p>FP: {FpPersonMonths}</p> */}
            <p>Enter Cost of 1 FP:</p>
            <input type="number" placeholder="Enter Cost of 1 FP" value={CostofOneFp} onChange={handleCostOfOneFpCalculation} min="0" />
            {/* <p>Cost of 1 FP: {CostofOneFp}</p> */}
            

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Component</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {renderComponentFields('inputs', 'External Inputs', inputs)}
                        {renderComponentFields('outputs', 'External Outputs', outputs)}
                        {renderComponentFields('logicalFiles', 'External Logical Files', logicalFiles)}
                        {renderComponentFields('inquiries', 'External Inquiries', inquiries)}
                        {renderComponentFields('externalFiles', 'External Interface Files', externalFiles)}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <h2>Complexity based on Count</h2>
            <Table striped bordered hover style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Components</th>
                        <th>No. of Counts</th>
                        <th>Complexity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Inputs</td>
                        <td>{counts.inputs}</td>
                        <td>{complexityTable.inputs}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Outputs</td>
                        <td>{counts.outputs}</td>
                        <td>{complexityTable.outputs}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Logical Files</td>
                        <td>{counts.logicalFiles}</td>
                        <td>{complexityTable.logicalFiles}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Inquiries</td>
                        <td>{counts.inquiries}</td>
                        <td>{complexityTable.inquiries}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">External Files</td>
                        <td>{counts.externalFiles}</td>
                        <td>{complexityTable.externalFiles}</td>
                    </tr>
                </tbody>
            </Table>
            <h2>Count Total by multiplying Complexity of each with count</h2>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Count</th>
                        <th>Low</th>
                        <th>Average</th>
                        <th>High</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Inputs</td>
                        <td>{counts.inputs}</td>
                        <td>3</td>
                        <td>4</td>
                        <td>6</td>
                        <td>{totalByComplexity.inputs}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Outputs</td>
                        <td>{counts.outputs}</td>
                        <td>4</td>
                        <td>5</td>
                        <td>7</td>
                        <td>{totalByComplexity.outputs}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Logical Files</td>
                        <td>{counts.logicalFiles}</td>
                        <td>7</td>
                        <td>10</td>
                        <td>15</td>
                        <td>{totalByComplexity.logicalFiles}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Inquiries</td>
                        <td>{counts.inquiries}</td>
                        <td>3</td>
                        <td>4</td>
                        <td>6</td>
                        <td>{totalByComplexity.inquiries}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">External Files</td>
                        <td>{counts.externalFiles}</td>
                        <td>5</td>
                        <td>7</td>
                        <td>10</td>
                        <td>{totalByComplexity.externalFiles}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="bold-weight">
                            Count Total
                        </td>
                        <td>{totalByComplexity.inputs + totalByComplexity.outputs + totalByComplexity.logicalFiles + totalByComplexity.inquiries + totalByComplexity.externalFiles}</td>
                    </tr>
                </tbody>
            </Table>
            <h2>Rets and Dets Functional Complexity</h2>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Components</th>
                        <th>RETs</th>
                        <th>DETs</th>
                        <th>Functional Complexity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={{ fontWeight: 'bold' }}>Inputs</td></tr>
                    {inputs.map((input, index) => (
                        <tr key={index}>
                            <td>{input.input}</td>
                            <td>{input.rets}</td>
                            <td>{input.dets}</td>
                            <td>{functionalComplexity.inputs[index]}</td>
                        </tr>
                    ))}
                    <tr><td style={{ fontWeight: 'bold' }}>Outputs</td></tr>
                    {outputs.map((output, index) => (
                        <tr key={index}>
                            <td>{output.output}</td>
                            <td>{output.rets}</td>
                            <td>{output.dets}</td>
                            <td>{functionalComplexity.outputs[index]}</td>
                        </tr>
                    ))}
                    <tr><td style={{ fontWeight: 'bold' }}>Logical Files</td></tr>
                    {logicalFiles.map((logicalFile, index) => (
                        <tr key={index}>
                            <td>{logicalFile.logicalFile}</td>
                            <td>{logicalFile.rets}</td>
                            <td>{logicalFile.dets}</td>
                            <td>{functionalComplexity.logicalFiles[index]}</td>
                        </tr>
                    ))}
                    <tr><td style={{ fontWeight: 'bold' }}>Inquiries</td></tr>
                    {inquiries.map((inquiry, index) => (
                        <tr key={index}>
                            <td>{inquiry.inquiry}</td>
                            <td>{inquiry.rets}</td>
                            <td>{inquiry.dets}</td>
                            <td>{functionalComplexity.inquiries[index]}</td>
                        </tr>
                    ))}
                    <tr><td style={{ fontWeight: 'bold' }}>External Files</td></tr>
                    {externalFiles.map((externalFile, index) => (
                        <tr key={index}>
                            <td>{externalFile.externalFile}</td>
                            <td>{externalFile.rets}</td>
                            <td>{externalFile.dets}</td>
                            <td>{functionalComplexity.externalFiles[index]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h3>External Inputs Complexity Count</h3>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Complexity</th>
                        <th>Count</th>
                        <th>Multiplication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Low</td>
                        <td>{complexityCountsInputs.low}</td>
                        <td>{complexityCountsInputs.low * 3}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Average</td>
                        <td>{complexityCountsInputs.average}</td>
                        <td>{complexityCountsInputs.average * 4}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">High</td>
                        <td>{complexityCountsInputs.high}</td>
                        <td>{complexityCountsInputs.high * 6}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{complexityCountsInputs.low * 3 + complexityCountsInputs.average * 4 + complexityCountsInputs.high * 6}</td>
                    </tr>
                </tbody>
            </Table>

            <h3>External Outputs Complexity Count</h3>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Complexity</th>
                        <th>Count</th>
                        <th>Multiplication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Low</td>
                        <td>{complexityCountsOutputs.low}</td>
                        <td>{complexityCountsOutputs.low * 4}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Average</td>
                        <td>{complexityCountsOutputs.average}</td>
                        <td>{complexityCountsOutputs.average * 5}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">High</td>
                        <td>{complexityCountsOutputs.high}</td>
                        <td>{complexityCountsOutputs.high * 7}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{complexityCountsOutputs.low * 4 + complexityCountsOutputs.average * 5 + complexityCountsOutputs.high * 7}</td>
                    </tr>


                </tbody>
            </Table>

            <h3>External Logical Files Complexity Count</h3>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Complexity</th>
                        <th>Count</th>
                        <th>Multiplication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Low</td>
                        <td>{complexityCountsLogicalFiles.low}</td>
                        <td>{complexityCountsLogicalFiles.low * 7}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Average</td>
                        <td>{complexityCountsLogicalFiles.average}</td>
                        <td>{complexityCountsLogicalFiles.average * 10}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">High</td>
                        <td>{complexityCountsLogicalFiles.high}</td>
                        <td>{complexityCountsLogicalFiles.high * 15}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{complexityCountsLogicalFiles.low * 7 + complexityCountsLogicalFiles.average * 10 + complexityCountsLogicalFiles.high * 15}</td>
                    </tr>
                </tbody>
            </Table>

            <h3>External Inquiries Complexity Count</h3>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th>Complexity</th>
                        <th>Count</th>
                        <th>Multiplication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Low</td>
                        <td>{complexityCountsInquiries.low}</td>
                        <td>{complexityCountsInquiries.low * 3}</td>

                    </tr>
                    <tr>
                        <td className="bold-weight">Average</td>
                        <td>{complexityCountsInquiries.average}</td>
                        <td>{complexityCountsInquiries.average * 4}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">High</td>
                        <td>{complexityCountsInquiries.high}</td>
                        <td>{complexityCountsInquiries.high * 6}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight"></td>
                        <td>Total</td>
                        <td>{complexityCountsInquiries.low * 3 + complexityCountsInquiries.average * 4 + complexityCountsInquiries.high * 6}</td>
                    </tr>
                </tbody>
            </Table>

            <h3>External Interface Files Complexity Count</h3>
            <Table striped bordered hover  style={{marginLeft:"0px"}}>
                <thead>
                    <tr>
                        <th className="bold-weight">Complexity</th>
                        <th>Count</th>
                        <th>Multiplication</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="bold-weight">Low</td>
                        <td>{complexityCountsExternalFiles.low}</td>
                        <td>{complexityCountsExternalFiles.low * 5}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">Average</td>
                        <td>{complexityCountsExternalFiles.average}</td>
                        <td>{complexityCountsExternalFiles.average * 7}</td>
                    </tr>
                    <tr>
                        <td className="bold-weight">High</td>
                        <td>{complexityCountsExternalFiles.high}</td>
                        <td>{complexityCountsExternalFiles.high * 10}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td>{complexityCountsExternalFiles.low * 5 + complexityCountsExternalFiles.average * 7 + complexityCountsExternalFiles.high * 10}</td>
                    </tr>
                </tbody>
            </Table>
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
      <th>Project ID</th>
      <th>Function Point</th>
        <th>Effort</th>
        <th>Cost</th>
        <th>DFP</th>
        <th>Effort DFP</th>
        <th>Cost DFP</th>
        <th>CFP</th>
        <th>FP Person Months</th>
        <th>Cost of 1 FP</th>
        
       
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {savedData.map((data, index) => (
        <tr key={index}>
            <td>{data.projectId}</td>
            <td>{data.fp}</td>
            <td>{data.effort}</td>
            <td>{data.cost}</td>
            <td>{data.dfp}</td>
            <td>{data.effortDFP}</td>
            <td>{data.costDFP}</td>
            <td>{data.cfp}</td>
            <td>{data.fpPersonMonths}</td>
            <td>{data.costofOneFp}</td>

          
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
            <div className='references' style={{marginLeft:"-0px"}}>
                <h3>References</h3>
                <ul>
                  
                    <li>International Function Points Users Group. (2005). Function Point Counting Practices Manual (Version 4.2.1). New Jersey.</li>
                                    </ul>
                </div>
            

        </div>
    );
}

export default SimpleFP;
