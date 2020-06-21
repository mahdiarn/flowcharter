const svg = document.getElementsByClassName('canvas')[0];
const modalOverlay = document.getElementsByClassName('modal-overlay');
const addCardModalOverlay = document.getElementById("add-card-modal-overlay")
const addCardModal = document.getElementById("add-card-modal")
const cardModal = document.getElementById("card-modal")
const addCardForm = document.addCardForm;
const addCardFormActions = addCardForm.cardActionInput;

const cardModalInputLabel = document.querySelector('label[for="cardModalInput"]'); 
const cardModalInput = addCardForm.cardModalInput; 
const cardUrlInputLabel = document.querySelector('label[for="cardUrlInput"]'); 
const cardUrlInput = addCardForm.cardUrlInput; 

addCardForm.reset();
cardModalInputLabel.style.visibility = "hidden";
cardModalInput.style.visibility = "hidden";

const setStyleVisibility = (element, value) => {
    element.style.visibility = value;
}

const setStyleDisplay = (element, value) => {
    element.style.display = value;
}

const switchActionInput = (event) => {
    switch(event.target.value) {
        case "1":
            setStyleVisibility(cardUrlInputLabel,"visible");
            setStyleVisibility(cardUrlInput,"visible");
            setStyleVisibility(cardModalInputLabel,"hidden");
            setStyleVisibility(cardModalInput,"hidden");
            break;
        case "2":
            setStyleVisibility(cardModalInputLabel,"visible");
            setStyleVisibility(cardModalInput,"visible");
            setStyleVisibility(cardUrlInputLabel,"hidden");
            setStyleVisibility(cardUrlInput,"hidden");
            break;
        default:
    }
}

Array.from(addCardFormActions).forEach((el) => {
    el.addEventListener('change', switchActionInput);
});

const hideOverlayAndItsChild = (event) => {
    setStyleDisplay(event.target, "none") 
    setStyleDisplay(addCardModal, "none") 
    setStyleDisplay(cardModal, "none") 
}
Array.from(modalOverlay).forEach((el) => {
    el.addEventListener('click', hideOverlayAndItsChild);
});

const showAddCardModal = () => {
    addCardForm.reset();
    setStyleVisibility(cardUrlInputLabel,"visible");
    setStyleVisibility(cardUrlInput,"visible");
    setStyleVisibility(cardModalInputLabel,"hidden");
    setStyleVisibility(cardModalInput,"hidden");
    setStyleDisplay(addCardModalOverlay,"block");
    setStyleDisplay(addCardModal,"block");
}

const hideAddCardModal = () => {
    setStyleDisplay(addCardModalOverlay,"none");
    setStyleDisplay(addCardModal,"none");
}


var isPointerDown = false;

var pointerOrigin = {
  x: 0,
  y: 0
};

var viewBox = {
    x: 0,
    y: 0,
};
  
var newViewBox = {
    x: 0,
    y: 0
};

if (window.PointerEvent) {
    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointerleave', onPointerUp);
    svg.addEventListener('pointermove', onPointerMove);
} else {
    svg.addEventListener('mousedown', onPointerDown);
    svg.addEventListener('mouseup', onPointerUp);
    svg.addEventListener('mouseleave', onPointerUp);
    svg.addEventListener('mousemove', onPointerMove);
    svg.addEventListener('touchstart', onPointerDown);
    svg.addEventListener('touchend', onPointerUp);
    svg.addEventListener('touchmove', onPointerMove);
}

function getPointFromEvent(event) {
    let point = {x:0, y:0};
    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }
    return point;
}

function onPointerDown(event) {
  isPointerDown = true; // We set the pointer as down
  
  let pointerPosition = getPointFromEvent(event);
  pointerOrigin.x = pointerPosition.x;
  pointerOrigin.y = pointerPosition.y;
}
  
function onPointerMove (event) {
    if (!isPointerDown) {
      return;
    }
    event.preventDefault();
  
    let pointerPosition = getPointFromEvent(event);
  
    newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x);
    newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y);
    newViewBox.x = newViewBox.x / 100;
    newViewBox.y = newViewBox.y / 100;
    setViewbox(newViewBox.x, newViewBox.y);
}

function onPointerUp() {
    isPointerDown = false;

    viewBox.x = newViewBox.x;
    viewBox.y = newViewBox.y;
  }

function setViewbox(posX = null, posY = null, zoomX = null, zoomY = null) {
    let viewbox = svg.getAttribute("viewBox");
    viewbox = viewbox.split(" ");
    if (posX !== null) viewbox[0] = (parseInt(viewbox[0]) + posX).toString();
    if (posY !== null) viewbox[1] = (parseInt(viewbox[1]) + posY).toString();
    if (zoomX !== null) viewbox[2] = (parseInt(viewbox[2]) + zoomX).toString();
    if (zoomY !== null) viewbox[3] = (parseInt(viewbox[3]) + zoomY).toString();
    svg.setAttribute("viewBox", `${viewbox[0]} ${viewbox[1]} ${viewbox[2]} ${viewbox[3]}`);
}

function zoomIn() {
    setViewbox(null, null, -10, -10);
}

function zoomOut() {
    setViewbox(null, null, 10, 10);
}