import { FC, useEffect, useState, CSSProperties } from "react";
import Graph, { UsageGraphError } from "graphology";
import { parse } from "graphology-gexf/browser";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  useRegisterEvents,
  useLoadGraph,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

const sigmaStyle = { height: "100vh", width: "100%" };

// Component that load the graph
const LoadGraph = () => {
  const loadGraph = useLoadGraph();
  
  useEffect(() => {
    fetch("http://localhost:8080/v1/nodes/rumors")
    .then((res) => res.json())
    .then((data) => {
      // Parse GEXF string:
      const graph = new Graph();
      graph.addNode("rumors", {label: "rumors"});
      data.effects.forEach((node: string) => {
        if (!graph.hasNode(node))
          graph.addNode(node, {label: node});
        graph.addDirectedEdge("rumors", node);
      });
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "x", Math.random()*500);
        graph.setNodeAttribute(node, "y", Math.random()*500);
        graph.setNodeAttribute(node, "size", 15);
      });
      loadGraph(graph);
    });
  }, [loadGraph]);

  return null;
};

const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
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
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};

// Component that display the graph
export const DisplayGraph = () => {
  return (
    <SigmaContainer style={sigmaStyle}>
      <GraphEvents />
      <LoadGraph />
    </SigmaContainer>
  );
};