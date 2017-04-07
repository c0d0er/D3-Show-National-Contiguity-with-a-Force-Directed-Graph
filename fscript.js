class ForceGraph extends React.Component{
  componentDidMount() {
    d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',(data)=>{
      let nodes=data.nodes;
      let links=data.links;
      let w=window.innerWidth;
      let h=window.innerHeight;
      //console.log(nodes)
      //console.log(links)

      let linksArr=[];
      links.forEach((e,i)=>{
        console.log(e)
        linksArr.push([e.source, e.target])
      })
console.log(linksArr)

      let div = d3.select('.forcegraph').append('div');

      let svg=d3.select('.forcegraph')
                .append('svg')
                .attr('width',w)
                .attr('height', h);

      let forceG = d3.forceSimulation(nodes)
                     .force('link', d3.forceLink().links(links).strength(2.2))
                     .force('charge', d3.forceManyBody().strength(-0.5))
                     .force('center', d3.forceCenter(w/2, h/2))
                     .force('collide', d3.forceCollide(20))
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

          node.on('mouseover', function(d){
            console.log(d)
                      div.html('<div class="tooltip1"><span class="country">'+d.country+d.index+'</span></div>')
            .style('left', (d3.event.clientX) + 'px')
            .style('top', (d3.event.clientY - 32) + 'px')
            .style('position', 'absolute');
      })

              .on('mouseout', function(){
                d3.select('.tooltip1')
            .classed('hidden', 'true');
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
        .attr("transform", "translate(" + (w / 2) + " ," + 60 + ")")
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
