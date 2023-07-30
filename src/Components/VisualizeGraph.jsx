import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import popper from 'cytoscape-popper';
import cloneDeep from 'clone-deep';
import reactDom from 'react-dom';

Cytoscape.use(popper);

function removeTooltipPoppers() {
  const poppers = document.body.querySelectorAll('.popper-tooltip');

  console.log('poppers', poppers);

  poppers.forEach((popper) => {
    popper.remove();
  });
}

function DisplayEdges({ data }) {
  return (
    <>
      {data?.map((edge, index) => {
        return (
          <div key={index}>
            Label: {edge?._private?.data?.label}
            Source: {edge?._private?.data?.source}
            Target: {edge?._private?.data?.target}
          </div>
        );
      })}
    </>
  );
}

const NodeTooltip = (props) => {
  const { data, edges } = props;

  return (
    <div style={{ height: '100%', width: '200px', background: 'white' }}>
      <div>
        <b>Vertex Details</b>
      </div>
      <div>"{data?.label}"</div>
      <div>edges: {edges?.length}</div>
      {/* <DisplayEdges data={edges} /> */}
    </div>
  );
};

const EdgeTooltip = (props) => {
  const { data } = props;

  return (
    <div style={{ height: '100%', width: '200px', background: 'white' }}>
      <div>
        <b>Edge Details</b>
      </div>
      <div>{`${data?.source} => ${data?.target}`}</div>
      <div>Label: {data?.label}</div>
    </div>
  );
};

const createContentFromComponent = (component, id) => {
  const dummyDomEle = document.createElement('div');
  dummyDomEle.setAttribute('id', id);
  dummyDomEle.setAttribute('class', 'popper-tooltip');
  reactDom.render(component, dummyDomEle);
  document.body.appendChild(dummyDomEle);
  return dummyDomEle;
};

// node: [id, label]
const transformNode = (node, index) => {
  const result = { data: { id: node[0], label: node[1] } };
  return result;
};

// Source,Target,Type,id,weight
const transformEdge = (edge) => {
  const result = {
    data: {
      source: edge[0],
      target: edge[1],
      label: edge[2],
      weight: edge[4],
    },
  };
  return result;
};

const visualizeGraph = (nodesArr, edgesArr, callback) => {
  const nodesCopy = cloneDeep(nodesArr).map((node, index) => transformNode(node, index));
  const edgeArr = [];
  nodesArr.forEach((node) => {
    const edgesArray = edgesArr.filter(
      (edge) =>
        edge[0] === node[0] &&
        // nodes array has edges target
        nodesArr.findIndex((n) => n[0] === edge[1]) > -1
    );
    edgesArray
      .filter((e) => e[0] !== e[1])
      .forEach((edge) => {
        edgeArr.push(transformEdge(edge));
      });
  });

  console.log('nodes', nodesCopy, 'edges', edgesArr);

  // nodes:
  // data
  // [{id: 'Addam-Marbrand', label: 'Addam Marbrand'} ... ]

  // edges
  // ["Addam-Marbrand", "Brynden-Tully", "Undirected", "0", "3"]
  const elements = CytoscapeComponent.normalizeElements({
    nodes: nodesCopy,
    edges: edgeArr,
  });
  callback(elements);
};

const layout = {
  name: 'cose',
  // name: 'circle',
  fit: true,
  padding: 30,
  minDist: 100,
  componentSpacing: 100,
  nodeOverlap: 5,
  nodeRepulsion: 400000,
};

const VisualizeGraph = ({ allNodes, allEdges }) => {
  const [cytoElements, setCytoElements] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  const cyRef = useRef(null);
  const cyPopperRef = useRef(null);

  useEffect(() => {
    if (!cytoElements) return;
    const cy = cyRef.current;

    cy?.nodes().on('mouseover', (event) => {
      removeTooltipPoppers();

      const data = event?.target._private?.data;
      const edges = event?.target._private?.edges;
      const id = data?.id;

      cyPopperRef.current = event.target.popper({
        content: createContentFromComponent(<NodeTooltip data={data} edges={edges} />, id),
        popper: {
          placement: 'right',
          removeOnDestroy: true,
        },
      });
    });

    cy?.nodes().on('mouseout', () => {
      removeTooltipPoppers();

      if (cyPopperRef && cyPopperRef.current) {
        cyPopperRef?.current?.destroy();
      }
    });

    cy?.edges().on('mouseover', (event) => {
      removeTooltipPoppers();

      const edgeData = event?.target?._private.data;
      const id = edgeData?.id;

      cyPopperRef.current = event.target.popper({
        content: createContentFromComponent(<EdgeTooltip data={edgeData} />, id),
        popper: {
          placement: 'right',
          removeOnDestroy: true,
        },
      });
    });

    cy?.edges().on('mouseout', () => {
      removeTooltipPoppers();
      if (cyPopperRef && cyPopperRef.current) {
        cyPopperRef?.current?.destroy();
      }
    });
  }, [cytoElements]);

  return (
    <>
      {cytoElements ? (
        <>
          <Button
            onClick={() => {
              setCytoElements(null);
            }}
          >
            Remove Graph
          </Button>
          <Button
            onClick={() => {
              setShowLabels(!showLabels);
            }}
          >
            Toggle Labels
          </Button>
          <CytoscapeComponent
            elements={cytoElements}
            style={{ width: '1000px', height: '1000px' }}
            layout={layout}
            cy={(cy) => {
              cyRef.current = cy;
            }}
            stylesheet={[
              {
                selector: 'node',
                style: {
                  ...(showLabels && {
                    label: 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '25px',
                    'font-family': 'Nixie One, cursive',
                    shape: 'roundrectangle',
                    width: 'label',
                    height: 'label',
                    padding: '7px',
                    color: '#FFFFFF',
                  }),
                  backgroundColor: '#c5896d',

                  // 'background-color':
                  //   'mapData(inDegree, 1, 8, rgba(163, 154, 164), rgba(240, 146, 60))',
                  // 'background-opacity': 'mapData(inDegree, 1, 8, .3, 1)',
                  // 'border-color': 'transparent',
                },
              },
              {
                selector: 'edge',
                style: {
                  width: 5,
                  targetArrowShape: 'triangle',
                  curveStyle: 'bezier',
                  color: '#c5896d',
                },
              },
            ]}
          />
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              visualizeGraph(allNodes, allEdges, setCytoElements);
            }}
          >
            Visualize Graph
          </Button>
        </>
      )}
    </>
  );
};

export default VisualizeGraph;
