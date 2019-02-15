/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import PropTypes from 'prop-types';
import React, { LegacyRef } from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { ButtonTypes } from '../../prop-types/types';
import { componentsX } from '../../internal/FeatureFlags';

const { prefix } = settings;

type ButtonType = 'button' | 'reset' | 'submit';

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  small?: boolean;
  kind: any;
  href?: string;
  tabIndex?: number;
  type?: ButtonType;
  role?: string;
  inputref?: LegacyRef<HTMLButtonElement & HTMLAnchorElement>;
  children?: React.ReactNode;
  icon?:
    | {
        width?: string;
        height?: string;
        viewBox: string;
        svgData: object;
      }
    | string
    | React.ReactNode;
  iconDescription?: any;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  small,
  kind,
  href,
  tabIndex,
  type,
  icon,
  iconDescription,
  inputref,
  ...other
}) => {
  const buttonClasses = classNames(className, {
    [`${prefix}--btn`]: true,
    [`${prefix}--btn--sm`]: small,
    [`${prefix}--btn--primary`]: kind === 'primary',
    [`${prefix}--btn--danger`]: kind === 'danger',
    [`${prefix}--btn--secondary`]: kind === 'secondary',
    [`${prefix}--btn--ghost`]: kind === 'ghost',
    [`${prefix}--btn--danger--primary`]: kind === 'danger--primary',
    [`${prefix}--btn--tertiary`]: kind === 'tertiary',
  });
  const commonProps = {
    tabIndex,
    className: buttonClasses,
  };
  const buttonImage = (() => {
    if (componentsX && icon && React.isValidElement(icon)) {
      return icon;
    }
    if (!componentsX && icon) {
      return (
        <Icon
          icon={Object(icon) === icon ? icon : undefined}
          name={Object(icon) !== icon ? icon : undefined}
          description={iconDescription}
          className={`${prefix}--btn__icon`}
          aria-hidden="true"
        />
      );
    }
    return null;
  })();
  const button = (
    <button
      {...other}
      {...commonProps}
      disabled={disabled}
      type={type}
      ref={inputref}>
      {children}
      {buttonImage}
    </button>
  );

  const anchor = (
    <a {...other} {...commonProps} href={href} role="button" ref={inputref}>
      {children}
      {buttonImage}
    </a>
  );
  return href ? anchor : button;
};

Button.propTypes = {
  /**
   * Specify the content of your Button
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be added to your Button
   */
  className: PropTypes.string,

  /**
   * Specify whether the Button should be disabled, or not
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether the Button should be a small variant
   */
  small: PropTypes.bool,

  /**
   * Specify the kind of Button you want to create
   */
  kind: ButtonTypes.buttonKind.isRequired,

  /**
   * Optionally specify an href for your Button to become an <a> element
   */
  href: PropTypes.string,

  /**
   * Optional prop to specify the tabIndex of the Button
   */
  tabIndex: PropTypes.number,

  /**
   * Optional prop to specify the type of the Button
   */
  type: PropTypes.oneOf<ButtonType>(['button', 'reset', 'submit']),

  /**
   * Optional prop to specify the role of the Button
   */
  role: PropTypes.string,

  /**
   * Specify an icon to include in the Button through a string or object
   * representing the SVG data of the icon
   */
  icon: PropTypes.oneOfType([
    PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
      viewBox: PropTypes.string.isRequired,
      svgData: PropTypes.object.isRequired,
    }),
    PropTypes.string,
    PropTypes.node,
  ]),

  /**
   * If specifying the `icon` prop, provide a description for that icon that can
   * be read by screen readers
   */
  iconDescription: (props: ButtonProps) => {
    if (props.icon && !props.iconDescription) {
      return new Error(
        'icon property specified without also providing an iconDescription property.'
      );
    }
    return undefined;
  },
};

Button.defaultProps = {
  tabIndex: 0,
  type: 'button',
  disabled: false,
  small: false,
  kind: 'primary',
};

export default Button;
