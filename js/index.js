
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
  let today = new Date(1714165120 *1000);
  const date = new Date(x*1000);
  today.setHours(today.getHours()-3)
  console.log(today.toLocaleString('pt-br', {timeZone: 'UTC',dateStyle:'short'}));
  return date.toLocaleString('pt-br', {timeZone: 'UTC',dateStyle:'short'})
}
calcTimeStamp()

 function alterDataDescription(x,y){
  let calc = x/y;
  document.querySelector(`#panel2`).innerHTML=`${(calc*10).toFixed(2)} reais`
  document.querySelector(`#panel3`).innerHTML=`${(calc*100).toFixed(2)} reais`
  document.querySelector(`#panel4`).innerHTML=`${(calc*1000).toFixed(2)} reais`
  document.querySelector(`#panel5`).innerHTML=`${(calc*10000).toFixed(2)} reais`
 }
// chart
async function showChart(){
  async function getSpecificPeriod(x,y){
    let urlApi = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/10?start_date=${x}&end_date=${y}`;
    try{
      
      const res = await fetch(urlApi);
      const data = await res.json();
      // console.log(data)
      return data

    }catch(e){

      console.log(e)
      return null
    }

  }

  //set initial data com 20240425 =  25/04/2024;
  
  const monthVariation = await getSpecificPeriod(20230102,20230123);
  const ctx = document.getElementById('chart');
  console.log(monthVariation)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthVariation.map(i=>calcTimeStamp(i.timestamp)),
      datasets: [{
        label: 'high value',
        data: monthVariation.map(i => i.high),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
showChart();
 