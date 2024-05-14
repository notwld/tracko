import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';

const ItemType = {
    ITEM: 'item'
};

const DraggableItem = ({ item, type, moveItem }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemType.ITEM,
        item: { ...item, type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`Dropping ${item.product_backlog_id} from ${item.type} to ${dropResult.to}`);
                moveItem(item.product_backlog_id, item.type, dropResult.to);
            }
        },
    }));

    return (
        <div ref={drag} className="card m-2 shadow-sm" style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}>
            <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
            </div>
        </div>
    );
};

const DropZone = ({ children, type }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemType.ITEM,
        drop: () => ({ to: type }),
    }));

    return (
        <div ref={drop} className="drop-zone p-3" style={{ minHeight: '200px', backgroundColor: '#f8f9fa', border: 'dashed 2px #ccc' }}>
            {children.length > 0 ? children : <p className="text-center text-muted">Drag items here</p>}
        </div>
    );
};

const Sprint = ({ initialBacklogs,onClose }) => {
    const [sprintItems, setSprintItems] = useState([]);
    const [backlogs, setBacklogs] = useState([]);

    useEffect(() => {
        setBacklogs(initialBacklogs);
        console.log('Initial backlogs set:', initialBacklogs);
    }, [initialBacklogs]);

    const moveItem = (id, from, to) => {
        if (from === to) {
            console.log('No movement needed since source and destination are the same.');
            return;
        }

        if (to === 'sprint') {
            const item = backlogs.find(item => item.product_backlog_id === id);
            setSprintItems((prev) => [...prev, item]);
            setBacklogs((prev) => prev.filter(item => item.product_backlog_id !== id));
        } else if (to === 'backlog') {
            const item = sprintItems.find(item => item.product_backlog_id === id);
            setBacklogs((prev) => [...prev, item]);
            setSprintItems((prev) => prev.filter(item => item.product_backlog_id !== id));
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sprint Planning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>onClose()}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <h4>Sprint</h4>
                                    <DropZone type="sprint">
                                        {sprintItems.map((item) => (
                                            <DraggableItem key={item.product_backlog_id} item={item} type="sprint" moveItem={moveItem} />
                                        ))}
                                    </DropZone>
                                </div>
                                <div className="col-6">
                                    <h4>Backlogs</h4>
                                    <DropZone type="backlog">
                                        {backlogs.map((item) => (
                                            <DraggableItem key={item.product_backlog_id} item={item} type="backlog" moveItem={moveItem} />
                                        ))}
                                    </DropZone>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>onClose()}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Sprint;
