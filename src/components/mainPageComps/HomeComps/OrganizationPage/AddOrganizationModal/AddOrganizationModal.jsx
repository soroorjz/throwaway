import React, { useState } from "react";
import Tree from "react-d3-tree";
import { FaBuilding, FaPlus, FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "./AddOrganizationModal.scss";

const AddOrganizationModal = ({ isOpen, onClose, onAdd }) => {
  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  const initialTreeState = {
    id: generateId(),
    name: "",
    image: null,
    subCount: 0,
    activities: [],
    children: [],
  };

  const [tree, setTree] = useState(initialTreeState);

  if (!isOpen) return null;

  // افزودن فرزند به یک گره
  const addChild = (parentId, newChild) => {
    const updateNode = (node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newChild],
        };
      }
      return {
        ...node,
        children: node.children.map(updateNode),
      };
    };
    setTree(updateNode(tree));
  };

  // حذف گره
  const removeNode = (nodeId) => {
    const updateNode = (node) => {
      if (node.id === nodeId) return null;
      return {
        ...node,
        children: node.children
          .map(updateNode)
          .filter((child) => child !== null),
      };
    };
    const updatedTree = updateNode(tree);
    if (updatedTree) setTree(updatedTree);
  };

  // به‌روزرسانی نام گره
  const updateNode = (nodeId, field, value) => {
    const updateNode = (node) => {
      if (node.id === nodeId) {
        return { ...node, [field]: value };
      }
      return {
        ...node,
        children: node.children.map(updateNode),
      };
    };
    setTree(updateNode(tree));
  };

  // رندر گره‌های سفارشی
  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g>
      <foreignObject x="-100" y="-50" width="200" height="140">
        <div className="add-org-modal__node">
          <div className="add-org-modal__node-content">
            <FaBuilding className="add-org-modal__node-icon" />
            <input
              type="text"
              value={nodeDatum.name}
              onChange={(e) => updateNode(nodeDatum.id, "name", e.target.value)}
              placeholder="نام دستگاه"
              className="add-org-modal__node-input"
            />
            <div className="add-org-modal__node-actions">
              <button
                onClick={() =>
                  addChild(nodeDatum.id, {
                    id: generateId(),
                    name: "",
                    image: null,
                    subCount: 0,
                    activities: [],
                    children: [],
                  })
                }
                className="add-org-modal__node-action"
                title="افزودن دستگاه تابعه"
              >
                <FaPlus />
              </button>
              {nodeDatum.id !== tree.id && (
                <button
                  onClick={() => removeNode(nodeDatum.id)}
                  className="add-org-modal__node-action add-org-modal__node-action--delete"
                  title="حذف دستگاه"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
          <Tooltip id={`tooltip-${nodeDatum.id}`} />
        </div>
      </foreignObject>
    </g>
  );

  // تبدیل درخت به فرمت data
  const flattenTree = (node, parentId = null) => {
    const result = [
      {
        id: node.id,
        name: node.name,
        parent: parentId,
        ExecutiveBodyId: node.id,
        image: node.image || null,
        subCount: node.subCount || 0,
        activities: node.activities || [],
      },
    ];
    node.children.forEach((child) => {
      result.push(...flattenTree(child, node.id));
    });
    return result;
  };

  // تأیید و افزودن
  const handleSubmit = () => {
    if (!tree.name.trim()) {
      alert("نام دستگاه اصلی الزامی است!");
      return;
    }
    const flattenedData = flattenTree(tree).filter((item) => item.name.trim());
    if (flattenedData.length === 0) {
      alert("حداقل یک دستگاه با نام معتبر باید اضافه شود!");
      return;
    }
    onAdd(flattenedData);
    setTree(initialTreeState); // ریست کردن tree به حالت اولیه
    onClose();
  };

  // بستن مودال با ریست کردن tree
  const handleClose = () => {
    setTree(initialTreeState); // ریست کردن tree هنگام بستن
    onClose();
  };

  return (
    <div className="add-org-modal-overlay">
      <div className="add-org-modal">
        <div className="add-org-modal-content">
          <h2>افزودن دستگاه جدید</h2>
          <div className="add-org-modal__tree">
            <Tree
              data={tree}
              renderCustomNodeElement={renderCustomNodeElement}
              orientation="vertical"
              pathFunc="diagonal"
              translate={{ x: 300, y: 100 }}
              nodeSize={{ x: 220, y: 140 }}
              separation={{ siblings: 1.2, nonSiblings: 1.8 }}
              zoomable={true}
              draggable={true}
            />
          </div>
          <div className="add-org-modal-actions">
            <button onClick={handleSubmit}>تأیید</button>
            <button onClick={handleClose}>لغو</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizationModal;
