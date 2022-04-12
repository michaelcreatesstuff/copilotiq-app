import React, { useState } from 'react';
import { Button } from 'antd';
import CytoscapeComponent from 'react-cytoscapejs';
import cloneDeep from 'clone-deep';

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
      label: `Edge from ${edge[0]} to ${edge[1]}`,
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
    edgesArray.forEach((edge) => {
      edgeArr.push(transformEdge(edge));
    });
  });
  const elements = CytoscapeComponent.normalizeElements({
    nodes: nodesCopy,
    edges: edgeArr,
  });
  callback(elements);
};

const layout = {
  name: 'circle',
};

const VisualizeGraph = ({ allNodes, allEdges }) => {
  const [cytoElements, setCytoElements] = useState(null);
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
          <CytoscapeComponent
            elements={cytoElements}
            style={{ width: '1000px', height: '1000px' }}
            layout={layout}
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