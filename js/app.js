const loan_amount = document.getElementById("loan-amount");
const allDownPaymentPercent = document.querySelectorAll('.downPaymentPercent');
const allDownPaymentValue = document.querySelectorAll('.downPaymentValue');
const mortgageInsurance = document.querySelectorAll('.mortgageInsurance');
const totalMortgage = document.querySelectorAll('.totalMortgage');
const mortgageRate = document.querySelectorAll('.mortgageRate');
const amortizationPeriod = document.querySelectorAll('.amortizationPeriod');
const allMonthlyPayments = document.querySelectorAll('.monthlyPayment');
const paymentFrequency = document.querySelector('#paymentFrequency');
const formatableNumbers = document.querySelectorAll('.moneyFormattable');

function convertDownPayment(mortgagePayment, downPaymentPercent) {
    // Ensure the down payment percent is in decimal form (e.g., 20% -> 0.20)
    const downPaymentDecimal = downPaymentPercent / 100;

    // Calculate the down payment amount in dollars
    const downPaymentAmount = mortgagePayment * downPaymentDecimal;

    const formattedDownPayment = downPaymentAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0, // Ensure no decimal places
        maximumFractionDigits: 0,
    });

    return formattedDownPayment;
}

function calculateMortgage(homePrice, downPayment, mortgageRate, amortizationPeriod, n) {
    const principal = (homePrice - downPayment);
    const downpaymentPercentage = ((downPayment / homePrice) * 100).toFixed(2);
    const { loanAmount, mortgageInsuranceRate } = calculateLoanAmount(homePrice, downPayment);
    const totalPayments = amortizationPeriod * 12;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, amortizationPeriod, mortgageRate, n);
    const totalMortgage = (principal + (principal * (mortgageInsuranceRate / 100))).toFixed(2);
    const totalPrincipalPaid = (monthlyPayment * totalPayments).toFixed(2);
    const totalInterestPaid = ((+totalPrincipalPaid + downPayment) - homePrice).toFixed(2);

    return { monthlyPayment, downpaymentPercentage, totalInterestPaid, totalPrincipalPaid, totalMortgage, };
}

function calculateLoanAmount(homePrice, downPayment) {
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
    const loanAmount = Math.round(principal + (principal * (mortgageInsuranceRate / 100)));
    return { loanAmount, mortgageInsuranceRate };
}

function calculateDownPayment(homePrice, downpaymentPercentage) {
    const downPayment = (homePrice * (downpaymentPercentage / 100)).toFixed(2);
    return parseFloat(downPayment);
}

function calculateDownPaymentPercent(homePrice, downPayment) {
    const downpaymentPercentage = ((downPayment / homePrice) * 100).toFixed(2);
    return parseFloat(downpaymentPercentage);
}

function checkDownPaymentPercent(downPaymentPercentage, index) {
    if (downPaymentPercentage < 20) {
        amortizationPeriod[index].options.last.disabled = true;
    } else {
        amortizationPeriod[index].options.last.disabled = false;
    }
}

loan_amount.addEventListener("change", function () {
    allDownPaymentPercent.forEach((dn, index) => {
        if (index === 0) {
            dn.value = 5
        } else if (index === 1) {
            dn.value = 10
        } else if (index === 2) {
            dn.value = 15
        } else if (index === 3) {
            dn.value = 20
        }
    });
    const change = new Event("change");
    setTimeout(() => {
        allDownPaymentValue.forEach((dn, index) => {
            dn.value = calculateDownPayment(+this.value, +allDownPaymentPercent[index].value)
            dn.removeAttribute('disabled')
        });

        mortgageInsurance.forEach((mi, index) => {
            mi.value = calculateMortgageInsurance(+this.value, +allDownPaymentValue[index].value)
        });

        totalMortgage.forEach((tm, index) => {
            tm.value = calculateLoanAmount(+this.value, +allDownPaymentValue[index].value).loanAmount
        });
        allDownPaymentPercent.forEach((allDP, index) => {
            allDP.removeAttribute('disabled')
            setTimeout(() => {
                allDP.dispatchEvent(change)
            }, 15)

        })
    });
});

allDownPaymentPercent.forEach((allDP, index) => {
    allDP.addEventListener('change', (e) => {
        allDownPaymentValue[index].value = calculateDownPayment(loan_amount?.value, e.target?.value);
        mortgageInsurance[index].value = calculateMortgageInsurance(loan_amount?.value, allDownPaymentValue[index]?.value)
        totalMortgage[index].value = calculateLoanAmount(loan_amount?.value, allDownPaymentValue[index]?.value).loanAmount
        checkDownPaymentPercent(allDP.value, index)
    });
});

