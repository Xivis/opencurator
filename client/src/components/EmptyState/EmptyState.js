import React from "react";

import './EmptyState.scss';

class EmptyState extends React.PureComponent {
  render() {
    return (
      <div className={`empty-state ${this.props.className}`}>
        <div>{this.props.children}</div>
      </div>
    )
  }
}

EmptyState.defaultProps = {
  className: '',
  children: 'Empty State'
};

export default EmptyState;