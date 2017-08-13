'use strict';
/* globals svg, mock */

this.mock = {
    mockActuatedValves: {},
    
    flowSetpoint: {
      fv1: Math.random(),
      fv2: Math.random(),
    },
    
    reactorState: true,
    
    filterState: true,
    
    init() {
        setInterval(this.setRandomValves, 5000);
        setInterval(this.setRandomPressure, 500);
        setInterval(this.setRandomFlows, 500);
        setInterval(this.setReactor, 500);
        setInterval(this.setFilter, 500);
        this.decommitionedValves = [1, 2, 7, 5, 9];
    },
    
    setRandomValves() {
      let i;
      for ( i = 1; i < 13; i++) {
        if (!mock.decommitionedValves.includes(i)) {
          mock.mockActuatedValves[`av${i}`] = (Math.random() > 0.5) ? true : false;
        }
      }
      svg.gas.setActuatedValves(mock.mockActuatedValves);
    },
    
    setRandomPressure() {
      let i;
      for ( i = 1; i < 6; i++) {
        svg.gas.setPressure(Math.random() * 10, `pt${i}`);
      }
      svg.gas.setPressure({
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
      
      svg.gas.setFlowController('fv1', {
        actual: (Math.random() > 0.5) ? mock.flowSetpoint['fv1'] + 0.3 : mock.flowSetpoint['fv1'] - 0.3,
        setpoint: mock.flowSetpoint['fv1'],
        gas: 'AsH3',
        max: 50,
        temperature: Math.random() * 50.0,
        connected: true,
        ip: '192.168.1.1234',
      });
    },
    
    setMockValves(valve, state) {
      mock.mockActuatedValves[valve] = state;
      svg.gas.setActuatedValves(mock.mockActuatedValves);
    },
    
    setReactor() {
      mock.reactorState = (Math.random() > 0.5) ? true : false;
      svg.reactor.setPressure(Math.random() * 10);
      svg.reactor.setTemperature(Math.random() * 100);
    },
    
    setFilter() {
      mock.filterState = (Math.random() > 0.5) ? true : false;
      svg.filter.setPressure(Math.random() * 10);
      svg.filter.setTemperature(Math.random() * 100);
    }
};