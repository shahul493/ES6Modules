import React, { Component } from 'react'
import Slider from 'react-step-range-slider'

class Horizontal extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: 12
    }
  }

  handleChangeStart = () => {
    console.log('Change event started')
  };

  handleChange = value => {
    this.setState({
      value: value
    })
  };

  handleChangeComplete = () => {
    console.log('Change event completed')
  };

  render () {
   const range = [
      { value: 6, step: 3 }, // treated as min
      { value: 9, step: 3 }, 
      { value: 12, step: 6 },
      { value: 18, step: 6 },
      { value: 24, step: 12 },
      { value: 36, step: 12 },
      { value: 48, step: 12 },
      { value: 60 } // treated as max
    ]
      
    const { value } = this.state
    return (
      <div className='slider'>
        <Slider
          range={range}
          value={this.state.value}
          onChangeStart={this.handleChangeStart}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
        />
        <div className='value'>{value}</div>
      </div>
    )
  }
}

export default Horizontal
