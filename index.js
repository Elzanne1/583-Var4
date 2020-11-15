
// DEFAULT state
let vis = 'LE';
let country_outer_svg = null;
let greatest_width = 0;

Promise.all([d3.json('countries.json'), d3.csv('Life Expectancy Data fixed.csv')])
    .then(([jsonData, csvData]) => {

        //SET UP
        setDoubleScroll();

        //Combining jsonData and csvData
        let data = getCountryImageInfo(jsonData, csvData);

        //Data setup
        setUp(data);

        updateDataState(data);

        setButtons(data);

    });

/**
 * Set up visualization container and the country names and lines within an svg tag.
 * @param data - combination of jsonData and csvData
 */
function setUp(data){
         //SETUP of document

         let country_div = d3.select('#vis_container').selectAll('div').append('div')
             .data(data)
             .enter()
             .append('div')
             .style('height', '3rem')


        let indices = calculatePercentiles(data);

         country_outer_svg = country_div
             .append('svg')
             .attr('xmlns', 'http://www.w3.org/2000/svg')
             .attr('width', '100%')


         let country_outer_svg_text = country_outer_svg
             .append('text')
             .attr('class', 'country_names')
             .attr('y', '10')
             .attr('dy', '0.35em')
             .text(function(d){
                 return d['name'];
             })



            let country_names = document.querySelectorAll('#vis_container div');
            country_names.forEach(function(d){                                                                                     
                                                                                                                                   
                                                                                                                                   
                let svg = d.querySelector('svg');                                                                                  
                let text = svg.querySelector('text');                                                                              
                let bbox = text.getBBox();                                                                                         
                                                                                                                                   
                let width = bbox.width;                                                                                            
                let height = bbox.height;
                                                                                                                                   
                for (let i = 0 ; i< data.length; i++){

                    if (text.textContent === data[i]['name'] ) {
                        if (width > greatest_width){
                            greatest_width = width;
                        }
                        data[i]['width'] = width;                                                                                  
                        data[i]['height'] = height;                                                                                
                                                                                                                                   
                    }                                                                                                              
                }

            });

            let count = 0;
            country_names.forEach(function(d){

                let svg = d.querySelector('svg');
                let line = document.createElementNS('http://www.w3.org/2000/svg','line');
                line.setAttribute('stroke', 'black');
                line.setAttribute('x1', greatest_width+20);
                line.setAttribute('x2', '100%');
                line.setAttribute('y1', data[count]['height']/2 + 5);
                line.setAttribute('y2', data[count]['height']/2 + 5);
                svg.appendChild(line);

                let line_red = document.createElementNS('http://www.w3.org/2000/svg','line');
                line_red.setAttribute('stroke', 'red');
                line_red.setAttribute('stroke-width', '0.13%')
                line_red.setAttribute('x1', greatest_width+20);
                line_red.setAttribute('x2',greatest_width + 30 + 15 *indices['25'])

                line_red.setAttribute('y1', data[count]['height']/2 + 5);
                line_red.setAttribute('y2', data[count]['height']/2 + 5);
                svg.appendChild(line_red);

                let line_yellow = document.createElementNS('http://www.w3.org/2000/svg','line');
                line_yellow.setAttribute('stroke', '#bdba31');
                line_yellow.setAttribute('stroke-width', '0.13%')
                line_yellow.setAttribute('x1', greatest_width + 30 + 15 *indices['25']);
                line_yellow.setAttribute('x2',greatest_width + 30 + 15 *indices['75'])

                line_yellow.setAttribute('y1', data[count]['height']/2 + 5);
                line_yellow.setAttribute('y2', data[count]['height']/2 + 5);
                svg.appendChild(line_yellow);

                let line_green = document.createElementNS('http://www.w3.org/2000/svg','line');
                line_green.setAttribute('stroke', 'green');
                line_green.setAttribute('stroke-width', '0.13%')
                line_green.setAttribute('x1', greatest_width + 30 + 15 *indices['75']);
                line_green.setAttribute('x2','100%')

                line_green.setAttribute('y1', data[count]['height']/2 + 5);
                line_green.setAttribute('y2', data[count]['height']/2 + 5);
                svg.appendChild(line_green);
                count++;
            })





}

/**
 * Combines necessary data
 * @param jsonData - country names and official abbreviations
 * @param csvData - Life Expectancy data (i.e which countries to get the flags for)
 * @returns {[]} data - an array of Objects, combining information from jsonData and csvData
 */
function getCountryImageInfo(jsonData, csvData){
    let data = [];
    csvData.forEach(function(d){
        let name = d['Country'].trim();
        for (let key in jsonData){
            if (jsonData[key].trim() === name){
                let abbrev = key;
                let a = abbrev.toLowerCase();
                let temp = {'name': name, 'code': abbrev, 'life_expectancy': d['Life expectancy '], 'bmi': d[' BMI '],
                'gdp': d['GDP'], 'income_resources': d['Income composition of resources'], 'schooling': d['Schooling'], 'location' : `./images/${a}.svg`};
                data.push(temp);
            }
        }
    });
    return data;
}

/**
 * Sorts the data based on values in the different columns
 * @param data - array to sort
 * @param comparisonAttr - which column is the sorting key
 * @returns {this}
 */
