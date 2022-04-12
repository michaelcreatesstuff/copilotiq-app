import cloneDeep from 'clone-deep';
import UndirectedGraph from '../graph/Graph';

const getFriendData = (adjacents) => {
  const copy = cloneDeep(adjacents);
  return copy
    .map((a) => {
      return {
        value: a.value,
        weight: a.weight,
      };
    })
    .sort((a, b) => b.weight - a.weight);
};

const getRecommendationData = (adjacents) => {
  const copy = cloneDeep(adjacents);
  const friends = copy.map((a) => {
    return {
      value: a.value,
      adjacents: a.adjacents,
      weight: a.weight,
    };
  });
  const friendsList = friends.map((friend) => friend.value);

  // get friends of friends
  const friendsOfFriends = friends.map((x) => {
    return x.adjacents.map((y) => {
      return {
        value: y.value,
        // combine weights: (source to target weight) + (friendsOfFriends)
        weight: x.weight + y.weight,
      };
    });
  });
  return (
    friendsOfFriends
      // flatten array of arrays
      .flat(1)
      // filter out friendsOfFriends that are already friends
      .filter((friendOfFriend) => !friendsList.includes(friendOfFriend.value))
      // sort by weight
      .sort((a, b) => b.weight - a.weight)
      // de-dupe and keep first index, which is highest weight
      .filter((item, index, self) => index === self.findIndex((i) => i.value === item.value))
  );
};

const transformToTableData = (nodes, graph) => {
  const tableData = nodes.map((node, index) => {
    return {
      key: index,
      index,
      name: node,
      email: `${node[0].replace(/[^\w\s]/gi, '')}@gmail.com`,
      profile_pic: index,
      friends: getFriendData(graph?.nodes?.get(node[0])?.adjacents),
      recommendations: getRecommendationData(graph?.nodes?.get(node[0])?.adjacents),
    };
  });
  return tableData;
};

const getGraph = (nodes, allEdgesArr) => {
  const graph = new UndirectedGraph();
  nodes.forEach((node) => {
    const edgesArray = allEdgesArr.filter((edge) => edge[0] === node[0]);
    edgesArray.forEach((edge) => {
      graph.addEdge(edge[0], edge[1], parseInt(edge[4]));
    });
  });
  return graph;
};

export { getFriendData, getRecommendationData, transformToTableData, getGraph };
