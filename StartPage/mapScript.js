

/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */


//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var colorR = d3.scale.linear()
			  .range([180,0]);

var colorG = d3.scale.linear()
			  .range([220, 84]);

var colorB = d3.scale.linear()
			  .range([255, 148]);

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in my states data!
d3.csv("FinalScoreSheet.csv", function(data) {
colorR.domain([-12,12]); // setting the range of the input data
colorG.domain([-12,12]);
colorB.domain([-12,12]);

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].State;

	// Grab data value
	var dataValue = data[i].TotalScore;

	// Grab Medical Data
	var datamedac = data[i].medac;

	// Grab Culture Data
	var dataculture = data[i].Culture;

	var datareligion = data[i].religion;

	var datacontraception = data[i].contraception;

	var dataabstinence = data[i].abstinence;

	var datamarriage = data[i].marriage;

	var datagay = data[i].gay;

	var datacondoms = data[i].condoms;

	var datahealthy = data[i].healthy;

	var datadecision = data[i].decision;

	var datarefusal = data[i].refusal;

	var dataconsent = data[i].consent;

	var datadating = data[i].dating;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.score = dataValue;
		json.features[j].properties.medac = datamedac;
		json.features[j].properties.culture = dataculture;
		json.features[j].properties.religion = datareligion;
		json.features[j].properties.contraception = datacontraception;
		json.features[j].properties.abstinence = dataabstinence;
		json.features[j].properties.marriage = datamarriage;
		json.features[j].properties.gay = datagay;
		json.features[j].properties.condoms = datacondoms;
		json.features[j].properties.healthy = datahealthy;
		json.features[j].properties.decision = datadecision;
		json.features[j].properties.refusal = datarefusal;
		json.features[j].properties.consent = dataconsent;
		json.features[j].properties.dating = datadating;

		// Stop looking through the JSON
		break;
		}
	}
}

// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.score;

	if (value) {
		console.log(value);
	//If value exists…
	return "rgb("+colorR(value)+","+colorG(value)+","+colorB(value)+")";
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
}).on("click", function(d) {
	console.log(d);
	showModal(d);
});



	});

});

function showModal(d){
  $(".modal").show();
	$("#title").html(d.properties.name);
	var textfield = $("#text").html(d.properties.score);
	var text = '<br>';
	var Culture  = d.properties.Culture;
	if(Culture == 1) {
		text += "The curricula does not need to be culturally appropriate and unbiased."
	} else if(Culture == -1){
		text += "The curricula must be culturally appropriate and unbiased."
	}

	var medac  = d.properties.medac;
	if(medac == 1) {
		text += "This state does not mandate sex/HIV education curricula be medically accurate."
	} else if(medac == -1){
		text += "This states mandates that HIV education curricula must be medically accurate, but does not mandate the sex education be medically accurate."
	} else if(medac == -2){
		text += "This states mandates that both sex and HIV education curricula must be medically accurate."
	}

	var religion  = d.properties.religion;
	if(religion == 1) {
		text += "The curricula may promote religion."
	} else if(religion == -1){
		text += "The curricula cannot promote religion."
	}

	var contraception  = d.properties.contraception;
	if(contraception == 1) {
		text += "When provided, sex education does not need to include information about contraception."
	} else if(contraception == -1){
		text += "When provided, sex education must include information about contraception."
	}

	var abstinence  = d.properties.abstinence;
	if(abstinence == 1) {
		text += "This state’s sex education program must stress abstinence."
	} else if(abstinence == 0){
		text += "This state’s sex education program must cover abstinence."
	}

	var marriage  = d.properties.marriage;
	if(marriage == 1) {
		text += "The state requires their sex education programs include the importance of having sex only within marriage."
	} else if(marriage == 0){
		text += "The state does not require teachers to address the importance of having sex only within marriage."
	}

	var gay  = d.properties.gay;
	if(gay == 1) {
		text += "According to the Guttmacher Institute, there are 17 states which mandate their sex education programs paint either a positive, inclusive picture or negative, discriminatory picture of sexual orientation. This state requires their sex ed program impose a negative view of sexual orientation."
	} else if(gay == -1){
		text += "According to the Guttmacher Institute, there are 17 states which mandate their sex education programs paint either a positive, inclusive picture or negative, discriminatory picture of sexual orientation. This state requires their sex ed program share an inclusive perspective of sexual orientation."
	}

	var condoms  = d.properties.condoms;
	if(condoms == 1) {
		text += "When HIV education is provided, it does not need to include information on condoms."
	} else if(condoms == -1){
		text += "When HIV education is provided, it must include information on condoms."
	}

	var healthy  = d.properties.healthy;
	if(healthy == 0) {
		text += "The state’s sex ed program does not necessitate providing information about the skills needed to have healthy sexual and romantic relationships."
	} else if(healthy == -1){
		text += "The state’s sex ed program must provide information about the skills needed to have healthy  sexual and romantic relationships."
	}

	var decision  = d.properties.decision;
	if(decision == 1) {
		text += "The curricula does not require information on sexual decision-making and self-discipline be taught."
	} else if(decision == -1){
		text += "The curricula must instruct students about sexual decision-making and self-discipline."
	}

	var refusal  = d.properties.refusal;
	if(refusal == 1) {
		text += "Instructional information on refusal skills and personal boundaries does not need to be included in the sex ed curricula."
	} else if(refusal == -1){
		text += "Instructional information on refusal skills and personal boundaries must be included in the sex ed curricula."
	}

	var consent  = d.properties.consent;
	if(consent == 1) {
		text += "The importance of consent to sexual activity does not need to be covered in sex ed courses."
	} else if(consent == -1){
		text += "The importance of consent to sexual activity must be covered."
	}

	var dating  = d.properties.dating;
	if(dating == 1) {
		text += "This state doesn’t require their educational programs include information on preventing, recognizing and responding to teen dating violence and sexual violence."
	} else if(dating == -1){
		text += "This state demands their educational programs include information on preventing, recognizing and responding to teen dating violence and sexual violence."
	}

	textfield.html(text);
}