function sortingVals(data, comparisonAttr){
      sorted = [...data].sort(function(a,b) {
          if (Number(a[comparisonAttr]) > Number(b[comparisonAttr])) {
              return 1;
          } else if (Number(a[comparisonAttr]) < Number(b[comparisonAttr])) {
              return -1;
          } else {
              return 0;
          }
      });

      return sorted;
}

/**
 * Returns the index of a country from one of the sorted arrays
 * @param array - array of objects
 * @param value - the country name to find
 * @returns {number}
 */
function getIndex( array, value){
    for (let i = 0; i< array.length ; i++){
        if (array[i]['name'] === value){
            return i;
        }

    }
    return -1;  
}

/**
 * Sets up functionality of buttons used to switch the data being displayed
 * @param data - combination of csvData and jsonData
 */
function setButtons(data){
    let btnLE = document.getElementById('LE');
    btnLE.onclick = function(){
        vis = 'LE';
        updateDataState(data);
    }

    let btnBMI = document.getElementById('BMI');
    btnBMI.onclick = function(){
        vis = 'BMI';
        updateDataState(data);
    }

    let btnGDP = document.getElementById('GDP');
    btnGDP.onclick = function(){
        vis = 'GDP';
        updateDataState(data);
    }

    let btnIC = document.getElementById('IC');
    btnIC.onclick = function(){
        vis = 'IC';
        updateDataState(data);
    }
    
    let btnS = document.getElementById('S');
    btnS.onclick = function(){
        vis = 'S';
        updateDataState(data);
    }
}

/**
 * Sets up the double horizontal scroll feature at the top and bottom of the visualization
 */
function setDoubleScroll(){
    let upper_wrapper = document.getElementById('wrapper_upper');
    let lower_wrapper = document.getElementById('wrapper_lower');

    upper_wrapper.onscroll = function() {
        lower_wrapper.scrollLeft = upper_wrapper.scrollLeft;
    }

    lower_wrapper.onscroll = function(){
        upper_wrapper.scrollLeft = lower_wrapper.scrollLeft;


    }
}

/**
 * Convert the smaller encoding string into a string used for a header on the html page
 * @param vis - which data to show
 * @returns {string}
 */
function translateCoding(vis){
    if (vis === 'LE'){
        return 'Life Expectancy (in years)'
    }

    else if (vis === 'GDP'){
        return 'GDP (in USD)'
    }

    else if (vis === 'BMI'){
       return 'BMI'
    }

    else if (vis === 'IC'){
        return 'Income composition of resources (from 0 to 1)'
    }

    else if (vis === 'S'){
        return 'Schooling (in years)'
    }
}

/**
 * Changes the data being displayed
 * @param data - combined csvData and jsonData
 */
function updateDataState(data){
   //STATE WHICH DATA IS CURRENTLY BEING DISPLAYED
   let info = document.getElementById('info');
   info.innerText = `Currently Showing: ${translateCoding(vis)}`;
   if (country_outer_svg !== null){
       displayData(data, country_outer_svg);
   }

}

/**
 * Changes position of country flags based on their position in the sorted array of data
 * @param data - combined csvData and jsonData
 */
function displayData(data){
      let state;
      if (vis === 'LE'){                                         
            state = 'life_expectancy';
      }                                                          
                                                                 
      else if (vis === 'GDP'){                                   
          state = 'gdp' ;
      }                                                          
                                                                 
      else if (vis === 'BMI'){                                   
         state = 'bmi';
      }                                                          
                                                                 
      else if (vis === 'IC'){                                    
          state = 'income_resources';
      }                                                          
                                                                 
      else if (vis === 'S'){                                     
          state = 'schooling';
      }

     country_outer_svg.select('image').remove();
      country_outer_svg.select('.value').remove();
      country_outer_svg.select('.percentile').remove();

     let sortedList = sortingVals(data,state);

     calculatePercentiles(sortedList);

                                                                                       
     country_outer_svg                                                                 
         .append('image')                                                              
         .attr('href', function(d){return d['location']})                              
         .attr('width', '2em')                                                         
         .attr('height', '2em')
         .attr('x', function(d){
             return getPos(sortedList, d)['x'];

         })
         .attr('y', function(d){return d['height']/2 - 10})

    country_outer_svg
        .append('text')
        .attr('class', `value`)
        .attr('y', '10')
        .attr('font-weight', 'bold')
        .attr('font-size', '0.75em')
        .attr('x',  function(d){
            return getPos(sortedList, d)['x']+30;
        })
        .attr('y', function(d){
            return getPos(sortedList,d)['y']+10;
        })
        .text(function(d){
            let currentState = Number(d[state]);
            return (String(currentState.toFixed(2)));

        })


}

/**
 * Returns position of the flag
 * @param list
 * @param d
 * @returns {{x: number, y: number}}
 */
function getPos(list,d){
    let index = getIndex(list,d['name']);
    let width = greatest_width + 30 + 15 * (index);
    let height = d['height']/2-10;
    let pos = {
        x: width,
        y: height
    }

    return pos;

}

function calculatePercentiles(list){
    let n = list.length;
    let percentile25index = 0.25 * n-1;
    let percentile75index = 0.75 * n-1;

    let percentilesIndices = {
        25: percentile25index,
        75: percentile75index
    }
    
    return percentilesIndices;

}


