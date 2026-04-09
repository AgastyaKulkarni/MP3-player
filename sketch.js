let albumCover;
let hours;
let minutes;
let currentDay;
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentDate;
let currentMonth;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let buttonState;
let playButton;
let fastForward;
let rewind;
let currentLocation;
let volumeSlider;
let lowVolume;
let highVolume;
let isPlaying = false;
let allSongs;
let currentIndex = 0;
let songName = "Unknown";
let artistName = "Unknown";
let currentSong;
let backgroundColour;
let textColour = 255;
let myFont;
let weather;
let weatherKey = "117206a5ec5d637c2f62d216149243f4";
let weatherDescription;
let weatherIcon;

function setup() {
  pixelDensity(displayDensity());
  noStroke();
  createCanvas(windowWidth, windowHeight);
  playButton = createImg('Images/pause.png');
  playButton.size(windowWidth*0.0425, windowHeight*0.08);
  playButton.position(windowWidth*0.7105, windowHeight*0.71);
  playButton.elt.addEventListener('click', (e) => {e.stopPropagation(); changePlaying();})
  //playButton.mousePressed(changePlaying);
  fastForward = createImg('Images/fastForward.png');
  fastForward.size(windowWidth*0.06, windowHeight*0.1);
  fastForward.position(windowWidth*0.8, windowHeight*0.7);
  fastForward.elt.addEventListener('click', (e) => {e.stopPropagation(); forwards();})
  //fastForward.mousePressed(forwards);
  rewind = createImg('Images/rewind.png');
  rewind.size(windowWidth*0.057, windowHeight*0.082);
  rewind.position(windowWidth*0.61, windowHeight*0.7075);
  rewind.elt.addEventListener('click', (e) => {e.stopPropagation(); rewinds();})
  //rewind.mousePressed(rewinds);
  currentLocation = createSlider(0,100,0,0);
  currentLocation.position(windowWidth*0.55, windowHeight*0.64);
  currentLocation.size(windowWidth*0.362);
  currentLocation.class("customSlider");
  volumeSlider = createSlider(0,100,40,1);
  volumeSlider.position(windowWidth*0.58, windowHeight*0.815);
  volumeSlider.size(windowWidth*0.3);
  volumeSlider.class("customSlider");
  getLocation();
  setInterval(getLocation, 600000);
}

function draw() {
  tint(255,50);
  background(backgroundColour);
  noTint();
  displayAlbumArt();
  displayTime();
  displayControls();
  updateSliders();
}

function preload(){
  lowVolume = loadImage('Images/lowVolume.png');
  highVolume = loadImage('Images/highVolume.png');
  myFont = loadFont('Fonts/Satoshi-Bold.otf');
  allSongs = null;
  loadJSON('allSongs.json', (data) => {
    allSongs = data.songs;
    loadSongs(currentIndex);
  });
}

function displayAlbumArt(){

  addShadows(windowWidth*0.05, windowHeight*0.1,windowWidth*0.4, windowHeight*0.8,55,"album");

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(windowWidth*0.05, windowHeight*0.1,windowWidth*0.4, windowHeight*0.8,55);
  drawingContext.clip();
  image(albumCover,windowWidth*0.05, windowHeight*0.1,windowWidth*0.4, windowWidth*0.4);
  drawingContext.restore();
}

function displayTime(){
  hours = hour();
  minutes = minute();
  let tDay = new Date();
  currentDay = days[tDay.getDay()];
  let tMonth = month();
  currentMonth = months[tMonth - 1];
  currentDate = day();
  if (minutes < 10){
    minutes = "0" + minutes;
  }
  textFont(myFont);
  addShadows(windowWidth*0.51, windowHeight*0.1, windowWidth*0.45, windowHeight*0.31, 55, "not");
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  rect(windowWidth*0.51, windowHeight*0.1, windowWidth*0.45, windowHeight*0.31, 55);
  fill(textColour);
  textSize(windowWidth*0.115);
  push();
  textWidth(windowWidth*0.13)
  text(hours + ":" + minutes,windowWidth*0.545, windowHeight*0.34);
  pop();
  fill(textColour-5);
  textSize(windowWidth*0.02236111111);
  text(currentDay, windowWidth*0.855, windowHeight*0.20);
  text(currentMonth + " " + currentDate, windowWidth*0.855, windowHeight*0.245);
  text(weather , windowWidth*0.855, windowHeight*0.33);
  push();
  textFont('sans-serif');
  text("·" + weatherIcon , windowWidth*0.91, windowHeight*0.33);
  pop();
  noFill();
  
}

function displayControls(){
  textFont(myFont);
  if (songName.length > 22){
    songName = songName.substring(0,22) + "...";
  }
  if (artistName.length > 22){
    artistName = artistName.substring(0,22) + "...";
  }
  addShadows(windowWidth*0.51, windowHeight*0.45, windowWidth*0.45, windowHeight*0.45, 55, "not");
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  rect(windowWidth*0.51, windowHeight*0.45, windowWidth*0.45, windowHeight*0.45, 55);
  push();
  fill(textColour);
  textAlign(CENTER);
  text(songName, windowWidth*0.73, windowHeight*0.525);
  text(artistName, windowWidth*0.73, windowHeight*0.6);
  pop();
  image(lowVolume, windowWidth*0.536, windowHeight*0.7775, windowWidth*0.038, windowHeight*0.1);
  image(highVolume, windowWidth*0.893, windowHeight*0.795, windowWidth*0.03, windowHeight*0.07);
  
}

