import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { toggleTheme } from '../../../utils/theme-switcher';
import { localStorageThemePreference } from '../../../constant';

type OwnProps = {};

type State = { isDarkMode: boolean };

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {});

class ThemeSwitcherMenuComponent extends Component<Props, State> {

    componentDidMount() {
        this.updateState();
    }

    updateTheme = () => {
        toggleTheme();
        this.updateState();
    };

    updateState = () => {
        this.setState({ isDarkMode: window.localStorage.getItem(localStorageThemePreference) === 'DARK' ? true : false });
    }


    render() {
        return (
            <>
                <div onClick={() => { this.updateTheme(); }}>
                    <div className={'theme-toggle' + (this.state && this.state.isDarkMode ? ' dark' : '')} id="theme-toggle">
                        <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                            <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="#AEB1B5" />
                            <g className="sun-beams" stroke="#AEB1B5">
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </g>
                            <mask className="moon" id="moon-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                <circle cx="24" cy="10" r="6" fill="black" />
                            </mask>
                        </svg>
                    </div>
                </div>
            </>
        );
    }
}

export const ThemeSwitcherMenu = enhance(ThemeSwitcherMenuComponent);
