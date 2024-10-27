// get HTML elements
const todayBtn = document.querySelector('.header-s div:first-child span');
const weekBtn = document.querySelector('.header-s div:last-child span');
const celsius = document.querySelector('.header-e button:first-child');
const Fahrenheit = document.querySelector('.header-e button:last-child');
const sTemp = document.getElementById('weather-summary-temp');
const sSym = document.getElementById('weather-summary-temp-cf');
const tempChange = document.getElementsByClassName('tempChange');
const sym = document.getElementsByClassName('CF');
const todaySection = document.getElementsByClassName('today')[0];
const weekSection = document.getElementsByClassName('week')[0];
const inputLocation = document.getElementsByTagName('input')[0];
const searchBtn = document.getElementById('search');
const loader = document.getElementById('loader');


// declr/define some values
celsius.disabled = true;
let tempArr = [];
let sideTemp;


// event listeners

window.onload = loading();

weekBtn.addEventListener('click', switchToWeekData);

todayBtn.addEventListener('click', switchToTodayData);

celsius.addEventListener('click', fToC);

Fahrenheit.addEventListener('click', cToF);

inputLocation.addEventListener('focus', inputFocus);
inputLocation.addEventListener('blur', blurFocus);

searchBtn.addEventListener('click', searchLocation);
document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
})

// loading
function loading(){
    setTimeout(()=>{
        loader.style.display = 'none';
    },3000);
}

// search location
function searchLocation(){
    inputLocation.value = inputLocation.value.trim();
    if(inputLocation.value.length === 0) alert('please enter a location');
    else {
        fetchData(inputLocation.value);
        inputLocation.value = '';
    };
}

// input focus
function inputFocus(){
    inputLocation.style.border = '1px solid rgb(2, 164, 228)';
    searchBtn.style.top = '15px';
    searchBtn.style.height = '40px';
}

// blur focus
function blurFocus(){
    inputLocation.style.border = 'none';
    searchBtn.style.height = '38.5px';
    searchBtn.style.top = '14px';
}

// function to convert and change temperature
function cToF(){
    Fahrenheit.disabled = true;
    celsius.disabled = false;
    celsius.style.backgroundColor = 'white';
    celsius.style.color = 'black';
    Fahrenheit.style.backgroundColor = 'black';
    Fahrenheit.style.color = 'white';
    changeTemp(1);
}

function fToC(){
    celsius.disabled = true;
    Fahrenheit.disabled = false;
    Fahrenheit.style.backgroundColor = 'white';
    Fahrenheit.style.color = 'black';
    celsius.style.backgroundColor = 'black';
    celsius.style.color = 'white';
    changeTemp(0);
}

const changeTemp = x => {
    if(x){
        sTemp.innerText = ((9/5*(sTemp.innerText))+32).toFixed(1);
        sSym.innerHTML = '&deg;F';
        for(let i=0; i<31; i++){
            tempChange[i].innerText = ((9/5*(tempChange[i].innerText))+32).toFixed(1);
            sym[i].innerHTML = '&deg;F';
        }
    }else{
        sTemp.innerText = sideTemp;
        sSym.innerHTML = '&deg;C';
        for(let i=0; i<31; i++){
            tempChange[i].innerText = tempArr[i];
            sym[i].innerHTML = '&deg;C'
        }
    }
}

// switch between today and week section
function switchToWeekData(){
    weekBtn.style.color = 'rgb(2, 164, 228)';
    todayBtn.style.color = 'rgb(55, 69, 75)';
    todaySection.style.display = 'none';
    weekSection.style.display = 'block';
}

function switchToTodayData(){
    todayBtn.style.color = 'rgb(2, 164, 228)';
    weekBtn.style.color = 'rgb(55, 69, 75)';
    todaySection.style.display = 'block';
    weekSection.style.display = 'none';
}


// fetch geolocation
const geoLocation = async () => {
    try{
        const resp = await fetch('https://geolocation-db.com/json/');
        const body = await resp.json();
        body.city ?? (body.city = 'Bengaluru');
        body.state ?? (body.state = 'Karnataka');
        body.country_name ?? (body.country_name = 'India');
        fetchData(`${body.city},${body.state},${body.country_name}`);
    }catch(err){
        console.log(err);
    }
}

