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

geoLocation();

const imgObj = {
    'partly-cloudy-day' : ['https://i.ibb.co/PZQXH8V/27.png', 'https://i.ibb.co/qNv7NxZ/pc.webp'],
    'partly-cloudy-night' : ['https://i.ibb.co/Kzkk59k/15.png', 'https://i.ibb.co/RDfPqXz/pcn.jpg'],
    'rain' : ['https://i.ibb.co/kBd2NTS/39.png', 'https://i.ibb.co/h2p6Yhd/rain.webp'],
    'clear-day' : ['https://i.ibb.co/rb4rrJL/26.png', 'https://i.ibb.co/WGry01m/cd.jpg'],
    'clear-night' : ['https://i.ibb.co/1nxNGHL/10.png', 'https://i.ibb.co/kqtZ1Gx/cn.jpg'],
}
