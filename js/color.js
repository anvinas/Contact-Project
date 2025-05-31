

/*
const inputEl = document.querySelector('#searchText');
console.log(inputEl);
inputEl.addEventListener('input', function(event) {

    const data = searchColor(event.target.value);
    
});
*/


// Handle Open My Create Contact Modal
const handleOpenCreateContactModal = ()=>{
    const modalEl = document.querySelector("#createModalContainer");
    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Create Contact Modal
const handleCloseCreateContactModal = ()=>{
    const modalEl = document.querySelector("#createModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}

//Handle Open My Delete Contact Modal
const handleOpenDeleteContactModal = ()=>{
    const modalEl = document.querySelector("#deleteModalContainer");
    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Delete Contact Modal
const handleCloseDeleteContactModal = ()=>{
    const modalEl = document.querySelector("#deleteModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}


//Handle Open My Modify Contact Modal
const handleOpenModifyContactModal = ()=>{
    const modalEl = document.querySelector("#modifyModalContainer");
    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Modify Contact Modal
const handleCloseModifyContactModal = ()=>{
    const modalEl = document.querySelector("#modifyModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}