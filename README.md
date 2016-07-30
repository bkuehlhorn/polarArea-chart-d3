## Polar Area Chart
A reusable radar chart implementation in D3.js. Styleable, configurable and transition-capable.
Create a gist of Polar Area Chart
//[![Polar Area Example](http://bl.ocks.org/?/thumbnail.png)](http://bl.ocks.org/?)

## Usage

### Install
`bower install git@github.com:???.git --save`

### Data structure
```

    var headers = ["Strategic & Aligned", "Adaptability", "Talent Development", "Empowering",
                   "Collaborative", "Employee Engagement", "Integrity", "Accountable", "Innovative"];
    var polarValues = [
      {
        color: "red",
        name: "6/10/2016",
        values: [9,8,7,6,5,4,3,2,1]
      }
      ];
```

`xOffset` and `yOffset` are optional values that allows a developer to change the position of a specific label. It is important to add them in **the first** group of axes.

### Simple single chart drawing
```html
<div class="chart-container"></div>
<script>
    PolarAreaChart("#chart-container", headers, polarValues[0], PolarAreaChartOptions);
</script>
```

### D3.js reusable chart API (not implemented)
```javascript
var chart = PolarAreaChart.chart();
var svg = d3.select('body').append('svg')
  .attr('width', 600)
  .attr('height', 800);

// draw one
svg.append('g').classed('focus', 1).datum(data).call(chart);

// draw many polarAreas
var game = svg.selectAll('g.game').data(
  [
    data,
    data,
    data,
    data
  ]
);
game.enter().append('g').classed('game', 1);
game
  .attr('transform', function(d, i) { return 'translate(150,600)'; })
  .call(chart);
```

### Style with CSS (coloring is part of input)
```css
.polarArea-chart .area {
  fill-opacity: 0.7;
}
.polarArea-chart.focus .area {
  fill-opacity: 0.3;
}
.polarArea-chart.focus .area.focused {
  fill-opacity: 0.9;
}
```

### Configure
```javascript
// retrieve config
chart.config();
// all options with default values
chart.config({
  containerClass: 'polarArea-chart', // target with css, the default stylesheet targets .polarArea-chart
  w: 600,
  h: 600,
  factor: 0.95,
  factorLegend: 1,
  levels: 3,
  maxValue: 0,
  minValue: 0,
  radians: 2 * Math.PI,
  color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
  axisLine: true,
  axisText: true,
  circles: true,
  radius: 5,
  open: false,  // whether or not the last axis value should connect back to the first axis value
                // if true, consider modifying the chart opacity (see "Style with CSS" section above)
  axisJoin: function(d, i) {
    return d.className || i;
  },
  tooltipFormatValue: function(d) {
    return d;
  },
  tooltipFormatClass: function(d) {
    return d;
  },
  transitionDuration: 300
});
```

## Example
###CSV2polarArea

Display a csv file as a polarArea chart at [http://bkuehlhorn.github.io/polarArea-chart-d3/csv2polarArea.html](http://bkuehlhorn.github.io/polarArea-chart-d3/csv2polarArea.html).


[![Example](https://rawgit.com/bkuehlhorn/polarArea-chart-d3/master/example/demo.svg)](http://bl.ocks.org/bkuehlhorn/gist)
http://bl.ocks.org/bkuehlhorn/gist
