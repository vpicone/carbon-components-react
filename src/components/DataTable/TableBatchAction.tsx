/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { iconAddSolid } from 'carbon-icons';
import Button from '../Button';

const TableBatchAction = props => (
  <Button small kind="ghost" icon={iconAddSolid} {...props} />
);

TableBatchAction.propTypes = {
  /**
   * Provide a text description for the icon in the button
   */
  iconDescription: PropTypes.string.isRequired,
};

TableBatchAction.defaultProps = {
  iconDescription: 'Add',
};

export default TableBatchAction;
