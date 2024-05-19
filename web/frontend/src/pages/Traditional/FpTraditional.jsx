import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const complexityWeights = {
  inputs: { low: 3, average: 4, high: 6 },
  outputs: { low: 4, average: 5, high: 7 },
  inquiries: { low: 3, average: 4, high: 6 },
  files: { low: 7, average: 10, high: 15 },
  interfaces: { low: 5, average: 7, high: 10 }
};

const determineComplexity = (rets, dets) => {
  if (rets === 1) {
    if (dets >= 1 && dets <= 19) return 'low';
    if (dets >= 20 && dets <= 50) return 'low';
    if (dets >= 51) return 'average';
  } else if (rets >= 2 && rets <= 5) {
    if (dets >= 1 && dets <= 19) return 'low';
    if (dets >= 20 && dets <= 50) return 'average';
    if (dets >= 51) return 'high';
  } else if (rets >= 6) {
    if (dets >= 1 && dets <= 19) return 'average';
    if (dets >= 20 && dets <= 50) return 'high';
    if (dets >= 51) return 'high';
  }
  return 'low';
};

const initialInputs = [
  { items: ['Password'], rets: 1, dets: 10 },
  { items: ['Login Button'], rets: 1, dets: 2 },
  { items: ['Doctor information'], rets: 1, dets: 6 },
  { items: ['Token number'], rets: 1, dets: 2 },
  { items: ['Patient information'], rets: 1, dets: 10 },
  { items: ['Submit Button'], rets: 1, dets: 5 },
  { items: ['Delete Button'], rets: 2, dets: 11 },
  { items: ['Update Button'], rets: 2, dets: 11 },
  { items: ['Print Button'], rets: 1, dets: 5 },
  { items: ['Login Button'], rets: 1, dets: 10 },
  { items: ['Add Button'], rets: 2, dets: 11 }
];

const initialOutputs = [
  { items: ['Incorrect password/id'], rets: 1, dets: 10 },
  { items: ['Input field is empty'], rets: 7, dets: 19 },
  { items: ['Token limit has expired'], rets: 1, dets: 2 },
  { items: ['Alert message'], rets: 7, dets: 19 },
  { items: ['Token print'], rets: 1, dets: 2 }
];

const initialInquiries = [
  { items: ['Printer interruption'], rets: 2, dets: 3 },
  { items: ['Successful message'], rets: 7, dets: 19 }
];

const initialFiles = [
  { items: ['Account Details'], rets: 4, dets: 10 },
  { items: ['Doctor Information'], rets: 1, dets: 6 },
  { items: ['Query Staff Information'], rets: 3, dets: 12 },
  { items: ['Compunder Information'], rets: 5, dets: 15 },
  { items: ['Bill Details'], rets: 3, dets: 12 },
  { items: ['Token Details'], rets: 1, dets: 2 },
  { items: ['Patient Details'], rets: 2, dets: 10 }
];

