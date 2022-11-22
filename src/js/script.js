const generateBtn = document.querySelector(".go-btn");
const sectionContainer = document.querySelector(".section");
const inputFloor = document.querySelector("#input-floor");
const inputLift = document.querySelector("#input-lifts");
const gameHide = document.querySelector(".lift-game");
const inputs = document.querySelectorAll(".input");
const errorEl = document.querySelector(".error");
const lifts = document.createElement("div");
lifts.className = "lifts-section";

// let lss = lifts.childNodes;
// console.log(lss);

inputs.forEach((input) => {
  input.addEventListener("keyup", () => {
    let exceedingValuesLimit = inputFloor.value <= 15 && inputLift.value <= 20;
    let valuesGreaterThanZero = inputFloor.value > 0 && inputLift.value > 0;
    if (valuesGreaterThanZero && exceedingValuesLimit) {
      // generateBtn.removeAttribute("disabled");
      generateBtn.disabled = false;
    } else {
      // generateBtn.setAttribute("disabled", "disabled");
      generateBtn.disabled = true;
    }
  });
});

inputs.forEach((inputsEl) => {
  inputsEl.addEventListener("input", () => {
    let exceedingValues = inputFloor.value <=15  && inputLift.value<= 20;
    if (exceedingValues) {
      errorEl.innerHTML = `<p>Enter the number of floors between 1 to 15<br></br>
    Enter the number of lifts between 1 to 20</p>`;
      errorEl.style.color = "green";
    } else{
      errorEl.style.color = "red";
    }
  });
});

const generateLiftsAndFloors = (e) => {
  e.preventDefault();
  if (inputFloor.value !== "" && inputLift.value !== "") {
    gameHide.style.display = "none";
    generateFloors();
    generateLifts();
    hidingLastButtonAndFirstButton(inputFloor.value);
  } else {
    alert("Please enter the values");
  }
};

const generateLifts = () => {
  let totalLift = Number(inputLift.value);
  for (let i = 0; i < totalLift; i++) {
    const liftsBoxEl = document.createElement("div");
    liftsBoxEl.classList.add("lift");
    liftsBoxEl.setAttribute("data-status", "free");
    liftsBoxEl.setAttribute("data-current", "0");
    //lift-doors
    const liftLeftDoor = document.createElement("div");
    liftLeftDoor.classList.add("left-door");
    const liftRightDoor = document.createElement("div");
    liftRightDoor.classList.add("right-door");
    liftsBoxEl.appendChild(liftLeftDoor);
    liftsBoxEl.appendChild(liftRightDoor);

    // const liftsSection=document.createElement("div")
    // liftsSection.className="lift-section";
    // // const liftsSection = document.querySelector(".lift-section");
    // liftsSection.append(liftsBoxEl)
    const lifts = document.querySelector("#floor-0");
    lifts.append(liftsBoxEl);
  }
};

const generateFloors = () => {
  let totalFloor = Number(inputFloor.value);
  for (let i = totalFloor - 1; i >= 0; i--) {
    const divEl = document.createElement("div");
    divEl.classList.add("floor");

    // const divId=`<div class="flex-sides">
    // <div class="btns">
    //   <button class="btn btn-up bttns-up-${i}">
    //     <i class="fa-sharp fa-solid fa-caret-up"></i>
    //   </button>
    //   <button class="btn btn-down bttns-down-${i}">
    //     <i class="fa-sharp fa-solid fa-caret-down"></i>
    //   </button>
    // </div>
    // <h3 class="floor-number">Floor ${i}</h3>
    // </div>
    // <div id="floor-${i}"></div>`
    // divEl.innerHTML=divId

    const divFlexSides = document.createElement("div");
    divFlexSides.classList.add("flex-sides");
    divEl.appendChild(divFlexSides);

    //bttns
    const divElBtns = document.createElement("div");
    divElBtns.classList.add("btns");
    const btnUp = document.createElement("button");
    btnUp.setAttribute("class", `btn btn-up bttns-up-${i}`);
    btnUp.innerHTML = `<i class="fa-sharp fa-solid fa-caret-up"></i>`;
    btnUp.addEventListener("click", () => {
      handleLifts(i);
    });

    const btnDown = document.createElement("button");
    btnDown.setAttribute("class", `btn btn-down bttns-down-${i}`);
    btnDown.innerHTML = `<i class="fa-sharp fa-solid fa-caret-down"></i>`;
    btnDown.addEventListener("click", () => {
      handleLifts(i);
    });

    divElBtns.appendChild(btnUp);
    divElBtns.appendChild(btnDown);
    divFlexSides.appendChild(divElBtns);

    const floorNumber = document.createElement("h3");
    floorNumber.classList.add("floor-number");
    floorNumber.innerText = `Floor ${i}`;
    divFlexSides.appendChild(floorNumber);

    //lift-container
    const lifts = document.createElement("div");
    lifts.setAttribute("class", "lifts-section");
    lifts.setAttribute("id", `floor-${i}`);
    divEl.appendChild(lifts);
    sectionContainer.appendChild(divEl);
  }
};
generateBtn.addEventListener("click", generateLiftsAndFloors);

const hidingLastButtonAndFirstButton = (totalFloor) => {
  document.querySelector(".bttns-down-0").remove();
  document.querySelector(`.bttns-up-${totalFloor - 1}`).remove();
};

const handleLifts = (position) => {
  console.log("clickkk", position); //1
  const liftsTarget = Array.from(document.querySelectorAll(".lift")); //converts to array from nodelists
  if (liftsTarget.find((lift) => lift.dataset.status === "free")) {
    // lift.getAttribute("data-status")==="free"
    moveLiftsInOrder(position);
  } else {
    storeLiftRequest(position);
  }
};

let liftsPush = [];
const storeLiftRequest = (pos) => {
  liftsPush.push(pos);
};

const moveLiftsInOrder = (pos) => {
  const liftsTarget = Array.from(document.querySelectorAll(".lift")); //converts to array from nodelists
  const getLifts = liftsTarget.find((lift) => lift.dataset.status === "free");
  if (Number(getLifts.dataset.current) === pos) {
    doorsOpening(getLifts, pos);
  } else {
    liftMovement(getLifts, pos);
  }
};

const liftMovement = (lift, pos) => {
  lift.setAttribute("data-status", "busy");

  const distance = Math.abs(Number(lift.dataset.current) - pos);

  // lift.classList.add("moveLiftUp--animation");
  lift.style.transform = `translateY(-${12.5 * pos}rem)`;
  lift.style.transition= `all ${(distance*2)}s linear`
  // lift.style.bottom = `${125 * pos}px`;
  // lift.style.transform = `bottom $(distance*2)s`;
  doorsOpening(lift, pos);
  console.log(liftsPush,'mk');
  setTimeout(() => {
    if(liftsPush.length>0){
      console.log("mkk")
       liftMovement(lift,liftsPush[0])
       // liftsPush.pop()
       liftsPush.shift()
    }
  },1000);
  
};


const doorsOpening = (lift, pos) => {
  lift.setAttribute("data-status", "busy");
  const distance = Math.abs(Number(lift.dataset.current) - pos);

  setTimeout(() => {
    console.log("door opens up",pos)
    lift.childNodes[0].classList.add("left-door--animation");
    lift.children[1].classList.add("right-door--animation");
  }, distance*2000+2000);

  setTimeout(() => {
    lift.childNodes[0].classList.remove("left-door--animation");
    lift.children[1].classList.remove("right-door--animation");
    lift.setAttribute("data-status", "free");
    lift.setAttribute("data-current", pos);
  }, distance* 2000+4500);
};

