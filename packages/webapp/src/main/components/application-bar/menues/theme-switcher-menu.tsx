import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { ModalRepository } from '../../../services/modal/modal-repository';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { switchTheme } from '../../../utils/theme-switcher';

type OwnProps = {};

type State = { show: boolean };

type StateProps = {};

type DispatchProps = {
    openModal: typeof ModalRepository.showModal;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {
    openModal: ModalRepository.showModal,
});

class ThemeSwitcherMenuComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('click', this.hideMenu);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideMenu);
    }

    showMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        this.setState({ show: true });
        event.stopPropagation();
    };

    hideMenu = (event: MouseEvent) => {
        this.setState({ show: false });
        event.stopPropagation();
    };

    render() {
        return (
            <>
                <NavDropdown
                    id="file-menu-item"
                    title="Theme Switcher"
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                    onClick={this.showMenu}
                >
                    <a className="dropdown-item" onClick={() => { switchTheme('light'); }}>
                        Light Mode
                    </a>
                    <a className="dropdown-item" onClick={() => { switchTheme('dark'); }}>
                        Dark Mode
                    </a>
                </NavDropdown>
            </>
        );
    }
}

export const ThemeSwitcherMenu = enhance(ThemeSwitcherMenuComponent);
