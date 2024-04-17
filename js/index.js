
const secondTypeCoin = document.querySelector("#toConversion");

secondTypeCoin.addEventListener("change", (e) => {
  e.preventDefault();
  const selectedValeu = document.querySelector('#selectedValue');
  const descriptionCoin = document.querySelector(".descriptionCoin");
  const descriptionCoin2 = document.querySelector("#descriptionCoin2");
  descriptionCoin.textContent = secondTypeCoin.value;
  descriptionCoin2.textContent = secondTypeCoin.value;
  selectedValeu.textContent = secondTypeCoin.value;
  getCoin(secondTypeCoin.value)
});

function loadNameCoin() {
  fetch("https://economia.awesomeapi.com.br/xml/available/uniq")
    .then((res) => res.text())
    .then((data) => LoadDataCoin(data));
}

function LoadDataCoin(json) {
  let parser = new DOMParser();
  const xmlDoc = parser.parseFromString(json, "text/xml");
  const dataCoin = xmlDoc.getElementsByTagName("xml");
  const lengthCoins = dataCoin[0].children;

  for (let i = 0; i < lengthCoins.length; i++) {
    let nameCoins = dataCoin[0].children[i].textContent;
    let acronym = dataCoin[0].children[i].localName;
    createOptionsCoin(acronym, nameCoins);
  }
}

function createOptionsCoin(coin, description) {
  let option = document.createElement("option");
  option.setAttribute("value", coin);
  option.textContent = `${description}`;
  secondTypeCoin.appendChild(option);
}

function conversionCoin(coin) {
  for (const key in coin) {
    calcConversion(coin[key].high)
  }

}
function getCoin(coin) {
  fetch(`https://economia.awesomeapi.com.br/last/${coin}-BRL`)
    .then((res) => res.json())
    .then((json) => conversionCoin(json));
}


function calcConversion(VT) {
  const Va = document.querySelector('#valueCoin_1');
  const Vb = document.querySelector('#valueCoin_2');

  
  Vb.value = ((Va.value / VT) / 1).toFixed(2);
  
  Va.addEventListener('input', () => {
    Vb.value = (Va.value / VT).toFixed(2);
  });
  Vb.addEventListener('input', () => {
    Va.value = (Vb.value * VT).toFixed(2);
  });
  console.log(Va.value, Vb.value);
  alterDataDescription(Va.value,Vb.value);
}
loadNameCoin();

function insertClass() {
  const timeList = document.querySelector('#tabList');
  const timeListAll = timeList.querySelectorAll('li');

  timeListAll.forEach((e) => {
    e.addEventListener('click', function () {
      timeListAll.forEach(item=>{
        if(item!==e)item.classList.remove('active');
      })
      e.classList.toggle('active')
    });
    
  })
}
insertClass();

function calcTimeStamp(x){
  const date = new Date(x);
  console.log(date.toLocaleString('pt-br', {timeZone: 'UTC',dateStyle:'short',timeStyle:'short'}));
}
calcTimeStamp(1538136540000)

 function alterDataDescription(x,y){
  let calc = x/y;
  document.querySelector(`#panel2`).innerHTML=`${(calc*10).toFixed(2)} reais`
  document.querySelector(`#panel3`).innerHTML=`${(calc*100).toFixed(2)} reais`
  document.querySelector(`#panel4`).innerHTML=`${(calc*1000).toFixed(2)} reais`
  document.querySelector(`#panel5`).innerHTML=`${(calc*10000).toFixed(2)} reais`
 }