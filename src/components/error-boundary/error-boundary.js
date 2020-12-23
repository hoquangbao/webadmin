import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  ErrorImageOverlay,
  ErrorImageContainer,
  ErrorImageText,
  ErrorImageTitle,
} from './error-boundary.styles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasErrored: false,
    };

    const { history } = this.props;

    history.listen((location, action) => {
      if (this.state.hasErrored) {
        this.setState({
          hasErrored: false,
        });
      }
    });
  }

  static getDerivedStateFromError(error) {
    return { hasErrored: true };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render() {
    return this.state.hasErrored ? (
      <ErrorImageOverlay>
        <ErrorImageContainer imageUrl="https://i.imgur.com/DWO5Hzg.png" />
        <ErrorImageTitle>This Page is Wrong</ErrorImageTitle>
        <ErrorImageText>
          You have been trying for ten minutes. It’s pretty late at night and
          pretty dark in your room. You reach over and flick on a lamp. You feel
          oh so stupid. The gap in the toy is a triangle and you only have the
          cylinder and cube pieces. In dismay you toss the toy aside. Curse your
          five year old’s inability to keep track of the triangle!
        </ErrorImageText>
      </ErrorImageOverlay>
    ) : (
      this.props.children
    );
  }
}

export default withRouter(ErrorBoundary);
