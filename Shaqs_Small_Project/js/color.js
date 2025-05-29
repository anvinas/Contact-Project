

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