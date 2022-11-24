import graph from "../Graph";

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
}


const createBaseNet = () => {
    return new BayesianNet();
}


const findAllPaths = (graph, startNodeId, endNodeId) => {
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
            paths.push(path.slice());
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

export {createBaseNet, BayesianNet, NetNode, Edge, findAllPaths};