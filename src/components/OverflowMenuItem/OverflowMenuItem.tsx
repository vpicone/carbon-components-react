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
import { keys } from '../../tools/key';

const { prefix } = settings;

export default class OverflowMenuItem extends React.Component {
  static propTypes = {
    /**
     * The CSS class name to be placed on the button element
     */
    className: PropTypes.string,

    /**
     * The CSS class name to be placed on the wrapper list item element
     */
    wrapperClassName: PropTypes.string,

    /**
     * The text in the menu item.
     */
    itemText: PropTypes.node.isRequired,

    /**
     * If given, overflow item will render as a link with the given href
     */
    href: PropTypes.string,

    /**
     * `true` to make this menu item a divider.
     */
    hasDivider: PropTypes.bool,

    /**
     * `true` to make this menu item a "danger button".
     */
    isDelete: PropTypes.bool,

    /**
     * `true` to make this menu item disabled.
     */
    disabled: PropTypes.bool,

    /**
     * event handlers
     */
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseUp: PropTypes.func,

    /**
     * A callback to tell the parent menu component that the menu should be closed.
     */
    closeMenu: PropTypes.func,

    /**
     * `true` if this menu item should get focus when the menu gets open.
     */
    primaryFocus: PropTypes.bool,

    /**
     * `true` if this menu item belongs to a floating OverflowMenu
     */
    floatingMenu: PropTypes.bool,

    /**
     * `true` if this menu item has long text and requires a browser tooltip
     */
    requireTitle: PropTypes.bool,
  };

  static defaultProps = {
    hasDivider: false,
    isDelete: false,
    disabled: false,
    itemText: 'Provide itemText',
    onClick: () => {},
    onKeyDown: () => {},
  };

  overflowMenuItem = React.createRef();

  setTabFocus = evt => {
    if (evt.which === keys.DOWN) {
      this.props.handleOverflowMenuItemFocus(this.props.index + 1);
    }
    if (evt.which === keys.UP) {
      this.props.handleOverflowMenuItemFocus(this.props.index - 1);
    }
  };

  handleClick = evt => {
    this.props.onClick(evt);
    this.props.closeMenu();
  };

  render() {
    const {
      href,
      className,
      itemText,
      hasDivider,
      isDelete,
      disabled,
      closeMenu, // eslint-disable-line
      onClick, // eslint-disable-line
      handleOverflowMenuItemFocus, // eslint-disable-line
      onKeyDown,
      primaryFocus,
      floatingMenu,
      wrapperClassName,
      requireTitle,
      index,
      ...other
    } = this.props;
    const overflowMenuBtnClasses = classNames(
      `${prefix}--overflow-menu-options__btn`,
      className
    );
    const overflowMenuItemClasses = classNames(
      `${prefix}--overflow-menu-options__option`,
      {
        [`${prefix}--overflow-menu--divider`]: hasDivider,
        [`${prefix}--overflow-menu-options__option--danger`]: isDelete,
        [`${prefix}--overflow-menu-options__option--disabled`]: disabled,
      },
      wrapperClassName
    );
    const primaryFocusProp =
      (primaryFocus && floatingMenu) || primaryFocus
        ? { 'data-floating-menu-primary-focus': true }
        : {};
    const TagToUse = href ? 'a' : 'button';
    return (
      <li className={overflowMenuItemClasses} role="menuitem">
        <TagToUse
          {...other}
          {...primaryFocusProp}
          href={href}
          className={overflowMenuBtnClasses}
          disabled={disabled}
          onClick={this.handleClick}
          onKeyDown={evt => {
            this.setTabFocus(evt);
            onKeyDown(evt);
          }}
          ref={this.overflowMenuItem}
          title={requireTitle ? itemText : null}
          tabIndex={-1}
          index={index}>
          {itemText}
        </TagToUse>
      </li>
    );
  }
}
