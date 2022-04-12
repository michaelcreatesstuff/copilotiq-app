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

// if we were using an actual api we would import this
// import { getUser } from '../api';

const Wrapper = styled.div`
  margin: 5%;
  display: flex;
`;

const ContentWrapper = styled.div`
  margin: 5%;
`;

const getUserFromGraph = (id, graph) => {
  return graph?.nodes?.get(id);
};

function UserPage(props) {
  const { userId } = props;
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

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
      const graph = getGraph(allNodes, allEdges);
      const user = getUserFromGraph(userId, graph);
      setUserData(user);
    }
  }, [allNodes, allEdges]);

  useEffect(() => {
    if (userData) {
      const friends = getFriendData(userData?.adjacents);
      const recommendations = getRecommendationData(userData?.adjacents);
      setFriends(friends);
      setRecommendations(recommendations);
    }
  }, [userData]);

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

export default UserPage;