function changePlaying(){
  if (currentSong.isPlaying()){
    isPlaying = false;
    playButton.attribute('src','Images/pause.png');
    currentSong.pause();
  }
  else{
    isPlaying = true;
    playButton.attribute('src','Images/play.png');
    currentSong.play();
  }
  console.log("Play/pause");
}

function addShadows(x,y,w,h,r,t){
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(x,y,w,h,r);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0,0,0,0.25)';
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 5;
  if (t == "album"){
    drawingContext.fillStyle = 'white';
    drawingContext.fill();
  }
  else{
    drawingContext.fillStyle = 'rgba(255,255,255,0.2)';
    drawingContext.fill();
  }
  drawingContext.filter = 'blur(10px)';
  drawingContext.restore();
}

function updateSliders(){
  let val1 = currentLocation.value();
  let max1 = currentLocation.elt.max;
  let percent1 = (val1 / max1) * 100;
  currentLocation.elt.style.background = `
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.8) ${percent1}%,
      rgba(255, 255, 255, 0.2) ${percent1}%,
      rgba(255, 255, 255, 0.2) 100%
    )
  `;
  let progress = 0;
  if (currentSong && currentSong.isLoaded()){
    progress = (currentSong.currentTime() / currentSong.duration()) * 100;
  }
  currentLocation.value(progress);
  currentLocation.input(() => {
    let newTime = (currentLocation.value() / 100) * currentSong.duration();
    currentSong.jump(newTime);
  });
  let pastTime = formatTime(currentSong.currentTime());
  let remainTime = formatTime((currentSong.duration()-currentSong.currentTime()));
  push();
  textSize(windowHeight*0.03);
  fill(textColour-5);
  text(pastTime, windowWidth*0.54, windowHeight*0.72);
  text(remainTime, windowWidth*0.9, windowHeight*0.72);
  pop();
  let val2 = volumeSlider.value();
  let max2 = volumeSlider.elt.max;
  let percent2 = (val2 / max2) * 100;
  volumeSlider.elt.style.background = `
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.8) ${percent2}%,
      rgba(255, 255, 255, 0.2) ${percent2}%,
      rgba(255, 255, 255, 0.2) 100%
    )
  `;
  let vol = volumeSlider.value() / 100;
  currentSong.setVolume(vol);
}

function rewinds(){
  currentIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
  loadSongs(currentIndex);
  console.log("Rewind")
}
function forwards(){
  currentIndex = (currentIndex + 1) % allSongs.length;
  isPlaying = true;
  loadSongs(currentIndex);
  console.log("Forwards")
}

function formatTime(seconds){
  let min = floor(seconds/60);
  let sec = floor(seconds%60);
  if (sec < 10){
    sec = "0" + sec;
  }
  let time = min + ":" + sec;
  return time;
}

function updateBackground(currentCover){
  currentCover.loadPixels();
  let r = 0, g = 0, b = 0;
  let count = 0;
  for (let x = 0; x < currentCover.width; x += 10){
      for (let y = 0; y < currentCover.height; y += 10){
        let index = 4 * (y * currentCover.width + x);
        r += currentCover.pixels[index];
        g += currentCover.pixels[index + 1];
        b += currentCover.pixels[index + 2];
        count++;
      }
  }
  
  if ((((r/count)+(g/count)+(b/count))/3 > 210)){
    textColour = 120;
  }

  return color(r/count, g/count, b/count);
}

function updateWeather(lat, lon){
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`;
  loadJSON(url, gotWeather);
}

function gotWeather(data){
  if (data.cod !== 200){
    weather = "Error";
    return;
  }
  let weatherData = data;
  weather = Math.round(weatherData.main.temp) + "°C";
  weatherDescription = data.weather[0].icon;

  if (weatherDescription.startsWith("01")){
    if (weatherDescription.endsWith("d")){
        weatherIcon = "☀️";
    }
    else if (weatherDescription.endsWith("n")){
        weatherIcon = "🌙";
    }
  }
  else if (weatherDescription.startsWith("02")){
    if (weatherDescription.endsWith("d")){
        weatherIcon = "🌤️";
    }
    else if (weatherDescription.endsWith("n")){
        weatherIcon = "🌙";
    }
  }
  else if (weatherDescription.startsWith("03") || weatherDescription.startsWith("04")){
    weatherIcon = "☁️";
  }
  else if (weatherDescription.startsWith("09") || weatherDescription.startsWith("10")){
    weatherIcon = "🌧️";
  }
  else if (weatherDescription.startsWith("13")){
    weatherIcon = "❄️";
  }
}

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Geolocation not supported");
  }
}

function success(position){
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  updateWeather(lat, lon);
}

function error(){
  console.log("Location access denied");
  updateWeather(51.3168, 0.5600);
}

function loadSongs(index){
  if (currentSong){
    currentSong.onended(() => {});
    currentSong.disconnect();
    currentSong.stop();
  }
  let songData = allSongs[index];

  currentSong = loadSound(songData.file, () => {if (isPlaying) currentSong.play();currentSong.onended(() => {if (currentSong.currentTime() >= currentSong.duration() - 0.1){forwards();}});}, (err) => {console.error("Load failed", err);});

  albumCover = loadImage(songData.cover, () => {backgroundColour = updateBackground(albumCover)});
  
  songName = songData.title;
  artistName = songData.artist;
}

