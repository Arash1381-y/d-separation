const isPathActive = (path, evidences, activations) => {

    const pathLength = path.length;
    const tripleSelectionLength = pathLength - 2;
    for (let i = 0; i < tripleSelectionLength; i++) {
        const triple = [path[i], path[i + 1], path[i + 2]];
        if (!isTripleActive(triple, evidences, activations)) {
            return false;
        }
    }
    return true;
}


const isTripleActive = (triple, evidences, activations) => {
    const [startNode, middleNode, endNode] = triple;

    const startToMiddleEdge = startNode.toEdges.find(edge => edge.to === middleNode);
    const middleToEndEdge = middleNode.toEdges.find(edge => edge.to === endNode);
    const middleToStartEdge = middleNode.toEdges.find(edge => edge.to === startNode);
    const endToMiddleEdge = endNode.toEdges.find(edge => edge.to === middleNode);

    // check chain form : if start node have edge to middle node and middle node have edge to end node
    if (startToMiddleEdge && middleToEndEdge) {
        return !evidences.includes(middleNode.id);
    }
    if (middleToStartEdge && endToMiddleEdge) {
        return !evidences.includes(middleNode.id);
    }

    // check common cause form : if start node have edge to middle node and end node have edge to middle node
    if (startToMiddleEdge && endToMiddleEdge) {
        return activations.includes(middleNode.id);
    }

    // check common effect form : if middle node have edge to start node and middle node have edge to end node
    if (middleToStartEdge && middleToEndEdge) {
        return !evidences.includes(middleNode.id);
    }

}
export default isPathActive;