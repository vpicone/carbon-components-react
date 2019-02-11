/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { settings } from 'carbon-components';

import {
  withKnobs,
  boolean,
  select,
  text,
  number,
} from '@storybook/addon-knobs';
import Tooltip from '../Tooltip';

const { prefix } = settings;
const directions = {
  'Bottom (bottom)': 'bottom',
  'Left (left)': 'left',
  'Top (top)': 'top',
  'Right (right)': 'right',
};

const props = {
  withIcon: () => ({
    clickToOpen: boolean('Click to open (clickToOpen)', false),
    direction: select('Tooltip direction (direction)', directions, 'bottom'),
    triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
    tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0),
  }),
  withoutIcon: () => ({
    showIcon: false,
    direction: select('Tooltip direction (direction)', directions, 'bottom'),
    triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
    tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0),
  }),
};

storiesOf('Tooltip', module)
  .addDecorator(withKnobs)
  .add(
    'default (bottom)',
    () => (
      <div style={{ marginTop: '2rem' }}>
        <Tooltip {...props.withIcon()}>
          <p>
            This is some tooltip text. This box shows the maximum amount of text
            that should appear inside. If more room is needed please use a modal
            instead.
          </p>
          <div className={`${prefix}--tooltip__footer`}>
            <a href="/" className={`${prefix}--link`}>
              Learn More
            </a>
            <button
              className={`${prefix}--btn ${prefix}--btn--primary`}
              type="button">
              Create
            </button>
          </div>
        </Tooltip>
      </div>
    ),
    {
      info: {
        text: `
            Tooltips are used to supply additional information to an element when hovering over it. By default,
            the tooltip will render above the element. The example below shows the default scenario.
          `,
      },
    }
  )
  .add(
    'no icon',
    () => (
      <div style={{ marginTop: '2rem' }}>
        <Tooltip {...props.withoutIcon()}>
          <p>
            This is some tooltip text. This box shows the maximum amount of text
            that should appear inside. If more room is needed please use a modal
            instead.
          </p>
          <div className={`${prefix}--tooltip__footer`}>
            <a href="/" className={`${prefix}--link`}>
              Learn More
            </a>
            <button
              className={`${prefix}--btn ${prefix}--btn--primary`}
              type="button">
              Create
            </button>
          </div>
        </Tooltip>
      </div>
    ),
    {
      info: {
        text: `
            Tooltips are used to supply additional information to an element when hovering over it. By default,
            the tooltip will render with an information Icon. The example below shows the option to exclude the Icon.
          `,
      },
    }
  );
