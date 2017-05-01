//shared js-modules
import dir from '../../../../js-modules/rackspace.js';
import met_map from '../../../../js-modules/met-map.js';
import format from '../../../../js-modules/formats.js';

dir.local("./").add("data")
//dir.add("data", "cleantech-patenting/data");

function main(){

	var width = 960;
	var height = 500;
	var aspect = 9/16;
	var pi2 = Math.PI*2;

	var wraps = d3.selectAll(".met-map").style("width","100%").style("overflow","hidden");

	d3.json(dir.url("data", "frey_migration_map.json"), function(err, data){

		if(!!err){
			return null;
		}

		var WRAP = d3.select("#frey-map");

		var options = [
			{name:"International and domestic migration components, 2010–2016", id:"equally"},
			{name:"Net international migration, 2010–2016", id:"net_international"},
			{name:"Net domestic migration, 2010–2016", id:"net_domestic"}
		]

		var lookup = {
			net_international:"Net international migration",
			net_domestic:"Net domestic migration"
		}

		var wraps = WRAP.selectAll("div.map-wrap").data([1,2]).enter().append("div").classed("map-wrap",true);

		wraps.each(function(d){

			var wrap = d3.select(this);

			var map_titlebox = wrap.append("div").style("padding","0em 1em")
									.style("border-bottom","1px solid #aaaaaa")
									.style("margin","1em 1em 5px 1em")
									;

			var mapwrap = wrap.append("div").style("padding","0em 1em")
											.append("div")
											.style("margin","0em auto")
											.style("max-width","1600px")
											.style("min-width","400px")
											.classed("c-fix",true);

			var map_main = mapwrap.append("div").classed("map-wrap", true);


			//inspect the data merge
			//console.log(map.data());

			var text_accessor = function(d){

				var I = d.obs.net_international;
				var D = d.obs.net_domestic;

				var II = '<span style="font-weight:bold;color:' + (I < 0 ? '#dc2a2a' : '#0d73d6') + '">' + format.ch0(I) + '</span>';
				var DD = '<span style="font-weight:bold;color:' + (D < 0 ? '#dc2a2a' : '#0d73d6') + '">' + format.ch0(D) + '</span>';

				return ["Net international migration: " + II, "Net domestic migration: " + DD];
			}

			var classCols = ["#0d73d6", "#91bae2" ,'#dc2a2a'];
			function dotColor(d){
				return classCols[(d.class-1)];
			}

			var map = met_map(map_main.node());

			map.responsive().states("#fffff4");
			map.store(data, "all_data");
			map.data(data, "fips");

			map.format("ch0").textAccessor(text_accessor);

			//map_title.text(d === 1 ? options[0].name : options[1].name);
			if(d==1){
				var map_title = map_titlebox.append("p")
							.style("text-align","center")
							.style("font-weight","bold")
							.style("margin","1em 0em 5px 0em")
							.text(options[0].name)
							;

				var el = map_titlebox.append("div").style("text-align","center").append("div").style("display","inline-block");

				var el1 = el.append("p").style("line-height","1em").style("margin","0em 0em 0.5em 0em").style("text-align","left");
				el1.append("span").classed("divdot",true).style("background-color","#0d73d6");
				el1.append("span").html("International migration gains <em>and</em> domestic migration losses (47 areas)");

				var el2 = el.append("p").style("line-height","1em").style("margin","0em 0em 0.5em 0em").style("text-align","left");
				el2.append("span").classed("divdot",true).style("background-color","#91bae2");
				el2.append("span").html("International migration gains <em>greater than</em> domestic migration gains (12 areas)");

				var el3 = el.append("p").style("line-height","1em").style("margin","0em 0em 0.5em 0em").style("text-align","left");
				el3.append("span").classed("divdot",true).style("background-color",'#dc2a2a');
				el3.append("span").html("Domestic Migration Gains <em>greater than</em> International Migration Gains (41 area)");

				//draw map
				map.bubble(8, dotColor);
			}


			if(d==2){

				var absmax = d3.max(data, function(d,i){
					return d3.max([Math.abs(d.net_international), 
								   Math.abs(d.net_domestic)])
				})

				//draw map
				map.maxval(absmax);
 
				var button_wrap0 = map_titlebox.append("div").style("text-align","center");
					button_wrap0.append("p").style("display","inline-block").text("Make a selection: ");
				var button_wrap = button_wrap0.append("div").classed("buttons",true).style("display","inline-block");
				
				var buttons = button_wrap.selectAll("p").data(options.slice(1)).enter().append("p").text(function(d){return d.name});

				var current_indicator = options[1].id
				buttons.classed("selected", function(d,i){return d.id == current_indicator});
				map.bubble(current_indicator, current_indicator);
				map.sizeName(lookup[current_indicator]);

				buttons.on("mousedown", function(d, i){
					current_indicator = d.id;
					buttons.classed("selected", function(d,i){return d.id == current_indicator});
					map.sizeName(lookup[current_indicator]);
					map.bubble(d.id, d.id);
				});
			}

		}); //end each

	}); //end d3.json callback

} //close main()

document.addEventListener("DOMContentLoaded", main);