// fetch location weather data
const fetchData = async (city) => {
    try{
        const resp = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`);
        const body = await resp.json();
        console.log(body);
        tempArr = [];
        functions(body);
    }catch(err){
        console.log(err);
        alert('location not found...')
    }
}

function functions(body){
    fetchTemps(body.days);
    weatherSummary(body.currentConditions, body.resolvedAddress);
    todayHighlight(body.currentConditions);
    hourlyData(body.days[0]);
    weeklyData(body.days);
}

// set weather summary
const weatherSummary = (currentConditions, resolvedAddress) => {
    const bg = document.getElementById('root');
    const icon = document.querySelector('#current-weather-icon img');
    const temp = document.getElementById('weather-summary-temp');
    const dayTime = document.querySelector('#temp-day-time p')
    const condition = document.getElementById('weather-summary-condition');
    const precipitation = document.getElementById('weather-summary-precipitation');
    const location = document.querySelector('#location p');

    icon.setAttribute('src', `${imgObj[currentConditions.icon][0]}`);
    bg.style.backgroundImage = `url(${imgObj[currentConditions.icon][1]})`
    const date = new Date();
    const day = date.toLocaleString('en-us', {weekday:'long'});
    let time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).slice(0,-3);
    if(time.length===4) time = 0 + time;

    sideTemp = currentConditions.temp;
    temp.innerText = sideTemp;
    location.innerText = resolvedAddress;
    condition.innerText = currentConditions.conditions;
    precipitation.innerText = currentConditions.precip ?? '0';
    dayTime.innerText = `${day}, ${time}`;
}

// set highlight data
const todayHighlight = currentConditions => {
    const uvIndex = document.querySelector('.grid-item:first-child p:nth-child(2)');
    const uvIndexStatus = document.querySelector('.grid-item:first-child p:last-child');
    const windSpeed = document.querySelector('.grid-item:nth-child(2) p:nth-child(2)');
    const sunrise = document.querySelector('.grid-item:nth-child(3) p:nth-child(2)');
    const sunset = document.querySelector('.grid-item:nth-child(3) p:nth-child(3)');
    const humidity = document.querySelector('.grid-item:nth-child(4) p:nth-child(2)');
    const humidityStatus = document.querySelector('.grid-item:nth-child(4) p:last-child');
    const visibility = document.querySelector('.grid-item:nth-child(5) p:nth-child(2)');
    const visibilityStatus = document.querySelector('.grid-item:nth-child(5) p:last-child');
    const airQuality = document.querySelector('.grid-item:nth-child(6) p:nth-child(2)');
    const airQualityStatus = document.querySelector('.grid-item:nth-child(6) p:last-child');

    uvIndex.innerText = currentConditions.uvindex;
    uvIndexStatus.innerText = uvIndexStatusf(uvIndex.innerText);
    windSpeed.innerText = currentConditions.windspeed;
    sunrise.innerText = currentConditions.sunrise.slice(0,-3) + ' am';
    const str = '0' + (currentConditions.sunset.slice(0,2) - 12);
    sunset.innerText = str + currentConditions.sunset.slice(2,-3) + ' pm';
    humidity.innerText = currentConditions.humidity + '%';
    humidityStatus.innerText = humidityStatusf(humidity.innerText);
    visibility.innerText = currentConditions.visibility;
    visibilityStatus.innerText = visibilityStatusf(visibility.innerText);
    airQuality.innerText = currentConditions.winddir;
    airQualityStatus.innerHTML = airQualityStatusf(airQuality.innerText/100);
}

// save temps in arr
const fetchTemps = days => {
    for(let i=0;i<24;i++){
        tempArr.push(days[0].hours[i].temp);
    }
    for(let i=0;i<7;i++){
        tempArr.push(days[i].temp);
    }    
}

// set hourly data
const hourlyData = today => {
    const hourWeekData = document.getElementsByClassName('one-hour-day');
    for(let i=0; i<24; i++){
        let time = today.hours[i].datetime.slice(0,-3);
        let ctime = time;
        time.slice(0,2)>12 ? (time = (time.slice(0,2)-12) + time.slice(2) + ' PM') : (time = time + ' AM');
        hourWeekData[i].children.item(0).innerText = time;
        
        let icon = today.hours[i]['icon'];
        if(icon === 'cloudy') (((+ctime.split(':')[0]) > (+today.sunrise.slice(0,2))) && ((+ctime.split(':')[0]) < (+today.sunset.slice(0,2))) ? (icon = 'cloudyd') : (icon='cloudyn'));
        hourWeekData[i].children.item(1).setAttribute('src', `${imgObj[icon][0]}`);

        hourWeekData[i].children.item(2).children.item(0).innerText = tempArr[i];
    }
}

// set weekly data
const weeklyData = days => {
    const hourWeekData = document.getElementsByClassName('one-hour-day');
    for(let i=0; i<7; i++){
        const date = new Date(days[i].datetime);
        const day = date.toLocaleString('en-us', {weekday:'long'});
        hourWeekData[i+24].children.item(0).innerText = day;
        
        hourWeekData[i+24].children.item(1).setAttribute('src', `${imgObj[days[i]['icon']][0]}`)

        hourWeekData[i+24].children.item(2).children.item(0).innerText = tempArr[i+24];
    }
}

// get uv index status
const uvIndexStatusf = val => {
  let status;
  switch(true){
    case (val<3):
      status = 'Low';
      break;
      
    case (val>=3 && val<6):
      status = 'Moderate';
      break;
      
    case (val>=6 && val<8):
      status = 'High';
      break;
      
    case (val>=8 && val<11):
      status = 'Very High';
      break;
      
    case (val>=11):
      status = 'Extreme';
      break;
      
    default:
      status = 'NA';
      break;
  }

  return status;
  
}

// get humidity status
const humidityStatusf = val => {
  if (val<40) return 'Low';
  else if (val>=40 && val<=60) return 'Moderate';
  else return 'High';
}

// get visibility status
const visibilityStatusf = val => {
  let status;
  val<=0.03 ? status='Dense Fog' : null;
  val>=0.04 && val<=0.16 ? status='Moderate Fog' : null;
  val>=0.17 && val<=0.35 ? status='Light Fog' : null;
  val>=0.36 && val<=1.13 ? status='Very Light Fog' : null;
  val>=1.14 && val<=2.16 ? status='Light Mist' : null;
  val>=2.17 && val<=5.4 ? status='Very Light Mist' : null;
  val>=5.41 && val<=10.8 ? status='Clear Air' : null;
  val>=10.81 ? status='Very Clear Air' : null;
  return status;
}

// get visibility status
const airQualityStatusf = val => {
  let status;
  val<=0.03 ? status='Good &#x1F44C' : null;
  val>=0.04 && val<=0.16 ? status='Moderate &#x1F610' : null;
  val>=0.17 && val<=0.35 ? status='Unhealthy for Sensitive Groups &#x1F637' : null;
  val>=0.36 && val<=1.13 ? status='Unhealthy &#x1F637' : null;
  val>=1.14 && val<=2.16 ? status='Very Unhealthy &#x1F628' : null;
  val>=2.17 ? status='Hazardous &#x1F631' : null;
  return status;
}

// call geolocation -default location
geoLocation();

// images and icons
const imgObj = {
    'partly-cloudy-day' : ['https://i.ibb.co/PZQXH8V/27.png', 'https://i.ibb.co/qNv7NxZ/pc.webp'],
    'partly-cloudy-night' : ['https://i.ibb.co/Kzkk59k/15.png', 'https://i.ibb.co/RDfPqXz/pcn.jpg'],
    'rain' : ['https://i.ibb.co/kBd2NTS/39.png', 'https://i.ibb.co/h2p6Yhd/rain.webp'],
    'clear-day' : ['https://i.ibb.co/rb4rrJL/26.png', 'https://i.ibb.co/WGry01m/cd.jpg'],
    'clear-night' : ['https://i.ibb.co/1nxNGHL/10.png', 'https://i.ibb.co/kqtZ1Gx/cn.jpg'],
    'cloudyd' : ['https://i.ibb.co/PZQXH8V/27.png'],
    'cloudyn' : ['https://i.ibb.co/Kzkk59k/15.png'],
}


