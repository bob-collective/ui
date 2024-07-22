import React from 'react';

class MyComponent extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if ((this.state as any)?.error) {
      console.log((this.state as any).error);

      return <h1>Caught an error.</h1>;
    }

    return (this.props as any).children;
  }
}

export { MyComponent };
