# arc-graph


Built on top of [d3.js](https://d3js.org/).


## Installing
1. Include [d3.js](https://d3js.org/) library
2. Include arc-chart.js library

### Prerequisities

D3.js is required for this to work. Make sure you include it before arc-chart.js.

```
<script src='d3.v3.min.js' type="text/javascript"></script>
<script src='arc-chart.js' type="text/javascript"></script>

```

### How to use

The library exposes a global object  ```arcChart``` which has the method : ```createChart```. To plot a arc chart, you will need to use the code somewhat like below:

```
arcChart.create({
  data: data, //see data section below for compatible data format
  selector: "#chartContainer", //the selector for the container where the graph will be plotted
  compact:true
});
```
This will plot you a shiny graph with default values. See the full options below.

## Data Format

The data should be an array of objects having the three properties:

1. **label**: label to be displayed in legends
2. **value**: value of the label 
3. **fill**: color of the ring/arc that you would like to have for this object/datum

Here is how a sample data would look like:
```
var data = [
  {
    'label':'Calculate',
    'value': 100,
    'fill':'steelBlue'
  },
  {
    'label':'Format',
    'value': 90,
    'fill':'red'
  }
]
```

## Quick note about graph dimensions
The graph drawn will span over the width of the container. If you want the graph to be of specific size, set dimensions of the container and the graph will expand within that container :P

## Options

- **arcThickness**: Number. Thickness of each arc (defaults to 15)
- **arcDistance**: Number. Distance between two arcs (defaults to 5)
- **compact**: Boolean. Switch to full circle mode/semi circle mode (defaults to false)
- **selector**: String. Selector string for DOM element - this is where the graph is going to be drawn into
- **data**: Array. See the data section above

## Built With

* [d3.js](https://d3js.org/) 
* [Atom] (http://atom.io/)

## Contributing
Just send a pull request :P

## Authors

**Mrinal Purohit**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

