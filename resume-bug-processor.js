class ResumeBugProcessor extends AudioWorkletProcessor {
    isPlaying = false;
    counter = 0;

    countDownFrom = 0;
    countDown;

    constructor (options) {
        super(options);
        let countDownFrom = parseInt(options.processorOptions.countDownFrom);
        if (isNaN(countDownFrom)) countDownFrom = 2;
        this.countDownFrom = countDownFrom;
        console.log(`AudioWorklet init, this.countDownFrom=${this.countDownFrom}`);
        this.port.onmessage = (ev) => {
            console.log(`AudioWorklet received message=${ev.data}`);
            this.isPlaying = ev.data ? true : false;
            this.counter = 0;
            if (this.isPlaying) this.port.postMessage(`started playing`);
            else {
                if (this.countDownFrom == 0) this.port.postMessage(`stopped playing (this.countDownFrom=${this.countDownFrom})`);
                else this.countDown = this.countDownFrom;
            }
        }
    }

    process (inputs, outputs, parameters) {
        if (!this.isPlaying) {
            if (this.countDown != null) {
                if (--this.countDown <= 0) {
                    if (this.countDown == 0) this.port.postMessage(`this.countDownFrom=${this.countDownFrom}`);
                    this.countDown = 0;
                } else console.log(`will reply in ${this.countDown} process() calls...`);
            }

            if (outputs.find(output =>
                output.find(channel =>
                    channel.find(sample =>
                        sample != 0)
                    != null)
                != null)
            != null) {
                console.error(`found non-zero sample in outputs, which should never happen`);
                // actually I've never seen this happened either
            } else {
                console.log(`outputs is kept unmodifed as all-zero`);
                // however I can hear unexpected burst on each AudioContext.resume()
                // which might be, I guess, "residue" buffered sound data before last suspend(),
                // which could either (1) had never yet been played as it should have been,
                // or just (2) unexpectedly replayed for the second time.
            }
            return true;
        }

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
