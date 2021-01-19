const url = "static/js/samples.json";

let metadata = []
let names = []
let samples= []

/**
 * function to charge JSON data on init and create the plots
 */
d3.json(url).then(function(data){
    // console.log(data)

    // get the data from the JSON into variables
    names = data.names;
    samples= data.samples;
    metadata = data.metadata;

    // Add the values to the <select> html tag
    names.forEach(name => {
        d3.select("#selector")
        .append("option")
        .attr("value", name)
        .text(name)
    });

    // To draw the graph for the first time we need to get some first data
    // so we get the first object of the array to build the first data
    // console.log("firstSamp: ",samples[0])
    let firstSamp = samples[0]
    

    // We get the first arrays of data and slice them to get only the top 10 values
    let sample_values = firstSamp.sample_values.slice(0,10)
    let otu_ids = firstSamp.otu_ids.map(d=>`OTU: ${d}`).slice(0,10)
    let otu_labels = firstSamp.otu_labels.slice(0,10)



    // Create the data for the bar chart
    let trace1 = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: "bar",
        orientation: 'h'
    }

    let dataPlot = [trace1]

    let layout = {
        title: `Test Subject ID: ${firstSamp.id}`,
        yaxis: {autorange: "reversed"}
    }

    Plotly.newPlot('plot', dataPlot, layout);

    //  set everything for the bubble chart
    let trace2 = {
        x: firstSamp.otu_ids,
        y: firstSamp.sample_values,
        text: firstSamp.otu_labels,
        mode: 'markers',
        marker: {
            size: firstSamp.sample_values,
            color: firstSamp.otu_ids
        }
    }

    let dataPlotBubble = [trace2]

    let layoutBubble = {
        title: `Test Subject ID: ${firstSamp.id}`
    }

    Plotly.newPlot('plotBubble', dataPlotBubble, layoutBubble);


    // populate the card wiht the demographic info
    let meta = Object.entries(metadata[0])

    let card = d3.select("#cardContent")
    .append("table")
    .attr("id","updateTable")

    let text = ""
    meta.forEach(element => {
         text += `<tr><td>${element[0]}</td><td>${element[1]}</td></tr>`
    });

    card.html(text)

})
.catch(function(e){
    console.log(e)
});


// Call updatePlotly() when a change takes place to the DOM
d3.select("#selector").on("change", updatePlotly);

/**
 * 
 * @param {Object} obj the object from JSON 
 * @param {Integer} id the id of the subject from the dropdown 
 * @returns {Object} obj with the information required to update the plots
 */
function getTestSubject(obj, id){
    // get the data from the JSON into variables
    samples= obj.samples;
    metadata = obj.metadata;

    let samples_array = []
    let metadata_array = []

    // check for the samples in the object with the id
    for(let i = 0, a = samples.length; i<a; i++){
        if(samples[i].id == id){
            samples_array = samples[i];
            break;
        }
    }

    // check for the metadata in the object with the id
    for(let i = 0, a = metadata.length; i<a; i++){
        if(metadata[i].id == id){
            metadata_array = metadata[i];
            break;
        }
    }

    // create the new object to update the plots
    let aux = {
        id: id,
        metadata: metadata_array,
        samples: samples_array
    }

    // return the object
    return aux;
}


function updatePlotly(){

    // Select the value from the dropdown
    let dropValue = d3.select("#selector").node().value

    d3.json(url).then(function(data){

        let newData = getTestSubject(data,dropValue)
        // Create the data for the bar chart
        let trace1 = {
            x: newData.samples.sample_values.slice(0,10),
            y: newData.samples.otu_ids.map(d=>`OTU: ${d}`).slice(0,10),
            text: newData.samples.otu_labels.slice(0,10),
            type: "bar",
            orientation: 'h'
        }

        let dataPlot = [trace1]

        let layout = {
            title: `Test Subject ID: ${newData.id}`,
            yaxis: {autorange: "reversed"}
        }

        Plotly.newPlot('plot', dataPlot, layout);

        //  set everything for the bubble chart
        let trace2 = {
            x: newData.samples.otu_ids,
            y: newData.samples.sample_values,
            text: newData.samples.otu_labels,
            mode: 'markers',
            marker: {
                size: newData.samples.sample_values,
                color: newData.samples.otu_ids
            }
        }

        let dataPlotBubble = [trace2]

        let layoutBubble = {
            title: `Test Subject ID: ${newData.id}`
        }

        Plotly.newPlot('plotBubble', dataPlotBubble, layoutBubble);


        // populate the card wiht the demographic info
        let meta = Object.entries(newData.metadata)

        // delete table
        d3.select("#updateTable").remove()

        // create new table
        let card = d3.select("#cardContent")
        .append("table")
        .attr("id","updateTable")

        let text = ""
        meta.forEach(element => {
            text += `<tr><td>${element[0]}</td><td>${element[1]}</td></tr>`
        });

        card.html("")
        card.html(text)


    })
    .catch(function(e){
        console.log(e)
    });

}