// @TODO: Complete the following function that builds the metadata panel
// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`
// Use `.html("") to clear any existing metadata
// Use `Object.entries` to add each key and value pair to the panel
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
// @TODO: Use `d3.json` to fetch the sample data for the plots
// @TODO: Build a Bubble Chart using the sample data
// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

function buildMetadata(sample) {
  
  var url = "/metadata/${sample}";
  
  d3.json(url).then(function(sample) {
    
    var sample_metadata = d3.select("#sample-metadata");
    
    d3.select("#sample-metadata").node().value = "";
    
    Object.entries(sample).forEach(function([key, value]) {
      
      var row = sample_metadata.append("panel-body");
      
      row.text("${key}: ${value}");
    
    });
  
  });

}

function buildCharts(sample) {

  var data_url = "/samples/${sample}";

  // BUBBLE CHART

  d3.json(data_url).then(function(data) {

    var x_axis = data.otu_ids;
    
    var y_axis = data.sample_values;

    var b_size = data.sample_values;

    var b_color = data.otu_ids;

    var b_text = data.otu_labels;

    var trace1 = [{

      x: x_axis,
      
      y: y_axis,
      
      mode: "markers",
      
      text: b_text,
      
      marker: {
        
        color: b_color,
        
        size: b_size
      
      }
    
    }];

    var data = [trace1];

    var layout = {

      title: "BUBBLE PLOT",
      
      x_axis: { title: "OTU IDS" },

      y_axis: { title: "SAMPLE VALUES"}

    };

    Plotly.newPlot("bubble", data, layout);

    // PIE CHART

    d3.json(data_url).then(function(data) {

      var p_values = data.sample_values.slice(0,10);

      var p_lables = data.otu_ids.slice(0,10);

      var p_hover = data.otu_labels.slice(0,10);

      var trace2 = [{

        values: p_values,

        labels: p_lables,

        hovertext: p_hover,

        type: "pie"

      }];

      var data = [trace2];

      var layout = {

        title: "PIE CHART",

      };

      Plotly.newPlot("pie", data, layout);
    
    });
  
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
