var TIMEOUT_IN_SECS = 3 * 10
var TEMPLATE = '<h1><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>'

function padZero(number){
  return ("00" + String(number)).slice(-2);
}

class Timer{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs){
    this.isRunning = false
    this.timestampOnStart = null
    this.initial_timeout_in_secs = timeout_in_secs
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
  getTimestampInSecs(){
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds/1000)
  }
  start(){
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }
  stop(){
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }
  calculateSecsLeft(){
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
}

class TimerWidget{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct(){
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
  mount(rootTag){
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')


    /* border-radius: 10px; */
    /* height: 100px; */

    this.timerContainer.setAttribute("style", "position: fixed; z-index: 2147483647; background-color: #f2f2f2; border-left: 0px; border-style: solid; padding-left: 10px; padding-right: 10px;")
    this.timerContainer.innerHTML = TEMPLATE

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.overlayImage = document.createElement("img")
    this.overlayImage.setAttribute("src", "https://image.ibb.co/nLaiVb/return_to_work.jpg")

    this.overlayContainer = document.createElement('div')
    this.overlayContainer.setAttribute("id", "overlay")
    this.overlayContainer.setAttribute("style", "visibility: hidden; position: absolute; left: 0px; top: 0px; width:100%; height:100%; text-align:center; z-index: 1000;")
    this.overlayContainer.appendChild(this.overlayImage)
    rootTag.insertBefore(this.overlayContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }
  overlay() {
    this.overlay_elem = document.getElementById("overlay");
    this.overlay_elem.style.visibility = (this.overlay_elem.style.visibility == "visible") ? "hidden" : "visible";
  }
  update(secsLeft){
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)
  }
  unmount(){
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}


function main(){

  var timer = new Timer(TIMEOUT_IN_SECS)
  var timerWiget = new TimerWidget()
  var intervalId = null

  timerWiget.mount(document.body)

  function handleIntervalTick(){
    var secsLeft = timer.calculateSecsLeft()
    if (!secsLeft)
      timerWiget.overlay()
    timerWiget.update(secsLeft)
  }

  function handleVisibilityChange(){
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}

// initialize timer when page ready for presentation
window.addEventListener('load', main)
