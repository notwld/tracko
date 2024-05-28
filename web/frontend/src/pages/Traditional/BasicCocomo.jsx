import React, { useState, useEffect } from 'react';
import './StyleSheets/BasicCocomo.css';
import { Link } from 'react-router-dom';
import { database } from '../../config/firebase';
import { onSnapshot, collection, addDoc, updateDoc, query ,deleteDoc, doc} from 'firebase/firestore';

function BasicCocomo() {
  const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')) || '');
  const [projectLevel, setProjectLevel] = useState('');
  const [selectedValues, setSelectedValues] = useState({
    a: '',
    b: '',
    c: '',
    d: ''
  });
  const [conversionType, setConversionType] = useState('LOC');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [totalLOC, setTotalLOC] = useState(0);
  const [effortApplied, setEffortApplied] = useState(0);
  const [developmentTime, setDevelopmentTime] = useState(0);
  const [costPerPersonMonth, setCostPerPersonMonth] = useState(0.00);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedData, setSavedData] = useState([]);

  function handleCostPerPersonsMonth(e) {
    let value = e.target.value;
    if (value !== "") {
      value = parseFloat(value);
      if (isNaN(value) || value < 0) return;
    }
    setCostPerPersonMonth(value);
  }

  const languageData = {
    "1032/AF": 16,
    "1st Generation default": 320,
    "2nd Generation default": 107,
    "3rd Generation default": 80,
    "4th Generation default": 20,
    "5th Generation default": 5,
    "AAS Macro": 91,
    "ABAP/4": 16,
    "ACCEL": 19,
    "Access": 38,
    "ACTOR": 21,
    "Acumen": 28,
    "Ada 83": 71,
    "Ada 95": 49,
    "ADR/DL": 40,
    "ADR/IDEAL/PDL": 20,
    "ADS/Batch": 20,
    "ADS/Online": 20,
    "AI shell default": 49,
    "AI SHELLS": 49,
    "ALGOL 68": 107,
    "ALGOL W": 107,
    "AMBUSH": 32,
    "AML": 49,
    "AMPPL II": 64,
    "ANSI BASIC": 64,
    "ANSI COBOL 74": 107,
    "ANSI COBOL 85": 91,
    "ANSI SQL": 13,
    "ANSWER/DB": 13,
    "APL 360/370": 32,
    "APL default": 32,
    "APL*PLUS": 32,
    "APPLESOFT BASIC": 128,
    "Application Builder": 20,
    "Application Manager": 36,
    "APS": 17,
    "APT": 71,
    "APTools": 20,
    "ARC": 49,
    "Ariel": 107,
    "ARITY": 49,
    "Arity PROLOG": 64,
    "ART": 49,
    "ART-IM": 46,
    "ART Enterprise": 46,
    "Artemis": 40,
    "AS/SET": 19,
    "ASI/INQUIRY": 13,
    "ASK Windows": 46,
    "Assembly (Basic)": 320,
    "Assembly (Macro)": 213,
    "Associative default": 64,
    "Autocoder": 320,
    "awk": 21,
    "Aztec C": 128,
    "BALM": 107,
    "BASE SAS": 53,
    "BASIC": 107,
    "BASIC A": 128,
    "Basic assembly": 320,
    "Berkeley PASCAL": 91,
    "BETTER BASIC": 91,
    "BLISS": 107,
    "BMSGEN": 36,
    "BOEINGCALC": 6,
    "BTEQ": 13,
    "C": 128,
    "C Set 2": 91,
    "C++": 53,
    "C86Plus": 128,
    "CA-dBFast": 40,
    "CA-EARL": 28,
    "CAST": 49,
    "CBASIC": 91,
    "CDADL": 20,
    "CELLSIM": 46,
    "Centerline C++": 53,
    "CHILI": 107,
    "CHILL": 107,
    "CICS": 46,
    "CLARION": 58,
    "CLASCAL": 80,
    "CLI": 32,
    "CLIPPER": 19,
    "CLIPPER DB": 40,
    "CLOS": 21,
    "CLOUT": 40,
    "CMS2": 107,
    "CMSGEN": 19,
    "COBOL": 107,
    "COBOL II": 107,
    "Cobol/400": 91,
    "COBRA": 20,
    "CodeCenter": 36,
    "Cofac": 36,
    "COGEN": 36,
    "COGNOS": 36,
    "COGO": 71,
    "COMAL": 80,
    "COMIT II": 64,
    "Common LISP": 64,
    "Concurrent PASCAL": 80,
    "CONNIVER": 64,
    "CORAL 66": 107,
    "CORVET": 19,
    "CorVision": 15,
    "CPL": 160,
    "Crystal Reports": 20,
    "CSL": 49,
    "CSP": 53,
    "CSSL": 46,
    "CULPRIT": 13,
    "CxPERT": 49,
    "CYGNET": 19,
    "Data base default": 40,
    "Dataflex": 40,
    "Datatrieve": 20,
    "dBase III": 40,
    "dBase IV": 36,
    "DCL": 213,
    "DEC-RALLY": 40,
    "Decision support default": 36,
    "PHP":53.33,
    "PYTHON":53.33,
    "C#":51.20,

  
    "DELPHI": 29,
    "DL/1": 40,
    "DNA-4": 19,
    "DOS Batch Files": 128,
    "DSP Assembly": 160,
    "DTABL": 46,
    "DTIPT": 46,
    "DYANA": 71,
    "DYNAMO-III": 46,
    "EASEL": 29,
    "EASY": 49,
    "EASYTRIEVE +": 13,
    "Eclipse": 49,
    "ED-Scheme 3.4": 53,
    "EDA/SQL": 12,
    "EIFFEL": 21,
    "ENFORM": 46,
    "English-based default": 53,
    "Ensemble": 29,
    "EPOS": 20,
    "Erlang": 40,
    "ESF": 40,
    "ESPADVISOR": 49,
    "ESPL/I": 71,
    "EUCLID": 107,
    "EXCEL 1-2": 6,
    "EXCEL 3-4": 6,
    "EXCEL 5": 6,
    "EXPRESS": 36,
    "EXSYS": 49,
    "Extended Common LISP": 56,
    "EZNOMAD": 36,
    "Facets": 20,
    "FactoryLink IV": 29,
    "FAME": 36,
    "FileMaker Pro": 36,
    "FLAVORS": 29,
    "FLEX": 46,
    "FlexGen": 29,
    "FOCUS": 40,
    "FOIL": 53,
    "Forte": 18,
    "FORTH": 64,
    "FORTRAN 66": 128,
    "FORTRAN 77": 107,
    "FORTRAN 90": 80,
    "FORTRAN 95": 71,
    "FORTRAN": 107,
    "FORTRAN II": 128,
    "Foundation": 29,
    "FOXPRO 1": 40,
    "FOXPRO 2.5": 34,
    "FRAMEWORK": 6,
    "G2": 49,
    "GAMMA": 16,
    "Genascript": 27,
    "GENER/OL": 13,
    "GENEXUS": 15,
    "GENIFER": 19,
    "GeODE 2.0": 16,
    "GFA Basic": 34,
    "GML": 46,
    "RUBY":45.71,
    "Golden Common LISP": 64,
    "GPSS": 46,
    "GUEST": 28,
    "Guru": 49,
    "GW BASIC": 98,
    "Haskell": 38,
    "High C": 128,
    "HLEVEL": 58,
    "HP BASIC": 128,
    "HTML 2.0": 16,
    "HTML 3.0": 15,
    "HTML": 160,
    "Huron": 16,
    "IBM ADF I": 20,
    "IBM ADF II": 18,
    "IBM Advanced BASIC": 98,
    "IBM CICS/VS": 40,
    "IBM Compiled BASIC": 91,
    "IBM VS COBOL": 107,
    "IBM VS COBOL II": 91,
    "ICES": 71,
    "ICON": 80,
    "IDMS": 40,
    "IEF": 14,
    "IEW": 14,
    "IFPS/PLUS": 32,
    "IMPRS": 40,
    "INFORMIX": 40,
    "INGRES": 40,
    "INQUIRE": 13,
    "INSIGHT2": 49,
    "INSTALL/1": 16,
    "INTELLECT": 53,
    "INTERLISP": 58,
    "Interpreted BASIC": 107,
    "Interpreted C": 128,
    "IQLISP": 58,
    "IQRP": 13,
    "JANUS": 71,
    "JAVA": 53,
    "JCL": 221,
    "JOSS": 107,
    "JOVIAL": 107,
    "KAPPA": 40,
    "KBMS": 49,
    "KCL": 64,
    "KEE": 49,
    "Keyplus": 40,
    "KL": 64,
    "KLO": 64,
    "KNOWOL": 49,
    "KRL": 58,
    "KSH": 21,
    "Ladder Logic": 36,
    "LAMBIT/L": 64,
    "Lattice C": 128,
    "Liana": 128,
    "LILITH": 71,
    "LINC II": 14,
    "LISP": 64,
    "LOGLISP": 58,
    "LOOPS": 21,
    "LOTUS 123 DOS": 6,
    "LOTUS Macros": 107,
    "LUCID 3D": 6,
    "LYRIC": 53,
    "M": 16,
    "macFORTH": 64,
    "MACH1": 40,
    "Machine language": 640,
    "Macro assembly": 213,
    "MAESTRO": 16,
    "MAGEC": 16,
    "MAGIK": 21,
    "MAKE": 21,
    "MANTIS": 40,
    "MAPPER": 53,
    "MARK IV": 40,
    "MARK V": 36,
    "MATHCAD": 5,
    "MDL": 36,
    "MENTOR": 53,
    "MESA": 107,
    "Microfocus COBOL": 80,
    "microFORTH": 64,
    "Microsoft C": 128,
    "MicroStep": 20,
    "Miranda": 40,
    "Model 204": 38,
    "MODULA 2": 80,
    "MOSAIC": 6,
    "MS C ++ V. 7": 53,
    "MS Compiled BASIC": 91,
    "MSL": 64,
    "muLISP": 64,
    "MUMPS": 19,
    "NASTRAN": 71,
    "NATURAL 1": 53,
    "NATURAL 2": 46,
    "NATURAL Construct": 25,
    "Natural language": 3200,
    "NETRON/CAP": 19,
    "NEXPERT": 49,
    "NIAL": 49,
    "NOMAD2": 40,
    "Non-procedural default": 36,
    "Notes VIP": 36,
    "Nroff": 53,
    "Object-Oriented default": 29,
    "OBJECT Assembler": 64,
    "Object LISP": 29,
    "Object LOGO": 29,
    "Object PASCAL": 29,
    "Object Star": 16,
    "Objective-C": 27,
    "ObjectVIEW": 25,
    "OGL": 80,
    "OMNIS 7": 40,
    "OODL": 29,
    "OPS": 46,
    "OPS5": 58,
    "ORACLE": 40,
    "Oracle Developer/2000": 23,
    "Oscar": 107,
    "PACBASE": 15,
    "PACE": 40,
    "PARADOX/PAL": 36,
    "PASCAL": 91,
    "PC FOCUS": 36,
    "PDL Millenium": 21,
    "PDP-11 ADE": 53,
    "PERL": 21,
    "Persistance Object Builder": 21,
    "PILOT": 53,
    "PL/I": 80,
    "PL/M": 71,
    "PL/S": 91,
    "PLANIT": 53,
    "PLANNER": 64,
    "PLANPERFECT 1": 7,
    "PLATO": 53,
    "polyFORTH": 64,
    "POP": 58,
    "POPLOG": 58,
    "Power BASIC": 49,
    "PowerBuilder": 16,
    "POWERHOUSE": 14,
    "PPL (Plus)": 40,
    "Pro-C": 27,
    "PRO-IV": 58,
    "Problem-oriented default": 71,
    "Procedural default": 107,
    "Professional PASCAL": 91,
    "Program Generator default": 16,
    "PROGRESS V4": 36,
    "PROLOG": 64,
    "PROSE": 107,
    "PROTEUS": 107,
    "QBasic": 58,
    "QBE": 13,
    "QMF": 15,
    "QNIAL": 49,
    "QUATTRO": 6,
    "QUATTRO PRO": 6,
    "Query default": 13,
    "QUICK BASIC 1": 64,
    "QUICK BASIC 2": 61,
    "QUICK BASIC 3": 58,
    "Quick C": 128,
    "Quickbuild": 28,
    "QUIZ": 15,
    "RALLY": 40,
    "RAMIS II": 40,
    "RapidGen": 28,
    "RATFOR": 91,
    "RDB": 40,
    "REALIA": 46,
    "Realizer 1.0": 40,
    "Realizer 2.0": 36,
    "RELATE/3000": 40,
    "Reuse default": 5,
    "REXX (MVS)": 80,
    "REXX (OS/2)": 46,
    "RM BASIC": 91,
    "RM COBOL": 107,
    "RM FORTRAN": 107,
    "RPG I": 80,
    "RPG II": 58,
    "RPG III": 56,
    "RT-Expert 1.4": 58,
    "S-PLUS": 32,
    "SAIL": 107,
    "SAPIENS": 16,
    "SAS": 32,
    "SAVVY": 13,
    "SBASIC": 91,
    "SCEPTRE": 71,
    "SCHEME": 53,
    "Screen painter default": 6,
    "SEQUAL": 12,
    "SHELL": 21,
    "SIMPLAN": 36,
    "SIMSCRIPT": 46,
    "SIMULA": 46,
    "SIMULA 67": 46,
    "Simulation default": 46,
    "SMALLTALK 286": 21,
    "SMALLTALK 80": 21,
    "SMALLTALK/V": 21,
    "SNAP": 80,
    "SNOBOL2-4": 128,
    "SoftScreen": 14,
    "SOLO": 58,
    "SPEAKEASY": 36,
    "Spinnaker PPL": 36,
    "Spreadsheet default": 6,
    "SPS": 320,
    "SPSS": 32,
    "SQL": 13,
    "SQL-Windows": 12,
    "Statistical default": 32,
    "STRATEGEM": 36,
    "STRESS": 71,
    "Strongly typed default": 91,
    "STYLE": 46,
    "SUPERBASE 1.3": 36,
    "SURPASS": 6,
    "SYBASE": 40,
    "Symantec C++": 29,
    "SYMBOLANG": 64,
    "Synchroworks": 18,
    "SYNON/2E": 19,
    "System-W": 36,
    "Tandem Access Language": 91,
    "TCL": 64,
    "TELON": 16,
    "TESSARACT": 40,
    "THE TWIN": 6,
    "THEMIS": 13,
    "TI-IEF": 14,
    "Topspeed C ++": 29,
    "TRANSFORM": 15,
    "TRANSLISP PLUS": 56,
    "TREET": 64,
    "TREETRAN": 64,
    "TRS80 BASIC II,III": 128,
    "TRUE BASIC": 64,
    "Turbo C": 128,
    "TURBO C++": 53,
    "TURBO EXPERT": 49,
    "Turbo PASCAL >5": 49,
    "Turbo PASCAL 1-4": 80,
    "Turbo PASCAL 4-5": 71,
    "Turbo PROLOG": 80,
    "TURING": 80,
    "TUTOR": 53,
    "TWAICE": 49,
    "UCSD PASCAL": 91,
    "UFO/IMS": 36,
    "UHELP": 32,
    "UNIFACE": 16,
    "UNIX Shell Scripts": 21,
    "VAX ACMS": 58,
    "VAX ADE": 40,
    "VECTRAN": 107,
    "VHDL": 19,
    "Visible C": 49,
    "Visible COBOL": 40,
    "Visicalc 1": 9,
    "Visual 4.0": 29,
    "Visual Basic 1": 46,
    "Visual Basic 2": 43,
    "Visual Basic 3": 40,
    "Visual Basic 4": 36,
    "Visual Basic 5": 29,
    "Visual Basic DOS": 40,
    "Visual C++": 34,
    "Visual COBOL": 20,
    "Visual Objects": 16,
    "VisualAge": 21,
    "VisualGen": 18,
    "VS-REXX": 32,
    "VULCAN": 64,
    "VZ Programmer": 36,
    "WARP X": 40,
    "XML":128,
    
    "WATCOM C": 128,
    "WATCOM C/386": 128,
    "Waterloo C": 128,
    "Waterloo PASCAL": 91,
    "WATFIV": 85,
    "WATFOR": 91,
    "WHIP": 91,
    "Wizard": 28,
    "XLISP": 64,
    "YACC": 53,
    "YACC++": 53,
    "ZBASIC": 91,
    "ZIM": 19,
    "ZLISP": 64,
  };


  const handleProjectLevelChange = (event) => {
    const level = event.target.value;
    setProjectLevel(level);
    switch (level) {
      case 'Organic':
        setSelectedValues({ a: 2.4, b: 1.05, c: 2.5, d: 0.38 });
        break;
      case 'Semi Detached':
        setSelectedValues({ a: 3.0, b: 1.12, c: 2.5, d: 0.35 });
        break;
      case 'Embedded':
        setSelectedValues({ a: 3.6, b: 1.20, c: 2.5, d: 0.32 });
        break;
      default:
        setSelectedValues({ a: '', b: '', c: '', d: '' });
        break;
    }
  };

  const handleConversionTypeChange = (event) => {
    setConversionType(event.target.value);
    setInputValue('');
    setTotalLOC(0);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const deleteRow = async (index) => {
    const docId = savedData[index].id; // Assuming each document in Firestore has a unique ID
    const newData = [...savedData];
    newData.splice(index, 1);
    setSavedData(newData);
  
    try {
      await deleteDoc(doc(database, "BasicCocomo", docId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  
  
  
  
  
  

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value < 0) {
      return;
    }
    setInputValue(value);
  };

  useEffect(() => {
    const inputValueFloat = parseFloat(inputValue);
    if (isNaN(inputValueFloat) || inputValueFloat < 0) {
      setTotalLOC(0);
      return;
    }

    if (conversionType === 'LOC') {
      setTotalLOC(inputValueFloat / 1000);
    } else if (conversionType === 'FP' && selectedLanguage) {
      const multiplier = languageData[selectedLanguage];
      setTotalLOC((inputValueFloat * multiplier) / 1000);
    } else if (conversionType === 'KLOC') {
      setTotalLOC(inputValueFloat);
    }
  }, [inputValue, conversionType, selectedLanguage]);

  useEffect(() => {
    const KLOC = totalLOC;
    const { a, b, c, d } = selectedValues;

    if (isNaN(KLOC) || KLOC <= 0 || !a || !b || !c || !d) {
      setEffortApplied(0);
      setDevelopmentTime(0);
      return;
    }

    const effort = a * Math.pow(KLOC, b);
    const time = c * Math.pow(effort, d);

    setEffortApplied(effort);
    setDevelopmentTime(time);
  }, [totalLOC, selectedValues]);

  const save = () => {
    const data = {
      projectLevel: projectLevel,
      selectedValues: selectedValues,
      conversionType: conversionType,
      selectedLanguage: selectedLanguage,
      inputValue: inputValue,
      totalLOC: totalLOC,
      effortApplied: effortApplied,
      developmentTime: developmentTime,
      costPerPersonMonth: costPerPersonMonth,
      projectId: parseInt(project.project_id)
    };
    addDoc(collection(database, "BasicCocomo"), data).then(() => {
      alert("Data saved successfully");
      console.log("Document written with ID: ");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
    console.log(data);
  };

  const fetchSavedData = () => {
    const q = query(collection(database, "BasicCocomo"));
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

  return (
    <div className='basic-cocomo-app'>
      <header>
        <h1>Cocomo I (Basic)</h1>
      </header>

      <div>
        <label>Select Project Level:</label>
        <select value={projectLevel} onChange={handleProjectLevelChange}>
          <option value="">Select Project Level</option>
          <option value="Organic">Organic</option>
          <option value="Semi Detached">Semi Detached</option>
          <option value="Embedded">Embedded</option>
        </select>
      </div>
      {projectLevel && (
        <div className='output-section'>
          <p>a = {selectedValues.a}</p>
          <p>b = {selectedValues.b}</p>
          <p>c = {selectedValues.c}</p>
          <p>d = {selectedValues.d}</p>
        </div>
      )}
      <div className="conversion-section">
        <h2>Conversion</h2>
        <div className="radio-group">
          <input type="radio" id="locRadio" name="conversionType" value="LOC" checked={conversionType === 'LOC'} onChange={handleConversionTypeChange} />
          <label htmlFor="locRadio">LOC</label>
          <input type="radio" id="fpRadio" name="conversionType" value="FP" checked={conversionType === 'FP'} onChange={handleConversionTypeChange} />
          <label htmlFor="fpRadio">FP to LOC</label>
          <input type="radio" id="klocRadio" name="conversionType" value="KLOC" checked={conversionType === 'KLOC'} onChange={handleConversionTypeChange} />
          <label htmlFor="klocRadio">KLOC</label>
        </div>
      </div>
      <div>
        {conversionType === 'LOC' ? (
          <div>
            <label htmlFor="locInput">Enter LOC:</label>
            <input type="number" id="locInput" value={inputValue} onChange={handleInputChange} />
          </div>
        ) : conversionType === 'FP' ? (
          <div>
            <label htmlFor="fpInput">Enter FP:</label>
            <input type="number" id="fpInput" value={inputValue} onChange={handleInputChange} />
            <label htmlFor="languageSelect">Select Language:</label>
            <select id="languageSelect" onChange={handleLanguageChange} value={selectedLanguage}>
              <option value="">Select</option>
              {Object.keys(languageData).map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor="klocInput">Enter KLOC:</label>
            <input type="number" id="klocInput" value={inputValue} onChange={handleInputChange} placeholder="Enter KLOC" />
          </div>
        )}
      </div>
      <div className='output-section'>
        <p>Total KLOC: {totalLOC}</p>
      </div>
      <p>Enter Cost per Person-month:</p>
      <div>
        <input
          type="number"
          placeholder="Enter cost per person-month"
          onChange={handleCostPerPersonsMonth}
          value={costPerPersonMonth}
          min="0"
        />
      </div>

      <div className="output-section">
        <p>Effort Applied: {effortApplied.toFixed(2)} person-months</p>
        <p>Development Time: {developmentTime.toFixed(1)} months</p>
        <p>Average Staff Size: {Math.floor(effortApplied / developmentTime)} Persons</p>
        <p>Cost: {Math.floor(effortApplied * costPerPersonMonth)} $</p>
        <button className='btn btn-primary' onClick={save}>Save</button>
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
              <div className="modal-body" >
                <table className="table table-bordered" style={{marginLeft:"0px"}}>
                  <thead>
                    <tr>
                      <th>Project Level</th>
                      <th>Conversion Type</th>
                      <th>Language</th>
                      <th>Input Value</th>
                      <th>Total LOC</th>
                      <th>Effort Applied</th>
                      <th>Development Time</th>
                      <th>Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  
{savedData.map((data, index) => (
  <tr key={index}>
    <td>{data.projectLevel}</td>
    <td>{data.conversionType}</td>
    <td>{data.selectedLanguage}</td>
    <td>{data.inputValue}</td>
    <td>{data.totalLOC}</td>
    <td>{data.effortApplied.toFixed(2)}</td>
    <td>{data.developmentTime.toFixed(1)}</td>
    <td>{Math.floor(data.effortApplied * data.costPerPersonMonth)} $</td>
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

      <div className='references'>
        <h3>References</h3>
        <ul>
          <li>Stutzke, Richard. <Link to={"https://web.archive.org/web/20200328141813/https://uweb.engr.arizona.edu/~ece473/readings/14-Software%20Estimating%20Technology.doc"}>Software Estimating Technology: A Survey</Link>. Archived from the original on 28 March 2020. Retrieved 9 Oct 2016.</li>
          <li>Boehm, Barry (1981). <Link to={"https://archive.org/details/softwareengineer0000boeh"}>Software Engineering Economics</Link>. Prentice-Hall. ISBN 0-13-822122-7.</li>
          <li>Barry Boehm, Chris Abts, A. Winsor Brown, Sunita Chulani, Bradford K. Clark, Ellis Horowitz, Ray Madachy, Donald J. Reifer, and Bert Steece. <Link to={"https://en.wikipedia.org/wiki/Software_Cost_Estimation_with_COCOMO_II_(book)"}>Software Cost Estimation with COCOMO II</Link> (with CD-ROM). Englewood Cliffs, NJ: Prentice-Hall, 2000. ISBN 0-13-026692-2</li>
        </ul>
      </div>
    </div>
  );
}

export default BasicCocomo;
