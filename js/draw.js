var cards = [];
var svgns = "http://www.w3.org/2000/svg";
var cardOffset = 10

class Card {
  constructor(label = "", action = {mode: 0, content: ""}, width = 10, height = 10, posX = 10, posY = 10, direction = 0) {
    this.label = label;
    this.action = action;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.id = cards.length;
    this.direction = direction;
  }
}

const openLinkFromCard = (url) => {
  window.open(url);
}

const openModal = (content) => {
  cardModal.innerHTML = content;
  
  setStyleDisplay(addCardModalOverlay,"block");
  setStyleDisplay(cardModal,"block");
}

function renderCard() {
  svg.innerHTML= "";
  cards.forEach((el, key) => {
    let card = document.createElementNS(svgns, 'rect');
    let label = document.createElementNS(svgns, 'text');
    let polygon = document.createElementNS(svgns, 'polygon');
    let marker = document.createElementNS(svgns, 'marker');
    let defs = document.createElementNS(svgns, 'defs');
    let line = document.createElementNS(svgns, 'line');

    card.setAttributeNS(null, 'x', el.posX);
    card.setAttributeNS(null, 'y', el.posY);
    card.setAttributeNS(null, 'width', el.width);
    card.setAttributeNS(null, 'height', el.height);
    card.setAttributeNS(null, 'fill', '#fff');
    card.setAttributeNS(null, 'stroke', '#000');
    card.setAttributeNS(null, 'stroke-width', '.1');
    card.style.cursor = "pointer";

    label.setAttributeNS(null, 'x', el.posX + (el.width/2));
    label.setAttributeNS(null, 'y', el.posY + (el.height/2));
    label.setAttributeNS(null, 'font-size', 1);
    label.setAttributeNS(null, 'dominant-baseline', 'middle');
    label.setAttributeNS(null, 'text-anchor', 'middle');
    label.innerHTML = el.label;
    label.style.cursor = "pointer";

    if (el.action.mode === 1) {
      label.addEventListener('click', () => {openLinkFromCard(el.action.content)});
      card.addEventListener('click', () => {openLinkFromCard(el.action.content)});
    } else if (el.action.mode === 2) {
      label.addEventListener('click', () => {openModal(el.action.content)});
      card.addEventListener('click', () => {openModal(el.action.content)});
    }

    if (key !== 0) {
      polygon.setAttributeNS(null, 'points', '0 0, 10 3.5, 0 7');

      marker.setAttributeNS(null, 'id', `arrowhead-${key}`);
      marker.setAttributeNS(null, 'markerWidth', '10');
      marker.setAttributeNS(null, 'markerHeight', '7');
      marker.setAttributeNS(null, 'refX', '0');
      marker.setAttributeNS(null, 'refY', '3.5');
      marker.setAttributeNS(null, 'orient', 'auto');

      line.setAttributeNS(null, 'x1', cards[key-1].posX + cards[key-1].width);
      line.setAttributeNS(null, 'y1', cards[key-1].posY + (cards[key-1].height / 2));
      line.setAttributeNS(null, 'x2', el.posX - 1);
      line.setAttributeNS(null, 'y2', el.posY + (el.height / 2));
      line.setAttributeNS(null, 'stroke', '#000');
      line.setAttributeNS(null, 'stroke-width', '.1');
      line.setAttributeNS(null, 'marker-end', `url(#arrowhead-${key})`);
      marker.appendChild(polygon);
      defs.appendChild(marker);

      svg.appendChild(defs);
      svg.appendChild(line);
    }
    svg.appendChild(card);
    svg.appendChild(label);
  })
}

function addCard() {
  let label = addCardForm.cardLabelInput.value;
  let action = parseInt(addCardForm.cardActionInput.value);
  let url = addCardForm.cardUrlInput.value;
  let modal = addCardForm.cardModalInput.value;
  let width = addCardForm.cardWidthInput.value;
  let height = addCardForm.cardHeightInput.value;
  console.log(width, height);
  if (
    (/d/.test(width)) ||
    (/d/.test(height))
  ) {
    alert("Width and Height must be a number!");
    return false;
  } 
  
  let newCard = {
    label,
    action: {
      mode: action,
      content: (action === 1) ? url : modal,
    }
  }
  let posX = 10;
  let posY = 10;
  if (cards.length !== 0) {
    posX = cards[cards.length - 1].posX + parseInt(cards[cards.length - 1].width) + cardOffset;
    if (parseInt(height) !== cards[cards.length - 1].height) {
      posY = (cards[cards.length - 1].posY + (cards[cards.length - 1].height / 2)) - (parseInt(height) / 2);
    }
  }
  cards.push(new Card(
    newCard.label,
    newCard.action,
    parseInt(width),
    parseInt(height),
    posX,
    posY
  ));
  hideAddCardModal();
  renderCard();
  return false;
}