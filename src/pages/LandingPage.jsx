import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styled from 'styled-components';
// node: [id, label]
import nodes from '../data/nodes.csv';
// Source,Target,Type,id,weight
import edges from '../data/edges.csv';

// import linodes from '../data/linodes.csv';

// import liedges from '../data/liedges.csv';

import linodes from '../data/linodesresult.csv';

import liedges from '../data/liedgesresult.csv';

import { VisualizeGraph, DataTable } from '../Components';
import { transformToTableData, getGraph } from '../Components/Table/helpers';

const LandingPageWrapper = styled.div`
  margin: 5%;
`;

function LandingPage() {
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [liNodes, setLiNodes] = useState([]);

  useEffect(() => {
    // Papa.parse(nodes, {
    Papa.parse(linodes, {
      download: true,
      complete: function (input) {
        const nodes = input?.data;
        // pop off labels
        nodes.shift();
        setAllNodes(nodes);
      },
    });
    // Papa.parse(edges, {
    Papa.parse(liedges, {
      download: true,
      complete: function (input) {
        const edges = input?.data;
        // pop off labels;
        edges.shift();
        setAllEdges(edges);
      },
    });

    Papa.parse(linodes, {
      download: true,
      complete: function (input) {
        const nodes = input?.data;
        // pop off labels
        nodes.shift();
        console.log('finalNode  s', nodes);
        setLiNodes(nodes);
      },
    });
  }, []);

  useEffect(() => {
    if (allNodes.length > 0 && allEdges.length > 0 && tableData.length === 0) {
      const graph = getGraph(allNodes, allEdges);
      const transformedData = transformToTableData(allNodes, graph);
      setTableData(transformedData);
    }
  }, [allNodes, allEdges, tableData]);

  return (
    <LandingPageWrapper>
      {allNodes.length > 0 && allEdges.length > 0 ? (
        <VisualizeGraph allNodes={allNodes} allEdges={allEdges} />
      ) : null}
      {tableData.length > 0 ? <DataTable tableData={tableData} /> : null}
    </LandingPageWrapper>
  );
}

export default LandingPage;
