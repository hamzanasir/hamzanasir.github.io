'use strict';
/* globals svg, mock */

this.mock = {
    mockActuatedValves: {},
    
    flowSetpoint: {
      fv1: Math.random(),
      fv2: Math.random(),
    },
    
    init() {
        setInterval(this.setRandomValves, 5000);
        setInterval(this.setRandomPressure, 500);
        setInterval(this.setRandomFlows, 500);
    },
    
    setRandomValves() {
      let i;
      for ( i = 1; i < 13; i++) {
        mock.mockActuatedValves[`av${i}`] = (Math.random() > 0.5) ? true : false;
      }
      svg.setActuatedValves(mock.mockActuatedValves);
    },
    
    setRandomPressure() {
      let i;
      for ( i = 1; i < 6; i++) {
        svg.setPressure(Math.random() * 10, `pt${i}`)
      }
      svg.setPressure({
        'full-scale pressure': Math.random() * 100,
        'led color': 'red, blinking',
        'pressure': Math.random() * 1000,
        'pressure units': 'psi',
        'run hours': Math.random() * 100,
        'system status': 'ok',
        'wait hours': '12',
        'connected': true,
        'ip': '192.168.1.1234'
      } , 'pt6', true);
    },
    
    setRandomFlows() {
      let i;
      for ( i = 1; i < 3; i++) {
        svg.setFlowController(`fv${i}`, {
          actual: (Math.random() > 0.5) ? mock.flowSetpoint[`fv${i}`] + 0.3 : mock.flowSetpoint[`fv${i}`] - 0.3,
          setpoint: mock.flowSetpoint[`fv${i}`],
          gas: 'AsH3',
          max: 50,
          temperature: Math.random() * 50.0,
          connected: true,
          ip: '192.168.1.1234',
        });
      }
    },
    
    setMockValves(valve, state) {
      mock.mockActuatedValves[valve] = state;
      svg.setActuatedValves(mock.mockActuatedValves);
    }
};