document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputValues = []; //stores the values of all the input elements in the form.
    const result = document.querySelector(".result"); //Stores the "Result" <div> element. 
    const resultTitleElement = result.querySelector(".result-title"); //Stores the title of the "Result" <div>
    const alertMsgElement = document.querySelector(".alert-msg");
    const marksValElement = result.querySelector('.marks-val');
    const totalMarksElement = result.querySelector('.total-marks');
    const percentageValElement = result.querySelector('.percentage-val');
    const gradeValElement = result.querySelector('.grade-val');
    const gradeRemarksElement = result.querySelector('.grade-remarks');
    const addSubBtn = document.querySelector(".add-sub-btn"); //Selects the Add-Subject Btn
    const resetBtn = document.querySelector(".reset-btn") //Selects the Reset Button Element

    // 👇 Function to create a new a <div> element of class "input-container":
    const createInpContainer = (subject) => {
        const inpContainer = document.createElement("div");
        inpContainer.className = "input-container";

        const input = document.createElement("input");
        input.type = "number";
        input.id = subject.toLowerCase();
        input.name = subject.toLowerCase();
        input.placeholder = subject;
        input.min = "0";
        input.max = "100";

        const label = document.createElement("label");
        label.htmlFor = input.id ;
        label.classList.add("p-0", "absolute", "text-white", "leading-[2rem]", "bg-[var(--primary)]", "opacity-0", "transition-all", "duration-300",  "cursor-text");
        label.innerText = subject;

        const abbr = document.createElement("abbr");
        abbr.title = "Delete marks-input box";
        abbr.classList.add("no-underline");

        const delBtn = document.createElement("button");
        delBtn.className = "del-btn";
        delBtn.type = "button";
        delBtn.innerHTML = `<svg class="del-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
        
        inpContainer.appendChild(input);
        inpContainer.appendChild(label);
        inpContainer.appendChild(abbr);
        abbr.appendChild(delBtn);

        return inpContainer;
    }


    //👇 Function to Handle the "Click" event triggered by the Add-Subject button
    const addSubject = () => {
        let subject = prompt("Enter the Subject Name [Only Alphabets and Spaces]: ").trim();

        if (subject && /^[A-Za-z\s]+$/.test(subject)) {
            result.classList.add("hidden"); //hides the "Alert" Paragraph element
            let newInpContainer = createInpContainer(subject);
            let inpContainers = form.querySelectorAll(".input-container");
            let lastInpContainer = inpContainers[inpContainers.length - 1];

            if (lastInpContainer) {
                lastInpContainer.insertAdjacentElement("afterend", newInpContainer);
            }
            else {
                form.insertAdjacentElement("afterbegin", newInpContainer);
            }
        }
        else {
            displayAlert("Please enter a valid subject name (only letters and spaces).");
        }
    }


    //👇 Function to Reset the webpage to initial state and Make the 'Result Paragraph' invisible.
    const reset = () => {
        result.classList.add("hidden");
    }


    //👇 Function to Delete the target's Parent Element (Marks Input Container), when the .del-btn is clicked.
    const delMarksInpField = (deleteButton) => {
        const inputContainer = deleteButton.closest(".input-container");
        
        if(inputContainer) {
            inputContainer.remove();
            updateMarks(true);
        }
    }


    //👇 Function to Calculate and Display the 'Result Paragraph'
    const displayResult = (marksObtained, totalMarks, percentage) => {
        result.classList.remove("alert");
        result.classList.remove("hidden");
        result.classList.add("bg-white", "border-blue-500");
        alertMsgElement.classList.add("hidden");
        resultTitleElement.innerHTML = `<svg class="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> Result`;
        result.querySelector(".stats").classList.remove("hidden");
        marksValElement.textContent = marksObtained;
        totalMarksElement.textContent = totalMarks;
        percentageValElement.textContent = `${percentage}%`;

        let grade, remarks, color;
        if (percentage >= 90) {
            grade = 'A+';
            remarks = 'Excellent';
            color = "#52eb34"; // green
        } else if (percentage >= 80) {
            grade = 'A';
            remarks = 'Very Good';
            color = "#039dfc"; // blue
        } else if (percentage >= 70) {
            grade = 'B';
            remarks = 'Good';
            color = "#ffa500"; // orange
        } else if (percentage >= 60) {
            grade = 'C';
            remarks = 'Average';
            color = "#ff8c00"; // dark orange
        } else if (percentage >= 45) {
            grade = 'D';
            remarks = 'Below Average';
            color = "#ff4500"; // orange red
        } else if (percentage >= 33) {
            grade = 'E';
            remarks = 'Needs Improvement';
            color = "#ff6347"; // tomato
        } else {
            grade = 'F';
            remarks = 'Failed';
            color = "#ff5733"; // red
        }

        gradeValElement.textContent = grade;
        gradeRemarksElement.textContent = remarks;

        // Apply the same color to all relevant elements
        percentageValElement.style.color = color;
        gradeValElement.style.color = color;
        gradeRemarksElement.style.color = color;
    }


    //👇 Function to Update the "totalMarks" when a Subject gets removed:
    const updateMarks = (forDeletePurpose) => {
        inputValues.splice(0, inputValues.length); //Removing the previously stored values of all the input elements.
        getUserInputMarks();
        let marksObtained = inputValues.reduce((sum, el) => sum + el, 0); //calculated total sum of marks, entered by the user
        let totalMarks = inputValues.length * 100;  //to count the total subjects, inputElements.length is used, and multiplied 
        //by 100 to get maximum marks (incl. all sujbects), as 100 is the max marks for each subject.
        let percentage = Math.round((marksObtained / totalMarks) * 100); //calculating percentage and rounding off.

        //👇 Update Marks & Percentage in the Result:
        if(forDeletePurpose) {
            if (inputValues.length <= 0) { //Tolta no. of input-box to enter marks is '0' Zero.
                displayAlert("Please, Add Subjects to Calculate Marks & Percentage, and Get the Result.");
            }
            else {
                marksValElement.textContent = marksObtained;
                totalMarksElement.textContent = totalMarks;
                percentageValElement.textContent = `${percentage}%`;
            }
        }
        else {
            displayResult(marksObtained, totalMarks, percentage);
        }
    }


    //👇 Function to Check if any 'inputValues' is valid or invalid (NaN/Null) & Display Alert
    const checkInputVals = () => {
        for (let value of inputValues) {
            if (!(value >= 0 && value <= 100)) {
                displayAlert("Please, Enter Valid Marks For All Subjects, Ranging 0-100.");
                return false; //means, Value is Invalid and Calculation Operation can't be Performed. 
            }
        }
        return true; //means, Value is valid and Calculation Operation can be Performed. 
    }


    //👇 Function to Display the "Div" element as Alert:
    const displayAlert = (message) => {
        result.classList.remove("hidden");
        result.classList.add("alert");
        result.classList.remove("bg-white", "border-blue-500");
        resultTitleElement.textContent = "Alert";
        resultTitleElement.innerHTML = ` 
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Alert`;
        alertMsgElement.classList.remove("hidden");
        alertMsgElement.innerHTML = message;
        result.querySelector(".stats").classList.add("hidden");
    }


    //👇 Function to get the values/marks entered by the user as inputs.
    const getUserInputMarks = () => {
        let formElements = form.elements; //Stores the total form elements.

        for (el of formElements) {
            if (el.tagName === "INPUT" && el.type === "number") {
                inputValues.push(parseInt(el.value));
            }
        }
    }


    //👇 Function to Handle the "Form Submit" event and Calculate Marks and Perecentage
    const calculate = (event) => {
        event.preventDefault();
        
        inputValues.splice(0, inputValues.length); //Removing the previously stored values of all the input elements.
        getUserInputMarks();

        if (inputValues.length <= 0) { //Corner-Case, when there are no(zero) input-fields to enter marks.
            displayAlert("There are not enough subjects to calculate marks. Please, Add Subjects by Using 'Add-Subject' Button.");
            return;
        }
        else if (checkInputVals()) {
            updateMarks(false);
        }
    }


    //👇 Events Definitions and Control Structures (Loops):
    form.addEventListener("submit", calculate);
    
    /*👇 Since, the Delete Btns are dynamcically added, therefore, used "event bubbling" 
    phenomenon to define "click" event-handlers for "del-btn". */ 
    form.addEventListener("click", (event) => { 
        const deleteButton = event.target.closest(".del-btn");
        
        if(deleteButton) {
            event.preventDefault(); // Prevent any default button behavior
            delMarksInpField(deleteButton);
        }
    })

    addSubBtn.addEventListener("click", addSubject);
    resetBtn.addEventListener("click", reset);
});
