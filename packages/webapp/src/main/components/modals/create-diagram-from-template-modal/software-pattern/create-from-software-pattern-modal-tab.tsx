import React, { Component } from 'react';
import { ListGroup, Tab, Tabs } from 'react-bootstrap';
import { SoftwarePatternCategory, SoftwarePatternTemplate, SoftwarePatternType } from './software-pattern-types';
import { Template } from '../template-types';
import { TemplateFactory } from '../template-factory';

type Props = {
  selectedTemplate: SoftwarePatternTemplate;
  selectTemplate: (template: Template) => void;
};
type State = {
  selectedPatternCategory: SoftwarePatternCategory;
};

const getInitialState = (): State => {
  return {
    selectedPatternCategory: SoftwarePatternCategory.STRUCTURAL,
  };
};

function patternTabComponentForCategory(
  softwarePatternTemplates: SoftwarePatternTemplate[],
  category: SoftwarePatternCategory,
  selectedPattern: SoftwarePatternTemplate,
  selectPattern: (pattern: SoftwarePatternTemplate) => void,
) {
  // BEHAVIORAL, STRUCTURAL, CREATIONAL
  const categoryPatterns = softwarePatternTemplates.filter(
    (patternTemplate) => patternTemplate.softwarePatternCategory === category,
  );
  return (
    <Tab eventKey={category} title={category} tabClassName="ps-2 pe-2" className="mt-1">
      <ListGroup id="diagram-type-list">
        {categoryPatterns.map((softwarePattern, index, array) => (
          <ListGroup.Item
            key={softwarePattern.type}
            action
            onClick={(event: any) => selectPattern(softwarePattern)}
            active={selectedPattern ? selectedPattern.type === softwarePattern.type : false}
          >
            {softwarePattern.type}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Tab>
  );
}

export class CreateFromSoftwarePatternModalTab extends Component<Props, State> {
  state = getInitialState();

  selectPattern = (pattern: SoftwarePatternTemplate) => {
    this.props.selectTemplate(pattern);
  };

  selectPatternCategory = (patternCategory: SoftwarePatternCategory) => {
    const newState: State = { ...this.state, selectedPatternCategory: patternCategory };
    this.setState(newState);
  };

  render() {
    const allPatterns = Object.values(SoftwarePatternType).map((pattern) =>
      TemplateFactory.createSoftwarePattern(pattern),
    );

    return (
      <>
        <Tabs
          className="flex-row"
          activeKey={this.state.selectedPatternCategory}
          onSelect={(patternCategory) => this.selectPatternCategory(patternCategory as SoftwarePatternCategory)}
        >
          {patternTabComponentForCategory(
            allPatterns,
            SoftwarePatternCategory.STRUCTURAL,
            this.props.selectedTemplate,
            this.selectPattern,
          )}
          {patternTabComponentForCategory(
            allPatterns,
            SoftwarePatternCategory.BEHAVIORAL,
            this.props.selectedTemplate,
            this.selectPattern,
          )}
          {patternTabComponentForCategory(
            allPatterns,
            SoftwarePatternCategory.CREATIONAL,
            this.props.selectedTemplate,
            this.selectPattern,
          )}
        </Tabs>
      </>
    );
  }
}
