import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { setTheme, toggleTheme } from '../../../utils/theme-switcher';
import { LocalStorageRepository } from '../../../../main/services/local-storage/local-storage-repository';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type OwnProps = {};

type State = { isDarkMode: boolean; showTooltip: boolean; overrideUserThemePreference: boolean };

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
    const systemTheme = LocalStorageRepository.getSystemThemePreference();
    const preferredTheme = LocalStorageRepository.getUserThemePreference();
    return (preferredTheme || systemTheme) === 'dark';
  };

  updateState = () => {
    this.setState({
      isDarkMode: this.isDarkMode(),
      overrideUserThemePreference: LocalStorageRepository.getUserThemePreference() ? false : true,
    });
  };

  getSystemTheme = (): string => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  handleInputChange = () => {
    if (!this.state.overrideUserThemePreference) {
      LocalStorageRepository.setSystemThemePreference(this.getSystemTheme());
      LocalStorageRepository.removeUserThemePreference();
      setTheme(this.getSystemTheme());
      this.updateState();
    } else {
      this.setState({ overrideUserThemePreference: false });
      LocalStorageRepository.setUserThemePreference(this.getSystemTheme());
    }
  };

  onToggle = () => {
    if (!this.state.showTooltip) {
      this.setState({ showTooltip: true });
    } else {
      if (this.isPopoverHovered()) {
        this.setState({ showTooltip: true });
        setTimeout(() => {
          this.onToggle();
        }, 500);
      } else {
        this.setState({ showTooltip: false });
      }
    }
  };

  isPopoverHovered = () => {
    const elem = document.getElementById('tooltip-bottom');
    if (elem?.parentElement?.querySelector(':hover') === elem) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <>
        <OverlayTrigger
          key="bottom"
          placement="bottom-start"
          show={this.state && this.state.showTooltip}
          onToggle={() => {
            this.onToggle();
          }}
          delay={{ show: 0, hide: 1500 }}
          overlay={
            <Tooltip id="tooltip-bottom">
              <div className="popover-content" id="theme-switch-popover-content">
                <div className="head">
                  ☾ <span>Dark Mode</span> ☾
                </div>
                <div className="experimental">EXPERIMENTAL</div>
                <div className="switch-box">
                  Sync with Operating System
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={this.state && this.state.overrideUserThemePreference}
                      onChange={this.handleInputChange}
                    />
                    <span className="slider round" />
                  </label>
                </div>

                {this.isDarkMode() && (
                  <div className="description">
                    <span>
                      You can click this icon at any time to disable the dark mode if you experience problems.
                    </span>
                  </div>
                )}
                {!this.isDarkMode() && (
                  <div className="description">
                    <span>Try the dark mode and relieve your eyes.</span>
                  </div>
                )}
              </div>
            </Tooltip>
          }
        >
          <div
            onClick={() => {
              this.updateTheme();
            }}
          >
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
