function buildOrgTree(data) {
  const nodeMap = {};
  data.forEach((item) => {
    nodeMap[item.id] = {
      id: item.id,
      name: item.name,
      parent: item.parent,
      image: item.image,
      subCount: item.subCount,
      activities: item.activities,
      children: [],
    };
  });

  const tree = [];
  Object.values(nodeMap).forEach((node) => {
    if (node.parent === null || !nodeMap[node.parent] || node.id === node.parent) {
      tree.push(node);
    } else {
      nodeMap[node.parent].children.push(node);
    }
  });

  return tree;
}

export default buildOrgTree;