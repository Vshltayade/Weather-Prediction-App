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


celsius.disabled = true;


weekBtn.addEventListener('click', switchToWeekData);

todayBtn.addEventListener('click', switchToTodayData);

celsius.addEventListener('click', fToC);

Fahrenheit.addEventListener('click', cToF);


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
        sTemp.innerText = (9/5*(sTemp.innerText))+32;
        sSym.innerHTML = '&deg;F';
        for(let i=0; i<31; i++){
            tempChange[i].innerText = (9/5*(tempChange[i].innerText))+32;
            sym[i].innerHTML = '&deg;F';
        }
    }else{
        sTemp.innerText = Math.round((sTemp.innerText-32)*5/9);
        sSym.innerHTML = '&deg;C';
        for(let i=0; i<31; i++){
            tempChange[i].innerText = Math.round((tempChange[i].innerText-32)*5/9);
            sym[i].innerHTML = '&deg;C'
        }
    }
}

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


const geoLocation = async () => {
    try{
        const resp = await fetch('https://geolocation-db.com/json/');
        const body = await resp.json();
        body.city ?? (body.city = 'Bengaluru')
        fetchData(body.city);
    }catch(err){
        console.log(err);
    }
}

const fetchData = async (city) => {
    try{
        const resp = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`);
        const body = await resp.json();
        console.log(body);
        weatherSummary(body.currentConditions, body.resolvedAddress);
        todayHighlight(body.currentConditions);
    }catch(err){
        console.log(err);
    }
}

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
    const date = new Date(currentConditions.datetimeEpoch*1000);
    const day = date.toLocaleString('en-us', {weekday:'long'});
    let time = date.toLocaleTimeString().slice(0,-6);
    if(time.length===4) time = 0 + time;

    temp.innerText = currentConditions.temp;
    location.innerText = resolvedAddress;
    condition.innerText = currentConditions.conditions;
    precipitation.innerText = currentConditions.precip;
    dayTime.innerText = `${day}, ${time}`;
}

// const todayHighlight = currentConditions => {
//     const uvIndex = document.querySelector('.grid-item:first-child p:nth-child(2)');
//     const windSpeed = document.querySelector('.grid-item:nth-child(2) p:nth-child(2)');
//     const sunrise = document.querySelector('.grid-item:nth-child(3) p:nth-child(2)');
//     const sunset = document.querySelector('.grid-item:nth-child(3) p:nth-child(3)');

//     uvIndex.innerText = currentConditions.uvindex;
//     windSpeed.innerText = currentConditions.windspeed;
//     sunrise.innerText = currentConditions.sunrise.slice(0,-3) + ' am';
//     const str = currentConditions.sunset.slice(0,2) - 12;
//     sunset.innerText = str + currentConditions.sunset.slice(3,-3)-12 + ' pm';
    
// }

// geoLocation();

const imgObj = {
    'partly-cloudy-day' : ['https://i.ibb.co/PZQXH8V/27.png', 'https://i.ibb.co/qNv7NxZ/pc.webp'],
    'partly-cloudy-night' : ['https://i.ibb.co/Kzkk59k/15.png', 'https://i.ibb.co/RDfPqXz/pcn.jpg'],
    'rain' : ['https://i.ibb.co/kBd2NTS/39.png', 'https://i.ibb.co/h2p6Yhd/rain.webp'],
    'clear-day' : ['https://i.ibb.co/rb4rrJL/26.png', 'https://i.ibb.co/WGry01m/cd.jpg'],
    'clear-night' : ['https://i.ibb.co/1nxNGHL/10.png', 'https://i.ibb.co/kqtZ1Gx/cn.jpg'],
}
