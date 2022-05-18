import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { setTheme, toggleTheme } from '../../../utils/theme-switcher';
import { LocalStorageRepository } from '../../../../main/services/local-storage/local-storage-repository';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// @ts-ignore
import ThemeSwitcherIcon from '../../../../../assets/theme-switcher.svg';

type OwnProps = {};

type State = { isDarkMode: boolean; showTooltip: boolean; overrideUserThemePreference: boolean };

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {});

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
          delay={{ show: 0, hide: 0 }}
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
              <ThemeSwitcherIcon />
            </div>
          </div>
        </OverlayTrigger>
      </>
    );
  }
}

export const ThemeSwitcherMenu = enhance(ThemeSwitcherMenuComponent);
