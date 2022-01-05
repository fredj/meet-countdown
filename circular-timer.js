import {LitElement, html, css} from 'lit';

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  minute: '2-digit',
  second: '2-digit'
});

export class CircularTimer extends LitElement {
  static styles = css`
    .container {
        position: relative;
        /*
        top: 30px;
        width: 300px;
        margin: 0 auto; 
        */
    }
    .setters {
        position: absolute;
        left: 85px;
        top: 75px;
    }
    .setters button {
        outline: none;
        background: transparent;
        border: none;
        font-weight: 300;
        font-size: 18px;
        width: 25px;
        height: 30px;
        color: #F7958E;
        cursor: pointer;
    }
    .minutes-set {
        float: left;
        margin-right: 28px;
    }
    .seconds-set {
        float: right;
    }
    .controls {
        position: absolute;
        left: 75px;
        top: 105px;
        text-align: center;
    }
    .display-remain-time {
        font-size: 65px;
        color: #F7958E;
    }
    .play, .pause, .reset {
        color: #F7958E;
        outline: none;
        background: transparent;
        border: none;
        margin-top: 10px;
        width: 50px;
        height: 50px;
        position: relative;
        cursor: pointer;
    }
    .play::before {
        display: block;
        content: "";
        position: absolute;
        top: 8px;
        left: 16px;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 22px solid #F7958E;
    }
    .pause::after {
        content: "";
        position: absolute;
        top: 8px;
        left: 12px;
        width: 15px;
        height: 30px;
        background-color: transparent;
        border-radius: 1px;
        border: 5px solid #F7958E;
        border-top: none;
        border-bottom: none;
    }
    .e-c-base {
        fill: none;
        stroke: #B6B6B6;
        stroke-width: 4px
    }
    .e-c-progress {
        fill: none;
        stroke: #F7958E;
        stroke-width: 4px;
    }
    .e-c-pointer {
        fill: #FFF;
        stroke: #F7958E;
        stroke-width: 2px;
    }
    #e-pointer {
        transition: transform 0.5s;
    }
    .blink {
      animation: blinker 1s ease-out infinite;
    }
    @keyframes blinker {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  static properties = {
    duration: {type: Number},
    timeLeft: {type: Number},
    running: {type: Boolean},
    paused: {type: Boolean},
  };

  constructor() {
    super();

    this.duration = 300;
    this.timeLeft = undefined;
    this.running = false;
    this.paused = false;

    this._timerInterval = undefined;
  }


  addSeconds(seconds) {
    this.duration = Math.max(this.duration + seconds, 1);
    if (this.timeLeft) {
      clearInterval(this._timerInterval);
      this.timeLeft += seconds;
      this.timer(this.timeLeft);
    }
    this.requestUpdate(); // FIXME
  }

  togglePlayPause() {
    if (!this.running) {
      this.timer(this.duration);
      this.running = true;
    } else {
      if (this.paused) {
        this.timer(this.timeLeft);
      } else {
        clearInterval(this._timerInterval);
      }
      this.paused = !this.paused;
    }
    this.requestUpdate(); // FIXME
  }

  timer(duration) {
    let remaining = Date.now() + (duration * 1000);

    this._timerInterval = setInterval(() => {
      this.timeLeft = Math.round((remaining - Date.now()) / 1000);
      if (this.timeLeft === 0) {
        this.reset();
      }
      this.requestUpdate(); // FIXME
    }, 1000);
  }

  reset() {
    clearInterval(this._timerInterval);
    this._timerInterval = undefined;
    this.running = false;
    this.paused = false;
    this.timeLeft = undefined;
    this.requestUpdate(); // FIXME
  }

  render() {
    const timeLeft = this.timeLeft || this.duration;
    const progressDegrees = (360 * timeLeft / this.duration) - 90;
    return html`
        <div class="container">
          <div class="setters">
            <div class="minutes-set">
              <button @click="${() => this.addSeconds(60)}">+</button>
              <button @click="${() => this.addSeconds(-60)}">-</button>
            </div>
            <div class="seconds-set">
              <button @click="${() => this.addSeconds(1)}">+</button>
              <button @click="${() => this.addSeconds(-1)}">-</button>
            </div>
          </div>
           <div class="circle">
              <svg width="300" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                 <g transform="translate(110,110)">
                    <circle r="100" class="e-c-base"/>
                    <g>
                       <circle r="100" class="e-c-progress"/>
                       <g id="e-pointer" style="transform: rotate(${progressDegrees}deg)">
                          <circle cx="100" cy="0" r="8" class="e-c-pointer"/>
                       </g>
                    </g>
                 </g>
              </svg>
           </div>
           <div class="controls">
              <div class="display-remain-time ${this.paused ? 'blink' : ''}">${timeFormatter.format(new Date(timeLeft * 1000))}</div>
              <button class="${this.running && !this.paused ? 'pause' : 'play'}" @click="${this.togglePlayPause}"></button>
              <button class="reset" @click="${this.reset}">&#8634;</button>
           </div>
        </div>
    `;
  }
}
customElements.define('circular-timer', CircularTimer);
