  let mp = new Map();
          let add=document.querySelector("#add");

       add.addEventListener("click", ()=>{
        document.body.insertAdjacentHTML("beforeend", `<div class="form">
     <input class="Title" type="text" placeholder="Title">
        
     <textarea  class="note" type="text" placeholder="Write Notes here">
        
     </textarea  >
     <div class="save">
        <button id="save">Save</button>
     </div>
      <button class="cut">
        <img src="cut.svg" alt="">
     </button>
    </div>`)
        
    //save data and store it in a hash map  
     
    let save=document.querySelector("#save");
    save.addEventListener("click", (event)=>{
        let f=document.querySelector(".form");
        let tc=f.children[0].value;
        let nc=f.children[1].value;
        let dtc= new Date();
         
        mp.set(tc,nc);

        let cont=document.querySelector(".container");
        cont.insertAdjacentHTML("beforeend", ` <div class="i">
            <div class="del">
                <button id="del"><img src="delete.svg" alt=""></button>
            </div>
            <div class="T"><h1>${tc}</h1></div>
            <div class="datetime">${dtc}</div>
        </div>`)

        //op
        // open note on card click

let cards = document.querySelectorAll(".T");

cards.forEach((card) => {
    card.addEventListener("click", (event) => {

        let i = event.target.closest(".i");

        let to = i.querySelector(".T").innerText;
        let noteo = mp.get(to);

        document.body.insertAdjacentHTML("beforeend", `
            <div class="form">
                <input class="Title" type="text" placeholder="Title" value="${to}">
                <textarea class="note">${noteo}</textarea>

                <div class="save">
                    <button id="save">Save</button>
                </div>

                <button class="cut">
                    <img src="cut.svg" alt="">
                </button>
            </div>
        `);

        let form = document.querySelector(".form");

        let sav = form.querySelector("#save");

        sav.addEventListener("click", () => {

            let updated_t = form.querySelector(".Title").value;
            let updated_n = form.querySelector(".note").value;
            let updated_time = new Date();

            // Original card update  
            i.querySelector(".T").children[0].innerText = updated_t;
            i.querySelector(".datetime").innerText = updated_time;

            // Map update
            mp.delete(to);
            mp.set(updated_t, updated_n);

            form.remove();
        });

        let ct = form.querySelector(".cut");

        ct.addEventListener("click", () => {
            form.remove();
        });

    });
});


        
   


        //delete
        let del=document.querySelectorAll("#del");

        del.forEach((e)=>{
            e.addEventListener("click", (event)=>{
             let card=event.target.closest(".i");
             let title = card.querySelector(".T").innerText;
             mp.delete(title);//map se bhi hatao
             card.remove();
            })
        })
       
         let note=event.target.closest(".form");
            note.remove();

    }) 
   
   
   



    


    //cut in form

    let cut=document.querySelectorAll(".cut");
    cut.forEach((e)=>{
        e.addEventListener("click",(event)=>{
            
            let note=event.target.closest(".form");
            note.remove();
        })
    })
       })


   
let sbar = document.querySelector("#sbar");

let suggestions = document.createElement("div");
suggestions.className = "suggestions";
suggestions.style.display = "none";

document.querySelector(".search").appendChild(suggestions);

let selected = -1;

// Highlight matching text
function highlight(title, val) {

    let index = title.toLowerCase().indexOf(val.toLowerCase());

    if (index === -1) return title;

    return title.substring(0, index) +
        `<mark>${title.substring(index, index + val.length)}</mark>` +
        title.substring(index + val.length);
}


// Search function
function search(val) {

    suggestions.innerHTML = "";
    selected = -1;

    if (val.trim() === "") {
        suggestions.style.display = "none";
        return;
    }

    let results = [];

    for (let [key, value] of mp) {

        if (key.toLowerCase().includes(val.toLowerCase())) {
            results.push(key);
        }
    }

    if (results.length === 0) {

        suggestions.innerHTML = `
            <div class="no-result">
                No matching notes found
            </div>
        `;

        suggestions.style.display = "block";
        return;
    }

    results.forEach((key) => {

        suggestions.insertAdjacentHTML("beforeend", `
            <div class="item" data-title="${key}">
                <h3>${highlight(key, val)}</h3>
                <p>${mp.get(key).substring(0, 65)}...</p>
            </div>
        `);

    });

    suggestions.style.display = "block";
}


// Open note function
function openNote(to) {

    let noteo = mp.get(to);

    let oldForm = document.querySelector(".form");

    if (oldForm) oldForm.remove();

    document.body.insertAdjacentHTML("beforeend", `
        <div class="form">
            <input class="Title" type="text"
                placeholder="Title" value="${to}">

            <textarea class="note">${noteo}</textarea>

            <div class="save">
                <button id="save">Save</button>
            </div>

            <button class="cut">
                <img src="cut.svg" alt="">
            </button>
        </div>
    `);

    let form = document.querySelector(".form");

    form.querySelector("#save").addEventListener("click", () => {

        let updated_t = form.querySelector(".Title").value;
        let updated_n = form.querySelector(".note").value;

        let card = [...document.querySelectorAll(".i")].find(
            e => e.querySelector(".T").innerText === to
        );

        if (updated_t !== to && mp.has(updated_t)) {
            alert("This title already exists!");
            return;
        }

        mp.delete(to);
        mp.set(updated_t, updated_n);

        if (card) {
            card.querySelector(".T h1").innerText = updated_t;
            card.querySelector(".datetime").innerText = new Date();
        }

        form.remove();

        suggestions.style.display = "none";
        sbar.value = "";
    });

    form.querySelector(".cut").addEventListener("click", () => {
        form.remove();
    });
}


// Typing
sbar.addEventListener("input", () => {
    search(sbar.value);
});


// Clicking a suggestion
suggestions.addEventListener("click", (event) => {

    let item = event.target.closest(".item");

    if (!item) return;

    let title = item.dataset.title;

    openNote(title);

    suggestions.style.display = "none";
    sbar.value = "";
});


// Keyboard navigation
sbar.addEventListener("keydown", (event) => {

    let items = suggestions.querySelectorAll(".item");

    if (event.key === "ArrowDown") {

        event.preventDefault();

        selected = Math.min(selected + 1, items.length - 1);

    }

    else if (event.key === "ArrowUp") {

        event.preventDefault();

        selected = Math.max(selected - 1, 0);

    }

    else if (event.key === "Enter") {

        event.preventDefault();

        if (items[selected]) {
            openNote(items[selected].dataset.title);
            suggestions.style.display = "none";
            sbar.value = "";
        }

    }

    else if (event.key === "Escape") {

        suggestions.style.display = "none";
    }

    items.forEach((item, index) => {

        item.classList.toggle("active", index === selected);

    });

});


// Outside click
document.addEventListener("click", (event) => {

    if (!event.target.closest(".search")) {
        suggestions.style.display = "none";
    }

});

       
     
