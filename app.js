var current_bool = true;
var forecast_bool = false;
var header_count = 0;
var header_div = document.createElement("div");

fetch_current();

function create_header(forecast){

    let update_time = document.createElement("div");
    let reload = document.createElement("div");
    let icon_div = document.createElement("div");
    let icon_img = document.createElement("img");
    let temp_icon = document.createElement("div");
    let humidity_icon = document.createElement("div");
    let rainfall_icon = document.createElement("div");
    let uv_icon = document.createElement("div");
    let warning_box = document.createElement("div");
    let warning = document.createElement("div");
    let warning_msg = document.createElement("div");
    let warning_arrow = document.createElement("img");

    reload.setAttribute("class", "img_reload");
    header_div.setAttribute("class", "header");
    update_time.setAttribute("class", "updateTime");
    icon_img.setAttribute("src", "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + forecast.icon[0] + ".png");
    icon_img.setAttribute("width", "100px");
    icon_img.setAttribute("height", "100px");
    icon_div.setAttribute("class", "iconDiv");
    temp_icon.setAttribute("class", "tempIcon");
    humidity_icon.setAttribute("class", "humidityIcon");
    rainfall_icon.setAttribute("class", "rainfallIcon");
    uv_icon.setAttribute("class", "uvIcon");
    warning.setAttribute("class", "warning");
    warning_box.setAttribute("class", "warningBox");
    warning_msg.setAttribute("class", "warningMsg");
    warning_arrow.setAttribute("src", "arrow.png");
    warning_arrow.setAttribute("class", "warningArrow");

    icon_div.appendChild(icon_img);

    let hr = forecast.updateTime.slice(11, 13);
    let min = forecast.updateTime.slice(14, 16);
    let am_pm = "am";
    hr <= 12 ? am_pm = "am" : am_pm = "pm";
    let hr_12 = hr % 12;
    if (hr_12 == 0) { 
        hr_12 = "1";
    }

    update_time.innerHTML = 'Last Update: ' + hr_12 + ':' + min + am_pm;
    temp_icon.innerHTML = forecast.temperature.data[1].value + '\u00B0' + "C";
    humidity_icon.innerHTML = forecast.humidity.data[0].value + "%";
    rainfall_icon.innerHTML = forecast.rainfall.data[13].max + "mm";
    if(forecast.uvindex == "") {
        uv_icon.innerHTML = "";
        uv_icon.style.display = "none";
    } 
    else {
        uv_icon.innerHTML = forecast.uvindex.data[0].value;
    }
    warning.innerHTML = "Warning";

    if(forecast.warningMessage == "") {
        warning_msg.innerHTML = "";
        warning.style.display = "none";
        warning_msg.style.display = "none";
    }
    else {
        warning_msg.innerHTML = forecast.warningMessage[0];
    }

    warning.appendChild(warning_arrow);
    warning_box.appendChild(warning);
    warning_box.appendChild(warning_msg);
    warning_msg.style.display = "none";

    header_div.innerHTML = '<h2>Weather in Hong Kong</h2>';
    header_div.appendChild(reload);
    header_div.appendChild(update_time);
    header_div.appendChild(icon_div);
    header_div.appendChild(temp_icon);
    header_div.appendChild(humidity_icon);
    header_div.appendChild(rainfall_icon);
    header_div.appendChild(uv_icon);
    header_div.appendChild(warning_box);

    document.body.appendChild(header_div);

    var is_desktop = false;

    // -------- For Desktop -------------
    warning_arrow.addEventListener('mouseover', () => {
        is_desktop = true;
        warning_msg.style.display = "block";
    });

    warning_arrow.addEventListener('mouseout', () => {
        is_desktop = true;
        warning_msg.style.display = "none";
    });
    //-----------------------------------

    //--------- For touch devices -------
    if (is_desktop == false) {
        warning_arrow.addEventListener('click', () => {
            warning_msg.style.display = "block";
        });
    }
    //-----------------------------------

    reload.addEventListener('click', () => { //Reloads app on clicking
        document.body.innerHTML = "";
        header_count = 0;
        fetch_current();
    });
}

function fetch_current() {  
    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en")
    .then(response => {
        if(response.status == 200) { //OK
            response.json().then( forecast => {

                if(header_count == 0) {
                    header_count += 1;
                    create_header(forecast);
                }

                let check_current = document.createElement("div");

                check_current.setAttribute("class", "checkCurrent");
                check_current.innerHTML = "Temperature";

                document.body.appendChild(check_current);

                let check_forecast = document.createElement("div");
                check_forecast.innerHTML = "Forecast";

                check_forecast.setAttribute("class", "checkForecast");

                document.body.appendChild(check_forecast);

                check_current.style.backgroundColor = "white";
                check_current.style.paddingBottom = "0%";
                check_forecast.style.backgroundColor = "lightgray";
                check_forecast.style.paddingBottom = "0%";

                let all_districts_div = document.createElement("div");
                all_districts_div.setAttribute("class", "allDistrictsDiv");

                for (let i = 0; i < forecast.temperature.data.length; i++) {

                    let div1 = document.createElement("div");
                    let cancel = document.createElement("div");

                    let place = forecast.temperature.data[i]["place"];
                    let value = forecast.temperature.data[i]["value"];
                    let unit = forecast.temperature.data[i]["unit"];

                    div1.setAttribute("class", "districtWindow");
                    cancel.setAttribute("class", "img_cancel");

                    div1.innerHTML = '<div class="place">' + place + '</div> <br> <div class="value">' + value +  '\u00B0' + unit + '</div>';

                    div1.appendChild(cancel);
                    all_districts_div.appendChild(div1);

                    cancel.addEventListener('click', () => {all_districts_div.removeChild(div1)}); //Removes district on clicking X    
                }

                document.body.appendChild(all_districts_div);

                check_forecast.addEventListener('click', () => {
                    current_bool = false;
                    forecast_bool = true;
                    while (document.body.lastChild != header_div) {
                        document.body.removeChild(document.body.lastChild);
                    }
                    fetch_forecast();
                });

            });
        }
        else { //Error
            console.log("HTTP return status: " + response.status);
        }
    });
}

function fetch_forecast() {
    fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
    .then(response => {
        if(response.status == 200) { //OK
            response.json().then( forecast => {

                let check_current = document.createElement("div");

                check_current.setAttribute("class", "checkCurrent");
                check_current.innerHTML = "Temperature";

                document.body.appendChild(check_current);

                let check_forecast = document.createElement("div");
                check_forecast.innerHTML = "Forecast";

                check_forecast.setAttribute("class", "checkForecast");

                document.body.appendChild(check_forecast);

                check_current.style.backgroundColor = "lightgray";
                check_current.style.paddingBottom = "0%";
                check_forecast.style.backgroundColor = "white";
                check_forecast.style.paddingBottom = "0%";

                let all_districts_div = document.createElement("div");
                all_districts_div.setAttribute("class", "allDistrictsDiv");

                for (let i = 0; i < 9; i++) {

                    let district_window = document.createElement("div");
                    district_window.setAttribute("class", "window9Day");

                    let icon_9_day = document.createElement("div");
                    let icon_img_9_day = document.createElement("img");
                    let date_9_day = document.createElement("div");
                    let week_9_day = document.createElement("div");
                    let temp_min_9_day = document.createElement("div");
                    let temp_max_9_day = document.createElement("div");
                    let humidity_min_9_day = document.createElement("div");
                    let humidity_max_9_day = document.createElement("div");
                    let temp_min_max_9_day = document.createElement("div");
                    let humidity_min_max_9_day = document.createElement("div");

                    icon_9_day.setAttribute("class", "icon9Day");
                    icon_img_9_day.setAttribute("class", "iconImg9Day");
                    date_9_day.setAttribute("class", "date9Day");
                    week_9_day.setAttribute("class", "week9Day");
                    temp_min_9_day.setAttribute("class", "tempMin9Day");
                    temp_max_9_day.setAttribute("class", "tempMax9Day");
                    humidity_min_9_day.setAttribute("class", "tempMin9Day");
                    humidity_max_9_day.setAttribute("class", "tempMax9Day");
                    temp_min_max_9_day.setAttribute("class", "tempMinMax9Day");
                    humidity_min_max_9_day.setAttribute("class", "humidityMinMax9Day");

                    icon_img_9_day.setAttribute("src", "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + forecast.weatherForecast[i].ForecastIcon + ".png");
                    icon_img_9_day.setAttribute("width", "50px");
                    icon_img_9_day.setAttribute("height", "50px");
                    icon_9_day.appendChild(icon_img_9_day);

                    date_9_day.innerHTML = forecast.weatherForecast[i].forecastDate.slice(6, 8) + "/" + forecast.weatherForecast[i].forecastDate.slice(4, 6);
                    if(forecast.weatherForecast[i].forecastDate.slice(6, 8) < 10) {
                        date_9_day.innerHTML = forecast.weatherForecast[i].forecastDate.slice(7, 8) + "/" + forecast.weatherForecast[i].forecastDate.slice(4, 6);
                    }

                    week_9_day.innerHTML = forecast.weatherForecast[i].week;
                    temp_min_9_day.innerHTML = forecast.weatherForecast[i].forecastMintemp.value + '\u00B0' + forecast.weatherForecast[i].forecastMintemp.unit;
                    temp_max_9_day.innerHTML = forecast.weatherForecast[i].forecastMaxtemp.value + '\u00B0' + forecast.weatherForecast[i].forecastMaxtemp.unit;
                    humidity_min_9_day.innerHTML = forecast.weatherForecast[i].forecastMinrh.value + "%";
                    humidity_max_9_day.innerHTML = forecast.weatherForecast[i].forecastMaxrh.value + "%";
                    temp_min_max_9_day.innerHTML = temp_min_9_day.innerHTML + " | " + temp_max_9_day.innerHTML;
                    humidity_min_max_9_day.innerHTML = humidity_min_9_day.innerHTML + " | " + humidity_max_9_day.innerHTML;

                    district_window.appendChild(icon_9_day);
                    district_window.appendChild(date_9_day);
                    district_window.appendChild(week_9_day);
                    district_window.appendChild(temp_min_max_9_day);
                    district_window.appendChild(humidity_min_max_9_day);

                    all_districts_div.appendChild(district_window);
                }

                document.body.appendChild(all_districts_div);

                check_current.addEventListener('click', () => {
                    current_bool = true;
                    forecast_bool = false;
                    while (document.body.lastChild != header_div) {
                        document.body.removeChild(document.body.lastChild);
                    }
                    fetch_current();
                });

            });
        }
        else { //Error
            console.log("HTTP return status: " + response.status);
        }
    });
}
