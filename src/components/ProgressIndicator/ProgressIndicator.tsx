/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { settings } from 'carbon-components';
// TODO: import { CheckmarkOutline16 } from '@carbon/icons-react';
import CheckmarkOutline16 from '@carbon/icons-react/lib/checkmark--outline/16';
// TODO: import { Warning16 } from '@carbon/icons-react';
import Warning16 from '@carbon/icons-react/lib/warning/16';
import { componentsX } from '../../internal/FeatureFlags';

const { prefix } = settings;
const defaultRenderLabel = props => <p {...props} />;
export const ProgressStep = ({ ...props }) => {
  const {
    label,
    description,
    className,
    current,
    complete,
    invalid,
    secondaryLabel,
    disabled,
    renderLabel: ProgressStepLabel,
  } = props;

  const classes = classnames({
    [`${prefix}--progress-step`]: true,
    [`${prefix}--progress-step--current`]: current,
    [`${prefix}--progress-step--complete`]: complete,
    [`${prefix}--progress-step--incomplete`]: !complete && !current,
    [`${prefix}--progress-step--disabled`]: disabled,
    [className]: className,
  });

  const currentSvg =
    current &&
    (componentsX ? (
      <svg>
        <path d="M 7, 7 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0" />
      </svg>
    ) : (
      <svg>
        <circle cx="12" cy="12" r="12" />
        <circle cx="12" cy="12" r="6" />
        <title>{description}</title>
      </svg>
    ));

  const completeSvg =
    complete &&
    (componentsX ? (
      <CheckmarkOutline16 aria-label={description} role="img" />
    ) : (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <title>{description}</title>
        <g fillRule="nonzero">
          <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
          <path d="M11.646 5.146l.708.708-5.604 5.603-3.104-3.103.708-.708 2.396 2.397z" />
        </g>
      </svg>
    ));
  const incompleteSvg = (() => {
    if (complete) {
      return null;
    }
    if (componentsX) {
      if (invalid) {
        return <Warning16 className={`${prefix}--progress__warning`} />;
      }
      return (
        <svg>
          <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
        </svg>
      );
    }
    return (
      <svg>
        <title>{description}</title>
        <circle cx="12" cy="12" r="12" />
      </svg>
    );
  })();

  return (
    <li className={classes}>
      {currentSvg || completeSvg || incompleteSvg}
      <ProgressStepLabel className={`${prefix}--progress-label`}>
        {label}
      </ProgressStepLabel>
      {componentsX &&
      secondaryLabel !== null &&
      secondaryLabel !== undefined ? (
        <p className={`${prefix}--progress-optional`}>{secondaryLabel}</p>
      ) : null}
      <span className={`${prefix}--progress-line`} />
    </li>
  );
};

ProgressStep.propTypes = {
  /**
   * Provide the label for the <ProgressStep>
   */
  label: PropTypes.node.isRequired,

  /**
   * Provide an optional className to be applied to the containing <li> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the step is the current step
   */
  current: PropTypes.bool,

  /**
   * Specify whether the step has been completed
   */
  complete: PropTypes.bool,

  /**
   * Provide a description for the <ProgressStep>
   */
  description: PropTypes.string,

  /**
   * Specify whether the step is invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide an optional secondary label
   */
  secondaryLabel: PropTypes.string,

  /*
   * An optional parameter to allow for overflow content to be rendered in a
   * tooltip.
   */
  renderLabel: PropTypes.function,

  /**
   * Provide the props that describe a progress step tooltip
   */
  overflowTooltipProps: PropTypes.object,

  /**
   * Specify whether the step is disabled
   */
  disabled: PropTypes.bool,

  /**
   * The ID of the tooltip content.
   */
  tooltipId: PropTypes.string,
};

ProgressStep.defaultProps = {
  renderLabel: defaultRenderLabel,
};

export default class ProgressIndicator extends Component {
  state = {};

  static propTypes = {
    /**
     * Provide <ProgressStep> components to be rendered in the
     * <ProgressIndicator>
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Optionally specify the current step array index
     */
    currentIndex: PropTypes.number,
  };

  static defaultProps = {
    currentIndex: 0,
  };

  static getDerivedStateFromProps({ currentIndex }, state) {
    const { prevCurrentIndex } = state;
    return prevCurrentIndex === currentIndex
      ? null
      : {
          currentIndex,
          prevCurrentIndex: currentIndex,
        };
  }

  renderSteps = () =>
    React.Children.map(this.props.children, (child, index) => {
      if (index === this.state.currentIndex) {
        return React.cloneElement(child, {
          current: true,
        });
      }
      if (index < this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: true,
        });
      }
      if (index > this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: false,
        });
      }
      return null;
    });

  render() {
    const { className, currentIndex, ...other } = this.props; // eslint-disable-line no-unused-vars
    const classes = classnames({
      [`${prefix}--progress`]: true,
      [className]: className,
    });
    return (
      <ul className={classes} {...other}>
        {this.renderSteps()}
      </ul>
    );
  }
}
