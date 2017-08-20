import React from 'react';
import ReactDOM from 'react-dom';
import StepRangeSlider from './dist/';

export default class Example extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: 12
    }
  }

  handleChange(value) {
    this.setState({ value })
  }

  render() {
    const range = [
      { value: 6, step: 3 }, // treated as min
      { value: 9, step: 3 }, 
      { value: 12, step: 6 }, 
      { value: 18, step: 6 },
      { value: 24, step: 6 },
      { value: 36, step: 12 },
      { value: 48, step: 12 },      
      { value: 60 } // treated as max
    ]

    return (
      <div>
        <StepRangeSlider           
          range={range}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }

}