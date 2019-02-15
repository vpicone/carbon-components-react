/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { iconChevronRight } from 'carbon-icons';
import { settings } from 'carbon-components';
import Icon from '../Icon';
import ChevronRight16 from '@carbon/icons-react/lib/chevron--right/16';
import { match, keys } from '../../tools/key';
import { componentsX } from '../../internal/FeatureFlags';

const { prefix } = settings;

const defaultRenderExpando = ({ children, ...rest }) => (
  <button {...rest}>{children}</button>
);

type AccordionItemProps = {
  title?: React.ReactNode;
  className?: string;
  renderExpando?: (props: any) => JSX.Element;
  iconDescription?: string;
  open?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onHeadingClick?: (
    { isOpen, evt }: { isOpen: boolean; evt: React.MouseEvent }
  ) => void;
};

type AccordionItemState = {
  open: boolean;
  prevOpen: boolean;
};

export default class AccordionItem extends Component<
  AccordionItemProps,
  AccordionItemState
> {
  state = { open: false, prevOpen: false };

  static propTypes = {
    /**
     * Provide the contents of your AccordionItem
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the container node
     */
    className: PropTypes.string,

    /**
     * The accordion title.
     */
    title: PropTypes.node,

    /**
     * The callback function to render the expando button.
     * Can be a React component class.
     */
    renderExpando: PropTypes.func,

    /**
     * The description of the expando icon.
     */
    iconDescription: PropTypes.string,

    /**
     * `true` to open the expando.
     */
    open: PropTypes.bool,

    /**
     * The handler of the massaged `click` event.
     */
    onClick: PropTypes.func,

    /**
     * The handler of the massaged `click` event on the heading.
     */
    onHeadingClick: PropTypes.func,
  };

  static defaultProps = {
    title: 'title',
    renderExpando: defaultRenderExpando,
    iconDescription: 'Expand/Collapse',
    open: false,
    onClick: () => {},
    onHeadingClick: () => {},
  };

  static getDerivedStateFromProps({ open }, state) {
    const { prevOpen } = state;
    return prevOpen === open ? null : { open, prevOpen: open };
  }

  handleClick = evt => {
    this.props.onClick(evt);
  };

  handleHeadingClick = evt => {
    const open = !this.state.open;
    this.setState({ open });
    this.props.onHeadingClick({
      isOpen: open,
      evt,
    });
  };

  handleKeyDown = evt => {
    if (
      match(evt.which, keys.ESC) &&
      this.state.open &&
      evt.target.classList.contains(`${prefix}--accordion__heading`)
    ) {
      this.handleHeadingClick(evt);
    }
  };

  render() {
    const {
      className,
      title,
      renderExpando: Expando,
      iconDescription,
      children,
      onClick,
      onHeadingClick,
      ...other
    } = this.props; // eslint-disable-line no-unused-vars // eslint-disable-line no-unused-vars

    const classNames = classnames(
      { [`${prefix}--accordion__item--active`]: this.state.open },
      `${prefix}--accordion__item`,
      className
    );
    return (
      <li
        className={classNames}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        role="presentation"
        {...other}>
        <Expando
          type="button"
          aria-expanded={this.state.open}
          className={`${prefix}--accordion__heading`}
          onClick={this.handleHeadingClick}>
          {componentsX ? (
            <ChevronRight16
              className={`${prefix}--accordion__arrow`}
              aria-label={iconDescription}
            />
          ) : (
            <Icon
              className={`${prefix}--accordion__arrow`}
              icon={iconChevronRight}
              description={iconDescription}
              role={null}
            />
          ) // eslint-disable-line jsx-a11y/aria-role
          }

          <div className={`${prefix}--accordion__title`}>{title}</div>
        </Expando>
        <div className={`${prefix}--accordion__content`}>{children}</div>
      </li>
    );
  }
}
