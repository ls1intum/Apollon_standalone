import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { setTheme, toggleTheme } from '../../../utils/theme-switcher';
import { localStorageSystemTheme, localStorageThemePreference } from '../../../constant';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type OwnProps = {};

type State = { isDarkMode: boolean, showTooltip: boolean, overrideUserThemePreference: boolean };

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {});

const themeSwitcherIcon = (
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
);



class ThemeSwitcherMenuComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    componentDidMount() {
        this.updateState();
    }

    updateTheme = () => {
        toggleTheme();
        this.updateState();
    };

    isDarkMode = () => {
        const systemTheme = window.localStorage.getItem(localStorageSystemTheme);
        const preferredTheme = window.localStorage.getItem(localStorageThemePreference);
        if (preferredTheme) {
            if (preferredTheme === 'DARK') return true;
        } else {
            if (systemTheme === 'DARK') return true;
        }
        return false;
    }

    updateState = () => {
        this.setState({
            isDarkMode: this.isDarkMode(),
            showTooltip: false,
            overrideUserThemePreference: window.localStorage.getItem(localStorageThemePreference) ? false : true
        });
    };

    getSystemTheme = (): string => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'DARK';
        } else {
            return 'LIGHT';
        }
    }

    handleInputChange = () => {
        if (!this.state.overrideUserThemePreference) {
            window.localStorage.setItem(localStorageSystemTheme, this.getSystemTheme());
            window.localStorage.removeItem(localStorageThemePreference);
            setTheme(this.getSystemTheme().toLowerCase());
            this.updateState();
        } else {
            this.updateState();
        }
    }


    render() {
        return (
            <>
                <OverlayTrigger
                    key="bottom"
                    placement="bottom-start"
                    delay={{ show: 250, hide: 200000000 }}
                    rootCloseEvent="click"
                    overlay={
                        <Tooltip id="tooltip-bottom">
                            <div className="popover-content" id="theme-switch-popover-content">
                                <div className="head">☾ <span>Dark Mode</span> ☾</div>
                                <div className="experimental">EXPERIMENTAL</div>
                                <div className="switch-box">
                                    {/* <div><fa-icon [icon]="faSync"></fa-icon> {{ 'artemisApp.theme.sync' | artemisTranslate }}</div> */}
                                    Sync with Operating System
                                    <input
                                        type="checkbox"
                                        checked={this.state && this.state.overrideUserThemePreference}
                                        onChange={this.handleInputChange} />
                                </div>

                                <div className="description">
                                    <span>You can click this icon at any time to disable the dark mode if you experience problems.</span>
                                </div>
                            </div >
                        </Tooltip>


                    }







                >

                    <div onClick={() => { this.updateTheme(); }}>
                        <div className={'theme-toggle' + (this.state && this.state.isDarkMode ? ' dark' : '')} id="theme-toggle">
                            {themeSwitcherIcon}
                        </div>
                    </div>

                </OverlayTrigger>
            </>
        );
    }
}

export const ThemeSwitcherMenu = enhance(ThemeSwitcherMenuComponent);
