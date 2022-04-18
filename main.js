let wrapper = document.querySelector('.wrapper'),
inputPart = document.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
weatherPart = wrapper.querySelector('.weather-part'),
wIcon = weatherPart.querySelector('img'),
arrowBack = wrapper.querySelector('header i');

let api;

locationBtn.addEventListener('click', e => {
    e.preventDefault()
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert('Your browser not suppport geolocation')
    }
})

let onSuccess = position => {
    let apiKey = '1b64bce0fde44016ec284eeced1467c3'
    let {longitude, latitude} = position.coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetchData()
}

let onError = err => {
    infoTxt.innerText = err.message;
    infoTxt.classList.add('error');
}

inputField.addEventListener('keyup', e => {
    if(e.key == 'Enter' && inputField.value != '') {
        requestApi(inputField.value)
    }
})

function requestApi(city) {
    let apiKey = '1b64bce0fde44016ec284eeced1467c3'
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData()
}



function fetchData() {
    infoTxt.innerText = 'Getting Weather Details...'
    infoTxt.classList.add('pending')
    fetch(api).then(response => response.json()).then(result => weatherDetails(result))
}

function  weatherDetails(info) {
    if(info.cod == '404') {
        infoTxt.classList.replace('pending', 'error')
        infoTxt.innerText = `${inputField.value} isn,t valid city name`
    }else {
        console.log(info);
        
        let city = info.name;
        let country = info.sys.country;
        let {description, id} = info.weather[0];
        let {feels_like, humidity, temp} = info.main;

        if(id == '800') {
            wIcon.src = 'icons/clear.svg';
        } else if ( id >= 200 && id <= 232) {
            wIcon.src = 'icons/storm.svg'
        } else if ( id >= 600 && id <= 622) {
            wIcon.src = 'icons/snow.svg'
        } else if ( id >= 701 && id <= 781) {
            wIcon.src = 'icons/haze.svg'
        } else if ( id >= 801 && id <= 804) {
            wIcon.src = 'icons/cloud.svg'
        } else if ( (id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = 'icons/rain.svg'
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp)
        wrapper.querySelector('.weather').innerText = description
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`
        wrapper.querySelector('.feel .numb-2').innerText = Math.floor(feels_like)
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`

        infoTxt.classList.remove('pending', 'error')
        wrapper.classList.add('active')
    }
}

arrowBack.addEventListener('click', e => {
    e.preventDefault();
    wrapper.classList.remove('active')
})