// to check if all inputs are filled or not 
// if any of them is not filled this will return false 
const check_condition = (inputs) => {
    let filled = true;
    inputs.forEach((input) => {

        if (input.tagName.toLowerCase() === 'select') {
            const selectedOption = input.options[input.selectedIndex];
            if (selectedOption.disabled || selectedOption.value == 0) {
                filled = false;
            }
        } else {
            if (input.value == 0) {
                filled = false;
            }
        }
    });
    return filled;
};

const findPercentage = (total, current) => {
    return Math.round((current / total) * 10000) / 100
}

// formatting string into numbers
function removeSpecialCharacters(input) {
    // Replace commas, dollar signs, and words with an empty string
    const result = input.replace(/[, $%a-zA-Z]/g, '');

    // Convert the result to a number
    const numericValue = parseFloat(result);

    // Check if the numericValue is a valid number
    if (!isNaN(numericValue)) {
        return numericValue;
    } else {
        // Handle the case when the result is not a valid number
        console.error('Invalid numeric value after removing special characters');
        return null;
    }
}

// get GDS function
const getGDS = (annualIncome, principal, interestRate, taxes = 0, heat = 0) => {
    // Convert interest rate from percentage to decimal
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate monthly interest payment
    const interest = principal * monthlyInterestRate;

    // Total monthly housing expenses
    const totalHouseExp = principal + interest + taxes + heat;

    // GDS ratio
    const GDS = (totalHouseExp / (annualIncome / 12)) * 100;

    return GDS;
};

// get TDS function
const getTDS = (annualIncome, principal, interestRate, taxes = 0, heat = 0, otherDebtObligations = 0) => {
    // Convert interest rate from percentage to decimal
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate monthly interest payment
    const interest = principal * monthlyInterestRate;

    // Total monthly housing expenses with other debt obligations
    const totalHouseExpWithTax = principal + interest + taxes + heat + otherDebtObligations;

    // TDS ratio
    const TDSRatio = totalHouseExpWithTax / annualIncome;

    // TDS percentage
    const TDS = TDSRatio * 100;

    return { TDS, TDSRatio };
};

// get monthly income 
const getGrossMonthlyIncome = function (annualIncome) {
    return Math.round((annualIncome / 12) * 100) / 100
}
// calculate Monthly payments of Mortgage
function calculateMonthlyPayment(principal, loanTermYears, interestRate, n) {
    const loanAmount = principal;
    // Calculate the monthly interest rate
    const monthlyInterestRate = (interestRate / 100) / n;
    const rate = Math.ceil(monthlyInterestRate * 1000) / 1000
    // Calculate the total number of payments (months)
    const totalPayments = loanTermYears * n;
    // Calculate the monthly payment using the formula
    const n_by_r = Math.round(Math.pow(1 + monthlyInterestRate, totalPayments) * 10000000) / 10000000
    console.log(n_by_r)
    const monthlyPayment = (loanAmount * (monthlyInterestRate * n_by_r)) / (n_by_r - 1);

    return monthlyPayment.toFixed(2); // Round to 2 decimal places
}

// this function gets the total mortgage using the downpayment and its percentage 
function calculateMortgageAndPrincipal(downPayment, downPaymentPercentage) {
    // Calculate mortgage loan amount
    const mortgageLoanAmount = downPayment / (downPaymentPercentage / 100);

    // Principal amount is the same as the mortgage loan amount
    const principalAmount = mortgageLoanAmount;

    return {
        mortgageLoanAmount,
        principalAmount
    };
}

// calculate Mortgage Insurance 
function calculateMortgageInsurance(homePrice, downPayment) {
    const principal = homePrice - downPayment;
    const downpaymentPercentage = ((downPayment / homePrice) * 100).toFixed(2);
    const loanToValue = 100 - downpaymentPercentage;
    let mortgageInsuranceRate = 0;

    if (loanToValue <= 80) {
        mortgageInsuranceRate = 0;
    } else if (loanToValue > 80 && loanToValue <= 85) {
        mortgageInsuranceRate = 2.80;
    } else if (loanToValue > 85 && loanToValue <= 90) {
        mortgageInsuranceRate = 3.10;
    } else if (loanToValue > 90 && loanToValue <= 95) {
        mortgageInsuranceRate = 4;
    }

    const mortgageInsurance = Math.round(principal * (mortgageInsuranceRate / 100));
    return mortgageInsurance;
}
// to format Number in US Currency
const formatNumbers = (number) => {
    const fomattedNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    return fomattedNumber;
}

// Added my own property to js array to get last value of any array
Object.defineProperty(Array.prototype, 'last', {
    get() {
        if (this.length < 1) return undefined
        return this[this.length - 1]
    },
    enumerable: false
});
// this is for node list arrays because they normal Array prototype does not work on NodeList Arrays
Object.defineProperty(NodeList.prototype, 'last', {
    get() {
        return this[this.length - 1];
    },
    enumerable: false
});
// this is for HTML Options collections 
Object.defineProperty(HTMLOptionsCollection.prototype, 'last', {
    get() {
        return this[this.length - 1];
    },
    enumerable: false
});