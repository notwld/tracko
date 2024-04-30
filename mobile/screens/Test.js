import { useEffect, useState } from "react";
import { View } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";

const Test = () => {
   const [usecases, setUsecases] = useState([])
   useEffect(()=>{
    const usecasesFirebase = collection(database, 'usecases');
    const unsubscribe = onSnapshot(usecasesFirebase, (querySnapshot) => {
        const info = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUsecases(info);
        console.log(info);
    });
   },[])
   const getUsecaseWieght = (complexity) => {
    switch (complexity) {
        case 'simple':
            return 1;
        case 'average':
            return 2;
        case 'complex':
            return 3;
        default:
            return 0;
    }
}
   const calculateAdjustedUsecasePoints = (usecase) => {
   }

    return(
        <View>

        </View>
    )
}

export default Test;