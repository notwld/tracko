import React, { useState, useEffect } from 'react';
import './StyleSheets/IntermediateCocomo.css';
import { Link } from "react-router-dom";
import { database } from '../../config/firebase';
import { onSnapshot,addDoc,collection } from 'firebase/firestore';
function IntermediateCocomo() {
    const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')) || '');
    const [total, setTotal] = useState(1.00);
    const [duration, setDuration] = useState(0.00);
    const [costPerPersonMonth, setCostPerPersonMonth] = useState(0.00);

    const [projectLevel, setProjectLevel] = useState('');
    const [selectedValues, setSelectedValues] = useState({
        a: '',
        b: '',
        c: ''
    });
    const [values, setValues] = useState({
        "RequiredSoftwareReliability": { value: 0.00, clicked: false },
        "SizeOfApplicationDatabase": { value: 0.00, clicked: false },
        "ComplexityOfTheProduct": { value: 0.00, clicked: false },
        "RunTimePerformanceConstraints": { value: 0.00, clicked: false },
        "MemoryConstraints": { value: 0.00, clicked: false },
        "VolatilityOfTheVirtualMachineEnvironment": { value: 0.00, clicked: false },
        "RequiredTurnaboutTime": { value: 0.00, clicked: false },
        "AnalystCapability": { value: 0.00, clicked: false },
        "ApplicationsExperience": { value: 0.00, clicked: false },
        "SoftwareEngineerCapability": { value: 0.00, clicked: false },
        "VirtualMachineExperience": { value: 0.00, clicked: false },
        "ProgrammingLanguageExperience": { value: 0.00, clicked: false },
        "ApplicationOfSoftwareEngineeringMethods": { value: 0.00, clicked: false },
        "UseOfSoftwareTools": { value: 0.00, clicked: false },
        "RequiredDevelopmentSchedule": { value: 0.00, clicked: false }
    });

    const handleClick = (factor, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [factor]: { value, clicked: true }
        }));
    };

    const calculateTotal = () => {
        const total = Object.values(values).reduce((acc, currentValue) => {
            if (currentValue.clicked) {
                return acc * parseFloat(currentValue.value);
            }
            return acc;
        }, 1);
        setTotal(total);
        localStorage.setItem('total', total);
    };
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

    useEffect(() => {
        calculateTotal();
    }, [values]);

    const [conversionType, setConversionType] = useState('LOC');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [totalLOC, setTotalLOC] = useState(0);

     // Data for languages and their average source statements per function point
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
                setSelectedValues({ a: 3.2, b: 1.05 , c: 0.38});

                break;
            case 'Semi Detached':
                setSelectedValues({ a: 3.0, b: 1.12 , c: 0.35});
                break;
            case 'Embedded':
                setSelectedValues({ a: 2.8, b: 1.20 , c: 0.32});
                break;
            default:
                setSelectedValues({ a: '', b: '' });
                break;
        }
    };

    const handleConversionTypeChange = (event) => {
        setConversionType(event.target.value);
        setInputValue(''); // Reset input value when conversion type changes
        setTotalLOC(0);    // Reset totalLOC when conversion type changes
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleInputChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value < 0) return;
        setInputValue(value);
        if (conversionType === 'LOC') {
            setTotalLOC(value / 1000);
        }
    };

    const handleKLOCInputChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value < 0) return;
        setInputValue(value);
        if (conversionType === 'KLOC') {
            setTotalLOC(value);
        }
    };

    const calculateLOC = () => {
        const inputValueFloat = parseFloat(inputValue);
        if (isNaN(inputValueFloat) || inputValueFloat < 0) {
            alert('Please enter a valid number for LOC or FP.');
            return;
        }

        if (conversionType === 'FP' && selectedLanguage === '') {
            alert('Please select a language.');
            return;
        }

        const multiplier = languageData[selectedLanguage];

        let totalLOC;
        if (conversionType === 'FP') {
            totalLOC = inputValueFloat * multiplier / 1000; // Convert FP to KLOC
        } else {
            totalLOC = inputValueFloat / 1000; // Convert LOC to KLOC
        }
        setTotalLOC(totalLOC);
        localStorage.setItem('totalLOC', totalLOC);
        calculateEffortAndTime(totalLOC); // Recalculate effort after updating totalLOC
    };

    const [effortApplied, setEffortApplied] = useState(0);

    const calculateEffortAndTime = (kloc) => {
        const KLOC = kloc || parseFloat(totalLOC);
        const { a, b, c } = selectedValues;
    
        if (isNaN(KLOC) || KLOC < 0) {
            alert('Please enter a valid number for KLOC.');
            return;
        }
    
        const effort = a * Math.pow(KLOC, b) * total;
        setEffortApplied(effort);
    
        const duration = 2.5 * Math.pow(effort, c);
        setDuration(duration);
    };
    
    
    
    useEffect(() => {
        if (conversionType === 'KLOC' || conversionType === 'LOC') {
            calculateEffortAndTime();
            
        }
    }, [conversionType, totalLOC, selectedValues, total]);
    const save = () => {
        const data = {
            duration: duration,
            costPerPersonMonth: costPerPersonMonth,
            totalKLOC: totalLOC,
            effortApplied: effortApplied,
            avgStaffSize:Math.floor(effortApplied/duration),
            cost: Math.floor(costPerPersonMonth * effortApplied),
            projectLevel: projectLevel,
           projectId: project.project_id

        };

        addDoc(collection(database, "intermediateCocomo"), data).then(() => {
            alert("Data has been saved");
        }).catch((error) => {
            alert("Error adding document: ", error);
        });
    }

    return (
        <div className='intermediate-cocomo-app'>
            <header>
                <h1>Intermediate Cocomo</h1>
            </header>
            
            <div >
                <label>Select Project Level:</label>
                <select value={projectLevel} onChange={handleProjectLevelChange}>
                    <option value="">Select Project Level</option>
                    <option value="Organic">Organic</option>
                    <option value="Semi Detached">Semi Detached</option>
                    <option value="Embedded">Embedded</option>
                </select>
            </div>
            {projectLevel && (
                <div className='output-section' >
                    <p>a = {selectedValues.a}</p>
                    <p>b = {selectedValues.b}</p>
                    <p>c = {selectedValues.c}</p>
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
                        <input type="number" id="klocInput" value={inputValue} onChange={handleKLOCInputChange} placeholder="Enter KLOC" />
                    </div>
                )}
            </div>
            {(conversionType === 'FP' && inputValue >= 0) && (
                <button className='calculate-loc-button' onClick={calculateLOC}>Calculate</button>
            )}
            
            <div className='output-section'>
            <p>Total KLOC: {totalLOC}</p>
            </div>
            <p>Enter Cost per Person-month:</p>

            <div>
            <input
                type="number"
                placeholder="Enter cost per persons month"
                onChange={handleCostPerPersonsMonth}
                value={costPerPersonMonth}
                min="0"
            />
            </div>
            
            
<h3>Effort Adjustment Factors <strong>(EAF)</strong></h3>
            <table className="table table-striped table-hover"  style={{ width: '80%' }} >
                <thead>
                    <tr>
                        <th>Cost Drivers</th>
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

                        <td colSpan="7" style={{ fontWeight: 'bold' }}>Product Attributes</td>
                    </tr>
                    <tr>

                        <td>Required software reliability</td>
                        <td onClick={() => handleClick('RequiredSoftwareReliability', 0.75)} className={values.RequiredSoftwareReliability.clicked && values.RequiredSoftwareReliability.value === 0.75 ? 'clicked' : ''}>0.75</td>
                        <td onClick={() => handleClick('RequiredSoftwareReliability', 0.88)} className={values.RequiredSoftwareReliability.clicked && values.RequiredSoftwareReliability.value === 0.88 ? 'clicked' : ''}>0.88</td>
                        <td onClick={() => handleClick('RequiredSoftwareReliability', 1.00)} className={values.RequiredSoftwareReliability.clicked && values.RequiredSoftwareReliability.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('RequiredSoftwareReliability', 1.15)} className={values.RequiredSoftwareReliability.clicked && values.RequiredSoftwareReliability.value === 1.15 ? 'clicked' : ''}>1.15</td>
                        <td onClick={() => handleClick('RequiredSoftwareReliability', 1.40)} className={values.RequiredSoftwareReliability.clicked && values.RequiredSoftwareReliability.value === 1.40 ? 'clicked' : ''}>1.40</td>
                        <td>-</td>
                        <td>{values.RequiredSoftwareReliability.value}</td>
                    </tr>
                    <tr>
                        <td>Size of application database</td>
                        <td>-</td>
                        <td onClick={() => handleClick('SizeOfApplicationDatabase', 0.94)} className={values.SizeOfApplicationDatabase.clicked && values.SizeOfApplicationDatabase.value === 0.94 ? 'clicked' : ''}>0.94</td>
                        <td onClick={() => handleClick('SizeOfApplicationDatabase', 1.00)} className={values.SizeOfApplicationDatabase.clicked && values.SizeOfApplicationDatabase.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('SizeOfApplicationDatabase', 1.08)} className={values.SizeOfApplicationDatabase.clicked && values.SizeOfApplicationDatabase.value === 1.08 ? 'clicked' : ''}>1.08</td>
                        <td onClick={() => handleClick('SizeOfApplicationDatabase', 1.16)} className={values.SizeOfApplicationDatabase.clicked && values.SizeOfApplicationDatabase.value === 1.16 ? 'clicked' : ''}>1.16</td>
                        <td>-</td>
                        <td>{values.SizeOfApplicationDatabase.value}</td>
                    </tr>
                    <tr>
                        <td>Complexity of the product</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 0.70)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 0.70 ? 'clicked' : ''}>0.70</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 0.85)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 0.85 ? 'clicked' : ''}>0.85</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 1.00)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 1.15)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 1.15 ? 'clicked' : ''}>1.15</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 1.30)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 1.30 ? 'clicked' : ''}>1.30</td>
                        <td onClick={() => handleClick('ComplexityOfTheProduct', 1.65)} className={values.ComplexityOfTheProduct.clicked && values.ComplexityOfTheProduct.value === 1.65 ? 'clicked' : ''}>1.65</td>
                        <td>{values.ComplexityOfTheProduct.value}</td>
                    </tr>
                    <tr>

                        <td colSpan="7" style={{ fontWeight: 'bold' }}>Hardware Attributes</td>
                    </tr>
                    <tr>
                        <td>Run-time performance constraints</td>
                        <td>-</td>
                        <td>-</td>
                        <td onClick={() => handleClick('RunTimePerformanceConstraints', 1.00)} className={values.RunTimePerformanceConstraints.clicked && values.RunTimePerformanceConstraints.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('RunTimePerformanceConstraints', 1.11)} className={values.RunTimePerformanceConstraints.clicked && values.RunTimePerformanceConstraints.value === 1.11 ? 'clicked' : ''}>1.11</td>
                        <td onClick={() => handleClick('RunTimePerformanceConstraints', 1.30)} className={values.RunTimePerformanceConstraints.clicked && values.RunTimePerformanceConstraints.value === 1.30 ? 'clicked' : ''}>1.30</td>
                        <td onClick={() => handleClick('RunTimePerformanceConstraints', 1.66)} className={values.RunTimePerformanceConstraints.clicked && values.RunTimePerformanceConstraints.value === 1.66 ? 'clicked' : ''}>1.66</td>
                        <td>{values.RunTimePerformanceConstraints.value}</td>
                    </tr>
                    <tr>
                        <td>Memory constraints</td>
                        <td>-</td>
                        <td>-</td>
                        <td onClick={() => handleClick('MemoryConstraints', 1.00)} className={values.MemoryConstraints.clicked && values.MemoryConstraints.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('MemoryConstraints', 1.06)} className={values.MemoryConstraints.clicked && values.MemoryConstraints.value === 1.06 ? 'clicked' : ''}>1.06</td>
                        <td onClick={() => handleClick('MemoryConstraints', 1.21)} className={values.MemoryConstraints.clicked && values.MemoryConstraints.value === 1.21 ? 'clicked' : ''}>1.21</td>
                        <td onClick={() => handleClick('MemoryConstraints', 1.56)} className={values.MemoryConstraints.clicked && values.MemoryConstraints.value === 1.56 ? 'clicked' : ''}>1.56</td>
                        <td>{values.MemoryConstraints.value}</td>
                    </tr>
                    <tr>
                        <td>Volatility of the virtual machine environment</td>
                        <td>-</td>
                        <td onClick={() => handleClick('VolatilityOfTheVirtualMachineEnvironment', 0.87)} className={values.VolatilityOfTheVirtualMachineEnvironment.clicked && values.VolatilityOfTheVirtualMachineEnvironment.value === 0.87 ? 'clicked' : ''}>0.87</td>
                        <td onClick={() => handleClick('VolatilityOfTheVirtualMachineEnvironment', 1.00)} className={values.VolatilityOfTheVirtualMachineEnvironment.clicked && values.VolatilityOfTheVirtualMachineEnvironment.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('VolatilityOfTheVirtualMachineEnvironment', 1.15)} className={values.VolatilityOfTheVirtualMachineEnvironment.clicked && values.VolatilityOfTheVirtualMachineEnvironment.value === 1.15 ? 'clicked' : ''}>1.15</td>
                        <td onClick={() => handleClick('VolatilityOfTheVirtualMachineEnvironment', 1.30)} className={values.VolatilityOfTheVirtualMachineEnvironment.clicked && values.VolatilityOfTheVirtualMachineEnvironment.value === 1.30 ? 'clicked' : ''}>1.30</td>
                        <td>-</td>
                        <td>{values.VolatilityOfTheVirtualMachineEnvironment.value}</td>
                    </tr>
                    <tr>
                        <td>Required turnabout time</td>
                        <td>-</td>
                        <td onClick={() => handleClick('RequiredTurnaboutTime', 0.87)} className={values.RequiredTurnaboutTime.clicked && values.RequiredTurnaboutTime.value === 0.87 ? 'clicked' : ''}>0.87</td>
                        <td onClick={() => handleClick('RequiredTurnaboutTime', 1.00)} className={values.RequiredTurnaboutTime.clicked && values.RequiredTurnaboutTime.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('RequiredTurnaboutTime', 1.07)} className={values.RequiredTurnaboutTime.clicked && values.RequiredTurnaboutTime.value === 1.07 ? 'clicked' : ''}>1.07</td>
                        <td onClick={() => handleClick('RequiredTurnaboutTime', 1.15)} className={values.RequiredTurnaboutTime.clicked && values.RequiredTurnaboutTime.value === 1.15 ? 'clicked' : ''}>1.15</td>
                        <td>-</td>
                        <td>{values.RequiredTurnaboutTime.value}</td>
                    </tr>
                    <tr>

                        <td colSpan="7" style={{ fontWeight: 'bold' }}>Personal Attributes</td>
                    </tr>
                    <tr>
                        <td>Analyst capability</td>
                        <td onClick={() => handleClick('AnalystCapability', 1.46)} className={values.AnalystCapability.clicked && values.AnalystCapability.value === 1.46 ? 'clicked' : ''}>1.46</td>
                        <td onClick={() => handleClick('AnalystCapability', 1.19)} className={values.AnalystCapability.clicked && values.AnalystCapability.value === 1.19 ? 'clicked' : ''}>1.19</td>
                        <td onClick={() => handleClick('AnalystCapability', 1.00)} className={values.AnalystCapability.clicked && values.AnalystCapability.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('AnalystCapability', 0.86)} className={values.AnalystCapability.clicked && values.AnalystCapability.value === 0.86 ? 'clicked' : ''}>0.86</td>
                        <td onClick={() => handleClick('AnalystCapability', 0.71)} className={values.AnalystCapability.clicked && values.AnalystCapability.value === 0.71 ? 'clicked' : ''}>0.71</td>
                        <td>-</td>
                        <td>{values.AnalystCapability.value}</td>
                    </tr>
                    <tr>
                        <td>Applications experience</td>
                        <td onClick={() => handleClick('ApplicationsExperience', 1.29)} className={values.ApplicationsExperience.clicked && values.ApplicationsExperience.value === 1.29 ? 'clicked' : ''}>1.29</td>
                        <td onClick={() => handleClick('ApplicationsExperience', 1.13)} className={values.ApplicationsExperience.clicked && values.ApplicationsExperience.value === 1.13 ? 'clicked' : ''}>1.13</td>
                        <td onClick={() => handleClick('ApplicationsExperience', 1.00)} className={values.ApplicationsExperience.clicked && values.ApplicationsExperience.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('ApplicationsExperience', 0.91)} className={values.ApplicationsExperience.clicked && values.ApplicationsExperience.value === 0.91 ? 'clicked' : ''}>0.91</td>
                        <td onClick={() => handleClick('ApplicationsExperience', 0.82)} className={values.ApplicationsExperience.clicked && values.ApplicationsExperience.value === 0.82 ? 'clicked' : ''}>0.82</td>
                        <td>-</td>
                        <td>{values.ApplicationsExperience.value}</td>
                    </tr>
                    <tr>
                        <td>Software engineer capability</td>
                        <td onClick={() => handleClick('SoftwareEngineerCapability', 1.42)} className={values.SoftwareEngineerCapability.clicked && values.SoftwareEngineerCapability.value === 1.42 ? 'clicked' : ''}>1.42</td>
                        <td onClick={() => handleClick('SoftwareEngineerCapability', 1.17)} className={values.SoftwareEngineerCapability.clicked && values.SoftwareEngineerCapability.value === 1.17 ? 'clicked' : ''}>1.17</td>
                        <td onClick={() => handleClick('SoftwareEngineerCapability', 1.00)} className={values.SoftwareEngineerCapability.clicked && values.SoftwareEngineerCapability.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('SoftwareEngineerCapability', 0.86)} className={values.SoftwareEngineerCapability.clicked && values.SoftwareEngineerCapability.value === 0.86 ? 'clicked' : ''}>0.86</td>
                        <td onClick={() => handleClick('SoftwareEngineerCapability', 0.70)} className={values.SoftwareEngineerCapability.clicked && values.SoftwareEngineerCapability.value === 0.70 ? 'clicked' : ''}>0.70</td>
                        <td>-</td>
                        <td>{values.SoftwareEngineerCapability.value}</td>
                    </tr>
                    <tr>
                        <td>Virtual machine experience</td>
                        <td onClick={() => handleClick('VirtualMachineExperience', 1.21)} className={values.VirtualMachineExperience.clicked && values.VirtualMachineExperience.value === 1.21 ? 'clicked' : ''}>1.21</td>
                        <td onClick={() => handleClick('VirtualMachineExperience', 1.10)} className={values.VirtualMachineExperience.clicked && values.VirtualMachineExperience.value === 1.10 ? 'clicked' : ''}>1.10</td>
                        <td onClick={() => handleClick('VirtualMachineExperience', 1.00)} className={values.VirtualMachineExperience.clicked && values.VirtualMachineExperience.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('VirtualMachineExperience', 0.90)} className={values.VirtualMachineExperience.clicked && values.VirtualMachineExperience.value === 0.90 ? 'clicked' : ''}>0.90</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{values.VirtualMachineExperience.value}</td>
                    </tr>
                    <tr>
                        <td>Programming language experience</td>
                        <td onClick={() => handleClick('ProgrammingLanguageExperience', 1.14)} className={values.ProgrammingLanguageExperience.clicked && values.ProgrammingLanguageExperience.value === 1.14 ? 'clicked' : ''}>1.14</td>
                        <td onClick={() => handleClick('ProgrammingLanguageExperience', 1.07)} className={values.ProgrammingLanguageExperience.clicked && values.ProgrammingLanguageExperience.value === 1.07 ? 'clicked' : ''}>1.07</td>
                        <td onClick={() => handleClick('ProgrammingLanguageExperience', 1.00)} className={values.ProgrammingLanguageExperience.clicked && values.ProgrammingLanguageExperience.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('ProgrammingLanguageExperience', 0.95)} className={values.ProgrammingLanguageExperience.clicked && values.ProgrammingLanguageExperience.value === 0.95 ? 'clicked' : ''}>0.95</td>
                        <td>-</td>
                        <td>-</td>
                        <td>{values.ProgrammingLanguageExperience.value}</td>
                    </tr>
                    <tr>

                        <td colSpan="7" style={{ fontWeight: 'bold' }}>Project Attributes</td>
                    </tr>
                    <tr>
                        <td>Application of software engineering methods</td>
                        <td onClick={() => handleClick('ApplicationOfSoftwareEngineeringMethods', 1.24)} className={values.ApplicationOfSoftwareEngineeringMethods.clicked && values.ApplicationOfSoftwareEngineeringMethods.value === 1.24 ? 'clicked' : ''}>1.24</td>
                        <td onClick={() => handleClick('ApplicationOfSoftwareEngineeringMethods', 1.10)} className={values.ApplicationOfSoftwareEngineeringMethods.clicked && values.ApplicationOfSoftwareEngineeringMethods.value === 1.10 ? 'clicked' : ''}>1.10</td>
                        <td onClick={() => handleClick('ApplicationOfSoftwareEngineeringMethods', 1.00)} className={values.ApplicationOfSoftwareEngineeringMethods.clicked && values.ApplicationOfSoftwareEngineeringMethods.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('ApplicationOfSoftwareEngineeringMethods', 0.91)} className={values.ApplicationOfSoftwareEngineeringMethods.clicked && values.ApplicationOfSoftwareEngineeringMethods.value === 0.91 ? 'clicked' : ''}>0.91</td>
                        <td onClick={() => handleClick('ApplicationOfSoftwareEngineeringMethods', 0.82)} className={values.ApplicationOfSoftwareEngineeringMethods.clicked && values.ApplicationOfSoftwareEngineeringMethods.value === 0.82 ? 'clicked' : ''}>0.82</td>
                        <td>-</td>
                        <td>{values.ApplicationOfSoftwareEngineeringMethods.value}</td>
                    </tr>
                    <tr>
                        <td>Use of software tools</td>
                        <td onClick={() => handleClick('UseOfSoftwareTools', 1.24)} className={values.UseOfSoftwareTools.clicked && values.UseOfSoftwareTools.value === 1.24 ? 'clicked' : ''}>1.24</td>
                        <td onClick={() => handleClick('UseOfSoftwareTools', 1.10)} className={values.UseOfSoftwareTools.clicked && values.UseOfSoftwareTools.value === 1.10 ? 'clicked' : ''}>1.10</td>
                        <td onClick={() => handleClick('UseOfSoftwareTools', 1.00)} className={values.UseOfSoftwareTools.clicked && values.UseOfSoftwareTools.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('UseOfSoftwareTools', 0.91)} className={values.UseOfSoftwareTools.clicked && values.UseOfSoftwareTools.value === 0.91 ? 'clicked' : ''}>0.91</td>
                        <td onClick={() => handleClick('UseOfSoftwareTools', 0.83)} className={values.UseOfSoftwareTools.clicked && values.UseOfSoftwareTools.value === 0.83 ? 'clicked' : ''}>0.83</td>
                        <td>-</td>
                        <td>{values.UseOfSoftwareTools.value}</td>
                    </tr>
                    <tr>
                        <td>Required development schedule</td>
                        <td onClick={() => handleClick('RequiredDevelopmentSchedule', 1.23)} className={values.RequiredDevelopmentSchedule.clicked && values.RequiredDevelopmentSchedule.value === 1.23 ? 'clicked' : ''}>1.23</td>
                        <td onClick={() => handleClick('RequiredDevelopmentSchedule', 1.08)} className={values.RequiredDevelopmentSchedule.clicked && values.RequiredDevelopmentSchedule.value === 1.08 ? 'clicked' : ''}>1.08</td>
                        <td onClick={() => handleClick('RequiredDevelopmentSchedule', 1.00)} className={values.RequiredDevelopmentSchedule.clicked && values.RequiredDevelopmentSchedule.value === 1.00 ? 'clicked' : ''}>1.00</td>
                        <td onClick={() => handleClick('RequiredDevelopmentSchedule', 1.04)} className={values.RequiredDevelopmentSchedule.clicked && values.RequiredDevelopmentSchedule.value === 1.04 ? 'clicked' : ''}>1.04</td>
                        <td onClick={() => handleClick('RequiredDevelopmentSchedule', 1.10)} className={values.RequiredDevelopmentSchedule.clicked && values.RequiredDevelopmentSchedule.value === 1.10 ? 'clicked' : ''}>1.10</td>
                        <td>-</td>
                        <td>{values.RequiredDevelopmentSchedule.value}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td colSpan="7">{total}</td>
                    </tr>
                </tfoot>
            </table>
            <div className="output-section">
            
           
                   
            <p>Effort Applied: {Math.floor(effortApplied)} person-months</p>
            <p>Duration: {duration.toFixed(2)} Months</p>
            <p>Average Staff Size: {Math.floor(effortApplied/duration)} Persons</p>
            <p>Cost: {Math.floor(effortApplied*costPerPersonMonth)} $</p>
            <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
            <div className='references'>
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

export default IntermediateCocomo;
