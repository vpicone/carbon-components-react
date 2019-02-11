/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';

const { prefix } = settings;

const Toggle = ({
  className,
  defaultToggled,
  toggled,
  onChange,
  onToggle,
  id,
  labelText,
  labelA,
  labelB,
  ...other
}) => {
  let input;
  const wrapperClasses = classNames({
    [`${prefix}--form-item`]: true,
    [className]: className,
  });

  const checkedProps = {};

  if (typeof toggled !== 'undefined') {
    checkedProps.checked = toggled;
  } else {
    checkedProps.defaultChecked = defaultToggled;
  }

  const ToggleBody = () => (
    <div className={wrapperClasses}>
      <input
        {...other}
        {...checkedProps}
        type="checkbox"
        id={id}
        className={`${prefix}--toggle`}
        onChange={evt => {
          onChange && onChange(evt);
          onToggle(input.checked, id, evt);
        }}
        ref={el => {
          input = el;
        }}
      />

      <label className={`${prefix}--toggle__label`} htmlFor={id}>
        <span className={`${prefix}--toggle__text--left`}>{labelA}</span>
        <span className={`${prefix}--toggle__appearance`} />
        <span className={`${prefix}--toggle__text--right`}>{labelB}</span>
      </label>
    </div>
  );

  return labelText ? (
    <fieldset className={`${prefix}--fieldset`}>
      <legend className={`${prefix}--label`}>{labelText}</legend>
      <ToggleBody />
    </fieldset>
  ) : (
    <ToggleBody />
  );
};

Toggle.propTypes = {
  /**
   * Specify a custom className to apply to the form-item node
   */
  className: PropTypes.string,

  /**
   * Specify whether the toggle should be on by default
   */
  defaultToggled: PropTypes.bool,

  /**
   * Provide an optional hook that is called when the control is toggled
   */
  onToggle: PropTypes.func,

  /**
   * Provide an id that unique represents the underlying <input>
   */
  id: PropTypes.string.isRequired,

  /**
   * Specify whether the control is toggled
   */
  toggled: PropTypes.bool,

  /**
   * Specify the label for the "off" position
   */
  labelA: PropTypes.string.isRequired,

  /**
   * Specify the label for the "on" position
   */
  labelB: PropTypes.string.isRequired,
};

Toggle.defaultProps = {
  defaultToggled: false,
  label: '',
  labelA: 'Off',
  labelB: 'On',
  onToggle: () => {},
};

export default Toggle;
