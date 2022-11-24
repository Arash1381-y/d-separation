import GridLines from "react-gridlines";
import {Container, Grid, Typography} from "@mui/material";
import {
    GraphButton,
    GraphFormContainer,
    GraphTextField,
    FieldForm,
    themeColor
} from "./GeneralComponent";
import Visualizer from "./Graph";
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import {useFormik} from "formik";
import {createBaseNet, findAllPaths} from "./dataStructure/GraphStructure";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const MainPage = () => {

    const [baseNet, setBaseNet] = useState(createBaseNet());
    const [paths, setPaths] = useState([]);

    const [data, setData] = useState({
            nodes: [],
            links: []
        }
    );

    const addNode = (node) => {
        setData({
            nodes: [...data.nodes, {id: node, x: 700, y: 400}],
            links: [...data.links],
        })
        setBaseNet((baseNet) => {
            return baseNet.addNode(node);
        })
    }

    const addLink = (source, target) => {
        setData({
            nodes: data.nodes,
            links: [...data.links, {source: source, target: target}]
        })
        setBaseNet((baseNet) => {
            return baseNet.addEdge(source, target);
        })
    }


    const colorLinks = (path, baseNet) => {
        // find edges in path
        const edges = [];
        for (let i = 0; i < path.length - 1; i++) {
            const edge = baseNet.getEdge(path[i], path[i + 1]);
            const reverseEdge = baseNet.getEdge(path[i + 1], path[i]);
            if (edge !== undefined) {
                edges.push(edge);
            } else if (reverseEdge !== undefined) {
                edges.push(reverseEdge);
            }
        }

        // color edges
        const newLinks = data.links.map((link) => {
            const sourceNode = baseNet.getNodes().find((node) => node.id === link.source);
            const targetNode = baseNet.getNodes().find((node) => node.id === link.target);
            const edge = baseNet.getEdge(sourceNode, targetNode);
            const reverseEdge = baseNet.getEdge(targetNode, sourceNode);
            if (edges.includes(edge)) {
                return {...link, color: themeColor, strokeDasharray : 5, strokeWidth: 2.5};
            } else if (edges.includes(reverseEdge)) {
                return {...link, color: themeColor, strokeDasharray : 5, strokeWidth: 2.5};
            } else {
                return link;
            }
        })

        setData({
            nodes: data.nodes,
            links: newLinks
        })
    }

    const addNodeForm = useFormik({
        initialValues: {
            node: '',
        },
        // check if node is already in the graph
        validate: (values) => {
            const errors = {};
            if (values.node === '') {
                errors.node = 'Required';
            }
            if (data.nodes.find(node => node.id === values.node)) {
                errors.node = 'Node already exists';
            }
            return errors;
        },

        onSubmit: (values) => {
            addNode(values.node);
        }

    });

    const addLinkForm = useFormik({
        initialValues: {
            source: '',
            target: '',
        },
        // check if source and target are already in the graph
        validate: (values) => {
            const errors = {};
            if (values.source === '') {
                errors.source = 'Required';
            }
            if (values.target === '') {
                errors.target = 'Required';
            }
            if (!data.nodes.find(node => node.id === values.source)) {
                errors.source = 'Source node does not exist';
            }
            if (!data.nodes.find(node => node.id === values.target)) {
                errors.target = 'Target node does not exist';
            }
            return errors;
        },

        onSubmit: (values) => {
            addLink(values.source, values.target);
        }
    });

    return (
        <GridLines className="grid-area" cellWidth={200} strokeWidth={2} cellWidth2={50}>
            <Grid container sx={{minHeight: '90vh'}} columns={24}>
                {/*graph data section*/}
                <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
                    <GraphFormContainer>
                        {/*add Node button*/}
                        <form onSubmit={addNodeForm.handleSubmit}>
                            <FieldForm>
                                <GraphTextField
                                    size={'small'}
                                    label="Node name"
                                    variant="outlined"
                                    id="node"
                                    name="node"
                                    value={addNodeForm.values.node}
                                    onChange={addNodeForm.handleChange}
                                    error={addNodeForm.touched.node && Boolean(addNodeForm.errors.node)}
                                    helperText={addNodeForm.touched.node && addNodeForm.errors.node}
                                    fullWidth/>
                                <GraphButton type="submit" variant="contained" size={'small'} endIcon={<AddIcon/>}>
                                    Add Node
                                </GraphButton>
                            </FieldForm>
                        </form>

                        {/*add edge button*/}
                        <form onSubmit={addLinkForm.handleSubmit}>
                            <FieldForm>
                                <GraphTextField
                                    size={'small'}
                                    label="Source"
                                    variant="outlined"
                                    id="source"
                                    name="source"
                                    value={addLinkForm.values.source}
                                    onChange={addLinkForm.handleChange}
                                    error={addLinkForm.touched.source && Boolean(addLinkForm.errors.source)}
                                    helperText={addLinkForm.touched.source && addLinkForm.errors.source}
                                    fullWidth/>
                                <GraphTextField
                                    size={'small'}
                                    label="Target"
                                    variant="outlined"
                                    id="target"
                                    name="target"
                                    value={addLinkForm.values.target}
                                    onChange={addLinkForm.handleChange}
                                    error={addLinkForm.touched.target && Boolean(addLinkForm.errors.target)}
                                    helperText={addLinkForm.touched.target && addLinkForm.errors.target}
                                    fullWidth/>
                                <GraphButton type="submit" variant="contained" size={'small'} endIcon={<AddIcon/>}>
                                    Add Edge
                                </GraphButton>
                            </FieldForm>
                            <GraphButton variant="contained" size={'small'} onClick={() => {
                                //preform dfs on two random nodes
                                const nodes = baseNet.getNodes();
                                const randomNode1 = nodes[0].id;
                                const randomNode2 = nodes[1].id;
                                setPaths(findAllPaths(baseNet, randomNode1, randomNode2));
                            }}>
                                Find all paths
                            </GraphButton>
                        </form>
                    </GraphFormContainer>

                    <GraphFormContainer>
                        {//check if paths is not empty
                            paths.length > 0 &&
                            <Typography variant={'h6'} color={themeColor} fontWeight={'bolder'}>AVAILABLE
                                PATHS</Typography>
                        }
                        {
                            paths.map((path, index) => {
                                return <Container sx={{display: 'flex', marginBottom: '1rem'}} key={index}
                                                  onMouseEnter={
                                                      () => {
                                                          colorLinks(path, baseNet);
                                                      }
                                                  }
                                                  onMouseLeave={
                                                      () => {
                                                          setData({
                                                              nodes: data.nodes,
                                                              links: data.links.map((link) => {
                                                                  return {...link, color: 'black', strokeDasharray : 0, strokeWidth: 1.5};
                                                              })
                                                          })
                                                      }
                                                  }
                                >
                                    {/*for loop over each path*/}
                                    {path.slice(0, path.length - 1).map((node, index) => {
                                            return <div style={{display: 'flex'}} key={index}>
                                                <div>
                                                    {node.id}
                                                </div>
                                                <ArrowRightAltIcon color={'info'}/>
                                            </div>
                                        }
                                    )}
                                    <div>
                                        {path[path.length - 1].id}
                                    </div>
                                </Container>
                            })
                        }
                    </GraphFormContainer>
                </Grid>

                {/*graph visualizer*/}
                <Grid item xs={12} sm={12} md={12} lg={17} xl={17}>
                    <Visualizer data={data}/>
                </Grid>
            </Grid>
        </GridLines>
    );
}

export default MainPage;