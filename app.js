document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-simulation").addEventListener("click", function () {
    document.getElementById("main-screen").classList.add("hidden");
    document.getElementById("simulation-screen").classList.remove("hidden");
    initializeSimulation();
  });
});


const data = {
  x: [],
  y: [],
  mode: "lines",
  line: { color: "#17BECF" },
};

const layout = {
  title: "S&P 500 Simulation",
  xaxis: { title: "Time" },
  yaxis: { title: "Price" },
  hovermode: "closest",
};

let currentTimeIndex = 48;
let currentTime = new Date();
let initialDataGenerated = false;

function generatePrice(previousPrice) {
  const volatility = 0.005;
  const changePercent = (Math.random() * (volatility * 2) - volatility);
  const newPrice = previousPrice + (previousPrice * changePercent);
  return newPrice;
}

function generateInitialData() {
  const initialPrice = 3500;
  let time = new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000);
  for (let i = 0; i <= currentTimeIndex; i++) {
    data.x.push(new Date(time.getTime() + i * 60 * 60 * 1000));
    data.y.push(i === 0 ? initialPrice : generatePrice(data.y[i - 1]));
  }
  initialDataGenerated = true;
}

function addDataPoint() {
  if (currentTimeIndex < data.x.length - 1) {
    currentTimeIndex++;
    Plotly.update("stock-chart", { x: [data.x], y: [data.y] });
  } else {
    data.x.push(new Date(data.x[data.x.length - 1].getTime() + 60 * 60 * 1000));
    data.y.push(generatePrice(data.y[data.y.length - 1]));
    currentTimeIndex++;
    Plotly.update("stock-chart", { x: [data.x], y: [data.y] });
  }
  updateCurrentPrice();
}

function rewindHour() {
  if (currentTimeIndex > 0) {
    currentTimeIndex--;
    Plotly.update("stock-chart", { x: [data.x], y: [data.y] });
    updateCurrentPrice();
  }
}

function rewindDay() {
  if (currentTimeIndex > 23) {
    currentTimeIndex -= 24;
    Plotly.update("stock-chart", { x: [data.x], y: [data.y] });
    updateCurrentPrice();
  }
}

function updateCurrentPrice() {
  document.getElementById("current-price").innerText = `Current Price: ${data.y[currentTimeIndex].toFixed(2)}`;
}

function initializeSimulation() {
  if (!initialDataGenerated) {
    generateInitialData();
  }

  Plotly.newPlot("stock-chart", [data], layout);

  document.getElementById("stock-chart").on("plotly_hover", function (eventData) {
    const pointIndex = eventData.points[0].pointNumber;
    const price = data.y[pointIndex];
    document.getElementById("current-price").innerText = `Price: ${price.toFixed(2)}`;
  });

  document.getElementById("stock-chart").on("plotly_unhover", function () {
    updateCurrentPrice();
  });

  updateCurrentPrice();

  document.getElementById("rewind-hour").addEventListener("click", rewindHour);
  document.getElementById("rewind-day").addEventListener("click", rewindDay);
}
