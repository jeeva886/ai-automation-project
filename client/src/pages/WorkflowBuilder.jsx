import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import './WorkflowBuilder.css';
import { ArrowLeft, Save, Play, RefreshCw, Zap, Database, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialNodes = [
    { id: '1', type: 'input', data: { label: 'Trigger: Checkout' }, position: { x: 250, y: 50 } },
    { id: '2', type: 'default', data: { label: 'Action: Generate Order ID' }, position: { x: 250, y: 150 } },
    { id: '3', type: 'default', data: { label: 'DB: Store Order' }, position: { x: 250, y: 250 } },
    { id: '4', type: 'default', data: { label: 'Action: Generate Invoice' }, position: { x: 250, y: 350 } },
    { id: '5', type: 'output', data: { label: 'Notification: Email' }, position: { x: 250, y: 450 } },
];
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4F46E5' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#4F46E5' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#4F46E5' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#4F46E5' } },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Sidebar = () => {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow-label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="workflow-sidebar card">
            <div className="sidebar-header">
                <h3>System Nodes</h3>
                <p>Drag nodes to canvas</p>
            </div>
            <div className="nodes-list">
                <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input', 'Customer Action: Search')} draggable>
                    <Zap size={16} /> Trigger: Search
                </div>
                <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'default', 'Add to Cart')} draggable>
                    <RefreshCw size={16} /> Action: Add to Cart
                </div>
                <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'default', 'Confirm Checkout')} draggable>
                    <RefreshCw size={16} /> Action: Checkout
                </div>
                <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'default', 'Generate Order ID')} draggable>
                    <RefreshCw size={16} /> Action: Order ID
                </div>
                <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'default', 'Generate Invoice')} draggable>
                    <RefreshCw size={16} /> Action: Invoice
                </div>
                <div className="dndnode db" onDragStart={(event) => onDragStart(event, 'default', 'Store in Database')} draggable>
                    <Database size={16} /> DB: Store Order
                </div>
                <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output', 'Send Email Notification')} draggable>
                    <Mail size={16} /> Notification: Email
                </div>
            </div>
        </aside>
    );
};

export default function WorkflowBuilder() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const navigate = useNavigate();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow-label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${label}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    return (
        <div className="workflow-builder-page fade-in">
            <div className="workflow-topbar">
                <button className="btn-outline font-bold" onClick={() => navigate('/owner-dashboard')}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2 className="workflow-title text-primary"><Zap size={24} /> Automation Builder (n8n Clone)</h2>
                <div className="workflow-actions">
                    <button className="btn-outline text-secondary"><Play size={18} /> Test Flow</button>
                    <button className="btn-primary"><Save size={18} /> Save</button>
                </div>
            </div>

            <div className="workflow-dnd-container" ref={reactFlowWrapper}>
                <Sidebar />
                <ReactFlowProvider>
                    <div className="reactflow-wrapper">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                            attributionPosition="bottom-left"
                        >
                            <Controls />
                            <Background color="#ccc" gap={16} />
                            <MiniMap nodeColor={(n) => {
                                if (n.type === 'input') return '#4F46E5';
                                if (n.type === 'output') return '#10B981';
                                return '#F59E0B';
                            }} />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
