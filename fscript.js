class ForceGraph extends React.Component{
  componentDidMount() {
    $.getJSON('https://raw.githubusercontent.com/c0d0er/D3-Show-National-Contiguity-with-a-Force-Directed-Graph/master/countries.json',(data)=>{//same as d3.json;
      let nodes=data.nodes;
      let links=data.links;
      let w=window.innerWidth;
      let h=window.innerHeight;

      let div = d3.select('.forcegraph').append('div');

      let svg=d3.select('.forcegraph')
                .append('svg')
                .attr('width',w)
                .attr('height', h);

      let forceG = d3.forceSimulation(nodes)
                     .force('link', d3.forceLink().links(links).strength(2.5))
                     .force('charge', d3.forceManyBody().strength(440))
                     .force('center', d3.forceCenter(w/2, h/2))
                     .force('collide', d3.forceCollide(24))
                     .on('tick', ticked);

      let link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line');

      let node =  d3.select('.forcegraph')
                    .select('.flags')
                    .append('g')
                    .selectAll('img')
                    .data(nodes)
                    .enter()
                    .append('img')
                    .attr('class',d=>'flag flag-'+d.code)
                    
                    .call(d3.drag()
                            .on('start', dragstarted)
                            .on('drag', dragged)
                            .on('end', dragended)
                            );


 let linkedByIndex = {};
    links.forEach(function(d) {

        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
  console.log(linkedByIndex)
    
    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
    }
/*    node.on("mouseover", function(d){
        node.classed("node-connected", function(o) {
console.log(o)
            return isConnected(d, o);
        });

        link.classed("link-active", function(o) {
            return o.source === d || o.target === d;
        });

        d3.select(this).classed('node-active', true);
    }).on("mouseout", function(d){                
        node.attr('class', 'node')
        link.classed("link-active", false);
    });

    */

          node.on('mouseover', function(d){
                      let tooltipCountries=''
                      let connectedCountries=[];
            node.style('transform', function(o){
              if(isConnected (d,o)){
                connectedCountries.push(o.country);
                tooltipCountries=d.country+', is connected to '+connectedCountries.join(', ')+'.';
                return 'scale(1.2)';}
                else{return 'scale(0.7)';}
            })

            node.classed('node-connected', function(o){
              return isConnected(d,0);
            });
            link.classed("link-active", function(o) {
            return o.source === d || o.target === d;
        });

            d3.select(this).style('transform', 'scale(2)');

            div.html('<div class="tooltip1"><span class="country">'+tooltipCountries+'</span></div>')
            .style('left', (d3.event.clientX-24) + 'px')
            .style('top', (d3.event.clientY - 52) + 'px')
            .style('position', 'absolute');

      })

              .on('mouseout', function(){
                d3.select('.tooltip1')
            .classed('hidden', 'true');

            node.style('transform', 'scale(1)')

            node.classed('node-connected', false);
            link.classed('link-active', false);
            d3.select(this).style('transform', 'scale(1)')

          });

          function ticked() {
      link.attr("x1", (d) => d.source.x )
          .attr("y1", (d) => d.source.y )
          .attr("x2", (d) => d.target.x )
          .attr("y2", (d) => d.target.y );
      node.style("left", (d) => d.x-8 +'px')
          .style("top", (d) => d.y-8 +'px' );
        //svg.attr('width',window.innerWidth)
        //.attr('height', window.innerHeight);
    }
  
   function dragstarted(d) {
        if (!d3.event.active) { 
            forceG.alphaTarget(0.3)//0.3
                .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) {
            forceG.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }

    svg.append('text')
        .attr("transform", "translate(" + (w / 2) + " ," + 45 + ")")
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .style('font-size', '1.9em')
        .text("Show National Contiguity with a Force Directed Graph");
    })
  }

  render (){
    return (
      <div className='forcegraph'>
        <div className='flags'>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<ForceGraph/>,
  document.getElementById('app'));
