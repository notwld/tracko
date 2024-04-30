const data = [{ "actorComplexity": {
    "Admin": { "complexity": "simple", "transactions": 10, "weight": 1 }, 
    "User": { "complexity": "simple", "transactions": 10, "weight": 1 } }, 
    "calculatedEnvironmentalWeight": 1.46, 
    "calculatedTechnicalWeight": 0.7, 
    "environmentalComplexity": [{ "complexity": 2, "description": "Part-time Staff", "factor": "E7", "weight": -1 }], 
    "technicalComplexity": [{ "complexity": 5, "description": "Distributed System", "factor": "T1", "weight": 2 }], 
    
    ///important UUCW
    "useCaseComplexity": "complex",
    "usecase": { "actors": [[Object], [Object]], 
    "description": "User inputs his details to registered", 
    "environmental_complexity": null, 
    "post_condition": "user happy", 
    "pre_condition": "user knows how to register", 
    "project_id": 1, 
    "steps": "idk ask huzzu", 
    "technical_complexity": null, 
    "title": "User Accesses Registration Page", 
    "transactions": null, "type": null, "usecase_id": 8, "weightfactor": null }, "user": "mwfarrukh" }, 
    { "actorComplexity": { 
    "Admin": { "complexity": "average", "transactions": 15, "weight": 2 }, 
    "User": { "complexity": "average", "transactions": 15, "weight": 2 } }, 
    "calculatedEnvironmentalWeight": 1.46, "calculatedTechnicalWeight": 0.7, 
    "environmentalComplexity": [{ "complexity": 2, "description": "Part-time Staff", "factor": "E7", "weight": -1 }], "technicalComplexity": [{ "complexity": 5, "description": "Distributed System", "factor": "T1", "weight": 2 }], 
    "useCaseComplexity": "complex", "usecase": { "actors": [[Object], [Object]], "description": "User inputs his details to registered", "environmental_complexity": null, "post_condition": "user happy", "pre_condition": "user knows how to register", "project_id": 1, "steps": "idk ask huzzu", "technical_complexity": null, "title": "User Accesses Registration Page", "transactions": null, "type": null, "usecase_id": 8, "weightfactor": null }, "user": "mwfarrukh" }]

let simpleActorCount = 0;
let averageActorCount = 0;
let complexActorCount = 0;

let simpleUseCaseCount = 0;
let averageUseCaseCount = 0;
let complexUseCaseCount = 0;

// Count occurrences of each complexity level for actors and use cases
data.forEach(item => {
    // For actors
    for (const actor in item.actorComplexity) {
        const complexity = item.actorComplexity[actor].complexity.toLowerCase();
        if (complexity === "simple") {
            simpleActorCount++;
        } else if (complexity === "average") {
            averageActorCount++;
        } else if (complexity === "complex") {
            complexActorCount++;
        }
    }

    // For use cases
    const useCaseComplexity = item.useCaseComplexity.toLowerCase();
    if (useCaseComplexity === "simple") {
        simpleUseCaseCount++;
    } else if (useCaseComplexity === "average") {
        averageUseCaseCount++;
    } else if (useCaseComplexity === "complex") {
        complexUseCaseCount++;
    }
});

// Define weights for actors and use cases
const actorWeights = {
    "simple": 1,
    "average": 2,
    "complex": 3
};

const useCaseWeights = {
    "simple": 5,
    "average": 10,
    "complex": 15
};

// Calculate UAW
const UAW = (actorWeights["simple"] * simpleActorCount) + (actorWeights["average"] * averageActorCount) + (actorWeights["complex"] * complexActorCount);
console.log("UAW:", UAW);

// Calculate UUCW
const UUCW = (useCaseWeights["simple"] * simpleUseCaseCount) + (useCaseWeights["average"] * averageUseCaseCount) + (useCaseWeights["complex"] * complexUseCaseCount);
console.log("UUCW:", UUCW);

const UUCP = UAW + UUCW;
console.log("UUCP:", UUCP);

let TCF = 0;
let EF = 0;

// Loop through the data to extract TCF and EF values
data.forEach(item => {
    TCF += item.calculatedTechnicalWeight;
    EF += item.calculatedEnvironmentalWeight;
});

console.log("TCF:", TCF);
console.log("EF:", EF);

const UCP= UUCP*TCF*EF
console.log("UCP:", UCP);