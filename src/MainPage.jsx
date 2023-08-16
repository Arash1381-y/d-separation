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
import {createBaseNet, DSeparation} from "./dataStructure/GraphStructure";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CircleIcon from '@mui/icons-material/Circle';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from "@mui/material/Button";

const MainPage = () => {

    const [baseNet, setBaseNet] = useState(createBaseNet());
    const [paths, setPaths] = useState([]);
    const [isSeparable, setIsSeparable] = useState(false);

    const [data, setData] = useState({
            nodes: [],
            links: []
        }
    );

    const addNode = (node) => {
        setData({
            nodes: [...data.nodes, {id: node, x: Math.random() * 200 + 700, y: Math.random() * 200 + 400}],
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
                return {...link, color: themeColor, strokeDasharray: 5, strokeWidth: 2.5};
            } else if (edges.includes(reverseEdge)) {
                return {...link, color: themeColor, strokeDasharray: 5, strokeWidth: 2.5};
            } else {
                return link;
            }
        })

        setData({
            nodes: data.nodes,
            links: newLinks
        })
    }


    const addOrRemoveEvidence = (evidence) => {
        if (baseNet.getEvidence().includes(evidence)) {
            setBaseNet((baseNet) => {
                return baseNet.removeEvidence(evidence);
            })

            // change color of evidence node to default
            const newNodes = data.nodes.map((node) => {
                if (node.id === evidence) {
                    return {...node, color: '#5b51ff'}
                } else {
                    return node;
                }
            })

            setData({
                nodes: newNodes,
                links: data.links
            })
        } else {
            setBaseNet((baseNet) => {
                return baseNet.addEvidence(evidence);
            })

            // change color of evidence node to red
            const newNodes = data.nodes.map((node) => {
                if (node.id === evidence) {
                    return {...node, color: 'black',}
                } else {
                    return node;
                }
            })

            setData({
                nodes: newNodes,
                links: data.links
            })
        }
    }

    const addNodeForm = useFormik({
        initialValues: {
            node: '',
        },
        validateOnChange: false,
        validateOnBlur: false,
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
        validateOnBlur: false,
        validateOnChange: false,
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
            //check if link already exists
            if (data.links.find(link => link.source === values.source && link.target === values.target)) {
                errors.source = 'Link already exists';
                errors.target = 'Link already exists';
            }

            return errors;
        },

        onSubmit: (values) => {
            addLink(values.source, values.target);
        }
    });

    const queryForm = useFormik({
        initialValues: {
            firstNode: '',
            secondNode: '',
        },
        validateOnBlur: false,
        validateOnChange: false,
        validate: (values) => {
            const errors = {};
            if (values.firstNode === '') {
                errors.firstNode = 'Required';
            }
            if (values.secondNode === '') {
                errors.secondNode = 'Required';
            }
            if (!data.nodes.find(node => node.id === values.firstNode)) {
                errors.firstNode = 'First node does not exist';
            }
            if (!data.nodes.find(node => node.id === values.secondNode)) {
                errors.secondNode = 'Second node does not exist';
            }
            return errors;
        },

        onSubmit: (values) => {
            // preform D separation
            const [paths, isSeparable] = DSeparation(baseNet, values.firstNode, values.secondNode);
            setPaths(paths);
            setIsSeparable(isSeparable);
        }
    });

    const evidenceForm = useFormik({
        
        initialValues: {
            evidence: '',
        },
        
        validateOnBlur: false,
        validateOnChange: false,

        validate: (values) => {
            const errors = {};
            if (values.evidence === '') {
                errors.evidence = 'Required';
            }
            if (!data.nodes.find(node => node.id === values.evidence)) {
                errors.evidence = 'Node does not exist';
            }
            return errors;
        },

        onSubmit: (values) => {
            addOrRemoveEvidence(values.evidence);
        }
    });

    return (
        <GridLines className="grid-area" cellWidth={200} strokeWidth={2} cellWidth2={50}>
            <Grid container sx={{minHeight: '90vh'}} columns={24}>
                {/*graph data section*/}
                <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
                    <GraphFormContainer>
                        {/*add Node button*/}
                        <form onSubmit={addNodeForm.handleSubmit} style={{width: '100%'}}>
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
                        <form onSubmit={addLinkForm.handleSubmit} style={{width: '100%'}}>
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
                        </form>

                        <form onSubmit={evidenceForm.handleSubmit} style={{width: '100%'}}>
                            <FieldForm>
                                <GraphTextField
                                    size={'small'}
                                    label="Evidence"
                                    variant="outlined"
                                    id="evidence"
                                    name="evidence"
                                    value={evidenceForm.values.evidence}
                                    onChange={evidenceForm.handleChange}
                                    error={evidenceForm.touched.evidence && Boolean(evidenceForm.errors.evidence)}
                                    helperText={evidenceForm.touched.evidence && evidenceForm.errors.evidence}
                                    fullWidth/>
                                <GraphButton type="submit" variant="contained" size={'small'} endIcon={<AddIcon/>}>
                                    Add Or Remove Evidence
                                </GraphButton>
                            </FieldForm>
                        </form>

                        <form onSubmit={queryForm.handleSubmit} style={{width: '100%'}}>
                            <FieldForm>
                                <GraphTextField
                                    size={'small'}
                                    label="First Node"
                                    variant="outlined"
                                    id="firstNode"
                                    name="firstNode"
                                    value={queryForm.values.firstNode}
                                    onChange={queryForm.handleChange}
                                    error={queryForm.touched.firstNode && Boolean(queryForm.errors.firstNode)}
                                    helperText={queryForm.touched.firstNode && queryForm.errors.firstNode}
                                    fullWidth/>
                                <GraphTextField
                                    size={'small'}
                                    label="Second Node"
                                    variant="outlined"
                                    id="secondNode"
                                    name="secondNode"
                                    value={queryForm.values.secondNode}
                                    onChange={queryForm.handleChange}
                                    error={queryForm.touched.secondNode && Boolean(queryForm.errors.secondNode)}
                                    helperText={queryForm.touched.secondNode && queryForm.errors.secondNode}
                                    fullWidth/>

                                <GraphButton type="submit" variant="contained" size={'small'}>
                                    Query
                                </GraphButton>

                            </FieldForm>
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
                                return <Container sx={
                                    {
                                        display: 'flex',
                                        marginBottom: '1rem',
                                        justifyContent: 'space-between',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '1px solid #000',
                                        // change mouse cursor to pointer when hovering over the path
                                        '&:hover': {
                                            cursor: 'pointer',
                                        }
                                    }
                                }


                                                  key={index}
                                                  onMouseEnter={
                                                      () => {
                                                          colorLinks(path[0], baseNet);
                                                      }
                                                  }
                                                  onMouseLeave={
                                                      () => {
                                                          setData({
                                                              nodes: data.nodes,
                                                              links: data.links.map((link) => {
                                                                  return {
                                                                      ...link,
                                                                      color: 'black',
                                                                      strokeDasharray: 0,
                                                                      strokeWidth: 1.5
                                                                  };
                                                              })
                                                          })
                                                      }
                                                  }
                                >
                                    <div style={
                                        {
                                            display: 'flex',
                                        }}
                                    >
                                        {/*for loop over each path*/}

                                        {
                                            path[0].slice(0, path[0].length - 1).map((node, index) => {
                                                    return <div style={{display: 'flex'}} key={index}>
                                                        <div>

                                                            {node.id}
                                                        </div>
                                                        <ArrowRightAltIcon color={'info'}/>
                                                    </div>
                                                }
                                            )}
                                        <div>
                                            {path[0][path[0].length - 1].id}
                                        </div>
                                    </div>

                                    <div>
                                        <Typography variant={'body2'} color={'info'} fontWeight={'bolder'}>
                                            {/*if path is active display green circle icon otherwise red icon*/}
                                            {path[1] ? <CircleIcon style={{color: 'green'}}/> :
                                                <CircleIcon style={{color: 'red'}}/>}

                                        </Typography>
                                    </div>


                                </Container>
                            })
                        }
                    </GraphFormContainer>
                </Grid>

                {/*graph visualizer*/}
                <Grid item xs={10} sm={10} md={10} lg={15} xl={15}>
                    <Visualizer data={data}/>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    {/*Star Me in github*/}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GitHubIcon/>}
                    >
                        <a href="https://github.com/Arash1381-y/d-separation"
                           style={{textDecoration: 'none', color: 'white'}}>
                            Star Me</a>
                    </Button>

                </Grid>
            </Grid>
        </GridLines>
    );
}

export default MainPage;