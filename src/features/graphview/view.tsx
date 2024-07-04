import { useCallback, useEffect, useState } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useRegisterEvents,
  useSigma,
  ControlsContainer, ZoomControl, FullScreenControl,
  SearchControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import SideBar from "../../components/sidebar";
import { Box, Typography, useTheme } from "@mui/material";


import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Fullscreen, FullscreenExit, PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import { EdgeArrowProgram } from "sigma/rendering";
import EdgeInfo from "../../components/edgeinfo";

interface GraphEventsProps {
  selectedEdge: [string, string] | null,
	onEdgeSelectionChanged: (edge: [string, string] | null) => void
};

const GraphEvents: React.FC<GraphEventsProps> = (props: GraphEventsProps) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  // const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "fixed", true);
        setSelectedNode(e.node);
      },
      clickEdge: (e) => {
        let source = sigma.getGraph().getSourceAttribute(e.edge, "label");
        let target = sigma.getGraph().getTargetAttribute(e.edge, "label");
        props.onEdgeSelectionChanged([source, target]);
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return;
        // Get new position of node
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "fixed");
        }
      },
    });
  }, [registerEvents, sigma, draggedNode, selectedNode, props]);

  return null;
};

// Component that display the graph
export const DisplayGraph = () => {
  const [selectedEdge, setSelectedEdge] = useState<[string, string] | null>(null);
  const [graph, setGraph] = useState<Graph>(new Graph());
  const theme = useTheme();

  const sigmaStyle = { flexGrow: 1, height: "100vh", width: "100%", backgroundColor: theme.palette.background.paper, color: "white" };

  let loadNode = useCallback((node: string) => {
    fetch(`http://localhost:8080/v1/nodes/${node}`)
      .then((res) => res.json())
      .then((data) => {
        const x = Math.random()*10
        const y = Math.random()*10
        if (!graph.hasNode(node))
          graph.addNode(node, {label: node, x: x, y: y, size: 5});

        let i = 0;
        for (let effect of data.effects) {
          if (!graph.hasNode(effect))
            graph.addNode(effect, {label: effect, x: Math.random()-0.5+x, y: Math.random()-0.5+y, size: 5});
          if (!graph.hasDirectedEdge(node, effect))
            graph.addDirectedEdge(node, effect, {size: 2});
          if (++i > 1000)
            break;
        }
    });
  }, [graph]);

  return (
    <Box>
      <Box id="container" width="100vw" minHeight="100vh" sx={{ display: 'flex', flexFlow: 'row' }}>
        <SigmaContainer style={sigmaStyle} settings={{defaultEdgeType: "straight",
      edgeProgramClasses: {
        straight: EdgeArrowProgram
      }, enableEdgeEvents: true,
        defaultNodeColor: theme.palette.primary.main,
        defaultEdgeColor: theme.palette.grey[500]
      }} graph={graph}>
          <GraphEvents selectedEdge={selectedEdge} onEdgeSelectionChanged={setSelectedEdge}/>
          <ControlsContainer position={"bottom-right"}>
          <ZoomControl labels={{ zoomIn: "Zoom In", zoomOut: "Zoom Out", reset: "Reset Zoom" }}>
            <ZoomInIcon />
            <ZoomOutIcon />
            <FilterCenterFocusIcon />
          </ZoomControl>
          <FullScreenControl labels={{ enter: "Enter Fullscreen", exit: "Exit Fullscreen" }}>
            <Fullscreen />
            <FullscreenExit />
          </FullScreenControl>
          <LayoutForceAtlas2Control labels={{ stop: "Stop", start: "Start" }} autoRunFor={0.01} settings={{settings: {slowDown: 5}}}>
            <PlayCircleOutline />
            <PauseCircleOutline />
          </LayoutForceAtlas2Control>
          </ControlsContainer>
          <ControlsContainer position={"top-right"}>
            <SearchControl style={{ width: "200px" }} />
          </ControlsContainer>
        </SigmaContainer>
        <SideBar open={true} onClose={() => {}} onSearch={(str: string) => { return null; }} addNodeAction={(node: string) => {loadNode(node);}}>
          <Box>
            <Typography variant="h5">Information</Typography>
            <EdgeInfo edge={selectedEdge}/>
          </Box>
        </SideBar>
      </Box>
    </Box>
  );
};