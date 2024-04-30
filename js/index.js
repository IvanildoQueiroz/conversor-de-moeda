const secondTypeCoin = document.querySelector("#toConversion");
const secondTypeCoinGraph = secondTypeCoin.value
secondTypeCoin.addEventListener("change", (e) => {
  e.preventDefault();
  const selectedValeu = document.querySelector("#selectedValue");
  const descriptionCoin = document.querySelector(".descriptionCoin");
  const descriptionCoin2 = document.querySelector("#descriptionCoin2");
  descriptionCoin.textContent = secondTypeCoin.value;
  descriptionCoin2.textContent = secondTypeCoin.value;
  selectedValeu.textContent = secondTypeCoin.value;
  getCoin(secondTypeCoin.value);
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
    calcConversion(coin[key].high);
  }
}
function getCoin(coin) {
  fetch(`https://economia.awesomeapi.com.br/last/${coin}-BRL`)
    .then((res) => res.json())
    .then((json) => conversionCoin(json));
}

function calcConversion(VT) {
  const Va = document.querySelector("#valueCoin_1");
  const Vb = document.querySelector("#valueCoin_2");

  Vb.value = (Va.value / VT / 1).toFixed(2);

  Va.addEventListener("input", () => {
    Vb.value = (Va.value / VT).toFixed(2);
  });
  Vb.addEventListener("input", () => {
    Va.value = (Vb.value * VT).toFixed(2);
  });

  alterDataDescription(Va.value, Vb.value);
}
loadNameCoin();

async function insertClass() {
  return new Promise((res, rej) => {
    const timeList = document.querySelector("#tabList");
    const timeListAll = timeList.querySelectorAll("li");
    let valueDays;

    timeListAll.forEach((e) => {
      e.addEventListener("click", function () {
        timeListAll.forEach((item) => {

          if (item !== e) item.classList.remove("active");
          e.classList.add("active");
        });
        // e.classList.toggle("active");
        valueDays = e.value;
        res(valueDays);
      });
    });
  });
}
insertClass();

function calcTimeStamp(x) {
  let today = new Date(1714165120 * 1000);
  const date = new Date(x * 1000);
  today.setHours(today.getHours() - 3);
  return date.toLocaleString("pt-br", { timeZone: "UTC", dateStyle: "short" });
}
calcTimeStamp();

function alterDataDescription(x, y) {
  let calc = x / y;
  document.querySelector(`#panel2`).innerHTML = `${(calc * 10).toFixed(
    2
  )} reais`;
  document.querySelector(`#panel3`).innerHTML = `${(calc * 100).toFixed(
    2
  )} reais`;
  document.querySelector(`#panel4`).innerHTML = `${(calc * 1000).toFixed(
    2
  )} reais`;
  document.querySelector(`#panel5`).innerHTML = `${(calc * 10000).toFixed(
    2
  )} reais`;
}

// chart

async function showChart(coin) {
  async function getSpecificPeriod() {
    const valueDays = await insertClass();

    let data, data_BRL;
    let apiUrl_BRL = `https://economia.awesomeapi.com.br/json/daily/${coin}-BRL/${valueDays}`;
    let apiUrl = `https://economia.awesomeapi.com.br/json/daily/BRL-${coin}/${valueDays}`;
    // let urlApi_BRL = `https://economia.awesomeapi.com.br/json/daily/BRL-${coin}/10?start_date=${x}&end_date=${y}`;
    // let urlApi = `https://economia.awesomeapi.com.br/json/daily/${coin}-BRL/10?start_date=${x}&end_date=${y}`;
    try {
      const res_BRL = await fetch(apiUrl_BRL);
      data_BRL = await res_BRL.json();

      const res = await fetch(apiUrl);
      data = await res.json();
      //const valueDays = await insertClass();

      return { data, data_BRL, valueDays };
    } catch (e) {
      console.log(e);
      return window.reload();
    }
  }

  //set initial data nno chart
  const dataApi = await getSpecificPeriod();
  const monthVariation_BRL = dataApi.data_BRL;
  const monthVariation = dataApi.data;
  dataLoad(false)
  if (window.myChart) {
    window.myChart.destroy();
  }
  const ctx = document.getElementById("chart");
  
  
 const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: monthVariation.map((i) => calcTimeStamp(i.timestamp)),
      datasets: [
        {
          label: `high ${coin}`,
          data: monthVariation.map((i) => i.high),
          borderWidth: 1,
        },
        {
          label: "high BRL",
          data: monthVariation_BRL.map((i) => i.high),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
    },
  });
  window.myChart = myChart;
}
  secondTypeCoin.addEventListener("change", async (e) => {
    await showChart(secondTypeCoin.value);
    dataLoad(true)
  });
  
  const timeList = document.querySelector("#tabList");
  const timeListAll = timeList.querySelectorAll("li");
  
  timeListAll.forEach( (e) => {
    e.addEventListener("click", function () {
      timeListAll.forEach(async (item) => {
          await showChart(secondTypeCoin.value);
        });
      });
    });

    function dataLoad(data){
      if(data){

        document.querySelector('.DisplayLoadData').classList.toggle('load-active');
        document.querySelector('.DisplayLoadData').classList.toggle('load-desactive');
    }
    if(!data){
        document.querySelector('.DisplayLoadData').classList.toggle('load-active');
        document.querySelector('.DisplayLoadData').classList.toggle('load-desactive')
    }
  }