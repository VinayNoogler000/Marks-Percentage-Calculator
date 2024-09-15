const form = document.querySelector("form"); //Selected the Form Element
const p = document.querySelector(".result"); //stores the result paragraph
const resetBtn = document.querySelector(".reset-btn") //Selects the Reset Button Element

const getUserInputMarks = () => { //Function to get the values/marks entered by the user as inputs.
    let formElementsCount = form.elements.length; //Stores the count of total form elements.
    let inputValues = []; //Stores the values/marks entered by the user in the input elements.
   
    for(let i = 0; i < (formElementsCount - 2); i++) {
        inputValues.push( parseInt( form.elements[i].value ) );
    }

    return inputValues;
}

const checkInputVals = (inputVals) => { //Function to Check if any 'inputValues' is valid or invalid (NaN/Null) & Display Alert
    for(value of inputVals) {
        if( !(value >= 0 || value <= 100) ) { 
            p.innerHTML = "Values cannot be Empty. <br/> Please, Enter Valid Values Ranging 0-100.";
            p.classList.replace("result", "alert"); //changing paragraph 'p' from result to alert
            p.classList.replace("opacity-0", "opacity-100"); //making it visible
            
            return false; //means, Value is Invalid and Calculation Operation can't be Performed. 
        }
    }
    return true; //means, Value is Invalid and Calculation Operation can't be Performed. 
}

const displayResult = (marksObtained, percentage) => { //Function to Display the 'Result Paragraph'
    p.classList.replace("alert", "result");
    p.classList.replace("opacity-0", "opacity-100");
    p.innerHTML = `You Scored <span>${marksObtained}</span> Marks and Your Percentage is <span>${percentage}%</span>.`;

    if(percentage < 33) {
        p.style.color = "#FF5733"; //red
    }
    else if(percentage >= 33 && percentage < 50) {
        p.style.color = "#ffa500"; //orange
    }
    else if(percentage >= 50 && percentage < 70) {
        p.style.color = "#039dfc"; //blue
    }
    else {
        p.style.color = "#52eb34"; //green
    }
}

const calculate = (event) => { //Function to Handle the "Form Submit" event and Calculate Marks and Perecentage
    event.preventDefault();
    let inputValues = getUserInputMarks();
    
    if( checkInputVals(inputValues) ) {
        let marksObtained = inputValues.reduce( (sum, el) => el + sum); //calculated total sum of marks, entered by the user
        let totalMarks =  (form.elements.length - 2) * 100;  //two elements of form are buttons, so, to count just the input elements, 
                                                        //subtaction takes place, and multiplied by 100 to get maximum marks (incl. all sujbects), as 100 is the max marks for each subject.
        let percentage = Math.round( (marksObtained / totalMarks) * 100); //calculating percentage and rounding off.

        //👇 Display result paragraph:
        displayResult(marksObtained, percentage);
    }
}

const reset = () => { //Function to Reset the webpage to initial state and Make the 'Result Paragraph' invisible.
    p.classList.replace("opacity-100", "opacity-0"); 
}

form.addEventListener("submit", calculate);
resetBtn.addEventListener("click", reset);