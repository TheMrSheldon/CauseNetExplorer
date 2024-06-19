import { useCallback, useEffect, useState, } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useRegisterEvents,
  useLoadGraph,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useWorkerLayoutForce } from "@react-sigma/layout-force";
import { Attributes } from "graphology-types";


const sigmaStyle = { height: "100vh", width: "100%" };

const graph = new Graph();

// Component that load the graph
const LoadGraph = () => {
  // const { start, kill } = useWorkerLayoutForce({ isNodeFixed: (_: string, attr: Attributes) => { return attr.highlighted}, settings: {attraction: 1, repulsion: 0, inertia: 0, gravity: 0, maxMove: 1}});
  const { start, kill } = useWorkerLayoutForce({ isNodeFixed: (_: string, attr: Attributes) => { return attr.highlighted}, settings: {repulsion: 0.001, attraction: 0.0001, inertia: 0.0001, gravity: 0.0001}});
  const loadGraph = useLoadGraph();

  let loadNode = useCallback((node: string) => {
    fetch(`http://localhost:8080/v1/nodes/${node}`)
      .then((res) => res.json())
      .then((data) => {
        if (!graph.hasNode(node))
          graph.addNode(node, {label: node, x: Math.random()*10, y: Math.random()*10, size: 5});

        let i = 0;
        for (let effect of data.effects) {
          if (!graph.hasNode(effect))
            graph.addNode(effect, {label: effect, x: Math.random()*10, y: Math.random()*10, size: 5});
          if (!graph.hasDirectedEdge(node, effect))
            graph.addDirectedEdge(node, effect);
          if (++i > 200)
            break;
        }
        loadGraph(graph);
    });
  }, [loadGraph]);
  
  useEffect(() => {
    loadNode("humor");
    loadNode("death");
    loadNode("research");
    loadNode("accident");
    loadNode("hospital");
    loadNode("injuries");
    loadNode("costs");
    loadNode("amputations");
    loadNode("aids");
    loadGraph(graph);
    start();
    return () => {
      kill();
    };
  }, [start, loadNode, kill, loadGraph]);

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