allDownPaymentValue.forEach((allDV, index) => {
    allDV.addEventListener('change', (e) => {
        allDownPaymentPercent[index].value = calculateDownPaymentPercent(loan_amount?.value, e.target?.value)
        mortgageInsurance[index].value = calculateMortgageInsurance(loan_amount?.value, e.target?.value)
        totalMortgage[index].value = calculateLoanAmount(loan_amount?.value, e.target?.value).loanAmount
        checkDownPaymentPercent(allDP.value, index)
    });
});

amortizationPeriod.forEach((amrt, index) => {
    amrt.addEventListener('change', (e) => {
        let selectedOption = amrt.selectedIndex
        amortizationPeriod.forEach((amrt2, index) => {
            if (!check_condition(amortizationPeriod)) {
                amrt2.options[selectedOption].selected = true
            }
        })
    });
});

mortgageRate.forEach((MR) => {
    MR.addEventListener('change', (e) => {
        if (!check_condition(mortgageRate)) {
            mortgageRate.forEach((MR2) => {
                MR2.value = MR.value
            });
        }
        setTimeout(() => {
            mortgageRate.forEach((MR3, index) => {
                allMonthlyPayments[index].value = calculateMortgage(+loan_amount.value, +allDownPaymentValue[index].value, +MR3.value, +amortizationPeriod[index].value, +paymentFrequency.value).monthlyPayment
            })
        }, 100);
    })
})
paymentFrequency.addEventListener('change', (e) => {
    setTimeout(() => {
        mortgageRate.forEach((MR3, index) => {
            allMonthlyPayments[index].value = calculateMortgage(+loan_amount.value, +allDownPaymentValue[index].value, +MR3.value, +amortizationPeriod[index].value, +paymentFrequency.value).monthlyPayment
        })
    }, 100);
})


// Renewal Calculator Functionality
const buttonContainer = document.querySelectorAll('.buttonContainer button');
const scenariosContainer = document.querySelectorAll('.scenariosContainer');

buttonContainer.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        scenariosContainer.forEach((scene) => {
            scene.classList.add("hidden");
        });
        scenariosContainer[index].classList.remove('hidden')
    })
})

const renewalAmount = document.querySelector('#renewal_loan-amount')
const renewal_mortgageRate = document.querySelectorAll('.renewal_mortgageRate');
const allRenewal_monthlyPayment = document.querySelectorAll('.renewal_monthlyPayment');
const all_renewal_amortization = document.querySelectorAll('.renewal_amortization-period');

renewalAmount.addEventListener('change', (e) => {
    if (check_condition(renewal_mortgageRate) && check_condition(all_renewal_amortization)) {
        all_renewal_amortization.forEach((amrt2, index) => {
            allRenewal_monthlyPayment[index].value = calculateMonthlyPayment(+renewalAmount.value, +all_renewal_amortization[index].value, +renewal_mortgageRate[index].value, +renewal_paymentFrequency.value)
        })
    }

});

all_renewal_amortization.forEach((amrt, index) => {
    amrt.addEventListener('change', (e) => {
        let selectedOption = amrt.selectedIndex
        all_renewal_amortization.forEach((amrt2, index) => {
            if (!check_condition(all_renewal_amortization)) {
                amrt2.options[selectedOption].selected = true
            }
        })
    });
});

renewal_mortgageRate.forEach((MR) => {
    MR.addEventListener('change', (e) => {
        if (!check_condition(renewal_mortgageRate)) {
            renewal_mortgageRate.forEach((MR2) => {
                MR2.value = MR.value
            });
        }
        setTimeout(() => {
            renewal_mortgageRate.forEach((MR3, index) => {
                allRenewal_monthlyPayment[index].value = calculateMonthlyPayment(+renewalAmount.value, +all_renewal_amortization[index].value, +MR3.value, +renewal_paymentFrequency.value)
            })
        }, 100);
    })
})

renewal_paymentFrequency.addEventListener('change', (e) => {
    setTimeout(() => {
        renewal_mortgageRate.forEach((MR3, index) => {
            allRenewal_monthlyPayment[index].value = calculateMonthlyPayment(+renewalAmount.value, +all_renewal_amortization[index].value, +MR3.value, +renewal_paymentFrequency.value)
        })
    }, 100);
})
