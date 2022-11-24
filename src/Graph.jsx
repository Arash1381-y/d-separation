import React from 'react';
import {Graph} from "react-d3-graph";

const myConfig = {
    staticGraphWithDragAndDrop: true,
    nodeHighlightBehavior: true,
    directed: true,
    height: ' 94vh',
    width: '100%',
    node: {
        color: '#5b51ff',
        size: 400,
        highlightStrokeColor: "blue",
        fontWeight: 'bold',
        highlightFontWeight: 'bold',
        fontSize: 20,
        highlightFontSize: 20,
    },
    link: {
        color: '#28282f',
        highlightColor: '#5b51ff',
        strokeDasharray: null,
        strokeWidth: 2,
    },
};

const Visualizer = ({data}) => {
    return (
        <div style={{height: '100%'}}>
            <Graph
                id="graph-id" // id is mandatory
                data={data}
                config={myConfig}
            />
        </div>

    );
};

export default Visualizer;