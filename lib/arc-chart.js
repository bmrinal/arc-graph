var arcChart = (function() {
  const radian = Math.PI / 180
  var aData,
    selector,
    container,
    height,
    width,
    scale,
    pData,
    chart,
    outerRadius,
    arcThickness,
    innerRadius,
    startAngle,
    arcOffset,
    totalOffset,
    scale,
    angles;


  angles = {
    start: {
      1: 0 * radian,
      2: 90 * radian,
      3: 180 * radian,
      4: 270 * radian
    },
    end: {
      1: 90 * radian,
      2: 180 * radian,
      3: 270 * radian,
      4: 360 * radian
    }
  }

  var utils = {
    splicer: function(arr, start, end) {
      arr.splice(start, end); return arr;
    },
    stringToBoolean: function(string) {
      if (string && typeof (string) != 'boolean')
        switch (string.toLowerCase().trim()) {
          case "true":
          case "yes":
          case "1":
            return true;
          case "false":
          case "no":
          case "0":
          case null:
            return false;
          default:
            return Boolean(string);
      }else {
        return string
      }
    }
  }

  function getHeight(options) {
    var ht;
    if (options.plotQuadrant) {
      if ([2, 3].indexOf(+options.plotQuadrant.start) !== -1 || [2, 3, 4].indexOf(+options.plotQuadrant.end) !== -1)
        ht = (outerRadius * 2);
      else
        ht = outerRadius;
    } else {
      if (utils.stringToBoolean(options.compact))
        ht = outerRadius;
      else
        ht = (outerRadius * 2)
    }
    return ht;
  }

  function initialize(options) {
    container = d3.select(options.selector);

    //resetting
    container.innerHTML = '';
    container.select("svg").remove();

    //initializing svg container
    container.append("svg").attr('id', "d3-concentric-chart");

    //adapting to container width
    width = +(utils.splicer(container.style('width').split(""), -2, 2).join("")) || 200;
    outerRadius = (width - (0.3 * width)) / 2; //offsetting outer radius to accomodate lengends
    height = getHeight(options);
    arcThickness = +options.arcThickness || 15; //thickness of arcs
    innerRadius = outerRadius - arcThickness;
    startAngle = options.plotQuadrant ? angles.start[options.plotQuadrant.start] : 4.7; //defaults to 4.7
    arcOffset = +options.arcDistance || 4; //distance between two arcs
    totalOffset = arcThickness + arcOffset;
    chart = d3.select('#d3-concentric-chart')
      .attr('height', height)
      .attr('width', width);

    scale = d3.scale.linear()
      .domain([0, d3.max(aData.map(function(d) {
        return d.value
      }))])

    //scaling range based on display mode
    if (!options.plotQuadrant) { //ignored if quadrants are specified
      if (utils.stringToBoolean(options.compact))
        scale.range([4.68, 7.9]);
      else
        scale.range([4.68, 10.99]);
    } else {
      scale.range([angles.start[options.plotQuadrant.start], angles.end[options.plotQuadrant.end]]);
    }
  }

  function plotLegend(i) {
    var x,
      y,
      leg,
      legend = chart.append('g');
    x = (width - (0.3 * width) + 10);
    y = ((i + 1) * 20);
    leg = legend.append('g').attr('transform', 'translate(' + x + ',' + y + ')');

    //drawing legend rectangle
    leg.append('rect')
      .attr('height', 10)
      .attr('width', 10)
      .attr('fill', aData[i].fill);

    //drawing text
    leg.append('text').attr('transform', 'translate(15,' + 10 + ')')
      .text(aData[i].label + " (" + aData[i].value + ")")
      .attr('font-family', "Verdana")
      .attr('font-size', "13")
      .attr('fill', 'darkslategrey')
  }

  function processData(data) {
    pData = [];
    for (var i = 0; i < aData.length; i++) {

      // writing out legend for i
      plotLegend(i);

      //prep data for arcs
      if (i != 0) {
        outerRadius -= totalOffset;
        innerRadius = outerRadius - arcThickness;
      }
      pData.push(
        {
          outerRadius: outerRadius,
          innerRadius: innerRadius,
          startAngle: startAngle,
          endAngle: scale(aData[i].value),
          fill: aData[i].fill
        }
      )
    }
  }

  function plotArcs() {
    var arc = d3.svg.arc()
      .innerRadius(function(d) {
        return d.innerRadius
      })
      .outerRadius(function(d) {
        return d.outerRadius
      })
      .startAngle(function(d) {
        return d.startAngle
      })
      .endAngle(function(d) {
        return d.endAngle
      });

    var arcs = chart.selectAll('.arc')
      .data(pData)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', "translate(" + (width - (0.3 * width)) / 2 + "," + (width - (0.3 * width)) / 2 + ")")
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        return d.fill
      });
  }

  function validateOptions(options) {
    //validations
    if (!options.selector)
      throw 'Please provide a selector';

    if (!aData && !options.data)
      throw 'No data provided to plot the chart!';

    aData = options.data;
    selector = options.selector;

    if (options.plotQuadrant) {
      var testString = [1, 2, 3, 4];
      if (!options.plotQuadrant.end)
        throw 'Parameter missing: quadrant object should contain "end" key'

      if (!options.plotQuadrant.start)
        throw 'Parameter missing: quadrant object should contain "start" key'

      if (testString.indexOf(+options.plotQuadrant.end) == -1 || testString.indexOf(+options.plotQuadrant.start) == -1)
        throw 'Invalid values for quadrant start and end. Allowed values 1,2,3,4. For more details see docs.'

      if (+options.plotQuadrant.end === +options.plotQuadrant.start)
        throw 'end quadrant cannot be greater than start quadrant'

      if (+options.plotQuadrant.end < +options.plotQuadrant.start)
        throw 'end quadrant cannot be greater than start quadrant'



    }
  }
  return {
    create: function(options) {
      validateOptions(options);
      initialize(options);
      processData();
      plotArcs();
    }
  }
}())
