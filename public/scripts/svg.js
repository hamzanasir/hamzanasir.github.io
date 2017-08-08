/* globals $, d3, graphUtil, digitsOnly, colors, has, mock, svg */

this.svg = {

  /**
   * Draws an svg in the target div and saves selectors
   */
  init(selector) {
    const self = this;
    this.$selector = $(selector);

    d3.xml('static/diborane.svg', (xml) => {
      this.$selector.html(xml.documentElement);
      this.svg = d3.select(`${selector} > svg`);
      this.svg.attr('viewBox', '0 0 550 820')
        .attr('preserveAspectRatio', 'xMinYMin');
      this.resize();

      let i;
      let prefix;
      this.manualOptionFocused = false;
      this.valveControlEnabled = true;
      this.actuatedValves = {};
      this.manualValves = {};
      this.pipes = {};
      this.cylinders = {};
      this.state = {};

      $('.popover-hover').data('state', 'hover');
      $('.popover-hover').popover({
        container: this.$selector,
        trigger: 'manual',
        placement: 'bottom',
        html: true,
        animation: false,
      })
        .on('mouseenter', function onMouseEnter() {
          if ($(this).data('state') === 'hover') {
            const _self = this;
            $('.popover-hover').filter(function onPopoverHover() {
              return $(this).data('state') === 'hover';
            }).popover('hide');
            $(this).popover('show');
            $('.popover').on('mouseleave', () => {
              if ($(_self).data('state') === 'hover') {
                $(_self).popover('hide');
              }
            }).on('click', (e) => {
              if ($('.manual-option').is(':focus')) {
                e.preventDefault();
                e.stopPropagation();
              }
            });
          }
          self.$selector.find('.manual-option').attr('contenteditable', self.valveControlEnabled);
        }).on('mouseleave', function onMouseLeave() {
          if ($(this).data('state') === 'hover') {
            const _self = this;
            setTimeout(() => {
              if (!$('.popover:hover').length) {
                $(_self).popover('hide');
              }
            }, 300);
          }
        })
        .on('click', function onClick(e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(this).data('state') === 'hover') {
            $('.popover-hover').popover('hide');
            $('.popover-hover').data('state', 'hover');
            $(this).data('state', 'pinned');
            $(this).popover('show');
          } else {
            $(this).data('state', 'hover');
          }
        });

      this.$selector.find('[data-toggle="popover"]').popover({
        container: self.$selector,
        trigger: 'hover',
        placement: 'top',
      });
      
      const pipeList = d3.selectAll('#diborane-pipes > g, #diborane-pipes > path')[0];
      $.each(pipeList, (index, pipe) => {
        this.pipes[pipe.id] = this.svg.selectAll(`#${pipe.id} > path`);
      });
  
      this.graph = graphUtil.createGraph(this.pipes);
  
      for (i = 1; i <= 12; i += 1) {
        prefix = `#diborane-av${i.toString()}-`;
        this.actuatedValves[`av${i.toString()}`] = {
          stem: this.svg.selectAll(`${prefix}path`),
          base: this.svg.selectAll(`${prefix}handles`),
        };
      }
  
      for (i = 1; i <= 4; i += 1) {
        this.manualValves[`mv${i.toString()}`] = this.svg.selectAll(`#diborane-mv${i.toString()}`);
      }
  
      this.cylinders = {
        source: this.svg.selectAll('#diborane-source-cylinder'),
        c1: this.svg.selectAll('#diborane-cylinder-1'),
        c2: this.svg.selectAll('#diborane-cylinder-2'),
        c3: this.svg.selectAll('#diborane-cylinder-3'),
      };
  
      this.$selector.find('#diborane-valves > .av, .mv').click(function onValveClick() {
        const valveId = $(this)[0].id.split('-')[1];
        if (valveId.indexOf('mv') > -1) {
          svg.setManualValves({ [valveId]: !self.state[valveId] });
        } else {
          mock.setMockValves(valveId, !self.state[valveId]);
        }
        //client.toggleValve('diborane', valveId, !self.state[valveId]);
      });
  
      this.$selector.on('focusin', '.manual-option', () => {
        this.manualOptionFocused = true;
      });
  
      this.$selector.on('keypress', '.diborane-flow-setpoint', digitsOnly);
      this.$selector.on('focusout', '.diborane-flow-setpoint', function onFlowFocusOut() {
        if (self.valveControlEnabled) {
          mock.flowSetpoint[$(this).data('label')] = parseFloat($(this).html());
        }
        self.manualOptionFocused = false;
      });
  
      this.$selector.on('keypress', '.diborane-gas-instance', function onKeyPress(e) {
        const keycode = e.keyCode || e.which;
        if (keycode === 13 || keycode === 27) {
          e.preventDefault();
          $(this).focusout().blur();
        }
      });
      this.$selector.on('focusout', '.diborane-gas-instance', function onGasFocusOut() {
        self.manualOptionFocused = false;
      });
      mock.setRandomValves();
    });
  },

  /**
   * Makes the svg fit the parent div while maintaining 1:1 aspect ratio
   */
  resize() {
    const width = this.$selector.width();
    this.svg.attr('width', width).attr('height', width * (820 / 550));
  },

  updatePipes() {
    let isArrow;

    const colorMap = {
      hazard: colors.yellow,
      inert: colors.blue,
      blend: colors.green,
      vacuum: colors.lightgray,
    };

    const p = {
      hazard: graphUtil.bfs(this.graph, 'source', this.state)
        .concat(graphUtil.bfs(this.graph, 'c1', this.state))
        .concat(graphUtil.bfs(this.graph, 'c2', this.state))
        .concat(graphUtil.bfs(this.graph, 'c3', this.state)),
      inert: graphUtil.bfs(this.graph, 'inert', this.state),
      vacuum: graphUtil.bfs(this.graph, 'vacuum', this.state),
    };
    p.vacuum = graphUtil.difference(p.vacuum, p.hazard.concat(p.inert));
    p.blend = graphUtil.intersection(p.hazard, p.inert);
    p.hazard = graphUtil.difference(p.hazard, p.blend);
    p.inert = graphUtil.difference(p.inert, p.blend);

    $.each(this.pipes, (id, selector) => {
      isArrow = (id.indexOf('arrow') > -1);
      selector.style(isArrow ? 'fill' : 'stroke', colors.gray);
    });
    $.each(this.cylinders, (id, cylinder) => {
      cylinder.style('fill', colors.white);
    });
    $.each(p, (type, pipeIds) => {
      $.each(pipeIds, (i, pipe) => {
        this.pipes[pipe].style('stroke', colorMap[type]);
        if (has.call(this.pipes, `${pipe}-arrow`)) {
          this.pipes[`${pipe}-arrow`].style('fill', colorMap[type]);
        }
        $.each(this.cylinders, (id, cylinder) => {
          if (pipe.indexOf(id) > -1) {
            cylinder.style('fill', colorMap[type]);
          }
        });
      });
    });
  },

  setValve(valve, state) {
    if (state) {
      this.actuatedValves[valve].stem.style({ fill: colors.white, stroke: colors.green });
      this.actuatedValves[valve].base.style({ fill: colors.white, stroke: colors.gray });
    } else {
      this.actuatedValves[valve].stem.style({ fill: colors.white, stroke: colors.red });
      this.actuatedValves[valve].base.style({ fill: colors.gray, stroke: colors.gray });
    }
  },

  setManualValves(manualValveStates) {
    $.each(manualValveStates, (valveId, isOpen) => {
      this.state[valveId] = isOpen;
      this.manualValves[valveId].style({ fill: colors[isOpen ? 'white' : 'gray'] });
    });
    this.updatePipes();
  },

  setActuatedValves(valves) {
    $.each(valves, (valveId, isOpen) => {
      this.state[valveId] = isOpen;
      this.setValve(valveId, isOpen);
    });
    this.updatePipes();
  },

  toggleValveControl(enabled) {
    this.valveControlEnabled = enabled;
  },

  setPressure(pressure, label, isManometer = false) {
    let metadata;
    let $popover;
    let hasError;
    let data;
    let led;
    const $circle = this.$selector.find(`#diborane-${label}-circle`);
    const $text = this.$selector.find(`#${label}`);
    const $units = this.$selector.find(`#diborane-${label}-units`);
    if (isManometer) {
      data = pressure;
      if (has.call(data, 'connected') && data.connected) {
        hasError = !(data['system status'] === 'ok' || data['system status'] === 'Zero Adjusted');
        $circle.css({ fill: hasError ? colors.blue : colors.white });
        $text.add($units).css({ fill: hasError ? colors.white : colors.gray });
        $units.text(data['pressure units']);

        if (data.pressure < 1) {
          $text.text(data.pressure.toFixed(2));
        } else if (data.pressure < 10) {
          $text.text(data.pressure.toFixed(1));
        } else {
          $text.text(data.pressure.toFixed(0));
        }

        if (data['led color'].split(', ').length === 1) {
          led = `<span style="color: ${colors[data['led color']]}">&#x25cf;</span>`;
        } else {
          led = data['led color'];
        }

        metadata = `<p><span class="name">LED</span> <span class="value">${led}</span></p>` +
            `<p><span class="name">Time Until Ready</span> <span class="value">${(data['wait hours'] * 60.0).toFixed(0)} minutes</span></p>` +
            `<p><span class="name">Run Time</span> <span class="value">${(data['run hours'] / 24.0).toFixed(1)} days</span></p>` +
            `<p><span class="name">Full-Scale Pressure</span> <span class="value">${data['full-scale pressure'].toFixed(0)} ${data['pressure units']}</span></p>` +
            `<p><span class="name">Address</span> <a class="value" href="http://${data.ip}/" target="_blank">${data.ip}</a></p>`;
        if (hasError) {
          metadata = `<div class="fault"><p class="status">${data['system status']}</p></div>${metadata}`;
        } else {
          metadata = `<p><span class="name">System Status</span> <span class="value">${data['system status']}</span></p>${metadata}`;
        }

        $popover = $(`#diborane-${label}-indicator > .popover-hover`).attr('data-content', `<div class="metadata">${metadata}</div>`).data('bs.popover');
        $popover.setContent();
        $popover.$tip.addClass($popover.options.placement);
      } else {
        $circle.css({ fill: colors.gray });
        $text.add($units).css({ fill: colors.white });
      }
    } else if (!pressure || pressure < -100) {
      $circle.css({ fill: colors.gray });
      $text.add($units).css({ fill: colors.white });
    } else {
      $circle.css({ fill: colors.white });
      $text.add($units).css({ fill: colors.gray });
      $text.text(pressure.toFixed(pressure > 1 ? 0 : 1));
    }
  },

  setFlowController(label, flow) {
    let isOffset;
    let metadata;
    let rounded;
    let $popover;
    const $circle = this.$selector.find(`#diborane-${label}-circle`);
    const $text = this.$selector.find(`#${label}`);
    const $units = this.$selector.find(`#diborane-${label}-units`);
    if (flow && has.call(flow, 'connected') && flow.connected) {
      isOffset = (Math.abs(flow.setpoint - flow.actual) > 1);
      $circle.css({ fill: isOffset ? colors.blue : colors.white });
      $text.add($units).css({ fill: isOffset ? colors.white : colors.gray });
      if (Math.abs(flow.actual) < 0.1) {
        rounded = '0';
      } else if (Math.abs(flow.actual) < 1) {
        rounded = flow.actual.toFixed(2);
      } else {
        rounded = flow.actual.toFixed(1);
      }
      if ($text.text() !== rounded) {
        $text.text(rounded);
      }

      if (!this.manualOptionFocused) {
        metadata = `<p><span class="name">Setpoint</span> <span class="value"><span class="diborane-flow-setpoint manual-option" contenteditable="${true}" data-label="${label}">${flow.setpoint.toFixed(1)}</span> sccm</span></p>` +
              `<p><span class="name">Gas</span> <span class="value diborane-gas-instance manual-option" contenteditable="${this.valveControlEnabled}" data-label="${label}">${flow.gas ? flow.gas.replace(/(\d)/, '<sub>$1</sub>') : 'N/A'}</span></p>` +
              `<p><span class="name">Max Flow</span> <span class="value">${flow.max ? flow.max.toFixed(0) : 'N/A'} sccm</span></p>` +
              `<p><span class="name">Temperature</span> <span class="value">${flow.temperature.toFixed(1)} &deg;C</span></p>` +
              `<p><span class="name">Address</span> <a class="value" href="http://${flow.ip}/" target="_blank">${flow.ip}</a></p>`;
        $popover = $(`#diborane-${label}-indicator > .popover-hover`).attr('data-content', `<div class="metadata">${metadata}</div>`).data('bs.popover');
        $popover.setContent();
        $popover.$tip.addClass($popover.options.placement);
      }
    } else {
      $circle.css({ fill: colors.gray });
      $text.add($units).css({ fill: colors.white });
    }
  },
};