const FpTraditional = () => {
  const [inputs, setInputs] = useState(initialInputs);
  const [outputs, setOutputs] = useState(initialOutputs);
  const [files, setFiles] = useState(initialFiles);
  const [interfaces, setInterfaces] = useState([]);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [questionWeights, setQuestionWeights] = useState(Array(questions.length).fill(0));
  const [functionalPoints, setFunctionalPoints] = useState(0);
  const [componentDetails, setComponentDetails] = useState({
    inputs: [],
    outputs: [],
    files: [],
    interfaces: [],
    inquiries: []
  });
  const [complexityTable, setComplexityTable] = useState({
    inputs: { low: 0, average: 0, high: 0 },
    outputs: { low: 0, average: 0, high: 0 },
    files: { low: 0, average: 0, high: 0 },
    interfaces: { low: 0, average: 0, high: 0 },
    inquiries: { low: 0, average: 0, high: 0 },
    total: 0
  });

  const getOverallComplexity = (table, type) => {
    if (table.high > 0) return 'high';
    if (table.average > 0) return 'average';
    return 'low';
  };

  const handleInputChange = (event, index, type) => {
    const { name, value } = event.target;
    const updatedComponents = [...type];
    if (name === 'items') {
      updatedComponents[index][name] = value.split(',').map(item => item.trim());
    } else {
      updatedComponents[index][name] = parseInt(value, 10);
    }

    switch (type) {
      case inputs:
        setInputs(updatedComponents);
        break;
      case outputs:
        setOutputs(updatedComponents);
        break;
      case files:
        setFiles(updatedComponents);
        break;
      case interfaces:
        setInterfaces(updatedComponents);
        break;
      case inquiries:
        setInquiries(updatedComponents);
        break;
      default:
        break;
    }

    console.log(`Updated ${name} of ${type} at index ${index}:`, updatedComponents[index]);
  };

  const addComponent = (type) => {
    const newComponent = { items: [''], rets: 0, dets: 0 };
    switch (type) {
      case 'inputs':
        setInputs([...inputs, newComponent]);
        break;
      case 'outputs':
        setOutputs([...outputs, newComponent]);
        break;
      case 'files':
        setFiles([...files, newComponent]);
        break;
      case 'interfaces':
        setInterfaces([...interfaces, newComponent]);
        break;
      case 'inquiries':
        setInquiries([...inquiries, newComponent]);
        break;
      default:
        break;
    }

    console.log(`Added new component to ${type}`);
  };

  const handleQuestionChange = (index, value) => {
    let updatedQuestionWeights = [...questionWeights];
    updatedQuestionWeights[index] = parseInt(value, 10);
    setQuestionWeights(updatedQuestionWeights);
    console.log(`Updated question weight at index ${index}:`, value);
  };

  const calculateComplexityTable = (components) => {
    const table = { low: 0, average: 0, high: 0 };
    components.forEach(component => {
      const complexity = determineComplexity(component.rets, component.dets);
      table[complexity]++;
    });
    return table;
  };

  const calculateFunctionalPoints = () => {
    const calculateWeight = (components, type) => {
      const weight = components.reduce((acc, curr) => {
        const complexity = determineComplexity(curr.rets, curr.dets);
        return acc + complexityWeights[type][complexity];
      }, 0);

      setComponentDetails(prevState => ({
        ...prevState,
        [type]: components.map(component => ({
          ...component,
          complexity: determineComplexity(component.rets, component.dets)
        }))
      }));

      return weight;
    };

    const totalComplexityWeight = calculateWeight(inputs, 'inputs') +
                                  calculateWeight(outputs, 'outputs') +
                                  calculateWeight(files, 'files') +
                                  calculateWeight(interfaces, 'interfaces') +
                                  calculateWeight(inquiries, 'inquiries');

    const totalQuestionWeight = questionWeights.reduce((acc, curr) => acc + curr, 0);
    const totalFunctionalPoints = totalComplexityWeight + totalQuestionWeight;
    setFunctionalPoints(totalFunctionalPoints);
    console.log('Calculated Functional Points:', totalFunctionalPoints);

    setComplexityTable({
      inputs: calculateComplexityTable(inputs),
      outputs: calculateComplexityTable(outputs),
      files: calculateComplexityTable(files),
      interfaces: calculateComplexityTable(interfaces),
      inquiries: calculateComplexityTable(inquiries),
      total: totalComplexityWeight
    });
  };

  useEffect(() => {
    calculateFunctionalPoints();
  }, [inputs, outputs, files, interfaces, inquiries, questionWeights]);

  return (
    <div className="container" style={{ marginTop: '80px', paddingLeft: '180px' }}>
      <h2>Functional Points Calculator</h2>
      <h3>Total Functional Points: {functionalPoints}</h3>
      <div className="mb-4">
        <h4>Overall Component Complexity</h4>
        <p>INPUT: {getOverallComplexity(complexityTable.inputs, 'inputs').toUpperCase()}</p>
        <p>OUTPUT: {getOverallComplexity(complexityTable.outputs, 'outputs').toUpperCase()}</p>
        <p>INQUIRIES: {getOverallComplexity(complexityTable.inquiries, 'inquiries').toUpperCase()}</p>
        <p>FILE: {getOverallComplexity(complexityTable.files, 'files').toUpperCase()}</p>
        <p>EXTERNAL INTERFACE: {getOverallComplexity(complexityTable.interfaces, 'interfaces').toUpperCase()}</p>
      </div>
      <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#componentsModal">Edit Components</button>
      <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#questionsModal">Edit Questions</button>

      <h4 className="mt-4">Component Details</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>DATA FUNCTIONS</th>
            <th>RETs</th>
            <th>DETs</th>
            <th>FUNCTIONAL COMPLEXITY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="text-center"><strong>INTERNAL LOGICAL FILES</strong></td>
          </tr>
          {componentDetails.files.length > 0 ? (
            componentDetails.files.map((component, index) => (
              <tr key={index}>
                <td>{component.items.join(', ')}</td>
                <td>{component.rets}</td>
                <td>{component.dets}</td>
                <td>{component.complexity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">None</td>
            </tr>
          )}
          <tr>
            <td colSpan="4" className="text-center"><strong>EXTERNAL INTERFACE FILES</strong></td>
          </tr>
          {componentDetails.interfaces.length > 0 ? (
            componentDetails.interfaces.map((component, index) => (
              <tr key={index}>
                <td>{component.items.join(', ')}</td>
                <td>{component.rets}</td>
                <td>{component.dets}</td>
                <td>{component.complexity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">None</td>
            </tr>
          )}
          <tr>
            <td colSpan="4" className="text-center"><strong>TRANSACTIONAL FUNCTIONS</strong></td>
          </tr>
          <tr>
            <td colSpan="4" className="text-center"><strong>EXTERNAL INPUTS</strong></td>
          </tr>
          {componentDetails.inputs.length > 0 ? (
            componentDetails.inputs.map((component, index) => (
              <tr key={index}>
                <td>{component.items.join(', ')}</td>
                <td>{component.rets}</td>
                <td>{component.dets}</td>
                <td>{component.complexity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">None</td>
            </tr>
          )}
          <tr>
            <td colSpan="4" className="text-center"><strong>EXTERNAL OUTPUTS</strong></td>
          </tr>
          {componentDetails.outputs.length > 0 ? (
            componentDetails.outputs.map((component, index) => (
              <tr key={index}>
                <td>{component.items.join(', ')}</td>
                <td>{component.rets}</td>
                <td>{component.dets}</td>
                <td>{component.complexity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">None</td>
            </tr>
          )}
          <tr>
            <td colSpan="4" className="text-center"><strong>EXTERNAL INQUIRIES</strong></td>
          </tr>
          {componentDetails.inquiries.length > 0 ? (
            componentDetails.inquiries.map((component, index) => (
              <tr key={index}>
                <td>{component.items.join(', ')}</td>
                <td>{component.rets}</td>
                <td>{component.dets}</td>
                <td>{component.complexity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">None</td>
            </tr>
          )}
        </tbody>
      </table>

      <h4 className="mt-4">Complexity Table</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Measurement Parameter</th>
            <th>Low</th>
            <th>Average</th>
            <th>High</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Number of External Inputs</td>
            <td>{complexityTable.inputs.low}</td>
            <td>{complexityTable.inputs.average}</td>
            <td>{complexityTable.inputs.high}</td>
            <td>{inputs.length}</td>
          </tr>
          <tr>
            <td>Number of External Outputs</td>
            <td>{complexityTable.outputs.low}</td>
            <td>{complexityTable.outputs.average}</td>
            <td>{complexityTable.outputs.high}</td>
            <td>{outputs.length}</td>
          </tr>
          <tr>
            <td>Number of External Inquiries</td>
            <td>{complexityTable.inquiries.low}</td>
            <td>{complexityTable.inquiries.average}</td>
            <td>{complexityTable.inquiries.high}</td>
            <td>{inquiries.length}</td>
          </tr>
          <tr>
            <td>Number of Internal Logical Files</td>
            <td>{complexityTable.files.low}</td>
            <td>{complexityTable.files.average}</td>
            <td>{complexityTable.files.high}</td>
            <td>{files.length}</td>
          </tr>
          <tr>
            <td>Number of External Interface Files</td>
            <td>{complexityTable.interfaces.low}</td>
            <td>{complexityTable.interfaces.average}</td>
            <td>{complexityTable.interfaces.high}</td>
            <td>{interfaces.length}</td>
          </tr>
          <tr>
            <td>Count Total</td>
            <td colSpan="4">{complexityTable.total}</td>
          </tr>
        </tbody>
      </table>

      <h4 className="mt-4">Information Table</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Domain Value</th>
            <th>Count</th>
            <th>Simple</th>
            <th>Average</th>
            <th>Complex</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {['inputs', 'outputs', 'inquiries', 'files', 'interfaces'].map((component, index) => (
            <tr key={index}>
              <td>{`External ${component.charAt(0).toUpperCase() + component.slice(1)}`}</td>
              <td>{eval(component).length}</td>
              <td>{componentDetails[component].filter(item => item.complexity === 'low').length}</td>
              <td>{componentDetails[component].filter(item => item.complexity === 'average').length}</td>
              <td>{componentDetails[component].filter(item => item.complexity === 'high').length}</td>
              <td>{componentDetails[component].reduce((acc, curr) => acc + complexityWeights[component][curr.complexity], 0)}</td>
            </tr>
          ))}
          <tr>
            <td>Count Total</td>
            <td colSpan="5">{complexityTable.total}</td>
          </tr>
        </tbody>
      </table>

      {/* Components Modal */}
      <div className="modal fade" id="componentsModal" tabIndex="-1" aria-labelledby="componentsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="componentsModalLabel">Edit Components</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {['inputs', 'outputs', 'files', 'interfaces', 'inquiries'].map((component, index) => (
                <div key={index}>
                  <h5>{component.charAt(0).toUpperCase() + component.slice(1)}</h5>
                  {eval(component).map((item, idx) => (
                    <div className="mb-3" key={idx}>
                      <input
                        type="text"
                        name="items"
                        className="form-control"
                        placeholder="Enter items separated by commas"
                        onChange={(event) => handleInputChange(event, idx, eval(component))}
                        value={item.items.join(', ')}
                      />
                      <input
                        type="number"
                        name="rets"
                        className="form-control mt-2"
                        placeholder="RETs"
                        onChange={(event) => handleInputChange(event, idx, eval(component))}
                        value={item.rets}
                      />
                      <input
                        type="number"
                        name="dets"
                        className="form-control mt-2"
                        placeholder="DETs"
                        onChange={(event) => handleInputChange(event, idx, eval(component))}
                        value={item.dets}
                      />
                    </div>
                  ))}
                  <button className="btn btn-secondary mb-3" onClick={() => addComponent(component)}>Add {component.charAt(0).toUpperCase() + component.slice(1)}</button>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={calculateFunctionalPoints}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Modal */}
      <div className="modal fade" id="questionsModal" tabIndex="-1" aria-labelledby="questionsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="questionsModalLabel">Edit Questions</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {questions.map((question, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">{question}</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Weight"
                    onChange={(event) => handleQuestionChange(index, event.target.value)}
                    value={questionWeights[index]}
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={calculateFunctionalPoints}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FpTraditional;
