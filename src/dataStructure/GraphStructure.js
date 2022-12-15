import isPathActive from "./pathChecker";


class NetNode {
    constructor(id) {
        this.id = id;
        this.fromEdges = [];
        this.toEdges = [];
    }
}

class Edge {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class BayesianNet {
    constructor() {
        this.nodes = [];
        this.evidence = [];
    }

    addEvidence(nodeId) {
        this.evidence.push(nodeId);
        return this;
    }

    getEvidence() {
        return this.evidence;
    }

    addNode(nodeId) {
        //check if node is existed
        if (!this.nodes.find(node => node.id === nodeId)) {
            this.nodes.push(new NetNode(nodeId));
        }
        return this;
    }

    removeNode(nodeId) {
        this.nodes = this.nodes.filter(node => node.id !== nodeId);
    }

    addEdge(from, to) {
        const fromNode = this.nodes.find(node => node.id === from);
        const toNode = this.nodes.find(node => node.id === to);
        //check if edge is existed
        if (!fromNode.toEdges.find(edge => edge.to === toNode)) {
            fromNode.toEdges.push(new Edge(fromNode, toNode));
            toNode.fromEdges.push(new Edge(fromNode, toNode));
        }
        return this;
    }

    getNodes() {
        return this.nodes;
    }

    getEdge(fromNode, toNode) {
        return fromNode.toEdges.find(edge => edge.to === toNode);
    }

    propagate() {
        // return a list of activated nodes id
        const active_nodes = [];
        // propagate evidence
        this.evidence.forEach(nodeId => {
            const node = this.nodes.find(node => node.id === nodeId);
            active_nodes.push(node.id);

            // propagate to all nodes that have edge to this node
            const frontier = [node];
            while (frontier.length > 0) {
                const currentNode = frontier.pop();
                currentNode.fromEdges.forEach(edge => {
                    const fromNode = edge.from;
                    if (!active_nodes.includes(fromNode.id)) {
                        active_nodes.push(fromNode.id);
                        frontier.push(fromNode);
                    }
                });
            }
        })
        return active_nodes;
    }

    removeEvidence(evidence) {
        this.evidence = this.evidence.filter(nodeId => nodeId !== evidence);
        return this;
    }
}


const createBaseNet = () => {
    return new BayesianNet();
}

const DSeparation = (graph, startNodeId, endNodeId) => {
    const evidence = graph.getEvidence();
    const activations = graph.propagate();
    const paths = findAllPaths(graph, startNodeId, endNodeId, evidence, activations);
    // check if there is a path that is active
    const isDSeparated = paths.every(path => !path[1]);

    // return a list of paths and a boolean value that indicate if the nodes are seprated or not
    return [paths, isDSeparated];
}

const findAllPaths = (graph, startNodeId, endNodeId, evidence, activations) => {
    // preform DFS to find all paths
    const startNode = graph.nodes.find(node => node.id === startNodeId);
    const endNode = graph.nodes.find(node => node.id === endNodeId);
    const paths = [];
    const visited = new Set();
    const path = [];
    const dfs = (node) => {
        visited.add(node);
        path.push(node);
        if (node === endNode) {
            // check if path is active or not
            if (isPathActive(path, evidence, activations)) {
                // if path is active add a pair of path and true to paths
                paths.push([path.slice(), true]);
            } else {
                // if path is not active add a pair of path and false to paths
                paths.push([path.slice(), false]);
            }
        } else {
            // ignore direction of edges
            const edges = [...node.fromEdges, ...node.toEdges];
            for (const edge of edges) {
                const nextNode = edge.from === node ? edge.to : edge.from;
                if (!visited.has(nextNode)) {
                    dfs(nextNode);
                }
            }
        }
        path.pop();
        visited.delete(node);
    }
    dfs(startNode);
    return paths;
}

export {createBaseNet, BayesianNet, NetNode, Edge, findAllPaths, DSeparation};