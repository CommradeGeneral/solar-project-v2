class SLD_Cell {
    static SLDs = []
    constructor(svgref, objref, index, phaseRef) {
        this.phase = 1;
        this.svgref = svgref;
        this.protectionRelay = objref.current[`pr_${index.toString().padStart(2, '0')}`];
        this.energyMeter = objref.current[`em_${index.toString().padStart(2, '0')}`];
        this.connections = objref.current.devices_state;
        this.index = index
        this.phaseRef = phaseRef;

        let buttons = this.svgref.querySelectorAll('.phase-butt')

        buttons[this.phase - 1].classList.add('active');
        this.updateValues(this.phase);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = () => {
                this.phase = i + 1;
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove('active');
                }
                buttons[i].classList.add('active');
                this.update();
            }
        }

        this.update();
        SLD_Cell.SLDs.push(this);
    }

    static updateAll() {
        SLD_Cell.SLDs.forEach(element => {
            element.update();
        });
    }


    update(data) {
        //console.log("PR:", this.protectionRelay);
        //console.log("EM:", this.energyMeter);
        let cell_elements = this.svgref.querySelector(".cell");
        let states = new Uint8Array(this.connections)[this.index - 1];
        states = 0x3
        if ((states & 0x03)) {
            cell_elements.style.opacity = '1';
        } else {
            cell_elements.style.opacity = '0.15';
        }
        let protectionRelayConn = this.svgref.querySelector('.cell-protection-relay-conn');
        if (states & 0x01) {
            protectionRelayConn.classList.add('connected');
        } else {
            protectionRelayConn.classList.remove('connected');
        }

        try {
            let energyMeterConn = this.svgref.querySelector('.cell-energy-meter-conn')

            if (states & 0x02) {
                energyMeterConn.classList.add('connected');
            } else {
                energyMeterConn.classList.remove('connected');
            }
        } catch (err) {
            //console.error(err)
        }
        this.updateContacts()
        this.updateValues(this.phase)
    }

    updateContacts() {
        let cell_elements = this.svgref.querySelector(".cell");
        const line11 = cell_elements.querySelector('.line-1-1');
        const line12 = cell_elements.querySelector('.line-1-2');
        const line13 = cell_elements.querySelector('.line-1-3');
        const contact1 = cell_elements.querySelector('.contact-1');
        const rect = cell_elements.querySelector('.contact-1-rect')

        const line21 = cell_elements.querySelector('.line-2-1');
        const line22 = cell_elements.querySelector('.line-2-2');
        const line23 = cell_elements.querySelector('.line-2-3');
        const contact2 = cell_elements.querySelector('.contact-2');
        let protectionRelayStat = new DataView(this.protectionRelay.buffer).getUint8(0);

        if ((protectionRelayStat & 0x01) == 0) {
            line11.setAttribute('d', 'm 78.284144,113.17293 -12.693251,0')
            line12.setAttribute('d', 'm 77.775932,114.56923 -12.185039,0')
            line13.setAttribute('d', 'm 78.030038,113.87108 10.154062,0')
            contact1.setAttribute('transform', `rotate(20,79.399261,110.10917)`)
            rect.style.fill = 'red'

        } else {
            line11.setAttribute('d', 'M 79.399261,113.17293H 65.590893')
            line12.setAttribute('d', 'M 79.399261,114.56923H 65.590893')
            line13.setAttribute('d', 'M 79.399261,113.87108H 88.1841')
            contact1.setAttribute('transform', `rotate(0,79.399261,110.10917)`)
            rect.style.fill = '#338000'
        }

        if ((protectionRelayStat & 0x01) == 0) {
            line21.setAttribute('d', 'm 87.485951 97.326577 0 -4.985291')
            line22.setAttribute('d', 'm 88.882251 97.834789 0 -5.493503')
            line23.setAttribute('d', 'M 88.1841 97.580682 V 113.87108')
            contact2.setAttribute('transform', `rotate(20,84.42218,96.211464)`)
        } else {
            line21.setAttribute('d', 'm 87.485951 96.211456 v -3.87017')
            line22.setAttribute('d', 'm 88.882251 96.211456 v -3.87017')
            line23.setAttribute('d', 'M 88.1841 96.211455 V 113.87108')
            contact2.setAttribute('transform', `rotate(0,84.42218,96.211464)`)

        }

    }

    updateValues(phase = 1) {
        let cell_elements = this.svgref.querySelector(" .meter");
        const voltage = cell_elements.querySelector('.volt-value');
        const current = cell_elements.querySelector('.ampere-value');
        //
        let rawData = this.energyMeter.buffer;
        let dataView = new DataView(rawData);
        let voltages = [dataView.getFloat32(4), dataView.getFloat32(8), dataView.getFloat32(12)];
        let currents = [dataView.getFloat32(16), dataView.getFloat32(20), dataView.getFloat32(24)];
        // making voltage between 0 to 9999
        // and so do current
        let volt = voltages[phase - 1]
        let curr = currents[phase - 1]
        if (volt > 9999) volt = 9999;
        if (curr > 9999) curr = 9999;
        if (volt < 0) volt = 0;
        if (curr < 0) curr = 0;
        //console.log(volt, curr)
        // fixing the number of digits excluded decimal point
        let voltStr = volt.toString().substring(0, 6).padStart(6, '0');
        let currStr = curr.toString().substring(0, 6).padStart(6, '0');
        //console.log(voltStr, currStr)
        if (!voltStr.includes('.')) {
            voltStr = volt.toString().substring(0, 5).padStart(5, '0');
        }
        if (!currStr.includes('.')) {
            currStr = curr.toString().substring(0, 5).padStart(5, '0');
        }
        voltage.textContent = voltStr;
        current.textContent = currStr;
    }


}

export default SLD_Cell;