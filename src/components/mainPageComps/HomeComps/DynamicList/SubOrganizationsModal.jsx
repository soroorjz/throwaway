import React, { useState } from "react";
import Tree from "react-d3-tree";
import { FaBuilding, FaPlus, FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "./SubOrganizationsModal.scss";

const SubOrganizationsModal = ({
  isOpen,
  onClose,
  subOrganizations,
  setSubOrganizations,
  allData,
  setAllData,
  parentId,
  title,
  isEditMode = false,
}) => {
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const [tree, setTree] = useState({
    id: parentId,
    name: title,
    image: null,
    subCount: subOrganizations.length,
    activities: [],
    children: subOrganizations,
  });

  if (!isOpen) return null;

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

  const removeNode = (nodeId) => {
    const updateNode = (node) => {
      if (node.id === nodeId) return null;
      return {
        ...node,
        children: node.children.map(updateNode).filter((child) => child !== null),
      };
    };
    const updatedTree = updateNode(tree);
    if (updatedTree) setTree(updatedTree);
  };

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

  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g>
      <foreignObject x="-100" y="-50" width="200" height="140">
        <div className="sub-org-modal__node">
          <div className="sub-org-modal__node-content">
            <FaBuilding className="sub-org-modal__node-icon" />
            {isEditMode ? (
              <>
                <input
                  type="text"
                  value={nodeDatum.name}
                  onChange={(e) => updateNode(nodeDatum.id, "name", e.target.value)}
                  placeholder="نام دستگاه"
                  className="sub-org-modal__node-input"
                />
                <div className="sub-org-modal__node-actions">
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
                    className="sub-org-modal__node-action"
                    title="افزودن دستگاه تابعه"
                  >
                    <FaPlus />
                  </button>
                  {nodeDatum.id !== parentId && (
                    <button
                      onClick={() => removeNode(nodeDatum.id)}
                      className="sub-org-modal__node-action sub-org-modal__node-action--delete"
                      title="حذف دستگاه"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <span
                className="sub-org-modal__node-name"
                data-tooltip-id={`tooltip-${nodeDatum.id}`}
                data-tooltip-content={nodeDatum.fullName || nodeDatum.name}
              >
                {nodeDatum.name}
              </span>
            )}
          </div>
          <Tooltip id={`tooltip-${nodeDatum.id}`} />
        </div>
      </foreignObject>
    </g>
  );

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

  const handleSave = () => {
    const flattenedData = flattenTree(tree).filter((item) => item.name.trim());
    if (!flattenedData.some((item) => item.id === parentId)) {
      alert("نام دستگاه اصلی الزامی است!");
      return;
    }

    const deleteOrgAndChildren = (orgId) => {
      const orgsToDelete = [orgId];
      allData.forEach((item) => {
        if (item.parent === orgId) {
          orgsToDelete.push(...deleteOrgAndChildren(item.id));
        }
      });
      return orgsToDelete;
    };
    const orgsToDelete = deleteOrgAndChildren(parentId);
    const updatedData = allData.filter((item) => !orgsToDelete.includes(item.id));

    setAllData([...updatedData, ...flattenedData]);
    localStorage.setItem(title, JSON.stringify([...updatedData, ...flattenedData]));
    setSubOrganizations(tree.children);
    onClose();
  };

  return (
    <div className="sub-org-modal-overlay">
      <div className="sub-org-modal">
        <div className="sub-org-modal-content">
          <h2>{title}</h2>
          <div className="sub-org-modal__tree">
            <Tree
              data={tree}
              renderCustomNodeElement={renderCustomNodeElement}
              orientation="vertical"
              pathFunc="diagonal"
              translate={{ x: 400, y: 100 }}
              nodeSize={{ x: 220, y: 140 }}
              separation={{ siblings: 1.2, nonSiblings: 1.8 }}
              zoomable={true}
              draggable={true}
              initialZoom={0.7}
            />
          </div>
          <div className="sub-org-modal-actions">
            {isEditMode && (
              <button onClick={handleSave} className="sub-org-modal-save">
                ذخیره
              </button>
            )}
            <button onClick={onClose} className="sub-org-modal-close">
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubOrganizationsModal;