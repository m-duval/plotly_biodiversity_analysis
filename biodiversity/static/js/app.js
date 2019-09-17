function buildMetadata(sample) {
  
  var url = `/metadata/${sample}`;
  
  d3.json(url).then(function(sample) {
    
    var sample_metadata = d3.select(`#sample-metadata`);
    
    // d3.select("#sample-metadata").node().value = "";

    sample_metadata.html("");
    
    Object.entries(sample).forEach(function([key, value]) {
      
      var row = sample_metadata.append("panel-body");
      
      row.text(`${key}: ${value}`);
    
    });
  
  });

}

function buildCharts(sample) {

  var data_url = `/samples/${sample}`;

  // BUBBLE CHART

  d3.json(data_url).then(function(data) {

    var x_axis = data.otu_ids;
    
    var y_axis = data.sample_values;

    var b_size = data.sample_values;

    var b_color = data.otu_ids;

    var b_text = data.otu_labels;

    var bubble = {

      x: x_axis,
      
      y: y_axis,
      
      mode: "markers",
      
      text: b_text,
      
      marker: {
        
        color: b_color,
        
        size: b_size
      
      }
    
    };

    var data = [bubble];

    var layout = {

      title: "BUBBLE PLOT",
      
      x_axis: { title: "OTU IDS" },

      y_axis: { title: "SAMPLE VALUES" }

    };

    Plotly.newPlot("bubble", data, layout);

    // PIE CHART

    d3.json(data_url).then(function(data) {

      var p_values = data.sample_values.slice(0,10);

      var p_lables = data.otu_ids.slice(0,10);

      var p_hover = data.otu_labels.slice(0,10);

      var pie = {

        values: p_values,

        labels: p_lables,

        hovertext: p_hover,

        type: "pie"

      };

      var data = [pie];

      var layout = {

        title: "OTU PIE CHART",

      };

      Plotly.newPlot("pie", data, layout);
    
    });

  });
  
  }
  
  function init() {
    
    var selector = d3.select("#selDataset");
    
    d3.json("/names").then((sampleNames) => {
      
      sampleNames.forEach((sample) => {
        
        selector

        .append("option")

        .text(sample)

        .property("value", sample);
      
      });
      
      const firstSample = sampleNames[0];
      
      buildCharts(firstSample);
      
      buildMetadata(firstSample);
    
    });
  
  }
  
  function optionChanged(newSample) {
    
    buildCharts(newSample);
    
    buildMetadata(newSample);
  
  }
  
  init();