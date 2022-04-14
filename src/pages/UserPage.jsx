import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import Skeleton from 'react-loading-skeleton';
// node: [id, label]
import nodes from '../data/nodes.csv';
// Source,Target,Type,id,weight
import edges from '../data/edges.csv';
import { getFriendData, getRecommendationData, getGraph } from '../Components/Table/helpers';
import { TableModal } from '../Components';
import { InputNumber, Button, Table } from 'antd';

// if we were using an actual api we would import this
// import { getUser } from '../api';

const Wrapper = styled.div`
  margin: 5%;
`;

const RowWrapper = styled.div`
  margin: 5%;
  display: flex;
`;

const ContentWrapper = styled.div`
  margin: 5%;
`;

const getUserFromGraph = (id, graph) => {
  return graph?.nodes?.get(id);
};

const degreesTableColumns = [
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Degrees of Separation',
    dataIndex: 'degrees',
    key: 'degrees',
  },
];

function UserPage(props) {
  const { userId } = props;
  const [allNodes, setAllNodes] = useState([]);
  const [graph, setGraph] = useState(null);
  const [allEdges, setAllEdges] = useState([]);
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(1);
  const [degreesTableData, setDegreesTableData] = useState(null);
  const [nthData, setNthData] = useState(null);

  //// if we were using an actual api it would look like this
  //   async function getUserData() {
  //     await getUser()
  //       .then((res) => {
  //         const { data = [] } = res?.data;
  //         setUserData(data);
  //       })
  //       .catch((err) => {
  //// with more robust error handling
  //         window.alert(JSON.stringify(error));
  //       });
  //   }

  // instead we are geting our data from a csv file and handling what would happen on the api side in react
  useEffect(() => {
    Papa.parse(nodes, {
      download: true,
      complete: function (input) {
        const nodes = input?.data;
        // pop off labels
        nodes.shift();
        setAllNodes(nodes);
      },
    });
    Papa.parse(edges, {
      download: true,
      complete: function (input) {
        const edges = input?.data;
        // pop off labels;
        edges.shift();
        setAllEdges(edges);
      },
    });
  }, []);

  useEffect(() => {
    if (allNodes.length > 0 && allEdges.length > 0) {
      const newGraph = getGraph(allNodes, allEdges);
      const user = getUserFromGraph(userId, newGraph);
      setGraph(newGraph);
      setUserData(user);
    }
  }, [allNodes, allEdges]);

  useEffect(() => {
    if (userData) {
      const friends = getFriendData(userData?.adjacents);
      const recommendations = getRecommendationData(userData?.adjacents, userId);
      setFriends(friends);
      setRecommendations(recommendations);
    }
  }, [userData]);

  function onChange(value) {
    setDegreesOfSeparation(value);
    setNthData(null);
  }

  function onClick() {
    const degrees = graph.bfsGetNthConnection(graph?.nodes?.get(userId), degreesOfSeparation);
    setNthData(degrees?.nthConnection);
    const newTableData = [...degrees?.distances].map((item, i) => {
      return {
        key: i,
        name: item?.[0]?.value,
        degrees: item?.[1],
      };
    });
    setDegreesTableData(newTableData);
  }

  const getOrdinal = (n) => {
    if (n === 1) {
      return '1st';
    } else if (n === 2) {
      return '2nd';
    } else if (n === 3) {
      return '3rd';
    }
    return `${n}th`;
  };

  return (
    <Wrapper>
      <RowWrapper>
        {userData ? (
          <ContentWrapper>
            <div>Name: {userData?.value}</div>
            <img src={`https://via.placeholder.com/180x180.png?text=${userData?.value}`} />
          </ContentWrapper>
        ) : (
          <ContentWrapper>
            <Skeleton rows={20} />
          </ContentWrapper>
        )}
        {friends ? (
          <ContentWrapper>
            <b>{friends?.length ? friends?.length : 0} Friends:</b>
            {friends?.length > 5 ? (
              <>
                {friends?.slice(0, 5)?.map((a) => {
                  return <div key={a.value}>{a.value}</div>;
                })}
                <TableModal title={`${friends.length} Friends`} data={friends} />
              </>
            ) : (
              <>
                {friends?.map((a) => {
                  return <div key={a.value}>{a.value}</div>;
                })}
              </>
            )}
            <br />
          </ContentWrapper>
        ) : (
          <ContentWrapper>
            <Skeleton rows={20} />
          </ContentWrapper>
        )}
        {recommendations ? (
          <ContentWrapper>
            <b>{recommendations?.length ? recommendations?.length : 0} Recommendations:</b>
            {recommendations?.length > 5 ? (
              <>
                {recommendations?.slice(0, 5)?.map((a) => {
                  return <div key={a.value}>{a.value}</div>;
                })}
                <TableModal
                  title={`${recommendations.length} Recommendations`}
                  data={recommendations}
                />
              </>
            ) : (
              <>
                {recommendations?.map((a) => {
                  return <div key={a.value}>{a.value}</div>;
                })}
              </>
            )}
          </ContentWrapper>
        ) : (
          <ContentWrapper>
            <Skeleton rows={20} />
          </ContentWrapper>
        )}
      </RowWrapper>
      <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
      <Button onClick={onClick}>Show Degrees of Separation</Button>
      {nthData ? (
        <ContentWrapper>
          <b>
            {nthData?.length ? nthData?.length : 0} {getOrdinal(degreesOfSeparation)} level
            recommendations
          </b>
          {nthData?.length > 5 ? (
            <>
              {nthData?.slice(0, 5)?.map((a) => {
                return <div key={a?.node?.value}>{a?.node?.value}</div>;
              })}
              <TableModal
                connections
                title={`${getOrdinal(degreesOfSeparation)} level
            recommendations`}
                data={nthData}
              />
            </>
          ) : (
            <>
              {nthData?.map((a) => {
                return <div key={a?.node?.value}>{a?.node?.value}</div>;
              })}
            </>
          )}
          <br />
        </ContentWrapper>
      ) : null}
      {degreesTableData ? (
        <Table dataSource={degreesTableData} columns={degreesTableColumns} />
      ) : null}
    </Wrapper>
  );
}

export default UserPage;
