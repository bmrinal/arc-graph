var arcChart = (function() {

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
    scale;

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

  function initialize(options) {
    container = d3.select(options.selector);

    //resetting
    container.innerHTML = '';
    container.select("svg").remove()

    //adapting to container width
    width = +(utils.splicer(container.style('width').split(""), -2, 2).join("")) || 200;

    container.append("svg").attr('id', "d3-concentric-chart");
    outerRadius = (width - (0.3 * width)) / 2,
    height = (outerRadius * 2)
    if (utils.stringToBoolean(options.compact))
      height /= 2;

    arcThickness = +options.arcThickness || 15; //thickness of arcs
    innerRadius = outerRadius - arcThickness,
    startAngle = 4.7,
    arcOffset = +options.arcDistance || 4, //distance between two arcs
    totalOffset = arcThickness + arcOffset;
    chart = d3.select('#d3-concentric-chart')
      .attr('height', height)
      .attr('width', width);

    scale = d3.scale.linear()
      .domain([0, d3.max(aData.map(function(d) {
        return d.value
      }))])

    //scaling range based on display mode
    if (utils.stringToBoolean(options.compact))
      scale.range([4.68, 7.9]);
    else
      scale.range([4.68, 10.99]);
  }

  function plotLegends(i) {
    var legend = chart.append('g'),
      leg,
      x,
      y;
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
      plotLegends(i);

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

  return {
    create: function(options) {
      if (!options.selector)
        throw 'Please provide a selector';

      if (!aData && !options.data)
        throw 'No data provided to plot the chart!';

      aData = options.data;
      selector = options.selector;

      initialize(options);
      processData();
      plotArcs();
    }
  }
}())
