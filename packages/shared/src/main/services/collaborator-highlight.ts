import { UMLElement } from '@ls1intum/apollon';
import { Collaborator } from '../collaborator-dto';

export type UMLElementSelectorType = {
  elementId: string;
  name: string;
  color: string;
};

export const updateSelectedByArray = (
  selElemIds: string[],
  elements: UMLElement[],
  collaborationName: string,
  collaborationColor: string,
) => {
  return elements?.map((x: UMLElement) => {
    const currObj = { elementId: x.id, name: collaborationName, color: collaborationColor };

    let updatedSelectedBy = x.selectedBy;
    if (selElemIds.includes(x.id)) {
      // Case for Select
      if (!x.selectedBy) {
        updatedSelectedBy = [currObj];
      } else if (x.selectedBy && !isInSelectedByArray(x.selectedBy, currObj)) {
        updatedSelectedBy = appendCurrentObject(x.selectedBy!, currObj);
      }
    } else {
      // Case for Deselect
      if (x.selectedBy && isInSelectedByArray(x.selectedBy, currObj)) {
        updatedSelectedBy = removeCurrentObject(x.selectedBy!, currObj);
      }
    }
    return { ...x, selectedBy: updatedSelectedBy };
  });
};

export const isInSelectedByArray = (selectedByList: any[], currObj: UMLElementSelectorType) => {
  const filteredSelectedByList = selectedByList.filter(
    (e: UMLElementSelectorType) =>
      e.elementId === currObj.elementId && e.name === currObj.name && e.color === currObj.color,
  );
  return filteredSelectedByList.length > 0 ? true : false;
};

export const appendCurrentObject = (
  prevSelectedBy: UMLElementSelectorType[],
  currentObj: UMLElementSelectorType,
): UMLElementSelectorType[] => {
  if (prevSelectedBy) {
    prevSelectedBy.push(currentObj);
    return prevSelectedBy;
  } else {
    return [currentObj];
  }
};

export const removeCurrentObject = (prevSelectedBy: UMLElementSelectorType[], currentObj: UMLElementSelectorType) => {
  const updatedSelectedBy = prevSelectedBy.filter((e) => {
    return e.elementId === currentObj.elementId && e.name !== currentObj.name && e.color !== currentObj.color;
  });
  return updatedSelectedBy;
};

export const removeDisconnectedCollaborator = (collaborator: Collaborator, elements: any) => {
  return elements?.map((x: UMLElement) => {
    let updatedSelectedBy = x.selectedBy;
    if (x.selectedBy) {
      updatedSelectedBy = x.selectedBy.filter((e: { name: string; color: string }) => {
        return e.name !== collaborator.name && e.color !== collaborator.color;
      });
    }
    return { ...x, selectedBy: updatedSelectedBy };
  });
};
