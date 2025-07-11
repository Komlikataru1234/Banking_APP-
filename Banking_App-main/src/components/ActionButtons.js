import React from "react";

export const ActionButtons = (props) => {
  const { setEditingUser, index, setEditModal, setDeleteUser } = props;

  return (
    <div id="actions">
      <ActionButton 
        icon="bx bx-edit" 
        text="Edit" 
        index={index} 
        actionType="edit"
        setEditingUser={setEditingUser} 
        setEditModal={setEditModal} 
      />

      <ActionButton 
        icon="bx bxs-x-square"  
        index={index} 
        actionType="delete"
        text="Delete" 
        setDeleteUser={setDeleteUser} 
      />
    </div>
  );
};

export const ActionButton = (props) => {
  const { icon, text, actionType, setEditingUser, index, setEditModal, setDeleteUser } = props;

  const click = (e, index) => {
    e.preventDefault();

    if (actionType === 'edit') {
      setEditingUser(index);
      setEditModal(true);
    }

    if (actionType === 'delete') {
      setDeleteUser(index);
    }
  };

  return (
    <button onClick={(e) => click(e, index)}>
      <i className={icon}></i> {text}
    </button>
  );
};
