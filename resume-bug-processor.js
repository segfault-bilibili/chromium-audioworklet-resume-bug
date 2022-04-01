class ResumeBugProcessor extends AudioWorkletProcessor {
    isPlaying = false;
    counter = 0;
  
    constructor (...args) {
        super(...args);
        this.port.onmessage = (ev) => {
            this.isPlaying = ev.data ? true : false;
            this.counter = 0;
            this.port.postMessage(`done (${ev.data})`);
        }
    }
  
    process (inputs, outputs, parameters) {
        if (!this.isPlaying) return true;

        const period = 2 * 48000 / 128;
        const halfPeriod = period / 2;

        if (this.counter < period) this.counter++;
        else this.counter = 0;
        const counter = this.counter;

        const volume = (counter < halfPeriod ? counter : (period - counter)) / halfPeriod;

        const random = new Float32Array(outputs[0][0].length);
        for (let i = 0; i < random.length; i++) random[i] = (Math.random() * 2 - 1) * volume;

        outputs[0].forEach((channel) => channel.set(random));

        return true;
    }
  }
  
  
  registerProcessor('resume-bug-processor', ResumeBugProcessor);
