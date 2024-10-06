import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { ApollonMode } from '@ls1intum/apollon';
import { useAppDispatch } from '../../store/hooks';
import { changeEditorMode } from '../../../services/editor-options/editorOptionSlice';

export const ViewMenu = () => {
  const dispatch = useAppDispatch();
  return (
    <NavDropdown id="file-menu-item" title="View" style={{ paddingTop: 0, paddingBottom: 0 }}>
      {Object.keys(ApollonMode).map((mode) => (
        <NavDropdown.Item
          key={mode}
          onClick={() => dispatch(changeEditorMode(ApollonMode[mode as keyof typeof ApollonMode]))}
        >
          {mode}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
